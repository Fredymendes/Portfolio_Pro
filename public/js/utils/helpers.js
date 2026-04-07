// ============================================
// SHARED UTILITIES - Helpers
// ============================================

/**
 * Échappe les caractères HTML pour prévenir les injections XSS
 * @param {string} text - Texte à échapper
 * @returns {string} Texte échappé
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Formate une date en français
 * @param {string} dateString - Date ISO (ex: "2025-03-15")
 * @returns {string} Date formatée (ex: "15 mars 2025")
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

/**
 * Affiche un message de chargement
 * @param {HTMLElement} container - Élément conteneur
 */
function showLoading(container) {
    container.innerHTML = '<div style="text-align: center; padding: 3rem;"><p>⏳ Chargement...</p></div>';
}

/**
 * Affiche un message d'erreur avec bouton retour
 * @param {HTMLElement} container - Élément conteneur
 * @param {string} message - Message d'erreur
 * @param {string} backUrl - URL du bouton retour
 * @param {string} backLabel - Libellé du bouton
 */
function showError(container, message, backUrl = '/blog', backLabel = 'Retour') {
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <p style="color: #e74c3c; font-size: 1.1rem; margin-bottom: 1rem;">❌ ${escapeHtml(message)}</p>
            <a href="${escapeHtml(backUrl)}" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 12px 24px; border-radius: 8px; font-size: 1rem; font-weight: 600; text-decoration: none; background: linear-gradient(135deg, #0052CC, #6366F1); color: #ffffff; cursor: pointer;">${escapeHtml(backLabel)}</a>
        </div>
    `;
}

/**
 * Clone et met à jour les paramètres URL
 * @param {string} key - Clé du paramètre
 * @param {string} value - Valeur du paramètre
 */
function updateUrlParam(key, value) {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

/**
 * Récupère un paramètre URL
 * @param {string} key - Clé du paramètre
 * @returns {string|null} Valeur du paramètre
 */
function getUrlParam(key) {
    return new URLSearchParams(window.location.search).get(key);
}
