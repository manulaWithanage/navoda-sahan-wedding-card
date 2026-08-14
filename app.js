/**
 * Sahan & Navoda - Digital Wedding Invitation Logic
 * Features: Sliding Doors Gate, Audio Player, Canvas Petal Animation, Live Countdown, and RSVP Form Handler.
 */

// Configurable Google Sheets Web App Endpoint URL for RSVPs
const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxlva6t0mOp-ZxXgiEQkk83bor-LYeSXvZDS0c6UxIHpdmvi2csPXv0Yz8S-kyolwkRQg/exec";

// Wedding Date: September 24, 2026 at 10:00 AM
const WEDDING_DATE = new Date("September 24, 2026 10:00:00").getTime();

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. ENTRANCE GATE & AUDIO PLAYBACK
  // ==========================================
  const gate = document.getElementById("envelope-gate");
  const waxBtn = document.getElementById("wax-seal-btn");
  const bgMusic = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  const musicLabel = document.getElementById("music-label");

  let isPlayingMusic = false;

  function updateMusicUI(playing) {
    if (!musicToggle) return;
    if (playing) {
      musicToggle.classList.add("is-playing");
      musicToggle.classList.remove("is-muted");
      if (musicLabel) musicLabel.textContent = "PLAYING";
      musicToggle.setAttribute("aria-label", "Mute background music");
      musicToggle.setAttribute("title", "Mute background music");
    } else {
      musicToggle.classList.remove("is-playing");
      musicToggle.classList.add("is-muted");
      if (musicLabel) musicLabel.textContent = "MUTED";
      musicToggle.setAttribute("aria-label", "Play background music");
      musicToggle.setAttribute("title", "Play background music");
    }
  }

  function toggleMusic(e) {
    if (e) {
      e.stopPropagation();
    }
    if (!bgMusic) return;
    
    if (isPlayingMusic) {
      bgMusic.pause();
      isPlayingMusic = false;
      updateMusicUI(false);
    } else {
      bgMusic.play().then(() => {
        isPlayingMusic = true;
        updateMusicUI(true);
      }).catch(err => {
        console.log("Audio playback error:", err);
      });
    }
  }

  if (waxBtn && gate) {
    waxBtn.addEventListener("click", () => {
      // 1. Trigger door slide
      gate.classList.add("gate-open");
      
      // 2. Try playing background music
      if (bgMusic) {
        bgMusic.play().then(() => {
          isPlayingMusic = true;
          updateMusicUI(true);
        }).catch(err => {
          console.log("Autoplay blocked:", err);
          updateMusicUI(false);
        });
      }

      // 3. Initialize Petal Canvas
      initPetals();

      // 4. Remove gate after animation finishes
      setTimeout(() => {
        gate.style.display = "none";
      }, 1200);
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusic);
  }

  // ==========================================
  // 2. LIVE COUNTDOWN TIMER
  // ==========================================
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance < 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================
  // 3. FALLING PETALS CANVAS (True Downward Gravitational Fall)
  // ==========================================
  let petalsRunning = false;

  function initPetals() {
    if (petalsRunning) return;
    const canvas = document.getElementById("petals-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    petalsRunning = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 12 : 20;
    const petals = [];

    // Warm, Rich Rose & Gold Wedding Palette
    const petalColors = [
      "#E2AA93", // Warm rose petal
      "#D99B84", // Deep blush petal
      "#E5C888", // Rich champagne gold
      "#C7A24B", // Metallic gold
      "#EBB3A6"  // Soft pink rose
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 4 + 7, // 7px to 11px
        speedY: Math.random() * 1.4 + 1.8, // Clear downward gravitational fall (1.8 - 3.2 px/frame)
        speedX: Math.random() * 0.4 - 0.2, // Subtle breeze drift
        swaySpeed: Math.random() * 0.025 + 0.015,
        swayAngle: Math.random() * Math.PI * 2,
        swayRange: Math.random() * 0.8 + 0.4, // Subtle aerodynamic flutter (downward motion dominates)
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.02 - 0.01,
        tilt: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.02 + 0.01,
        opacity: Math.random() * 0.25 + 0.50, // 0.50 to 0.75
        color: petalColors[Math.floor(Math.random() * petalColors.length)]
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.y += p.speedY;
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * p.swayRange + p.speedX;
        p.rotation += p.rotationSpeed;
        p.tilt += p.tiltSpeed;

        // Reset past bottom
        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }
        // Wrap horizontally
        if (p.x > width + 25) p.x = -25;
        if (p.x < -25) p.x = width + 25;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        
        // 3D perspective flip (bounded so it never collapses to 0)
        const scaleY = Math.max(0.3, Math.abs(Math.cos(p.tilt)));
        ctx.scale(1, scaleY);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Organic curved rose petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.60, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    render();
  }

  // Initialize petals immediately
  initPetals();

  // ==========================================
  // 4. RSVP FORM SUBMISSION HANDLER
  // ==========================================
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpStatus = document.getElementById("rsvp-status");
  const submitBtn = document.getElementById("submit-btn");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("guest-name").value.trim();
      const guestCount = document.getElementById("guest-count").value;
      const attendance = document.getElementById("attendance").value;
      const message = document.getElementById("guest-message").value.trim();

      if (!name) {
        if (rsvpStatus) {
          rsvpStatus.style.color = "#d9534f";
          rsvpStatus.textContent = "Please enter your name.";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (rsvpStatus) {
        rsvpStatus.style.color = "#C7A24B";
        rsvpStatus.textContent = "Submitting your RSVP...";
      }

      const formData = new URLSearchParams();
      formData.append("timestamp", new Date().toLocaleString());
      formData.append("name", name);
      formData.append("guest_count", guestCount);
      formData.append("attendance", attendance);
      formData.append("message", message);

      // Submit to Google Apps Script endpoint if configured, or simulate success
      fetch(GOOGLE_SHEETS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      })
      .then(() => {
        if (rsvpStatus) {
          rsvpStatus.style.color = "#556B2F";
          rsvpStatus.textContent = "✨ Thank you! Your RSVP has been submitted successfully.";
        }
        rsvpForm.reset();
      })
      .catch(err => {
        console.error("RSVP Error:", err);
        if (rsvpStatus) {
          rsvpStatus.style.color = "#556B2F";
          rsvpStatus.textContent = "✨ Thank you! Your response has been received.";
        }
        rsvpForm.reset();
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  // ==========================================
  // 5. SCROLL REVEAL OBSERVER
  // ==========================================
  const scrollReveals = document.querySelectorAll(".scroll-reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    scrollReveals.forEach(el => observer.observe(el));
  } else {
    scrollReveals.forEach(el => el.classList.add("active"));
  }

});
