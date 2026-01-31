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

    // Blog Functionality (Preview on Home)
    const articlesGrid = document.getElementById('articles-grid');

    // Fetch and Render Articles
    if (articlesGrid) {
        fetch('articles.json')
            .then(response => response.json())
            .then(articles => {
                // Show only top 3 articles on home page
                const previewArticles = articles.slice(0, 3);

                // Feature the latest article in Hero
                const heroFeatured = document.getElementById('hero-featured-article');
                if (heroFeatured && articles.length > 0) {
                    const latest = articles[0];
                    heroFeatured.classList.remove('hidden');
                    heroFeatured.innerHTML = `
                        <div class="featured-pill" onclick="window.location.href='article.html?id=${latest.file}'">
                            <span class="featured-tag">New Insight</span>
                            <div class="featured-content">
                                <h4>${latest.title}</h4>
                                <span>Read 2 min &rarr;</span>
                            </div>
                        </div>
                    `;
                }

                if (previewArticles.length === 0) {
                    articlesGrid.innerHTML = '<p style="color:var(--text-secondary)">No articles found.</p>';
                    return;
                }

                previewArticles.forEach(article => {
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

                    // Click navigates to the article page
                    card.addEventListener('click', () => {
                        window.location.href = `article.html?id=${article.file}`;
                    });

                    articlesGrid.appendChild(card);

                    // Observe new card for animation
                    simpleObserver.observe(card);
                });
            })
            .catch(err => {
                console.error('Failed to load articles:', err);
                articlesGrid.innerHTML = '<p style="color:var(--text-secondary)">Loading insights...</p>';
            });
    }

});
