(() => {
  const THEME_KEY = "edusmart-theme";
  const MOBILE_BREAKPOINT = 680;
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");

  const updateMenuState = (isOpen) => {
    if (!menuToggle || !siteNav) {
      return;
    }

    siteNav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  };

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    if (themeToggle) {
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  };

  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  }

  if (menuToggle && siteNav) {
    updateMenuState(false);

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      updateMenuState(!isOpen);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          updateMenuState(false);
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        updateMenuState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        updateMenuState(false);
      }
    });
  }

  const typingText = document.getElementById("typing-text");
  if (typingText) {
    const words = ["Empowering", "Innovating", "Succeeding"];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;

    const cycleWords = () => {
      if (prefersReducedMotion) {
        return;
      }

      typingText.classList.add("is-changing");

      window.setTimeout(() => {
        index = (index + 1) % words.length;
        typingText.textContent = words[index];
        typingText.classList.remove("is-changing");
      }, 220);

      window.setTimeout(cycleWords, 2400);
    };

    if (!prefersReducedMotion) {
      window.setTimeout(cycleWords, 1800);
    }
  }

  const counters = document.querySelectorAll(".counter[data-target]");
  if (counters.length) {
    const animateCounter = (counter) => {
      const target = Number(counter.getAttribute("data-target"));
      const duration = 1400;
      const startTime = performance.now();

      const tick = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        counter.textContent = String(Math.floor(progress * target));

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          counter.textContent = String(target);
        }
      };

      window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  }

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  const showFormStatus = (message, type) => {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.hidden = false;
    formStatus.className = `form-status is-${type}`;
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (emailInput) {
        emailInput.setAttribute("aria-invalid", String(!isValidEmail && Boolean(email)));
      }

      if (!name) {
        showFormStatus("Please enter your name.", "error");
        return;
      }

      if (!isValidEmail) {
        if (emailInput) {
          emailInput.setAttribute("aria-invalid", "true");
        }
        showFormStatus("Please enter a valid email address.", "error");
        return;
      }

      if (!message) {
        showFormStatus("Please enter your message.", "error");
        return;
      }

      if (emailInput) {
        emailInput.setAttribute("aria-invalid", "false");
      }

      showFormStatus("Thank you! Your message has been sent successfully.", "success");
      contactForm.reset();
    });
  }
})();
