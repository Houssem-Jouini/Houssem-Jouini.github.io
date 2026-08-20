document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================
     1. SCROLL PROGRESS BAR & NAVBAR SCROLL STATE
     ========================================================== */
  const progressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (navbar) {
      if (winScroll > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (winScroll > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     2. MOBILE NAVBAR TOGGLE & SMOOTH NAV LINKS
     ========================================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================================
     3. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHT)
     ========================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' });

  sections.forEach(section => scrollSpyObserver.observe(section));

  /* ==========================================================
     4. REVEAL-ON-SCROLL ANIMATIONS
     ========================================================== */
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        const rect = entry.target.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
          entry.target.classList.remove('in-view');
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(t => revealObserver.observe(t));

  // Trigger hero animation smoothly on load
  const heroLeft = document.querySelector('.hero-left');
  const terminalCard = document.querySelector('.terminal-card');
  setTimeout(() => {
    if (heroLeft) heroLeft.classList.add('in-view');
    if (terminalCard) terminalCard.classList.add('in-view');
  }, 100);

  /* ==========================================================
     5. HERO CODE TERMINAL TAB SWITCHER
     ========================================================== */
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const codePanels = document.querySelectorAll('.code-panel');

  terminalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPanelId = tab.getAttribute('data-tab');

      terminalTabs.forEach(t => t.classList.remove('active'));
      codePanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePanel = document.getElementById(targetPanelId);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  /* ==========================================================
     6. INTERACTIVE SIGNALR & CQRS SIMULATOR
     ========================================================== */
  const simBtn = document.getElementById('run-simulation-btn');
  const simSteps = document.querySelectorAll('.pipeline-step');
  const simLog = document.getElementById('sim-log');
  let isSimulating = false;

  const sampleLogs = [
    { step: 0, tag: 'sim-tag-req', label: 'HTTP POST', msg: 'Angular Client dispatched CreateWorkflowCommand(Id: #8492, BPMN: "Process_Order")' },
    { step: 1, tag: 'sim-tag-cqrs', label: 'MediatR', msg: 'ValidationBehavior passed · Invoking CreateWorkflowCommandHandler.HandleAsync()' },
    { step: 2, tag: 'sim-tag-db', label: 'EF Core', msg: 'INSERT INTO [Workflows] · Committed UnitOfWork in SQL Server [4ms]' },
    { step: 3, tag: 'sim-tag-hub', label: 'SignalR', msg: 'WorkflowHub.BroadcastAsync("WorkflowStarted", { status: "Active", steps: 6 })' }
  ];

  function appendLog(tagClass, tagLabel, message) {
    if (!simLog) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    
    const line = document.createElement('div');
    line.className = 'sim-log-line';
    line.innerHTML = `<span class="sim-time">[${timeStr}]</span> <span class="${tagClass}">[${tagLabel}]</span> <span>${message}</span>`;
    simLog.appendChild(line);
    simLog.scrollTop = simLog.scrollHeight;
  }

  if (simBtn) {
    simBtn.addEventListener('click', () => {
      if (isSimulating) return;
      isSimulating = true;
      simBtn.disabled = true;
      simBtn.innerHTML = '<span>⚡ Processing Pipeline...</span>';

      // Reset step highlights
      simSteps.forEach(s => {
        s.classList.remove('active', 'done');
      });

      if (simLog) {
        simLog.innerHTML = '';
      }

      appendLog('sim-tag-req', 'INIT', 'Initiating live end-to-end CQRS + SignalR telemetry...');

      let currentStep = 0;

      function executeStep() {
        if (currentStep < sampleLogs.length) {
          const logData = sampleLogs[currentStep];
          
          simSteps.forEach((s, idx) => {
            if (idx === currentStep) {
              s.classList.add('active');
            } else if (idx < currentStep) {
              s.classList.remove('active');
              s.classList.add('done');
            }
          });

          appendLog(logData.tag, logData.label, logData.msg);
          currentStep++;
          setTimeout(executeStep, 600);
        } else {
          // Finish simulation
          simSteps.forEach(s => {
            s.classList.remove('active');
            s.classList.add('done');
          });
          appendLog('sim-tag-hub', 'COMPLETE', '✨ Pipeline finished successfully. Live Dashboard synchronized in 18ms.');
          simBtn.disabled = false;
          simBtn.innerHTML = '<span>▶ Run Simulation Again</span>';
          isSimulating = false;
        }
      }

      setTimeout(executeStep, 400);
    });
  }

  /* ==========================================================
     7. ONE-CLICK CLIPBOARD COPY WITH TOAST NOTIFICATION
     ========================================================== */
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Copied to clipboard!';
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`✓ ${label}`);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`✓ ${label}`);
      }
    });
  });

  /* ==========================================================
     8. WEB3FORMS DIRECT EMAIL SUBMISSION
     ========================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const msgInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'New Portfolio Inquiry';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!name || !email || !message) {
        showToast('⚠ Please fill in all required fields.');
        return;
      }

      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message Directly →';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ Sending message...</span>';
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: 'e84ed48d-a746-48c1-a736-b0db89b46bf6',
            name: name,
            email: email,
            subject: subject,
            message: message,
            from_name: 'Houssem Portfolio Contact'
          })
        });

        const result = await response.json();

        if (response.status === 200 && result.success) {
          showToast('✓ Message sent successfully! I will reply soon.');
          contactForm.reset();
        } else {
          showToast(`⚠ ${result.message || 'Error sending message. Please try again.'}`);
        }
      } catch (error) {
        showToast('⚠ Error sending. Please email directly to houssemeddine.jouini@esen.tn');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  /* ==========================================================
     9. LIGHTWEIGHT CANVAS CONSTELLATION / PARTICLES
     ========================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const particleCount = Math.min(Math.floor(window.innerWidth / 28), 45);
    let particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            this.x -= dx * 0.015;
            this.y -= dy * 0.015;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(201, 162, 39, 0.4)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    initParticles();

    let animationFrameId;
    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(91, 116, 128, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animateParticles);
    }

    // Only run animation if user does not prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animateParticles();
    }
  }
});
