/* =========================================================
   RIYAD PORTFOLIO — INTERACTIONS
   No libraries required
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  // Footer year
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Loader: show the word first, then fill the line from 0% to 100%.
  const preloader = document.querySelector("#preloader");
  const progressBar = document.querySelector("#loader-progress");

  if (preloader && progressBar) {
    let progress = 0;
    let target = 0;
    let frame = null;
    let simulationTimer = null;
    let holdTimer = null;
    let complete = document.readyState === "complete";
    let started = false;
    let hidden = false;

    const render = (value) => {
      progress = Math.max(0, Math.min(100, value));
      progressBar.style.width = `${progress}%`;
    };

    function animate() {
      frame = null;
      progress += (target - progress) * 0.1;
      if (Math.abs(target - progress) < 0.15) progress = target;
      render(progress);
      if (progress < target) frame = requestAnimationFrame(animate);
      else if (complete && progress >= 100) holdAndHide();
    }

    function setProgress(value) {
      target = Math.max(progress, Math.min(100, value));
      if (reduceMotion) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        render(target);
        if (complete && progress >= 100) holdAndHide();
      } else if (frame === null) {
        frame = requestAnimationFrame(animate);
      }
    }

    function holdAndHide() {
      if (hidden || holdTimer !== null) return;
      hidden = true;
      holdTimer = window.setTimeout(() => {
        preloader.classList.add("is-hidden");
        preloader.setAttribute("aria-hidden", "true");
      }, reduceMotion ? 0 : 4000);
    }

    function beginProgress() {
      if (started) return;
      started = true;
      if (complete) {
        setProgress(100);
        return;
      }
      let simulated = 0;
      function advance() {
        if (complete) return;
        simulated = Math.min(90, simulated + 0.65);
        setProgress(simulated);
        if (simulated < 90) simulationTimer = window.setTimeout(advance, 45);
      }
      advance();
    }

    // A short delay lets the "riyad." word appear before the progress bar.
    window.setTimeout(beginProgress, reduceMotion ? 0 : 500);

    function finishLoad() {
      if (complete) return;
      complete = true;
      window.clearTimeout(simulationTimer);
      if (started) setProgress(100);
      else {
        // If the load event happens before the delay, start after the same delay.
        window.setTimeout(() => {
          if (!started) beginProgress();
          setProgress(100);
        }, reduceMotion ? 0 : 500);
      }
    }

    if (!complete) window.addEventListener("load", finishLoad, { once: true });
    else window.setTimeout(() => { if (!started) beginProgress(); }, reduceMotion ? 0 : 500);
  }

  // Mobile navigation
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      menuToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.classList.toggle("open", !open);
    });
    navLinks.forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("visible"));
  }

  // Gentle mouse parallax for the CSS growth illustration
  const hero = document.querySelector(".hero");
  const visual = document.querySelector(".growth-visual");
  if (hero && visual && !isTouch && !reduceMotion) {
    let x = 0, y = 0, currentX = 0, currentY = 0, frame = null;
    function update() {
      frame = null;
      currentX += (x - currentX) * 0.07;
      currentY += (y - currentY) * 0.07;
      visual.style.transform = `perspective(900px) rotateY(${currentX * 5}deg) rotateX(${-currentY * 4}deg)`;
      if (Math.abs(x - currentX) > 0.001 || Math.abs(y - currentY) > 0.001) frame = requestAnimationFrame(update);
    }
    hero.addEventListener("pointermove", event => {
      if (event.pointerType === "touch") return;
      const rect = visual.getBoundingClientRect();
      x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / rect.width * 2));
      y = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / rect.height * 2));
      if (frame === null) frame = requestAnimationFrame(update);
    });
    hero.addEventListener("pointerleave", () => {
      x = 0; y = 0;
      if (frame === null) frame = requestAnimationFrame(update);
    });
  }

  // Magnetic CTA buttons on pointer devices
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach(button => {
      button.addEventListener("pointermove", event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.07}px, ${y * 0.1}px)`;
      });
      button.addEventListener("pointerleave", () => { button.style.transform = ""; });
    });
  }

  // Highlight the navigation link for the section currently in view
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-25% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }
});
