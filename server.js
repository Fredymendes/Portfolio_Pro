require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client } = require('@notionhq/client');

const app = express();
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.DATABASE_ID;

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security middleware - Headers
app.use((req, res, next) => {
    // Disable X-Powered-By header (don't expose Express)
    res.removeHeader('X-Powered-By');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // XSS Protection (legacy, modern browsers use CSP)
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Content Security Policy - strict but allows self resources
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com; style-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'; font-src https://cdnjs.cloudflare.com data:; img-src 'self' data: https:; connect-src 'self' https://api.notion.com https://formspree.io");
    
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10kb' })); // Limit payload size

// Validation middleware
const validatePagination = (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 3;

    if (page < 1 || limit < 1 || limit > 50) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
    }
    
    req.pagination = { page, limit };
    next();
};

// ============================================
// NOTION CONTENT EXTRACTOR
// ============================================

/**
 * Extrait le texte d'un bloc Notion
 * @param {Object} block - Bloc Notion
 * @returns {string} Texte du bloc
 */
function extractBlockText(block) {
    const getText = (rich_text)=> rich_text.map(rt => rt.plain_text).join('');
    try {
        switch (block.type) {
                   case 'paragraph':
            return `<p>${getText(block.paragraph.rich_text)}</p>`;
        case 'heading_1':
            return `<h1>${getText(block.heading_1.rich_text)}</h1>`;
        case 'heading_2':
            return `<h2>${getText(block.heading_2.rich_text)}</h2>`;
        case 'heading_3':
            return `<h3>${getText(block.heading_3.rich_text)}</h3>`;
        case 'bulleted_list_item':
            return `<li>${getText(block.bulleted_list_item.rich_text)}</li>`;
        case 'numbered_list_item':
            return `<li>${getText(block.numbered_list_item.rich_text)}</li>`;
        case 'quote':
            return `<blockquote>${getText(block.quote.rich_text)}</blockquote>`;
        case 'code':
            return `<pre><code>${getText(block.code.rich_text)}</code></pre>`;
        case 'divider':
            return `<hr>`;
        default:
            return '';
        }
    } catch (error) {
        console.error('Erreur extraction bloc:', error);
        return '';
    }
}

/**
 * Récupère tout le contenu d'une page Notion (avec pagination si nécessaire)
 * @param {string} pageId - ID de la page Notion
 * @returns {Promise<string>} Contenu texte complet
 */
async function getPageContent(pageId) {
    try {
        let allBlocks = [];
        let cursor = undefined;

        // Récupère tous les blocs (pagination si > 100 blocs)
        while (true) {
            const response = await notion.blocks.children.list({
                block_id: pageId,
                start_cursor: cursor,
                page_size: 100
            });

            allBlocks = allBlocks.concat(response.results);

            if (!response.has_more) break;
            cursor = response.next_cursor;
        }

        // Extrait le texte de tous les blocs
        return allBlocks
            .map(block => extractBlockText(block))
            .filter(text => text.length > 0)
            .join('\n\n');
    } catch (error) {
        console.error('Erreur lors de la récupération du contenu:', error);
        return '';
    }
}

// ✅ Route pour récupérer tous les articles avec validation
app.get('/api/posts', validatePagination, async (req, res) => {
    try {
        const { page, limit } = req.pagination;

        const response = await notion.databases.query({ database_id: databaseId });
        const allPosts = await Promise.all(response.results.map(async post => {
            const props = post.properties;
            const pageId = post.id;

            try {
                const content = await getPageContent(pageId);

                return {
                    id: pageId,
                    title: props.Articles?.title?.[0]?.plain_text || 'Sans titre',
                    description: props.Description?.rich_text?.[0]?.plain_text || 'Pas de description',
                    content: content || 'Contenu vide',
                    publicationDate: props["Publish Date"]?.date?.start || 'Date non spécifiée',
                    author: props.Author?.people?.[0]?.name || 'Auteur inconnu',
                    tags: props.Tags?.multi_select?.map(tag => tag.name) || []
                };
            } catch (error) {
                console.error(`Erreur lors du traitement de l'article ${pageId}:`, error);
                return null;
            }
        })).then(posts => posts.filter(post => post !== null));

        // Pagination côté serveur
        const totalPosts = allPosts.length;
        const totalPages = Math.ceil(totalPosts / limit);
        
        if (page > totalPages && totalPages > 0) {
            return res.status(400).json({ error: 'Page out of range' });
        }
        
        const start = (page - 1) * limit;
        const end = start + limit;
        const posts = allPosts.slice(start, end);

        res.json({ posts, totalPages, currentPage: page, totalPosts });
    } catch (error) {
        console.error('Erreur API /posts:', error);
        res.status(500).json({ error: "Erreur lors de la récupération des articles depuis Notion" });
    }
});

// ✅ Route pour récupérer un article par ID
app.get('/api/posts/:id', async (req, res) => {
    const pageId = req.params.id;

    // Validation de l'ID (accepte format UUID avec ou sans tirets)
    if (!/^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/i.test(pageId)) {
        return res.status(400).json({ error: 'Invalid article ID format' });
    }

    try {
        const page = await notion.pages.retrieve({ page_id: pageId });
        const props = page.properties;

        const content = await getPageContent(pageId);

        const article = {
            id: pageId,
            title: props.Articles?.title?.[0]?.plain_text || 'Sans titre',
            description: props.Description?.rich_text?.[0]?.plain_text || 'Pas de description',
            content,
            publicationDate: props["Publish Date"]?.date?.start || 'Date non spécifiée',
            author: props.Author?.people?.[0]?.name || 'Auteur inconnu',
            tags: props.Tags?.multi_select?.map(tag => tag.name) || []
        };

        res.json(article);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        if (error.status === 404) {
            return res.status(404).json({ error: "Article non trouvé" });
        }
        res.status(500).json({ error: "Erreur lors de la récupération de l'article" });
    }
});

// ✅ Routes pour servir les templates EJS
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/blog', (req, res) => {
    res.render('blog');
});

app.get('/article', (req, res) => {
    res.render('article');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Erreur non gérée:', err);
    res.status(500).json({ error: "Erreur serveur interne" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route non trouvée" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    if (!process.env.NOTION_API_KEY || !process.env.DATABASE_ID) {
        console.error('⚠️ Configuration manquante: NOTION_API_KEY ou DATABASE_ID');
    }
});
