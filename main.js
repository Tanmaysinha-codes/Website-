(() => {
  const THEME_KEY = "edusmart-theme";
  const MOBILE_BREAKPOINT = 680;
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const rootElement = document.documentElement;

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
    rootElement.classList.toggle("dark-mode", isDark);
    document.body.classList.toggle("dark-mode", isDark);
    if (themeToggle) {
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
      themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      themeToggle.setAttribute("aria-pressed", String(isDark));
    }
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : prefersDark
        ? "dark"
        : "light";
  applyTheme(initialTheme);

  if (siteNav) {
    const currentPath = window.location.pathname.split("/").pop()?.toLowerCase() || "index.html";
    siteNav.querySelectorAll('a[href]').forEach((link) => {
      const linkPath = (link.getAttribute("href") || "").split("?")[0].toLowerCase();
      const isActive = currentPath === "" ? linkPath === "index.html" : linkPath === currentPath;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = rootElement.classList.contains("dark-mode") ? "light" : "dark";
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

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const typingText = document.getElementById("typing-text");
  if (typingText) {
    const words = ["Empowering", "Innovating", "Succeeding"];
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

  const showFormStatus = (statusElement, message, type) => {
    if (!statusElement) {
      return;
    }

    statusElement.textContent = message;
    statusElement.hidden = false;
    statusElement.className = `form-status is-${type}`;
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
        showFormStatus(formStatus, "Please enter your name.", "error");
        return;
      }

      if (!isValidEmail) {
        if (emailInput) {
          emailInput.setAttribute("aria-invalid", "true");
        }
        showFormStatus(formStatus, "Please enter a valid email address.", "error");
        return;
      }

      if (!message) {
        showFormStatus(formStatus, "Please enter your message.", "error");
        return;
      }

      if (emailInput) {
        emailInput.setAttribute("aria-invalid", "false");
      }

      showFormStatus(formStatus, "Thank you! Your message has been sent successfully.", "success");
      contactForm.reset();
    });
  }

  const courseForm = document.getElementById("course-form");
  const courseStatus = document.getElementById("course-form-status");
  const courseSelect = document.getElementById("course-select");
  const courseSection = document.getElementById("course-registration");
  const applyButtons = document.querySelectorAll(".apply-btn");

  if (applyButtons.length) {
    applyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const courseValue = button.dataset.course;
        if (courseSelect && courseValue) {
          courseSelect.value = courseValue;
        }
        if (courseSection) {
          courseSection.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        }
        if (courseSelect) {
          courseSelect.focus();
        }
      });
    });
  }

  if (courseForm) {
    courseForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("course-name");
      const emailInput = document.getElementById("course-email");
      const phoneInput = document.getElementById("course-phone");
      const startSelect = document.getElementById("course-start");
      const modeInput = courseForm.querySelector('input[name="study-mode"]:checked');
      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const selectedCourse = courseSelect ? courseSelect.value : "";
      const selectedStart = startSelect ? startSelect.value : "";
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPhone = /^[+\d][\d\s().-]{7,}$/.test(phone);

      if (emailInput) {
        emailInput.setAttribute("aria-invalid", String(!isValidEmail && Boolean(email)));
      }

      if (!name) {
        showFormStatus(courseStatus, "Please enter your full name.", "error");
        return;
      }

      if (!isValidEmail) {
        showFormStatus(courseStatus, "Please enter a valid email address.", "error");
        return;
      }

      if (!phone || !isValidPhone) {
        showFormStatus(courseStatus, "Please enter a valid phone number.", "error");
        return;
      }

      if (!selectedCourse) {
        showFormStatus(courseStatus, "Please select a program.", "error");
        return;
      }

      if (!selectedStart) {
        showFormStatus(courseStatus, "Please choose a start term.", "error");
        return;
      }

      if (!modeInput) {
        showFormStatus(courseStatus, "Please select a study mode.", "error");
        return;
      }

      showFormStatus(courseStatus, "Application received! Our admissions team will contact you shortly.", "success");
      courseForm.reset();
      if (courseSelect) {
        courseSelect.selectedIndex = 0;
      }
      if (startSelect) {
        startSelect.selectedIndex = 0;
      }
    });
  }
})();
