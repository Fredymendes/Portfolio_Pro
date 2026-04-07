# 📚 Portfolio Documentation - Fredy Mendes

**Portfolio modern one-page** - Technicien Support IT  
✨ Navigation moderna + Blog Notion + Animations fluides

---

## 📖 Vue d'ensemble

| Élément | Description |
|---------|-------------|
| **Type** | Node.js + Express + EJS templates |
| **Architecture** | One-page + Blog (Notion API) |
| **Pages** | Servies par EJS (views/index.ejs, blog.ejs, article.ejs) |
| **Design** | Modern minimaliste, animations fluides |
| **Blog** | Intégré Notion API (3 preview + 6 full) |
| **Mobile** | 100% responsive |
| **Code** | Vanilla JS/CSS, zero framework |

---

## 🎨 Sections (Index)

1. **Navigation** - Sticky + hamburger + dots navigation
2. **Hero** - Photo + CV button + Contact button
3. **About** - Stats (<1 année, 200+ users, N1/N2) + Social links
4. **Experience** - Timeline 2 stages (Agorapulse, Data Transitions)
5. **Skills** - 5 catégories avec icônes
6. **Blog** - 3 articles preview + pagination
7. **Contact** - Email + localisation + formulaire
8. **Footer** - Copyright + social links

---

## 👤 Contenu

### Contact Personnel
| Info | Détail |
|------|--------|
| Email | fredy.mendes@live.fr |
| Localisation | Chelles (77500), France |
| LinkedIn | linkedin.com/in/fredymendes/ |
| GitHub | github.com/Fredymendes |
| X/Twitter | x.com/FredyMendes1 |

### Expériences
| Entreprise | Dates | Tech |
|-----------|-------|------|
| Agorapulse | Mar-May 2025 | macOS, MDM Mosyle, Active Directory, N1/N2 |
| Data Transitions | Feb-Jul 2019 | Vue.js, Nuxt.js, Slim Framework |

### Compétences (5 catégories)
- **Systèmes & Admin** - Windows, Linux, macOS, Active Directory, Microsoft 365
- **Réseaux & Sécurité** - TCP/IP, DNS, VPN, Pare-feu, Sauvegarde
- **Support & Incidents** - RDP/AnyDesk, GLPI, Diagnostic
- **Déploiement & Parc** - MDM Mosyle, VMware, Virtualisation
- **Développement** - Vue.js, Nuxt.js, Slim, Git

---

## 🎨 Design

### Couleurs
```
Primary:    #0052CC (bleu)
Secondary:  #6366F1 (violet)
Accent:     #10B981 (vert)
Dark:       #0f172a
Light:      #f8fafc
```

### Animations
`slideInUp` • `fadeIn` • `bounce` • `float` • Hover effects

### Responsive
- Desktop: Full
- Tablet (768px): 1 col
- Mobile (480px): Hamburger menu, scroll-dots cachés

---

## 📁 Architecture EJS (Templates)

### Structure
```
views/                          # Dossier templates
├── index.ejs                   # Page accueil
├── blog.ejs                    # Page blog
├── article.ejs                 # Page article detail
└── partials/                   # Composants réutilisables
    ├── header.ejs              # <head> + meta tags + favicon + CSS
    ├── nav.ejs                 # Navigation (sticky + hamburger)
    └── footer.ejs              # Footer + scripts + </body>
```

### Avantages
- ✅ **Centralisé** - HEAD/NAV/Footer en un seul endroit
- ✅ **DRY** - Pas de duplication de code
- ✅ **Maintenance** - Modification unique = changement partout

### Comment ça marche
Chaque page EJS inclut les partials :
```ejs
<%- include('partials/header', { title: 'Ma Page', description: '...' }) %>
<%- include('partials/nav') %>
<!-- contenu de la page -->
<%- include('partials/footer') %>
```

---

## 📁 Fichiers & Dossiers

### Static Assets (public/)
- `public/css/style.css` - Stylesheet unique (2000+ lignes)
- `public/js/main.js` - Navigation, hamburger, animations, scroll-dots
- `public/js/blog-home.js` - Blog homepage (3 articles preview)
- `public/js/blog.js` - Blog page (6 articles)
- `public/js/article.js` - Détail article (Notion API)
- `public/img/` - Favicon, photos, CV

### Backend
- `server.js` - Express + Notion API + EJS config
- `package.json` - Dépendances (express, ejs, @notionhq/client, dotenv)
- `.env` - Variables environnement (NOTION_API_KEY, DATABASE_ID)

---

## ⚙️ Quick Setup

### 1. Changer les couleurs
```css
/* style.css :root */
--primary-color: #0052CC → votre couleur
```

### 2. Modifier le contenu
- Page accueil: Éditer `views/index.ejs`
- Page blog: Éditer `views/blog.ejs`
- Photo: `public/img/Profil_Fredy.jpg`
- CV: `public/img/CV_Fredy_Mendes_Support_IT.pdf`

### 3. Changer le HEAD/NAV (appliquer partout)
- Navigation: Éditer `views/partials/nav.ejs`
- Meta tags/Favicon: Éditer `views/partials/header.ejs`
- Footer: Éditer `views/partials/footer.ejs`
- ✨ Changements appliqués à TOUTES les pages

### 4. Ajouter nouvelle page
1. Créer `views/mapage.ejs` avec :
   ```ejs
   <%- include('partials/header', { title: 'Ma Page', description: '...' }) %>
   <%- include('partials/nav') %>
   <!-- votre contenu -->
   <%- include('partials/footer') %>
   ```
2. Ajouter route dans `server.js` :
   ```js
   app.get('/mapage', (req, res) => {
       res.render('mapage');
   });
   ```

### 5. Animations
- Vitesse: Changer `0.3s` → `0.5s` dans style.css
- Disable: Supprimez classe `fade-in`

---

## 🚀 Deployment

### Checklist
- [ ] `npm start` - Tester localement
- [ ] Console JS - 0 erreurs
- [ ] Responsive - Mobile/tablet OK
- [ ] Blog - Pagination en place
- [ ] EJS templates - Tous les partials affichés
- [ ] Form - Contact fonctionnel
- [ ] Links - Tous opérationnels

### Config
- Variables env: `NOTION_API_KEY`, `DATABASE_ID`, `PORT`
- Domaine + HTTPS
- CDN recommandé images

---

## 🔧 Troubleshooting

| Problème | Solution |
|----------|----------|
| Blog vide | Vérifier `.env` |
| Liens cassés | Vérifier URLs HTML |
| Mobile cassé | Vérifier viewport meta |
| Form ignore | Vérifier Formspree ID |

---

**Portfolio Fredy Mendes - 2025** ✨


