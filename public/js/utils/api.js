// ============================================
// SHARED UTILITIES - API
// ============================================

/**
 * Récupère les articles du blog avec pagination
 * @param {number} page - Numéro de page (défaut: 1)
 * @param {number} limit - Nombre d'articles par page (défaut: 3)
 * @returns {Promise} Réponse JSON { posts, totalPages, currentPage, totalPosts }
 */
async function fetchPosts(page = 1, limit = 3) {
    try {
        const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        throw error;
    }
}

/**
 * Récupère un article détail par son ID
 * @param {string} articleId - ID de l'article (UUID)
 * @returns {Promise} Article { id, title, description, content, author, tags, publicationDate }
 */
async function fetchArticle(articleId) {
    try {
        if (!articleId) {
            throw new Error('ID article manquant');
        }

        const response = await fetch(`/api/posts/${articleId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Article non trouvé');
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
        throw error;
    }
}

/**
 * Crée une card HTML pour un article
 * @param {Object} post - Objet article
 * @returns {HTMLElement} Élément card
 */
function createArticleCard(post) {
    const { escapeHtml, formatDate } = window.BlogUtils || {};
    
    if (!escapeHtml || !formatDate) {
        console.error('Utils helpers non chargées');
        return null;
    }

    const tagsHtml = post.tags && post.tags.length > 0
        ? post.tags.map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')
        : '';

    const card = document.createElement('div');
    card.className = 'blog-card';
    card.innerHTML = `
        <div class="blog-card-content">
            <h3>${escapeHtml(post.title)}</h3>
            <div class="blog-card-meta">
                <span class="blog-card-author">
                    <i class="fas fa-user"></i> ${escapeHtml(post.author)}
                </span>
                <span>
                    <i class="fas fa-calendar"></i> ${formatDate(post.publicationDate)}
                </span>
            </div>
            <p>${escapeHtml(post.description)}</p>
            ${tagsHtml ? `<div class="blog-card-tags">${tagsHtml}</div>` : ''}
        </div>
        <div class="blog-card-footer">
            <a href="/article?id=${escapeHtml(post.id)}">
                Lire l'article <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    return card;
}
