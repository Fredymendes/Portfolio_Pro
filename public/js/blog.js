// ============================================
// FULL BLOG PAGE
// Uses BlogManager class from main.js (6 articles)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const blogManager = new BlogManager({
        containerID: 'blog-posts',
        paginationID: 'pagination',
        limit: 6,
        scrollTarget: null
    });
    blogManager.init();
});
