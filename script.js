
/* ==================================================
   PREMIUM CREATIVE AGENCY
   MAIN JAVASCRIPT

   01. DOM Initialization
   02. Responsive Navbar
   03. Mobile Menu Open / Close
   04. Keyboard Accessibility
   05. Navbar Scroll Effect
   06. Active Navigation Links
   07. GSAP Hero Entrance
   08. Smooth 3D Mouse Parallax
   09. Responsive Cleanup
================================================== */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /* ==============================================
     01. SELECT ELEMENTS
  ============================================== */

  const header = document.getElementById("siteHeader");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const backdrop = document.getElementById("menuBackdrop");

  const desktopLinks = document.querySelectorAll(
    ".desktop-navigation .nav-link"
  );

  const hero = document.querySelector(".hero-section");
  const heroParallax = document.getElementById("heroParallax");

  const desktopBreakpoint = window.matchMedia(
    "(min-width: 1025px)"
  );

  const desktopPointer = window.matchMedia(
    "(min-width: 1025px) and (hover: hover) and (pointer: fine)"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let menuOpen = false;
  let lastFocusedElement = null;

  /* ==============================================
     02. NAVBAR / MOBILE MENU
  ============================================== */

  if (header && hamburger && mobileMenu && backdrop) {

    const mobileLinks = mobileMenu.querySelectorAll(
      ".mobile-nav-link, .mobile-menu-button"
    );

    /* ------------------------------------------
       OPEN MENU
    ------------------------------------------ */

    function openMenu() {

      if (menuOpen) return;

      menuOpen = true;

      lastFocusedElement = document.activeElement;

      // Enable menu keyboard access
      mobileMenu.inert = false;
      mobileMenu.setAttribute("aria-hidden", "false");

      // CSS controls the smooth animation
      mobileMenu.classList.remove("is-closing");
      mobileMenu.classList.add("is-open");

      backdrop.classList.add("is-visible");
      hamburger.classList.add("is-active");
      header.classList.add("menu-active");

      document.body.classList.add("menu-locked");

      hamburger.setAttribute("aria-expanded", "true");
      hamburger.setAttribute(
        "aria-label",
        "Close navigation menu"
      );
    }

    /* ------------------------------------------
       CLOSE MENU
    ------------------------------------------ */

    function closeMenu(restoreFocus = true) {

      if (!menuOpen) return;

      menuOpen = false;

      // CSS reverse transition
      mobileMenu.classList.remove("is-open");
      backdrop.classList.remove("is-visible");

      hamburger.classList.remove("is-active");
      header.classList.remove("menu-active");

      document.body.classList.remove("menu-locked");

      mobileMenu.inert = true;
      mobileMenu.setAttribute("aria-hidden", "true");

      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

      if (
        restoreFocus &&
        lastFocusedElement &&
        lastFocusedElement.isConnected
      ) {
        lastFocusedElement.focus();
      }
    }

    /* ------------------------------------------
       HAMBURGER CLICK
    ------------------------------------------ */

    hamburger.addEventListener("click", () => {

      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }

    });

    /* ------------------------------------------
       OUTSIDE CLICK
    ------------------------------------------ */

    backdrop.addEventListener("click", () => {
      closeMenu();
      hamburger.focus();
    });

    /* ------------------------------------------
       MENU LINKS
    ------------------------------------------ */

    mobileLinks.forEach(link => {

      link.addEventListener("click", () => {
        closeMenu(false);
      });

    });

    /* ------------------------------------------
       ESCAPE KEY AND FOCUS TRAP
    ------------------------------------------ */

    document.addEventListener("keydown", event => {

      if (!menuOpen) return;

      if (event.key === "Escape") {
        closeMenu();
        hamburger.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [
        hamburger,
        ...mobileMenu.querySelectorAll("a[href]")
      ];

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        current === last
      ) {
        event.preventDefault();
        first.focus();
      } else if (!focusable.includes(current)) {
        event.preventDefault();
        first.focus();
      }

    });

    /* ------------------------------------------
       RESPONSIVE MENU CLEANUP
    ------------------------------------------ */

    desktopBreakpoint.addEventListener(
      "change",
      event => {
        if (event.matches && menuOpen) {
          closeMenu(false);
        }
      }
    );

    /* ==============================================
       03. STICKY NAVBAR
    ============================================== */

    function updateHeader() {

      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 30
      );

    }

    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );

    updateHeader();

    /* ==============================================
       04. ACTIVE NAVIGATION LINKS
    ============================================== */

    const sections = document.querySelectorAll(
      "main section[id]"
    );

    function updateActiveNavigation() {

      let activeId = "home";

      sections.forEach(section => {

        const position =
          section.getBoundingClientRect().top;

        if (position <= 160) {
          activeId = section.id;
        }

      });

      desktopLinks.forEach(link => {

        const href = link.getAttribute("href");

        link.classList.toggle(
          "active",
          href === "#" + activeId
        );

      });

    }

    window.addEventListener(
      "scroll",
      updateActiveNavigation,
      { passive: true }
    );

    updateActiveNavigation();

    console.log("Navbar initialized successfully.");

  } else {
    console.warn(
      "Navbar initialization skipped: missing HTML element."
    );
  }

  /* ==============================================
     05. CHECK GSAP
  ============================================== */

  const gsapReady =
    typeof window.gsap !== "undefined";

  const allowMotion =
    gsapReady && !reducedMotion.matches;

  if (!gsapReady) {
    console.warn(
      "GSAP not loaded. CSS animations will still work."
    );
  }

  /* ==============================================
     06. HERO ENTRANCE ANIMATION
  ============================================== */

  if (hero && allowMotion) {

    const heroTimeline = gsap.timeline({
      defaults: {
        ease: "power3.out"
      }
    });

    // Badge
    heroTimeline.from(".hero-badge", {
      y: 25,
      autoAlpha: 0,
      duration: 1.2
    });

    // Main Heading
    heroTimeline.from(".hero-heading", {
      y: 55,
      autoAlpha: 0,
      duration: 1.6
    }, "-=0.8");

    // Description
    heroTimeline.from(".hero-description", {
      y: 30,
      autoAlpha: 0,
      duration: 1.3
    }, "-=1.0");

    // Buttons
    heroTimeline.from(".hero-actions .hero-btn", {
      y: 25,
      autoAlpha: 0,
      duration: 1.1,
      stagger: 0.18
    }, "-=0.85");

    // Small Text
    heroTimeline.from(".hero-microcopy", {
      y: 18,
      autoAlpha: 0,
      duration: 1
    }, "-=0.7");

    // 3D Image Entrance
    heroTimeline.from(".hero-visual-enter", {
      x: 50,
      scale: 0.93,
      autoAlpha: 0,
      duration: 1.8,
      ease: "power2.out"
    }, 0.25);

    // Scroll Indicator
    heroTimeline.from(".hero-scroll", {
      y: 15,
      autoAlpha: 0,
      duration: 1.1
    }, "-=0.6");

    console.log("GSAP Hero entrance initialized.");

  }

  /* ==============================================
     07. SMOOTH 3D MOUSE PARALLAX
  ============================================== */

  if (hero && heroParallax && allowMotion) {

    const moveX = gsap.quickTo(
      heroParallax,
      "x",
      {
        duration: 1.6,
        ease: "power3.out"
      }
    );

    const moveY = gsap.quickTo(
      heroParallax,
      "y",
      {
        duration: 1.6,
        ease: "power3.out"
      }
    );

    const rotateX = gsap.quickTo(
      heroParallax,
      "rotationX",
      {
        duration: 1.6,
        ease: "power3.out"
      }
    );

    const rotateY = gsap.quickTo(
      heroParallax,
      "rotationY",
      {
        duration: 1.6,
        ease: "power3.out"
      }
    );

    /* ------------------------------------------
       PARALLAX ON POINTER MOVE
    ------------------------------------------ */

    hero.addEventListener("pointermove", event => {

      if (!desktopPointer.matches) return;

      const rect = hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      // Gentle parallax movement
      moveX(x * 26);
      moveY(y * 18);

      rotateX(-y * 7);
      rotateY(x * 9);

    });

    /* ------------------------------------------
       RESET WHEN POINTER LEAVES
    ------------------------------------------ */

    function resetParallax() {

      moveX(0);
      moveY(0);

      rotateX(0);
      rotateY(0);
    }

    hero.addEventListener(
      "pointerleave",
      resetParallax
    );

    /* ------------------------------------------
       RESET WHEN SWITCHING TO MOBILE
    ------------------------------------------ */

    desktopPointer.addEventListener(
      "change",
      event => {

        if (!event.matches) {
          resetParallax();
        }

      }
    );

    console.log("Smooth 3D parallax initialized.");
  }

  /* ==============================================
     08. DEBUG READY MESSAGE
  ============================================== */

  console.log(
    "Website JavaScript V3 loaded successfully!"
  );

});




/* ==========================================
   SECTION 03 — ABOUT US ANIMATIONS
   GSAP FREE + SCROLLTRIGGER
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /* 01. GET ABOUT SECTION */

  const aboutSection = document.querySelector(
    ".about-section"
  );

  if (!aboutSection) return;

  /* 02. CHECK MOTION SETTINGS */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (reducedMotion.matches) return;

  /* 03. CHECK GSAP AND SCROLLTRIGGER */

  if (
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger === "undefined"
  ) {
    console.warn(
      "About animation skipped: GSAP or ScrollTrigger not loaded."
    );
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* 04. IMAGE SCROLL REVEAL */

  gsap.fromTo(
    ".about-image-frame",
    {
      autoAlpha: 0,
      y: 65,
      scale: 0.94
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,

      duration: 1.65,
      ease: "power3.out",

      scrollTrigger: {
        trigger: ".about-visual",
        start: "top 85%",
        once: true
      },

      clearProps: "transform,opacity,visibility"
    }
  );

  /* 05. FLOATING CARD REVEAL */

  gsap.fromTo(
    ".about-floating-card",
    {
      autoAlpha: 0,
      x: 35,
      y: 20
    },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,

      duration: 1.35,
      ease: "power3.out",

      scrollTrigger: {
        trigger: ".about-visual",
        start: "top 75%",
        once: true
      },

      delay: 0.45,
      clearProps: "transform,opacity,visibility"
    }
  );

  /* 06. CONTENT ENTRANCE */

  const aboutTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-content",
      start: "top 85%",
      once: true
    },

    defaults: {
      ease: "power3.out"
    }
  });

  aboutTimeline

    .fromTo(
      ".about-eyebrow",
      {
        autoAlpha: 0,
        y: 25
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1
      }
    )

    .fromTo(
      ".about-heading",
      {
        autoAlpha: 0,
        y: 45
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.45
      },
      "-=0.7"
    )

    .fromTo(
      ".about-description",
      {
        autoAlpha: 0,
        y: 30
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15
      },
      "-=0.85"
    )

    .fromTo(
      ".about-feature-card",
      {
        autoAlpha: 0,
        y: 40
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.18,
        clearProps: "transform,opacity,visibility"
      },
      "-=0.8"
    )

    .fromTo(
      ".about-cta",
      {
        autoAlpha: 0,
        y: 25
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        clearProps: "transform,opacity,visibility"
      },
      "-=0.7"
    );

  /* 07. CLEAR INLINE STYLES AFTER REVEAL */

  aboutTimeline.eventCallback("onComplete", () => {

    gsap.set(
      [
        ".about-eyebrow",
        ".about-heading",
        ".about-description"
      ],
      {
        clearProps: "transform,opacity,visibility"
      }
    );

  });

  console.log(
    "About Us ScrollTrigger animations initialized!"
  );

});














/* =====================================================
   SECTION 04 — INFINITE PACKAGES CAROUSEL
   Native JavaScript + GSAP ScrollTrigger
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  const viewport = document.getElementById(
    "packagesViewport"
  );

  const track = document.getElementById(
    "packagesTrack"
  );

  const pagination = document.getElementById(
    "packagesPagination"
  );

  const prevButton = document.querySelector(
    ".packages-prev"
  );

  const nextButton = document.querySelector(
    ".packages-next"
  );

  const currentCounter = document.querySelector(
    ".packages-current"
  );

  const totalCounter = document.querySelector(
    ".packages-total"
  );

  if (
    !viewport ||
    !track ||
    !pagination ||
    !prevButton ||
    !nextButton
  ) {
    return;
  }

  /* ==========================================
     01. CAROUSEL STATE
  ========================================== */

  let originalCards = [];
  let allCards = [];

  let visibleCount = 3;
  let currentIndex = 3;

  let isAnimating = false;
  let resizeTimer;

  let pointerStartX = 0;
  let pointerStartY = 0;
  let pointerId = null;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const duration = 850;

  /* ==========================================
     02. RESPONSIVE CARD COUNT
  ========================================== */

  function getVisibleCount() {

    if (window.innerWidth <= 767) {
      return 1;
    }

    if (window.innerWidth <= 1024) {
      return 2;
    }

    return 3;
  }

  /* ==========================================
     03. CREATE INFINITE LOOP
  ========================================== */

  function setupCarousel() {

    // Remove old clones
    track.querySelectorAll(".is-clone").forEach(card => {
      card.remove();
    });

    originalCards = Array.from(
      track.querySelectorAll(".package-card:not(.is-clone)")
    );

    if (!originalCards.length) return;

    visibleCount = Math.min(
      getVisibleCount(),
      originalCards.length
    );

    currentIndex = visibleCount;

    // Build leading clones
    const leadingClones = originalCards
      .slice(-visibleCount)
      .map(card => {

        const clone = card.cloneNode(true);

        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        clone.inert = true;

        return clone;
      });

    // Build trailing clones
    const trailingClones = originalCards
      .slice(0, visibleCount)
      .map(card => {

        const clone = card.cloneNode(true);

        clone.classList.add("is-clone");
        clone.setAttribute("aria-hidden", "true");
        clone.inert = true;

        return clone;
      });

    // Add leading clones in the correct order
    const leadingFragment = document.createDocumentFragment();

    leadingClones.forEach(card => {
      leadingFragment.appendChild(card);
    });

    track.prepend(leadingFragment);

    // Add trailing clones
    const trailingFragment = document.createDocumentFragment();

    trailingClones.forEach(card => {
      trailingFragment.appendChild(card);
    });

    track.appendChild(trailingFragment);

    allCards = Array.from(track.children);

    // Reset animation before measuring positions
    track.classList.add("is-instant");

    updatePosition(false);
    updatePagination();
    updateCounter();

    // Force layout before enabling transitions
    void track.offsetHeight;

    track.classList.remove("is-instant");

    console.log(
      "Packages carousel initialized:",
      originalCards.length,
      "packages;",
      visibleCount,
      "visible."
    );
  }

  /* ==========================================
     04. UPDATE CAROUSEL POSITION
  ========================================== */

  function updatePosition(animate = true) {

    if (!allCards.length) return;

    if (!animate || prefersReducedMotion.matches) {
      track.classList.add("is-instant");
    } else {
      track.classList.remove("is-instant");
    }

    // The track is positioned relative to itself.
    const activeCard = allCards[currentIndex];

    if (!activeCard) return;

    const offset = activeCard.offsetLeft;

    track.style.transform =
      `translate3d(${-offset}px, 0, 0)`;

    if (!animate || prefersReducedMotion.matches) {
      requestAnimationFrame(() => {
        track.classList.remove("is-instant");
      });
    }
  }

  /* ==========================================
     05. UPDATE COUNTER
  ========================================== */

  function getRealIndex() {

    return (
      (currentIndex - visibleCount + originalCards.length)
      % originalCards.length
    );
  }

  function updateCounter() {

    if (!originalCards.length) return;

    const realIndex = getRealIndex();

    if (currentCounter) {
      currentCounter.textContent = String(
        realIndex + 1
      ).padStart(2, "0");
    }

    if (totalCounter) {
      totalCounter.textContent = String(
        originalCards.length
      ).padStart(2, "0");
    }
  }

  /* ==========================================
     06. DOT PAGINATION
  ========================================== */

  function buildPagination() {

    pagination.innerHTML = "";

    originalCards.forEach((card, index) => {

      const dot = document.createElement("button");

      dot.type = "button";

      dot.setAttribute(
        "aria-label",
        `Go to ${card.querySelector(".package-title")?.textContent || "package"}`
      );

      dot.dataset.package = String(index);

      dot.addEventListener("click", () => {

        if (isAnimating) return;

        const currentRealIndex = getRealIndex();

        const forwardDistance =
          (index - currentRealIndex + originalCards.length)
          % originalCards.length;

        const backwardDistance =
          forwardDistance - originalCards.length;

        // Choose the shorter route
        if (
          Math.abs(backwardDistance) <
          Math.abs(forwardDistance)
        ) {
          currentIndex += backwardDistance;
        } else {
          currentIndex += forwardDistance;
        }

        moveToCurrentIndex();
      });

      pagination.appendChild(dot);
    });

    updatePagination();
  }

  function updatePagination() {

    const realIndex = getRealIndex();

    pagination.querySelectorAll("button").forEach(
      (dot, index) => {

        const active = index === realIndex;

        dot.classList.toggle("is-active", active);

        if (active) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      }
    );
  }

  /* ==========================================
     07. MOVE CAROUSEL
  ========================================== */

  function moveToCurrentIndex() {

    if (!allCards.length) return;

    isAnimating = true;

    updatePosition(true);
    updatePagination();
    updateCounter();
  }

  function nextSlide() {

    if (isAnimating || !originalCards.length) return;

    currentIndex += 1;

    moveToCurrentIndex();
  }

  function previousSlide() {

    if (isAnimating || !originalCards.length) return;

    currentIndex -= 1;

    moveToCurrentIndex();
  }

  nextButton.addEventListener("click", nextSlide);

  prevButton.addEventListener("click", previousSlide);

  /* ==========================================
     08. RESET AT THE CLONE BOUNDARY
  ========================================== */

  track.addEventListener("transitionend", event => {

    if (
      event.target !== track ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    isAnimating = false;

    // Moved into the trailing clones
    if (currentIndex >= visibleCount + originalCards.length) {

      currentIndex -= originalCards.length;

      updatePosition(false);
    }

    // Moved into the leading clones
    if (currentIndex < visibleCount) {

      currentIndex += originalCards.length;

      updatePosition(false);
    }

    updatePagination();
    updateCounter();
  });

  /* ==========================================
     09. TOUCH SWIPE / POINTER DRAG
  ========================================== */

  viewport.addEventListener("pointerdown", event => {

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    pointerId = event.pointerId;

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
  });

  viewport.addEventListener("pointerup", event => {

    if (pointerId !== event.pointerId) return;

    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;

    pointerId = null;

    // Ignore vertical scrolling
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    if (Math.abs(deltaX) < 45) return;

    if (deltaX < 0) {
      nextSlide();
    } else {
      previousSlide();
    }
  });

  viewport.addEventListener("pointercancel", () => {
    pointerId = null;
  });

  /* ==========================================
     10. KEYBOARD NAVIGATION
  ========================================== */

  viewport.setAttribute("tabindex", "0");

  viewport.addEventListener("keydown", event => {

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousSlide();
    }
  });

  /* ==========================================
     11. RESPONSIVE RESIZE
  ========================================== */

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      setupCarousel();
      buildPagination();

    }, 180);

  }, { passive: true });

  /* ==========================================
     12. INITIALIZE
  ========================================== */

  setupCarousel();
  buildPagination();

  /* ==========================================
     13. GSAP SCROLL REVEAL
  ========================================== */

  if (
    !prefersReducedMotion.matches &&
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined"
  ) {

    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      ".packages-toolbar",
      {
        autoAlpha: 0,
        y: 20
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".packages-toolbar",
          start: "top 88%",
          once: true
        },

        clearProps: "transform,opacity,visibility"
      }
    );

    gsap.fromTo(
      ".packages-viewport",
      {
        autoAlpha: 0,
        y: 35
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.35,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".packages-viewport",
          start: "top 85%",
          once: true
        },

        clearProps: "transform,opacity,visibility"
      }
    );

    gsap.fromTo(
      ".packages-footer",
      {
        autoAlpha: 0,
        y: 22
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".packages-footer",
          start: "top 92%",
          once: true
        },

        clearProps: "transform,opacity,visibility"
      }
    );
  }

  console.log("Infinite Packages Section ready.");

});



/* =====================================================
   SECTION 05 — PORTFOLIO SCROLL REVEAL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  const section = document.querySelector(
    ".portfolio-section"
  );

  if (!section) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Keep content visible if animation is unavailable.
  if (
    reduceMotion ||
    typeof window.gsap === "undefined" ||
    typeof window.ScrollTrigger === "undefined"
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // 01. Section heading
  gsap.fromTo(
    section.querySelectorAll(
      ".portfolio-eyebrow, .portfolio-heading, .portfolio-description"
    ),
    {
      autoAlpha: 0,
      y: 28
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.15,
      stagger: 0.16,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",

      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        once: true
      }
    }
  );

  // 02. Exactly two portfolio cards
  gsap.fromTo(
    section.querySelectorAll(".portfolio-card"),
    {
      autoAlpha: 0,
      y: 42
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.25,
      stagger: 0.2,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",

      scrollTrigger: {
        trigger: ".portfolio-grid",
        start: "top 83%",
        once: true
      }
    }
  );

  // 03. Bottom call-to-action
  gsap.fromTo(
    section.querySelector(".portfolio-footer"),
    {
      autoAlpha: 0,
      y: 24
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",

      scrollTrigger: {
        trigger: ".portfolio-footer",
        start: "top 92%",
        once: true
      }
    }
  );

  console.log("Portfolio section animations initialized.");

});




/* ==========================================
   PREMIUM PRELOADER
   Extra 5 Seconds After Page Load
========================================== */

(() => {
  "use strict";

  const loader = document.getElementById("sitePreloader");

  if (!loader) return;

  const root = document.documentElement;

  root.classList.add("is-loading");

  const minimumDisplayTime = 1000;
  const extraDisplayTime = 5000;
  const safetyTimeout = 20000;

  const startTime = performance.now();

  let hasFinished = false;
  let fallbackTimer;

  function hidePreloader() {
    if (hasFinished) return;

    hasFinished = true;
    clearTimeout(fallbackTimer);

    const elapsed = performance.now() - startTime;

    // Keep the loader visible for 5 seconds
    // after the page resources have finished loading.
    const remainingTime = Math.max(
      minimumDisplayTime - elapsed,
      extraDisplayTime
    );

    window.setTimeout(() => {

      loader.classList.add("is-hidden");
      loader.setAttribute("aria-hidden", "true");

      root.classList.remove("is-loading");

      const removeLoader = () => {
        if (loader.isConnected) loader.remove();
      };

      loader.addEventListener("transitionend", event => {
        if (
          event.target === loader &&
          event.propertyName === "opacity"
        ) {
          removeLoader();
        }
      });

      // Fallback if transitionend does not fire.
      window.setTimeout(removeLoader, 1200);

    }, remainingTime);
  }

  window.addEventListener(
    "load",
    hidePreloader,
    { once: true }
  );

  if (document.readyState === "complete") {
    hidePreloader();
  }

  // Safety fallback for slow or failed resources.
  fallbackTimer = window.setTimeout(
    hidePreloader,
    safetyTimeout
  );

})();



/* =====================================================
   SECTION 06 — CONTACT FORM + FOOTER + GSAP
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";

  /* 01. FOOTER YEAR */

  const footerYear = document.getElementById("footerYear");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


  /* 02. CONTACT FORM */

  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactFormStatus");

  if (form && status) {

    /*
      IMPORTANT:
      Replace this with your WhatsApp number.

      Format: country code + number, digits only.
      Bangladesh example format: 8801XXXXXXXXX

      Do not include +, spaces or dashes.
    */

    const WHATSAPP_NUMBER = "YOURWHATSAPPNUMBER";

    form.addEventListener("submit", event => {

      event.preventDefault();

      status.textContent = "";

      // Validate using the browser's built-in form rules.
      if (!form.reportValidity()) {
        return;
      }

      // Avoid opening an unusable WhatsApp URL.
      if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        status.textContent =
          "Setup required: add your WhatsApp number in script.js before submitting.";
        return;
      }

      const formData = new FormData(form);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const packageName = String(
        formData.get("package") || ""
      ).trim();

      const budget = String(
        formData.get("budget") || "Not specified"
      ).trim();

      const message = String(
        formData.get("message") || ""
      ).trim();

      /*
        Construct the inquiry message from validated fields.
        URL encoding prevents special characters from breaking
        the WhatsApp message URL.
      */

      const inquiry = [
        "Hello! I would like to inquire about your services.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Package: ${packageName}`,
        `Budget: ${budget}`,
        "",
        "Project Details:",
        message
      ].join("\n");

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=` +
        encodeURIComponent(inquiry);

      // Open directly from the user's submit action.
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      if (whatsappWindow) {
        status.textContent =
          "Your inquiry is ready in WhatsApp. Review it and press Send there.";
      } else {
        // Fallback if the browser blocks the new tab.
        status.textContent =
          "Your browser blocked the new tab. Opening WhatsApp in this tab.";

        window.location.href = whatsappURL;
      }

    });

  }


  /* 03. GSAP SCROLL REVEAL */

  const contactSection = document.querySelector(
    ".contact-section"
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    contactSection &&
    !reduceMotion &&
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined"
  ) {

    gsap.registerPlugin(ScrollTrigger);

    // Section intro
    gsap.fromTo(
      contactSection.querySelectorAll(
        ".contact-eyebrow, .contact-heading, .contact-description"
      ),
      {
        autoAlpha: 0,
        y: 26
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",

        scrollTrigger: {
          trigger: contactSection,
          start: "top 78%",
          once: true
        },

        clearProps: "transform,opacity,visibility"
      }
    );

    // Sidebar and form
    gsap.fromTo(
      contactSection.querySelectorAll(
        ".contact-sidebar, .contact-form-panel"
      ),
      {
        autoAlpha: 0,
        y: 35
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.18,
        ease: "power3.out",

        scrollTrigger: {
          trigger: ".contact-layout",
          start: "top 82%",
          once: true
        },

        clearProps: "transform,opacity,visibility"
      }
    );

    // Footer
    const footer = document.querySelector(".site-footer");

    if (footer) {

      gsap.fromTo(
        footer.querySelectorAll(
          ".footer-brand, .footer-copy, .footer-links"
        ),
        {
          autoAlpha: 0,
          y: 15
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",

          scrollTrigger: {
            trigger: footer,
            start: "top 96%",
            once: true
          },

          clearProps: "transform,opacity,visibility"
        }
      );

    }

  }

  console.log("Contact section initialized.");

});
