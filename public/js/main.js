// ============================================
// BLOG MANAGER CLASS
// Manages blog rendering with pagination
// ============================================

class BlogManager {
    constructor(options = {}) {
        this.container = document.getElementById(options.containerID || 'blog-posts');
        this.paginationContainer = document.getElementById(options.paginationID || 'pagination');
        this.postsPerPage = options.limit || 3;
        this.scrollTarget = options.scrollTarget || (this.container ? this.container.closest('section')?.id : null);
        
        this.currentPage = 1;
        this.totalPages = 1;
    }

    showLoading() {
        if (this.container) {
            this.container.innerHTML = '<div style="text-align: center; padding: 2rem; grid-column: 1/-1;"><p>⏳ Chargement des articles...</p></div>';
        }
    }

    showError(message) {
        if (this.container) {
            this.container.innerHTML = `<div style="text-align: center; padding: 2rem; grid-column: 1/-1; color: #e74c3c;"><p>❌ ${escapeHtml(message)}</p></div>`;
        }
        if (this.paginationContainer) {
            this.paginationContainer.innerHTML = '';
        }
    }

    async fetchAndRender(page = 1) {
        this.currentPage = page;
        this.showLoading();

        try {
            const response = await fetch(`/api/posts?page=${page}&limit=${this.postsPerPage}`);
            if (!response.ok) throw new Error('Erreur serveur');
            const data = await response.json();
            
            if (!data.posts || data.posts.length === 0) {
                if (this.container) {
                    this.container.innerHTML = '<div style="text-align: center; padding: 2rem; grid-column: 1/-1;"><p>Aucun article trouvé.</p></div>';
                }
                if (this.paginationContainer) {
                    this.paginationContainer.innerHTML = '';
                }
                return;
            }

            this.renderPosts(data.posts);
            this.totalPages = data.totalPages || 1;
            this.renderPagination();
        } catch (error) {
            console.error('Erreur:', error);
            this.showError('Impossible de charger les articles. Veuillez réessayer plus tard.');
        }
    }

    renderPosts(posts) {
        if (!this.container) return;
        this.container.innerHTML = '';

        posts.forEach(post => {
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
            this.container.appendChild(card);
        });
    }

    renderPagination() {
        if (!this.paginationContainer) return;
        this.paginationContainer.innerHTML = '';
        
        if (this.totalPages <= 1) return;

        for (let i = 1; i <= this.totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = i === this.currentPage ? 'active' : '';
            btn.addEventListener('click', () => {
                this.fetchAndRender(i);
                
                if (this.scrollTarget) {
                    const section = document.getElementById(this.scrollTarget);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
            this.paginationContainer.appendChild(btn);
        }
    }

    init() {
        if (this.container) {
            this.fetchAndRender(this.currentPage);
        }
    }
}

// ============================================
// MAIN JAVASCRIPT - ONE PAGE PORTFOLIO
// ============================================

// Navigation et Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Fermer le menu au clic sur un lien
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Sticky navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll pour les anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer pour animations au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observer pour les éléments à animer
document.querySelectorAll('.section-title, .stat-card, .timeline-content, .skill-category, .blog-card, .contact-form').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Scroll indicator click
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const notif = document.getElementById('formNotification');
        const btn = contactForm.querySelector('button[type="submit"]');

        // Validation
        if (!name || !email || !message) {
            notif.textContent = '✗ Veuillez remplir tous les champs.';
            notif.style.color = '#e74c3c';
            notif.style.display = 'block';
            return;
        }

        // Envoi
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        notif.style.display = 'none';

        try {
            const response = await fetch('https://formspree.io/f/xjkwgpzy', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            });

            if (response.ok) {
                notif.textContent = '✓ Message envoyé avec succès.';
                notif.style.color = '#2ecc71';
                contactForm.reset();
            } else {
                notif.textContent = '✗ Une erreur est survenue. Réessaie ou contacte-moi par email.';
                notif.style.color = '#e74c3c';
            }
        } catch {
            notif.textContent = '✗ Connexion impossible. Vérifie ta connexion internet.';
            notif.style.color = '#e74c3c';
        }

        notif.style.display = 'block';
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
    });
}

// Active link dans la navigation
window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Update scroll dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === current) {
            dot.classList.add('active');
        }
    });
});

// Scroll dots navigation
const dots = document.querySelectorAll('.dot');
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const section = dot.getAttribute('data-section');
        const targetSection = document.querySelector(`#${section}`);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('✅ Portfolio principal chargé');
