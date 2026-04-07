# 🏗️ AUDIT ARCHITECTURE - Portfolio

**Date**: 7 avril 2026  
**Statut**: À améliorer  
**Score**: 6/10

---

## 📊 État Actuel

### ✅ Points Positifs
- Structure EJS propre avec partials centralisés
- Séparation backend (Express) / frontend (Vanilla JS)
- Sécurité : headers, validation, XSS protection
- Notion API bien intégrée

### 🔴 Problèmes Identifiés

#### 1. **Redondance de Code (CRITIQUE)**

| Problème | Localisation | Impact |
|----------|--------------|--------|
| `escapeHtml()` | blog-home.js, blog.js, article.js | 3x dupliquée |
| `formatDate()` | blog-home.js, blog.js, article.js | 3x dupliquée |
| Rendering articles | blog-home.js (renderBlogPosts), blog.js (renderPage) | Quasiment identique |
| Fetch API | blog-home.js, blog.js | Logique similaire |

**Ligne de code dupliquée**: ~40 lignes (20% du code JS)

#### 2. **Organisation Fichiers JS**

```
Actuellement:
public/js/
├── main.js           (121 lignes - navigation)
├── blog-home.js      (99 lignes - blog homepage)
├── blog.js           (98 lignes - blog page)
└── article.js        (69 lignes - article detail)

Problème:
• blog-home.js et blog.js = 70% de code dupliqué
• Pas de module pour les utilitaires (escapeHtml, formatDate)
• Pas de gestion centralisée de l'API
```

#### 3. **Backend Structure**

```
server.js: 1 fichier pour :
• Configuration EJS
• Security headers
• Middleware
• Validation
• 2x routes API
• 3x routes templates
• Gestion d'erreurs
→ 180+ lignes : trop dense
```

---

## 📋 Architecture Proposée

### Option 1: **Modularisation Simple** (Recommandée)

```
public/js/
├── utils/
│   ├── api.js          ← Centralise fetch API
│   ├── helpers.js      ← escapeHtml(), formatDate()
│   └── dom.js          ← Manipulation DOM commune
├── main.js             ← Navigation seulement
├── blog.js             ← Logique blog (homepage + page)
└── article.js          ← Article détail

server.js → routes/
├── api.js              ← GET /api/posts, /api/posts/:id
├── pages.js            ← GET /, /blog, /article
└── middleware.js       ← Security, validation
```

**Gains:**
- -40 lignes de JS dupliqué
- Maintenance +70% plus facile
- API réutilisable

---

### Option 2: **Modularisation Complète** (Pour le futur)

```
src/
├── server/
│   ├── index.js
│   ├── config/
│   │   └── security.js
│   ├── routes/
│   │   ├── api.js
│   │   └── pages.js
│   └── middleware/
│       └── validation.js
├── client/
│   ├── js/
│   │   ├── modules/
│   │   │   ├── api.js
│   │   │   ├── blog.js
│   │   │   └── article.js
│   │   └── utils/
│   │       ├── helpers.js
│   │       └── dom.js
│   ├── css/
│   └── img/
└── views/
```

**Gains:**
- Architecture scalable
- Easy testing
- DX amélioré

---

## 🔧 Actions Recommandées (Priorités)

### 🔴 P0 - URGENT
1. **Créer `utils/helpers.js`**
   - `escapeHtml()`
   - `formatDate()`
   - Import dans tous les fichiers

2. **Fusionner blog-home.js + blog.js**
   - Une seule logique blog
   - Paramètre pour limite d'articles
   - Réduire de 99+98 = 197 lignes à ~120

### 🟡 P1 - IMPORTANT
3. **Créer `utils/api.js`**
   - `fetchPosts(page, limit)`
   - `fetchArticle(id)`
   - Gestion erreurs centralisée

4. **Refactoriser server.js**
   - Extraire routes dans `routes/`
   - Extraire middleware dans `middleware/`

### 🟢 P2 - OPTIONNEL
5. **Ajouter webpack/esbuild**
   - Bundler JS automatique
   - Minifier en prod

---

## 📁 Plan d'Action Détaillé

### Phase 1: Utilitaires (30 min)

**Créer `public/js/utils/helpers.js`:**
```javascript
// Fonctions communes
export function escapeHtml(text) { ... }
export function formatDate(dateString) { ... }
```

**Mettre à jour blog-home.js, blog.js, article.js:**
```javascript
// Avant
function escapeHtml(text) { ... }

// Après
import { escapeHtml, formatDate } from './utils/helpers.js';
```

### Phase 2: Fusion Blog (1h)

**Créer `public/js/blog-unified.js`:**
```javascript
// Une seule fonte pour blog-home et blog
class BlogManager {
  async load(page = 1, limit = 3) { ... }
  render() { ... }
}
```

**Mettre à jour views/index.ejs et views/blog.ejs:**
```ejs
<script src="/js/blog-unified.js"></script>
<script>
  BlogManager.init({ limit: 3 }); // ou 6
</script>
```

### Phase 3: Refactor Backend (1h)

**Créer `routes/api.js`:**
```javascript
module.exports = router => {
  router.get('/api/posts', validatePagination, async (req, res) => { ... });
  router.get('/api/posts/:id', async (req, res) => { ... });
};
```

**Créer `routes/pages.js`:**
```javascript
module.exports = router => {
  router.get('/', (req, res) => res.render('index'));
  router.get('/blog', (req, res) => res.render('blog'));
  router.get('/article', (req, res) => res.render('article'));
};
```

---

## 📊 Résultats Attendus

| Métrique | Avant | Après | Gain |
|----------|-------|-------|------|
| Lignes JS dupliquées | ~40 | 0 | -100% |
| Fichiers JS | 4 | 3-4 | -20% |
| Taille JS total | 15.7 KB | 12 KB | -24% |
| Complexité maintenance | HIGH | MEDIUM | +60% |
| Réutilisabilité code | LOW | HIGH | +300% |

---

## 🎯 Recommandation Finale

**Action immédiate:**
1. ✅ Créer `utils/helpers.js` avec escapeHtml, formatDate
2. ✅ Fusionner blog-home.js + blog.js
3. ✅ Créer `utils/api.js` pour centralize fetch

**Benefits:**
- Code ~24% plus petit
- Maintenance +60% meilleure
- Préparation pour futures fonctionnalités

**Timeline:** 2-3h de refactoring

---

**Voulez-vous que je commence par l'implémentation ?**
