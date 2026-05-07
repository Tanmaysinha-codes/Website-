(function () {
  const THEME_KEY = "edusmart-theme";
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    if (themeToggle) {
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  }

  const typingText = document.getElementById("typing-text");
  if (typingText) {
    const words = ["Empowering", "Innovating", "Succeeding"];
    let index = 0;
    setInterval(function () {
      index = (index + 1) % words.length;
      typingText.textContent = words[index];
    }, 1800);
  }

  const counters = document.querySelectorAll(".counter[data-target]");
  if (counters.length) {
    const animateCounter = function (counter) {
      const target = Number(counter.getAttribute("data-target"));
      const duration = 1400;
      const steps = 50;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          counter.textContent = String(target);
          clearInterval(timer);
        } else {
          counter.textContent = String(Math.floor(current));
        }
      }, duration / steps);
    };

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const emailInput = document.getElementById("email");
      const email = emailInput ? emailInput.value.trim() : "";
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValidEmail) {
        alert("Please enter a valid email address.");
        return;
      }

      alert("Thank you! Your message has been sent successfully.");
      contactForm.reset();
    });
  }
})();
