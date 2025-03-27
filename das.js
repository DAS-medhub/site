document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle') || createMenuToggle();
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    // Improved mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip for elements that don't need smooth scroll
            if (this.getAttribute('href') === '#') return;
            if (this.classList.contains('no-smooth-scroll')) return;
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Scroll Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // Add reveal class to all section elements if not already added in HTML
    document.querySelectorAll('section:not(.reveal)').forEach(section => {
        section.classList.add('reveal');
        revealObserver.observe(section);
    });

    // Dynamic Header
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Create and add Back to Top button
    createBackToTopButton();
    
    // Avatar Popup functionality
    if (!sessionStorage.getItem('avatarPopupShown')) {
        setTimeout(createAvatarPopup, 3000);
    }
    
    // Function to create menu toggle if not in HTML
    function createMenuToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'menu-toggle';
        
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            toggle.appendChild(span);
        }
        
        const headerContent = document.querySelector('.header-content');
        headerContent.appendChild(toggle);
        
        return toggle;
    }
    
    // Create Back to Top button
    function createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
        
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }
    
    // Create Avatar Popup
    function createAvatarPopup() {
        // Create popup container
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'avatar-popup-overlay';
        
        // Create popup card
        const popupCard = document.createElement('div');
        popupCard.className = 'avatar-popup-card reveal';
        
        // Add content to popup card
        popupCard.innerHTML = `
            <div class="avatar-popup-close"><i class="fas fa-times"></i></div>
            <div class="avatar-popup-content">
                <div class="avatar-popup-image">
                    <img src="images/image-removebg-preview.png" alt="Rose - AI Avatar">
                </div>
                <div class="avatar-popup-text">
                    <h3>Hello, I'm Rose!</h3>
                    <p>😊 I'm here to assess your symptoms and provide personalized health recommendations. 💙 Let's get you the care you need—lets talk now! 💬</p>
                    <div class="avatar-popup-buttons">
                        <button class="btn btn-primary start-chat-btn">Start Conversation</button>
                        <button class="btn btn-outline close-popup-btn">Maybe Later</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add popup to document
        document.body.appendChild(popupOverlay);
        popupOverlay.appendChild(popupCard);
        
        // Show popup with a slight delay for better user experience
        setTimeout(() => {
            popupOverlay.classList.add('active');
            popupCard.classList.add('active');
        }, 200);
        
        // Close popup functionality
        const closeButton = popupCard.querySelector('.avatar-popup-close');
        const laterButton = popupCard.querySelector('.close-popup-btn');
        
        function closePopup() {
            popupOverlay.classList.remove('active');
            popupCard.classList.remove('active');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (popupOverlay.parentNode) {
                    document.body.removeChild(popupOverlay);
                }
            }, 500);
            
            // Set session storage to prevent showing again in the same session
            sessionStorage.setItem('avatarPopupShown', 'true');
        }
        
        closeButton.addEventListener('click', closePopup);
        laterButton.addEventListener('click', closePopup);
        
        // Start chat functionality
        const startChatButton = popupCard.querySelector('.start-chat-btn');
        startChatButton.addEventListener('click', () => {
            closePopup();
            // Redirect to land.html when the button is clicked
            window.location.href = 'land.html';
        });
    }
});