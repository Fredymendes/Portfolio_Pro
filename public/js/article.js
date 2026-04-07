document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    const container = document.getElementById('article-content');

    if (!articleId) {
        showError('Article non trouvé. ID manquant.', '/blog', 'Retour au blog');
        return;
    }

    showLoading(container);

    fetch(`/api/posts/${articleId}`)
        .then(response => {
            if (!response.ok) throw new Error('Article non trouvé');
            return response.json();
        })
        .then(post => {
            const tagsHtml = post.tags && post.tags.length > 0
                ? `<div style="margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${post.tags.map(tag => `<span class="blog-tag">${escapeHtml(tag)}</span>`).join('')}
                   </div>`
                : '';

            container.innerHTML = `
                <h1>${escapeHtml(post.title)}</h1>
                <div class="article-meta">
                    <div>
                        <span><i class="fas fa-user"></i> ${escapeHtml(post.author)}</span>
                    </div>
                    <div>
                        <span><i class="fas fa-calendar"></i> ${formatDate(post.publicationDate)}</span>
                    </div>
                </div>
                <p><strong>Description:</strong> ${escapeHtml(post.description)}</p>
                ${tagsHtml}
                <div style="margin: 2rem 0; line-height: 1.8;">
                    ${post.content}
                </div>
            `;
        })
        .catch(error => {
            console.error('Erreur lors du chargement de l\'article :', error);
            showError('Impossible de charger l\'article. Veuillez réessayer plus tard.', '/blog', 'Retour au blog');
        });
});