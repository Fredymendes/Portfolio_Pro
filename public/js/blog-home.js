// ============================================
// BLOG POSTS - HOME PAGE
// Uses unified BlogManager with 3 articles limit
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const blogManager = new BlogManager({
        containerID: 'blog-posts',
        paginationID: 'blog-pagination',
        limit: 3,
        scrollTarget: 'blog'
    });
    blogManager.init();
});
