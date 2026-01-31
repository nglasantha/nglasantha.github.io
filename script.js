document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.card, .section-title, .about-content, .hero-content');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically or rely on inline styles transitioning to null?
    // Let's add a helper style method to clean up after animation
    const handleAnimation = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const simpleObserver = new IntersectionObserver(handleAnimation, observerOptions);
    fadeElements.forEach(el => simpleObserver.observe(el));

    // Blog Functionality
    const articlesGrid = document.getElementById('articles-grid');
    const modal = document.getElementById('article-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    // Render Articles
    if (articlesGrid && typeof blogArticles !== 'undefined') {
        blogArticles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'article-card';
            card.innerHTML = `
                <div>
                    <span class="article-category">${article.category}</span>
                    <h3 class="article-title">${article.title}</h3>
                    <span class="article-date">${article.date}</span>
                    <p class="article-summary">${article.summary}</p>
                </div>
                <div class="read-more">Read Article <span>&rarr;</span></div>
            `;

            card.addEventListener('click', () => openModal(article));
            articlesGrid.appendChild(card);

            // Observe new card for animation
            simpleObserver.observe(card);
        });
    }

    // Modal Functions
    function openModal(article) {
        modalBody.innerHTML = `
            <div class="modal-meta">
                <span>${article.date}</span> | <span>${article.category}</span>
            </div>
            <h2>${article.title}</h2>
            <div class="article-content">
                ${article.content}
            </div>
        `;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeModalFunc() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModalFunc();
        }
    });

});
