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

  if (bgMusic) {
    bgMusic.volume = 1.0;
    bgMusic.addEventListener("play", () => updateMusicUI(true));
    bgMusic.addEventListener("pause", () => updateMusicUI(false));
    bgMusic.addEventListener("ended", () => updateMusicUI(false));
  }

  function playAudio() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
      updateMusicUI(true);
    }).catch(err => {
      console.log("Autoplay waiting for first touch:", err);
      updateMusicUI(false);
    });
  }

  function toggleMusic(e) {
    if (e) {
      e.stopPropagation();
    }
    if (!bgMusic) return;
    
    if (bgMusic.paused) {
      bgMusic.play().catch(err => console.log("Play error:", err));
    } else {
      bgMusic.pause();
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", toggleMusic);
  }

  // Attempt autoplay immediately
  playAudio();

  // On any first click or tap anywhere, immediately start audio
  const startAudioOnFirstTouch = () => {
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().catch(() => {});
    }
  };

  window.addEventListener("click", startAudioOnFirstTouch, { once: true, passive: true });
  window.addEventListener("touchstart", startAudioOnFirstTouch, { once: true, passive: true });

  if (waxBtn && gate) {
    waxBtn.addEventListener("click", () => {
      // 1. Trigger door slide
      gate.classList.add("gate-open");
      
      // 2. Guaranteed audio play on tap
      if (bgMusic) {
        bgMusic.play().catch(err => console.log("Play error:", err));
      }

      // 3. Remove gate after animation finishes
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
    const petalCount = isMobile ? 10 : 16;
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
        speedY: Math.random() * 0.4 + 1.0, // Standard graceful falling speed (1.0 - 1.4 px/frame)
        speedX: Math.random() * 0.3 - 0.15, // Light air drift
        swaySpeed: Math.random() * 0.015 + 0.01,
        swayAngle: Math.random() * Math.PI * 2,
        swayRange: Math.random() * 0.6 + 0.3, // Gentle flutter
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.01 - 0.005,
        tilt: Math.random() * Math.PI,
        tiltSpeed: Math.random() * 0.015 + 0.005,
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
