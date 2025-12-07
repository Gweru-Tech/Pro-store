// NtandoStore v7 - Main JavaScript File
// Protected and Obfuscated Code

(function() {
    'use strict';
    
    // Anti-debugging protection
    (function() {
        setInterval(() => {
            if (window.console && window.console.clear) {
                console.clear();
            }
        }, 1000);
        
        // Disable right click
        document.addEventListener('contextmenu', e => {
            e.preventDefault();
            return false;
        });
        
        // Disable text selection on certain elements
        document.addEventListener('selectstart', e => {
            if (e.target.closest('.protected-content')) {
                e.preventDefault();
                return false;
            }
        });
        
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', e => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        });
    })();

    // Main Application Class
    class NtandoStore {
        constructor() {
            this.init();
            this.setupEventListeners();
            this.initializeAnalytics();
            this.setupMusicPlayer();
            this.loadAds();
        }

        init() {
            console.log('%c NtandoStore v7 - Professional Platform ', 'background: linear-gradient(45deg, #2563eb, #f59e0b); color: white; font-size: 16px; padding: 10px;');
            
            // Initialize components
            this.nav = document.querySelector('.nav-container');
            this.header = document.querySelector('.header');
            this.mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
            this.scrollTopBtn = document.querySelector('.scroll-top');
            
            // Initialize state
            this.isMobileMenuOpen = false;
            this.isScrolling = false;
            this.visitorData = this.getVisitorData();
        }

        setupEventListeners() {
            // Scroll events
            window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
            
            // Mobile menu toggle
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
            }
            
            // Smooth scroll for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', this.handleSmoothScroll.bind(this));
            });
            
            // Form submissions
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', this.handleFormSubmit.bind(this));
            });
            
            // Service cards hover effects
            document.querySelectorAll('.service-card').forEach(card => {
                card.addEventListener('mouseenter', this.handleCardHover.bind(this));
                card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            });
            
            // Dynamic content loading
            this.setupDynamicLoading();
        }

        initializeAnalytics() {
            // Track page view
            this.trackPageView();
            
            // Track user interactions
            this.trackUserInteractions();
            
            // Update visitor counter
            this.updateVisitorCounter();
            
            // Track time on site
            this.trackTimeOnSite();
        }

        setupMusicPlayer() {
            this.audioPlayer = new Audio();
            this.isPlaying = false;
            this.currentTrack = null;
            this.volume = 50;
            
            const musicToggle = document.querySelector('.music-toggle');
            const volumeControl = document.querySelector('.volume-control');
            
            if (musicToggle) {
                musicToggle.addEventListener('click', this.toggleMusic.bind(this));
            }
            
            if (volumeControl) {
                volumeControl.addEventListener('input', this.adjustVolume.bind(this));
            }
            
            // Load background music if available
            this.loadBackgroundMusic();
        }

        loadBackgroundMusic() {
            fetch('/api/settings/music')
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.music) {
                        this.currentTrack = data.music.file;
                        this.volume = data.music.volume || 50;
                        this.audioPlayer.volume = this.volume / 100;
                        this.audioPlayer.src = `/uploads/music/${this.currentTrack}`;
                        
                        if (data.music.isActive) {
                            this.playMusic();
                        }
                    }
                })
                .catch(error => console.error('Error loading background music:', error));
        }

        toggleMusic() {
            if (this.isPlaying) {
                this.pauseMusic();
            } else {
                this.playMusic();
            }
        }

        playMusic() {
            if (this.audioPlayer.src) {
                this.audioPlayer.play()
                    .then(() => {
                        this.isPlaying = true;
                        this.updateMusicUI();
                    })
                    .catch(error => console.error('Error playing music:', error));
            }
        }

        pauseMusic() {
            this.audioPlayer.pause();
            this.isPlaying = false;
            this.updateMusicUI();
        }

        updateMusicUI() {
            const musicToggle = document.querySelector('.music-toggle');
            if (musicToggle) {
                musicToggle.innerHTML = this.isPlaying ? '⏸️' : '▶️';
                musicToggle.classList.toggle('playing', this.isPlaying);
            }
        }

        adjustVolume(e) {
            this.volume = e.target.value;
            this.audioPlayer.volume = this.volume / 100;
            
            // Save volume preference
            fetch('/api/settings/volume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ volume: this.volume })
            });
        }

        loadAds() {
            // Load advertisements dynamically
            fetch('/api/ads')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.renderAds(data.ads);
                    }
                })
                .catch(error => console.error('Error loading ads:', error));
        }

        renderAds(ads) {
            ads.forEach(ad => {
                if (ad.isActive) {
                    const adElement = this.createAdElement(ad);
                    const container = document.querySelector(`.ad-${ad.position}`);
                    if (container) {
                        container.appendChild(adElement);
                        this.trackAdImpression(ad._id);
                    }
                }
            });
        }

        createAdElement(ad) {
            const adDiv = document.createElement('div');
            adDiv.className = 'advertisement';
            adDiv.innerHTML = `
                <a href="${ad.link}" target="_blank" data-ad-id="${ad._id}">
                    <img src="/uploads/ads/${ad.image}" alt="${ad.title}">
                    <div class="ad-content">
                        <h4>${ad.title}</h4>
                        <p>${ad.description}</p>
                    </div>
                </a>
            `;
            
            adDiv.querySelector('a').addEventListener('click', () => {
                this.trackAdClick(ad._id);
            });
            
            return adDiv;
        }

        trackAdClick(adId) {
            fetch('/api/ads/click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adId })
            });
        }

        trackAdImpression(adId) {
            fetch('/api/ads/impression', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adId })
            });
        }

        handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Header background opacity
            if (this.header) {
                this.header.style.background = scrollTop > 50 ? 
                    'rgba(255, 255, 255, 0.98)' : 
                    'rgba(255, 255, 255, 0.95)';
            }
            
            // Show/hide scroll to top button
            if (this.scrollTopBtn) {
                this.scrollTopBtn.style.display = scrollTop > 300 ? 'block' : 'none';
            }
            
            // Update active navigation based on scroll position
            this.updateActiveNavigation();
        }

        updateActiveNavigation() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (navLink && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    navLink.classList.add('active');
                }
            });
        }

        handleSmoothScroll(e) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }

        handleFormSubmit(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Processing...';
            }
            
            // Get form action and method
            const action = form.getAttribute('action');
            const method = form.getAttribute('method') || 'POST';
            
            // Submit form via fetch
            fetch(action, {
                method: method,
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                this.handleFormResponse(form, data);
            })
            .catch(error => {
                this.showAlert('An error occurred. Please try again.', 'danger');
            })
            .finally(() => {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Submit';
                }
            });
        }

        handleFormResponse(form, response) {
            if (response.success) {
                this.showAlert(response.message || 'Success!', 'success');
                form.reset();
                
                // Track conversion
                this.trackConversion(form.id);
            } else {
                this.showAlert(response.message || 'An error occurred', 'danger');
            }
        }

        showAlert(message, type = 'info') {
            // Remove existing alerts
            const existingAlert = document.querySelector('.alert');
            if (existingAlert) {
                existingAlert.remove();
            }
            
            // Create new alert
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            alert.textContent = message;
            
            // Insert at top of main content
            const main = document.querySelector('main') || document.body;
            main.insertBefore(alert, main.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
            
            // Scroll to top to show alert
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        handleCardHover(e) {
            const card = e.currentTarget;
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        }

        handleCardLeave(e) {
            const card = e.currentTarget;
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }

        setupDynamicLoading() {
            // Lazy load images
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
            
            // Infinite scroll for services
            this.setupInfiniteScroll();
        }

        setupInfiniteScroll() {
            const servicesContainer = document.querySelector('.services-grid');
            if (!servicesContainer) return;
            
            let isLoading = false;
            let page = 2;
            
            const loadMoreServices = () => {
                if (isLoading) return;
                
                isLoading = true;
                
                fetch(`/api/services?page=${page}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success && data.services.length > 0) {
                            data.services.forEach(service => {
                                const serviceCard = this.createServiceCard(service);
                                servicesContainer.appendChild(serviceCard);
                            });
                            page++;
                        }
                        isLoading = false;
                    })
                    .catch(error => {
                        console.error('Error loading more services:', error);
                        isLoading = false;
                    });
            };
            
            // Check if user scrolled near bottom
            window.addEventListener('scroll', this.throttle(() => {
                const scrollPosition = window.innerHeight + window.pageYOffset;
                const documentHeight = document.documentElement.offsetHeight;
                
                if (scrollPosition >= documentHeight - 500) {
                    loadMoreServices();
                }
            }, 200));
        }

        createServiceCard(service) {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="service-icon">🚀</div>
                <h3 class="service-title">${service.name}</h3>
                <p class="service-description">${service.description}</p>
                <div class="service-price">$${service.price}</div>
                <a href="/service/${service._id}" class="cta-button">Learn More</a>
            `;
            
            return card;
        }

        // Analytics methods
        trackPageView() {
            const pageData = {
                path: window.location.pathname,
                title: document.title,
                referrer: document.referrer,
                timestamp: new Date().toISOString(),
                visitorId: this.visitorData.id
            };
            
            fetch('/api/analytics/pageview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pageData)
            });
        }

        trackUserInteractions() {
            // Track clicks
            document.addEventListener('click', e => {
                const element = e.target;
                const interactionData = {
                    type: 'click',
                    element: element.tagName,
                    className: element.className,
                    timestamp: new Date().toISOString(),
                    visitorId: this.visitorData.id
                };
                
                fetch('/api/analytics/interaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(interactionData)
                });
            });
        }

        updateVisitorCounter() {
            const visitorElement = document.querySelector('.visitor-count');
            if (visitorElement) {
                fetch('/api/analytics/visitors')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            visitorElement.textContent = data.count.toLocaleString();
                        }
                    });
            }
        }

        trackTimeOnSite() {
            let startTime = Date.now();
            
            window.addEventListener('beforeunload', () => {
                const timeSpent = Date.now() - startTime;
                
                fetch('/api/analytics/time', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        timeSpent: timeSpent,
                        visitorId: this.visitorData.id
                    })
                });
            });
        }

        trackConversion(formId) {
            fetch('/api/analytics/conversion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'form',
                    formId: formId,
                    visitorId: this.visitorData.id,
                    timestamp: new Date().toISOString()
                })
            });
        }

        getVisitorData() {
            let visitorData = localStorage.getItem('ntandostore_visitor');
            
            if (!visitorData) {
                visitorData = {
                    id: this.generateUUID(),
                    firstVisit: new Date().toISOString(),
                    visits: 0
                };
            } else {
                visitorData = JSON.parse(visitorData);
            }
            
            visitorData.visits++;
            visitorData.lastVisit = new Date().toISOString();
            
            localStorage.setItem('ntandostore_visitor', JSON.stringify(visitorData));
            
            return visitorData;
        }

        generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            const mobileMenu = document.querySelector('.mobile-menu');
            
            if (mobileMenu) {
                mobileMenu.classList.toggle('active', this.isMobileMenuOpen);
                this.mobileMenuBtn.innerHTML = this.isMobileMenuOpen ? '✕' : '☰';
            }
        }

        // Utility methods
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }

    // Initialize the application when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        window.ntandostore = new NtandoStore();
        
        // Service Worker registration for offline support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
        
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                fetch('/api/analytics/performance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        loadTime: loadTime,
                        timestamp: new Date().toISOString()
                    })
                });
            });
        }
    });

    // Export for global access
    window.NtandoStore = NtandoStore;
    
})();