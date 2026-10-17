/**
 * DEVELOPER PORTFOLIO - ASHITHA (PIM UDUPI)
 * Core Application Logic: Theme Switching, Mobile Drawer, Project Filter,
 * Copy to Clipboard, Resume Modal, Form Validation, and Scrollspy.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. Toast Notification Utility
  // ------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, iconSvg = null, duration = 3200) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');

    const defaultIcon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;

    toast.innerHTML = `
      <span class="toast-icon">${iconSvg || defaultIcon}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, duration);
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }

  // ------------------------------------------------------------------------
  // 2. Theme Switching (Light / Dark with localStorage)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Initialize theme: Check storage, then system preference, default to 'light'
  const savedTheme = localStorage.getItem('ashitha_portfolio_theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Default appearance mode as requested: Light Theme
    setTheme('light');
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('ashitha_portfolio_theme', theme);

    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }

  // ------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // ------------------------------------------------------------------------
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('active');
    drawerBackdrop.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.setAttribute('aria-hidden', 'false');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (drawerCloseBtn) drawerCloseBtn.focus();
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('active');
    drawerBackdrop.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.focus();
    }
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ------------------------------------------------------------------------
  // 4. Smooth Scrolling & Active Scrollspy
  // ------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const trackedSections = document.querySelectorAll('main > section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    trackedSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ------------------------------------------------------------------------
  // 5. Project Category Filtering
  // ------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-hidden');
          card.classList.add('is-animating-in');
          card.addEventListener('animationend', () => {
            card.classList.remove('is-animating-in');
          }, { once: true });
        } else {
          card.classList.add('is-hidden');
          card.classList.remove('is-animating-in');
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 6. Copy to Clipboard Functionality
  // ------------------------------------------------------------------------
  async function copyText(text, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-https or older browsers
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.opacity = '0';
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();
        document.execCommand('copy');
        tempTextArea.remove();
      }
      showToast(successMessage);
    } catch (err) {
      showToast('Could not copy to clipboard. Text: ' + text);
    }
  }

  // Email Copy Buttons
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'ashithasuvarna0701@gmail.com';
      copyText(email, 'Email copied to clipboard!');
    });
  });

  // Phone Copy Buttons
  document.querySelectorAll('.copy-phone-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = btn.getAttribute('data-phone') || '6364506541';
      copyText(phone, 'Phone number copied to clipboard!');
    });
  });

  // ------------------------------------------------------------------------
  // 7. Accessible Resume Modal (Print, View, Download Plaintext)
  // ------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDoneBtn = document.getElementById('modal-done-btn');
  const modalPrintBtn = document.getElementById('modal-print-btn');
  const modalDownloadTxtBtn = document.getElementById('modal-download-txt-btn');
  const resumeTriggers = [
    document.getElementById('nav-resume-btn'),
    document.getElementById('hero-resume-trigger'),
    document.getElementById('drawer-resume-btn')
  ].filter(Boolean);

  let previousActiveElement = null;

  function openResumeModal() {
    if (!resumeModal) return;
    previousActiveElement = document.activeElement;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousActiveElement) previousActiveElement.focus();
  }

  resumeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // If mobile drawer was open, close it first
      closeDrawer();
      openResumeModal();
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeResumeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeResumeModal);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (modalDownloadTxtBtn) {
    modalDownloadTxtBtn.addEventListener('click', () => {
      downloadPlaintextResume();
    });
  }

  function downloadPlaintextResume() {
    const resumeText = `========================================================================
ASHITHA - ACADEMIC & TECHNICAL RESUME
First-Year MCA Student | Aspiring Software Developer
Poornaprajna Institute of Management (PIM), Udupi, Karnataka
========================================================================

CONTACT INFORMATION:
- Email: ashithasuvarna0701@gmail.com
- Phone: +91 6364506541
- Location: Udupi, Karnataka, India
- GitHub: https://github.com/ashithasuvarna0701-hue

PROFESSIONAL STATEMENT:
"My name is Ashitha. I am an aspiring software engineer interested in 
software development, web technologies and problem-solving."
Currently pursuing my Master of Computer Applications at Poornaprajna 
Institute of Management (PIM), dedicated to building accessible web apps 
and robust software systems.

ACADEMIC EDUCATION:
1. Master of Computer Applications (MCA)
   - Institution: Poornaprajna Institute of Management (PIM), Udupi, Karnataka
   - Duration: 2026 – 2028 | Status: Pursuing (1st Year)
   - Specialization: Computer Applications & Software Development
   - Core Areas: Software Engineering, Database Systems, Web Scripting, OOP

2. Bachelor of Computer Applications (BCA)
   - Institution: Mulky SunderRam shetty collage shirva, Karnataka
   - Duration: 2023 – 2026 | Status: Completed
   - Specialization: Computer Applications
   - Academic Score: 8.1 CGPA

PROGRAMMING & VERIFIED SKILLS:
- Verified Evaluated Languages:
  * Python: Level: Basic
  * HTML: Level: Basic (Web Markup Fundamentals)
- Frontend Development: HTML, CSS
- Backend Development: Node.js
- Databases & Storage: MySQL (Relational Schema & SQL)
- Tools & IDEs: GitHub (Git version control)
- Data Science & AI: Pandas (Data manipulation)
- Cloud & Systems: Google Cloud, Object-Oriented Programming (OOP)

PROJECTS & TECHNICAL ARTIFACTS:
1. Personal Developer Portfolio & Web Utilities
   - Category: Web Development | Status: In Progress
   - Tech: HTML5, CSS3, JavaScript (Vanilla ES6+), GitHub Pages
   - Overview: Modern developer portfolio built with semantic HTML5, 
     responsive design, dark/light theme switcher, accessible WCAG 2.1 AA 
     contrast, and dynamic project filtering.

2. Student Academic Database Model
   - Category: Databases & Storage | Status: In Progress (Academic Practical)
   - Tech: MySQL, SQL, Node.js
   - Overview: Relational schema design, entity modeling, normalization, 
     and query optimization for university coursework.

3. Exploratory Data Analysis with Python & Pandas
   - Category: Data Science & AI | Status: In Progress (Lab Experiments)
   - Tech: Python (Basic), Pandas
   - Overview: Data cleaning, DataFrame manipulations, and analytical exploration.

LANGUAGES & EXTRACURRICULARS:
- Spoken Languages: English (Professional Working), Kannada (Native / Fluent)
- Hobbies: Dancing, Reading books
========================================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ashitha_developer_resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Resume downloaded (.txt)');
  }

  // ------------------------------------------------------------------------
  // 8. Global Keyboard Handlers (Escape key for modal & drawer)
  // ------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal && resumeModal.classList.contains('active')) {
        closeResumeModal();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    }
  });

  // ------------------------------------------------------------------------
  // 9. Interactive Contact Form with Validation & Mailto Dispatch
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      const nameGroup = nameInput.closest('.form-group');
      if (!nameInput.value.trim()) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // Validate Email
      const emailGroup = emailInput.closest('.form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      // Validate Message
      const messageGroup = messageInput.closest('.form-group');
      if (!messageInput.value.trim()) {
        messageGroup.classList.add('has-error');
        isValid = false;
      } else {
        messageGroup.classList.remove('has-error');
      }

      if (!isValid) {
        showToast('Please correct the highlighted fields in the form.');
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim() || 'Inquiry for Ashitha';
      const userMessage = messageInput.value.trim();

      const emailBody = `Sender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${userMessage}\n\n---\nSent via Ashitha's Portfolio Website`;

      const mailtoUrl = `mailto:ashithasuvarna0701@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      // Try copying email body to clipboard for convenience
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(emailBody).catch(() => {});
      }

      // Open mail client
      window.location.href = mailtoUrl;

      showToast('Opening default email client...');
      contactForm.reset();
    });

    // Clear error states on input
    [nameInput, emailInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && input.value.trim()) {
          group.classList.remove('has-error');
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 10. Dynamic Current Year in Footer
  // ------------------------------------------------------------------------
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 11. Subtle Scroll Reveal Observer
  // ------------------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll('.content-section, .highlight-item, .project-card, .verified-skills-box');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }
});
