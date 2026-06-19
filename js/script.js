/**
 * Javacreate - Minecraft Server Portal
 * Main JavaScript Module
 * ===================================
 * Features: Loading screen, sidebar navigation, smooth scroll,
 * copy IP, scroll reveal, FAQ accordion, download counter,
 * typing effect, parallax, toast system, and more.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ===== UTILITY FUNCTIONS ===== */

  /**
   * Debounce utility - prevents excessive function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Delay in ms
   */
  const debounce = (func, wait = 100) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  /* ===== LOADING SCREEN ===== */

  const loadingScreen = document.getElementById("loadingScreen");

  const hideLoadingScreen = () => {
    if (!loadingScreen) return;

    setTimeout(() => {
      loadingScreen.classList.add("loading--hidden");
      document.body.classList.add("loaded");

      loadingScreen.addEventListener(
        "transitionend",
        () => {
          loadingScreen.remove();
        },
        { once: true },
      );
    }, 800);
  };

  window.addEventListener("load", hideLoadingScreen);

  /* ===== SIDEBAR NAVIGATION ===== */

  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  /** Open the mobile sidebar */
  const openSidebar = () => {
    sidebar.classList.add("sidebar--active");
    sidebarToggle.classList.add("sidebar-toggle--active");
    sidebarOverlay.classList.add("sidebar-overlay--active");
    document.body.style.overflow = "hidden";
  };

  /** Close the mobile sidebar */
  const closeSidebar = () => {
    sidebar.classList.remove("sidebar--active");
    sidebarToggle.classList.remove("sidebar-toggle--active");
    sidebarOverlay.classList.remove("sidebar-overlay--active");
    document.body.style.overflow = "";
  };

  /** Toggle sidebar open/close */
  const toggleSidebar = () => {
    if (sidebar.classList.contains("sidebar--active")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  // Close sidebar on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();
    }
  });

  /* ===== SMOOTH SCROLLING ===== */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();

      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });

        // Close sidebar on mobile after clicking a nav link
        if (window.innerWidth <= 768) {
          closeSidebar();
        }
      }
    });
  });

  /* ===== ACTIVE NAVIGATION STATE ===== */

  const navLinks = document.querySelectorAll(".nav__link");
  const sections = document.querySelectorAll("section[id]");

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      link.classList.remove("nav__link--active");
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.classList.add("nav__link--active");
      }
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  /* ===== COPY SERVER IP ===== */

  const copyIpBtn = document.getElementById("copyIp");
  const SERVER_IP = "play.javacreate.naufalrafa.my.id";

  if (copyIpBtn) {
    const originalHTML = copyIpBtn.innerHTML;

    copyIpBtn.addEventListener("click", async () => {
      try {
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(SERVER_IP);
        } else {
          // Fallback for older browsers
          const textarea = document.createElement("textarea");
          textarea.value = SERVER_IP;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        // Show success feedback
        showToast("IP Server berhasil disalin!", "success");

        // Temporarily change button content
        copyIpBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Tersalin!</span>
        `;

        setTimeout(() => {
          copyIpBtn.innerHTML = originalHTML;
        }, 2000);
      } catch (err) {
        showToast("Gagal menyalin IP. Silakan salin manual.", "error");
        console.error("Copy failed:", err);
      }
    });
  }

  /* ===== SCROLL REVEAL ANIMATION ===== */

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Apply stagger delay if specified
          if (el.dataset.delay) {
            el.style.transitionDelay = `${el.dataset.delay}ms`;
          }

          el.classList.add("reveal--active");
          revealObserver.unobserve(el);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  /* ===== BACK TO TOP BUTTON ===== */

  const backToTopBtn = document.querySelector(".back-to-top");

  if (backToTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 500) {
          backToTopBtn.classList.add("back-to-top--visible");
        } else {
          backToTopBtn.classList.remove("back-to-top--visible");
        }
      },
      { passive: true },
    );

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Track download clicks
  const downloadBtn = document.getElementById("downloadBtn");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      downloadCount++;
      localStorage.setItem(STORAGE_KEY, downloadCount);

      if (downloadCountEl) {
        animateCounter(downloadCountEl, downloadCount, 500);
      }

      showToast("Download dimulai...", "info");
    });
  }

  /* ===== FAQ ACCORDION ===== */

  const faqQuestions = document.querySelectorAll(".faq__question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.closest(".faq__item");
      const isActive = faqItem.classList.contains("faq__item--active");

      // Close all other FAQ items (accordion behavior)
      document.querySelectorAll(".faq__item--active").forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove("faq__item--active");
          const q = item.querySelector(".faq__question");
          if (q) q.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current item
      faqItem.classList.toggle("faq__item--active");
      question.setAttribute("aria-expanded", !isActive);
    });

    // Keyboard support
    question.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        question.click();
      }
    });
  });

  /* ===== TOAST NOTIFICATION SYSTEM ===== */

  /**
   * Show a toast notification
   * @param {string} message - Toast message text
   * @param {string} type - 'success' | 'error' | 'info'
   * @param {number} duration - Duration in ms before auto-dismiss
   */
  window.showToast = function showToast(
    message,
    type = "success",
    duration = 3000,
  ) {
    const container = document.querySelector(".toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;

    // Icon SVGs by type
    const icons = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3FB950" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
      error: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f85149" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
      info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    };

    toast.innerHTML = `${icons[type] || ""}<span>${message}</span>`;
    container.appendChild(toast);

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.add("toast--exit");
      toast.addEventListener(
        "animationend",
        () => {
          toast.remove();
        },
        { once: true },
      );
    }, duration);
  };

  // Make showToast accessible from global scope
  const showToast = window.showToast;

  /* ===== HERO TYPING EFFECT ===== */

  const typingElement = document.getElementById("heroTyping");

  if (typingElement) {
    const phrases = [
      "Creative Mode + Create Mod",
      "Build \u2022 Automate \u2022 Explore",
      "Railway System & Decoration",
      "Komunitas Kecil, Petualangan Besar",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = "";

    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseAfterType = 2000;
    const pauseAfterDelete = 500;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        currentText = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      typingElement.innerHTML = `${currentText}<span class="cursor"></span>`;

      let delay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing, pause then start deleting
        delay = pauseAfterType;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = pauseAfterDelete;
      }

      setTimeout(type, delay);
    };

    // Start typing after loading screen
    setTimeout(type, 1500);
  }

  /* ===== SUBTLE PARALLAX ===== */

  const heroBg = document.querySelector(".hero__bg");
  let ticking = false;

  if (heroBg) {
    const updateParallax = () => {
      if (window.innerWidth > 768) {
        const scrollY = window.scrollY;
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  /* ===== LAZY LOAD IMAGES ===== */

  const lazyImages = document.querySelectorAll("img[data-src]");

  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add("loaded");
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: "100px",
      },
    );

    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  /* ===== SERVER STATUS (PLACEHOLDER) ===== */

  /**
   * ServerStatus - Placeholder class for future real-time server status
   * In the future, this can fetch from an actual Minecraft server status API
   */
  class ServerStatus {
    constructor() {
      this.online = true;
      this.playerCount = 0;
      this.maxPlayers = 20;
      this.version = "1.20.1";
    }

    /**
     * Fetch server status
     */
    async fetchStatus() {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
        const data = await res.json();

        this.online = data.online;
        this.playerCount = data.players ? data.players.online : 0;
        this.maxPlayers = data.players ? data.players.max : 20;
        this.version = data.version || "Unknown";
        
        return {
          online: this.online,
          players: this.playerCount,
          max: this.maxPlayers,
          version: this.version,
        };
      } catch (error) {
        console.error("Failed to fetch server status:", error);
        return { online: false, players: 0, max: this.maxPlayers };
      }
    }

    /** Update DOM elements with server status */
    updateUI() {
      const dot = document.querySelector(".server-status__dot");
      const text = document.querySelector(".server-status__text");
      const count = document.querySelector(".server-status__count");

      if (dot) {
        dot.style.backgroundColor = this.online ? "var(--accent)" : "#f85149";
      }
      if (text) {
        text.textContent = this.online ? "Online" : "Offline";
      }
      if (count) {
        count.textContent = `${this.playerCount}/${this.maxPlayers} Online`;
      }
    }
  }

  // Initialize server status
  const serverStatus = new ServerStatus();
  
  /** Fetch status from API and refresh UI elements */
  const refreshServerStatus = async () => {
    await serverStatus.fetchStatus();
    serverStatus.updateUI();
  };

  // Run on page load
  refreshServerStatus();

  // Periodically refresh every 60 seconds
  setInterval(refreshServerStatus, 60000);

  /*
   * ===== FUTURE FEATURE PLACEHOLDERS =====
   *
   * Gallery Lightbox:
   * - Implement modal image viewer for screenshot gallery
   * - Support keyboard navigation and swipe gestures
   *
   * Leaderboard:
   * - Fetch player stats from server API
   * - Display top players with stats
   *
   * Discord Widget:
   * - Embed Discord server widget
   * - Show online members and invite link
   *
   * Real-time Player List:
   * - WebSocket connection to server
   * - Live player join/leave updates
   *
   * News Feed:
   * - Fetch and display server announcements
   * - Support markdown rendering
   *
   * Telegram Widget:
   * - Integrate Telegram channel/group widget
   * - Show latest messages
   */
});
