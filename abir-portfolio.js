/* =========================================
   ABIR PORTFOLIO — COMPLETE INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isTouchDevice = window.matchMedia(
    "(hover: none), (pointer: coarse)"
  ).matches;

  // 1. Footer year
  const yearElement = document.querySelector("#year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // 2. HELLO preloader
  // First show "hello", then reveal the bar after 700ms.
  // The bar fills to 90% while loading, then to 100% on window.load.
  // After it reaches 100%, keep it visible for 4 seconds before fading out.
  const preloader = document.querySelector("#preloader");
  const progressBar = document.querySelector("#loader-progress");

  if (preloader && progressBar) {
    let progress = 0;
    let targetProgress = 0;
    let animationFrame = null;
    let simulationTimer = null;
    let startTimer = null;
    let hideTimer = null;
    let loadComplete = document.readyState === "complete";
    let started = false;
    let finished = false;

    progressBar.style.width = "0%";

    function animateProgress() {
      animationFrame = null;
      progress += (targetProgress - progress) * 0.09;

      if (Math.abs(targetProgress - progress) < 0.15) {
        progress = targetProgress;
      }

      progressBar.style.width = `${progress}%`;

      if (progress < targetProgress) {
        animationFrame = requestAnimationFrame(animateProgress);
      } else if (loadComplete && progress >= 100) {
        keepFullThenHide();
      }
    }

    function setProgress(value) {
      targetProgress = Math.max(progress, Math.min(100, value));

      if (reduceMotion) {
        progress = targetProgress;
        progressBar.style.width = `${progress}%`;
        if (loadComplete && progress >= 100) keepFullThenHide();
        return;
      }

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(animateProgress);
      }
    }

    function keepFullThenHide() {
      if (finished || hideTimer !== null) return;
      finished = true;

      // Allow the CSS width transition to finish, then hold the full bar 4s.
      hideTimer = setTimeout(() => {
        preloader.classList.add("is-hidden");
        preloader.setAttribute("aria-hidden", "true");
      }, reduceMotion ? 0 : 4200);
    }

    function startProgress() {
      if (started) return;
      started = true;

      if (loadComplete) {
        setProgress(100);
        return;
      }

      let simulatedProgress = 0;

      function advanceLoading() {
        if (loadComplete) return;

        simulatedProgress = Math.min(90, simulatedProgress + 0.6);
        setProgress(simulatedProgress);

        if (simulatedProgress < 90) {
          simulationTimer = setTimeout(advanceLoading, 45);
        }
      }

      advanceLoading();
    }

    // Delay the bar so the "hello" text appears first.
    startTimer = setTimeout(startProgress, reduceMotion ? 0 : 700);

    function finishLoading() {
      if (loadComplete) return;
      loadComplete = true;
      clearTimeout(simulationTimer);

      // If the delay has not elapsed yet, startProgress will fill to 100.
      if (started) {
        setProgress(100);
      }
    }

    if (!loadComplete) {
      window.addEventListener("load", finishLoading, { once: true });
    } else {
      // Page was already loaded when this script ran.
      setTimeout(() => {
        if (!started) startProgress();
      }, reduceMotion ? 0 : 700);
    }
  }

  // 3. Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navLinks.classList.toggle("open", !isOpen);
    });

    navItems.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // 4. Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // 5. Mouse parallax on CSS 3D artwork
  const hero = document.querySelector(".hero");
  const visualStage = document.querySelector(".visual-stage");
  const depthElements = document.querySelectorAll("[data-depth]");

  if (hero && visualStage && !isTouchDevice && !reduceMotion) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let parallaxFrame = null;

    function updateParallax() {
      parallaxFrame = null;
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      depthElements.forEach((element) => {
        const depth = Number(element.dataset.depth) || 10;
        element.style.translate = `${currentX * depth}px ${currentY * depth}px`;
      });

      if (Math.abs(targetX - currentX) > 0.001 ||
          Math.abs(targetY - currentY) > 0.001) {
        parallaxFrame = requestAnimationFrame(updateParallax);
      }
    }

    hero.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = visualStage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = Math.max(-0.5, Math.min(0.5, (event.clientX - centerX) / rect.width));
      targetY = Math.max(-0.5, Math.min(0.5, (event.clientY - centerY) / rect.height));

      if (parallaxFrame === null) parallaxFrame = requestAnimationFrame(updateParallax);
    });

    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      if (parallaxFrame === null) parallaxFrame = requestAnimationFrame(updateParallax);
    });
  }

  // 6. Magnetic hover buttons on desktop
  if (!isTouchDevice && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.10}px, ${y * 0.12}px)`;
      });

      element.addEventListener("pointerleave", () => {
        element.style.transform = "";
      });
    });
  }

  // 7. Scroll-driven transformation on hero artwork
  if (hero && visualStage && !reduceMotion) {
    let scrollFrame = null;

    function updateScrollScene() {
      scrollFrame = null;
      const rect = hero.getBoundingClientRect();
      const distance = Math.max(1, hero.offsetHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));

      visualStage.style.setProperty("--scroll-rotate", `${progress * -12}deg`);
      visualStage.style.setProperty("--scroll-scale", (1 - progress * 0.12).toFixed(3));
      visualStage.style.setProperty("--scroll-y", `${progress * -30}px`);
    }

    function requestScrollUpdate() {
      if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateScrollScene);
    }

    visualStage.classList.add("scroll-3d");
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    requestScrollUpdate();
  }

  // 8. Highlight current navigation section
  const pageSections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: "-25% 0px -55% 0px", threshold: 0 });

    pageSections.forEach((section) => sectionObserver.observe(section));
  }
});
