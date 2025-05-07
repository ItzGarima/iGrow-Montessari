document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Initialize all components
  initNavigation();
  initHamburgerMenu();
  initTestimonialsSlider();
  initGallerySlider();
  initScrollAnimations();
  initFAQ();
});

// Initialize navigation and smooth scrolling
function initNavigation() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], a[href^="#"]');
  
  // Add click event listener to each navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default anchor behavior
      
      // Get the target section id from the href attribute
      const targetId = this.getAttribute('href');
      
      // Get the target element
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate position to scroll to (with offset for header height)
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Smooth scroll to the target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active link
        updateActiveLink(targetId.substring(1));
      }
    });
  });
  
  // Set active link based on scroll position
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Check each section and update active link accordingly
    document.querySelectorAll('section[id], div[id]').forEach(section => {
      const headerHeight = header ? header.offsetHeight : 0;
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        updateActiveLink(sectionId);
      }
    });
  });
}

// Function to update active link
function updateActiveLink(sectionId) {
  // Remove active class from all links
  const navLinks = document.querySelectorAll('.nav-links a, .nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current link
  const currentLinks = document.querySelectorAll(`.nav-links a[href="#${sectionId}"], .nav-link[href="#${sectionId}"]`);
  currentLinks.forEach(link => {
    link.classList.add('active');
  });
}

// Initialize hamburger menu
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('nav');
  
  if (!hamburger || !nav) return;
  
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent the document click from immediately closing the menu
    nav.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnHamburger) {
      nav.classList.remove('active');
    }
  });
  
  // Close menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
    });
  });
}

// Initialize testimonials slider with performance optimizations
function initTestimonialsSlider() {
  const slider = document.getElementById('testimonials-slider');
  if (!slider) return;
  
  initSlider(slider, 'testimonial-dots', 'prev-testimonial', 'next-testimonial', 5000);
}

// Initialize gallery slider with performance optimizations
function initGallerySlider() {
  const slider = document.getElementById('gallery-slider');
  if (!slider) return;
  
  initSlider(slider, 'gallery-dots', 'prev-gallery', 'next-gallery', 6000);
}

// Generic slider initialization function
function initSlider(slider, dotsId, prevBtnId, nextBtnId, autoSlideTime) {
  const slides = slider.children;
  const dotsContainer = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  let currentSlide = 0;
  let isAnimating = false;
  let autoSlideInterval;
  
  // Preload images for better performance
  Array.from(slides).forEach(slide => {
    const images = slide.querySelectorAll('img');
    images.forEach(img => {
      if (img.getAttribute('src')) {
        const preloadImg = new Image();
        preloadImg.src = img.getAttribute('src');
      }
    });
  });
  
  // Create dots for each slide
  if (dotsContainer) {
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.dataset.slide = i;
      dot.addEventListener('click', () => {
        if (!isAnimating) {
          goToSlide(i);
        }
      });
      dotsContainer.appendChild(dot);
    }
  }
  
  // Set up event listeners for next/prev buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (!isAnimating) {
        goToSlide(currentSlide - 1);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!isAnimating) {
        goToSlide(currentSlide + 1);
      }
    });
  }
  
  // Function to go to a specific slide
  function goToSlide(slideIndex) {
    // Prevent multiple animations at once
    if (isAnimating) return;
    isAnimating = true;
    
    // Reset auto slide timer
    resetAutoSlide();
    
    // Handle loop
    if (slideIndex < 0) {
      slideIndex = slides.length - 1;
    } else if (slideIndex >= slides.length) {
      slideIndex = 0;
    }
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      // Move slider with hardware acceleration
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.children;
        for (let i = 0; i < dots.length; i++) {
          dots[i].classList.toggle('active', i === currentSlide);
        }
      }
      
      // Allow next animation after transition completes
      setTimeout(() => {
        isAnimating = false;
      }, 500); // Match this with your CSS transition time
    });
  }
  
  // Start auto slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, autoSlideTime);
  }
  
  // Reset auto slide
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }
  
  // Start auto slide initially
  startAutoSlide();
  
  // Stop autoSlide when user interacts with the slider
  slider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
  });
  
  // Resume autoSlide when user stops interacting
  slider.addEventListener('mouseleave', () => {
    startAutoSlide();
  });
}

// Initialize scroll animations
function initScrollAnimations() {
  // Get all elements that should be animated on scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // If IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If element is in viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Stop observing after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 }); // Trigger when at least 10% of the element is visible
    
    // Observe all elements
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    // Just show all elements
    animatedElements.forEach(element => {
      element.classList.add('in-view');
    });
  }
}

// Initialize FAQ functionality
function initFAQ() {
  // Get all FAQ question elements
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  // Add click event listener to each question
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      // Toggle active class on parent item
      const faqItem = this.parentElement;
      
      // Check if this item is already active
      const isActive = faqItem.classList.contains('active');
      
      // First close all items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // If the clicked item wasn't active before, open it
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
  
  // Open the first FAQ item by default
  if (faqQuestions.length > 0) {
    faqQuestions[0].parentElement.classList.add('active');
  }
}