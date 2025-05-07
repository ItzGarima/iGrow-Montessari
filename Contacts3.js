.preventDefault();
      
      // Get the section id from href attribute
      const sectionId = this.getAttribute('href').substring(1);
      
      // Update active link
      setActiveLink(sectionId);
      
      // Scroll to the section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initialize the school picture hover effect
  const pictureBoxes = document.querySelectorAll('.picture-box');
  pictureBoxes.forEach(box => {
    box.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    box.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});

// Function to set active link
function setActiveLink(sectionId) {
  // Remove active class from all links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to current link
  const currentLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
  if (currentLink) {
    currentLink.classList.add('active');
  }
  
  activeLink = sectionId;
}