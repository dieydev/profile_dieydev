import confetti from 'canvas-confetti';
import { Scene3D } from './scene3d.js';
import { sound } from './audio.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D WebGL Canvas
  const canvas = document.getElementById('webgl-canvas');
  let scene3d = null;
  if (canvas) {
    try {
      scene3d = new Scene3D(canvas);
    } catch (e) {
      console.warn('WebGL initialization warning:', e);
    }
  }

  // 2. Audio Engine Setup & SFX Toggle
  const soundBtn = document.getElementById('sound-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      soundBtn.classList.toggle('active', isEnabled);
      showToast(isEnabled ? '🔊 Âm thanh Cyber SFX: BẬT' : '🔇 Âm thanh Cyber SFX: TẮT');
    });
  }

  // Play blip on interactive buttons & links hover
  const interactiveElements = document.querySelectorAll('button, a, .term-chip, .filter-tab');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      sound.playBlip(750, 0.04);
    });
  });

  // 3. Theme Switcher (Violet / Matrix / Sunset)
  const themeBtns = document.querySelectorAll('[data-theme-btn]');
  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    themeBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-theme-btn') === themeName);
    });

    if (scene3d) {
      scene3d.setTheme(themeName);
    }
    sound.playChime(520, 780, 0.2);
    showToast(`🎨 Giao diện đã đổi sang tông màu: ${themeName.toUpperCase()}`);
  }

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const theme = e.currentTarget.getAttribute('data-theme-btn');
      applyTheme(theme);
    });
  });

  // 4. 3D Wireframe Toggle
  const wireframeBtn = document.getElementById('wireframe-btn');
  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', () => {
      if (scene3d) {
        const isWire = scene3d.toggleWireframe();
        wireframeBtn.classList.toggle('active', isWire);
        sound.playBlip(900, 0.08);
        showToast(isWire ? '🧊 3D Wireframe: BẬT (Khung lưới)' : '💎 3D Hologram: BẬT (Bề mặt)');
      }
    });
  }

  // 5. Canvas Direct Click Interaction (Shockwaves & Node info)
  if (canvas && scene3d) {
    canvas.addEventListener('click', (e) => {
      sound.playLaser();
      const nodeData = scene3d.onPointerClick(e);
      if (nodeData && nodeData.name) {
        sound.playChime(660, 990, 0.2);
        showToast(`⚡ 3D Node: ${nodeData.name} (${nodeData.tag})`);
      }
    });
  }

  // 6. Section Scroll Spy & 3D Camera Choreography
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateScrollSpy() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentSectionId = 'hero';

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.id;
      }
    });

    // Update active nav link
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      link.classList.toggle('active', href === currentSectionId);
    });

    // Inform 3D engine to interpolate camera
    if (scene3d) {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
      scene3d.onScroll(progress, currentSectionId);
    }
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  // 7. Dynamic Typewriter Effect in Hero
  const typewriterElement = document.getElementById('typewriter-text');
  const typewriterRoles = [
    'Software Engineering Student @ TDMU',
    'Backend & Fullstack Developer',
    'Focusing on .NET 8 & Microservices',
    'Event-Driven Systems (Kafka + Redis)',
    'Reverse Proxy & Gateway (YARP)',
    'FastAPI & Distributed Architecture'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function runTypewriter() {
    if (!typewriterElement) return;

    const currentText = typewriterRoles[roleIdx];

    if (isDeleting) {
      typewriterElement.textContent = currentText.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      typewriterElement.textContent = currentText.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === currentText.length) {
      typingSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % typewriterRoles.length;
      typingSpeed = 500; // Pause before new phrase
    }

    setTimeout(runTypewriter, typingSpeed);
  }
  runTypewriter();

  // 8. Project Filtering
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      sound.playClick();

      const filterVal = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        }
      });
    });
  });

  // 9. 3D Tilt Effect on Glass Panels & Project Cards
  const tiltCards = document.querySelectorAll('.project-card, .skill-category-card, .hero-3d-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -6; // degrees
      const rotY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 10. Live GitHub API Sync (non-blocking)
  async function fetchGitHubLiveData() {
    try {
      const res = await fetch('https://api.github.com/users/dieydev');
      if (res.ok) {
        const data = await res.json();
        const statRepos = document.getElementById('stat-repos');
        if (statRepos && data.public_repos) {
          statRepos.textContent = data.public_repos;
        }
        const avatar = document.getElementById('profile-avatar');
        if (avatar && data.avatar_url) {
          avatar.src = data.avatar_url;
        }
      }
    } catch (e) {
      console.log('GitHub API offline fallback in use.');
    }
  }
  fetchGitHubLiveData();

  // 11. Interactive Cyber Terminal Logic
  const termInput = document.getElementById('term-cli-input');
  const termBody = document.getElementById('term-output-body');
  const termChips = document.querySelectorAll('.term-chip');
  const cmdHistory = [];
  let historyIdx = -1;

  const terminalCommands = {
    help: () => `Các lệnh hợp lệ:
  • whoami    : Hiển thị hồ sơ chi tiết của Nguyễn Thanh Duy
  • skills    : Danh sách kỹ năng công nghệ (.NET, Microservices, ...)
  • projects  : Liệt kê các dự án GitHub nổi bật
  • contact   : Thông tin liên lạc (Email, GitHub, Vị trí)
  • quote     : Triết lý lập trình
  • theme <t> : Đổi giao diện: violet | matrix | sunset
  • matrix    : Kích hoạt hiệu ứng mưa mã nguồn xanh Ma Trận
  • clear     : Xóa màn hình terminal
  • exit / bye: Chào tạm biệt`,

    whoami: () => `[USER PROFILE: Nguyễn Thanh Duy]
------------------------------------------------
Tên đầy đủ  : Nguyễn Thanh Duy (dieydev)
Vai trò     : Sinh viên Kỹ thuật Phần mềm (Đang tìm cơ hội Thực tập)
Trường      : Đại học Thủ Dầu Một (TDMU) - Dự kiến tốt nghiệp: 06/2027
Định hướng  : Backend / Fullstack Developer (.NET 8, Microservices)
Địa chỉ     : TP. Hồ Chí Minh, Việt Nam 🇻🇳
Sở thích    : System Architecture, .NET Ecosystem, Bóng đá, Gia đình`,

    skills: () => `[CORE TECH STACK]
------------------------------------------------
• Backend:  .NET 8, C#, ASP.NET Core, FastAPI, Python, Java, PHP
• Arch:     Microservices, Apache Kafka, Redis, YARP, Celery
• Frontend: React, TypeScript, JavaScript, HTML5/CSS3, Tailwind, Bootstrap
• DB & Ops: PostgreSQL, SQL Server, MySQL, Docker, EF Core, Linux`,

    projects: () => `[FEATURED REPOSITORIES]
------------------------------------------------
1. LMS - Microservices (.NET 8, FastAPI, Kafka, Redis, Docker, YARP)
   -> https://github.com/dieydev/lms-microservices
2. Spicy Noodle System / DuAnMiCayy (ASP.NET MVC 5, EF6, AJAX)
   -> https://github.com/dieydev/DuAnMiCayy
3. Hospital AI (Flutter, Dart, AI Medical Assistant)
   -> https://github.com/dieydev/hospital_ai
4. NexusFlow (TypeScript Automation Pipeline)
   -> https://github.com/dieydev/NexusFlow
5. Penguin Money Collector (C# Application)
   -> https://github.com/dieydev/penguin_money_collector`,

    contact: () => `[CONTACT INFORMATION]
------------------------------------------------
• Email : dieydev04@gmail.com
• GitHub: https://github.com/DieyDev
• City  : Thành phố Hồ Chí Minh, Việt Nam`,

    quote: () => `> "Problem-solving, self-learning, and adaptability in dynamic environments."
-- Nguyễn Thanh Duy`,

    sudo: () => `Permission denied: Bạn không có quyền Root trên hệ thống của dieydev 😉`,

    matrix: () => {
      triggerMatrixEffect();
      return `[MATRIX EFFECT INITIATED] Connecting to neural mainframe...`;
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    cmdHistory.push(trimmed);
    historyIdx = cmdHistory.length;

    // Print command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-output';
    cmdLine.innerHTML = `<span style="color: var(--theme-primary); font-weight: bold;">diey@portfolio:~$</span> ${escapeHtml(trimmed)}`;
    termBody.appendChild(cmdLine);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    sound.playClick();

    if (cmd === 'clear') {
      termBody.innerHTML = '';
      return;
    }

    let responseText = '';
    if (cmd === 'theme') {
      if (['violet', 'matrix', 'sunset'].includes(arg)) {
        applyTheme(arg);
        responseText = `Đã đổi chủ đề sang: ${arg.toUpperCase()}`;
      } else {
        responseText = `Vui lòng chọn: theme violet | theme matrix | theme sunset`;
      }
    } else if (terminalCommands[cmd]) {
      responseText = terminalCommands[cmd]();
    } else {
      responseText = `Lệnh không hợp lệ: '${trimmed}'. Gõ 'help' để xem danh sách lệnh có sẵn.`;
    }

    if (responseText) {
      const respLine = document.createElement('div');
      respLine.className = 'term-output';
      respLine.style.color = '#e2e8f0';
      respLine.textContent = responseText;
      termBody.appendChild(respLine);
    }

    termBody.scrollTop = termBody.scrollHeight;
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        executeCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (cmdHistory.length > 0 && historyIdx > 0) {
          historyIdx--;
          termInput.value = cmdHistory[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIdx < cmdHistory.length - 1) {
          historyIdx++;
          termInput.value = cmdHistory[historyIdx];
        } else {
          historyIdx = cmdHistory.length;
          termInput.value = '';
        }
      }
    });
  }

  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (termInput) {
        termInput.value = '';
      }
      executeCommand(cmd);
    });
  });

  // 12. Matrix Rain Screen Effect
  function triggerMatrixEffect() {
    let canvasMat = document.getElementById('matrix-rain-canvas');
    if (!canvasMat) {
      canvasMat = document.createElement('canvas');
      canvasMat.id = 'matrix-rain-canvas';
      canvasMat.style.position = 'fixed';
      canvasMat.style.top = '0';
      canvasMat.style.left = '0';
      canvasMat.style.width = '100vw';
      canvasMat.style.height = '100vh';
      canvasMat.style.zIndex = '9999';
      canvasMat.style.pointerEvents = 'none';
      canvasMat.style.opacity = '0.9';
      document.body.appendChild(canvasMat);
    }

    const ctx = canvasMat.getContext('2d');
    canvasMat.width = window.innerWidth;
    canvasMat.height = window.innerHeight;

    const chars = '01DIEYDEV.NET8KAFKAREDISEVENTDRIVEN010101XYZ';
    const fontSize = 16;
    const columns = Math.floor(canvasMat.width / fontSize);
    const drops = Array(columns).fill(1);

    let frameCount = 0;
    const matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvasMat.width, canvasMat.height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvasMat.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frameCount++;
      if (frameCount > 220) {
        clearInterval(matrixInterval);
        canvasMat.remove();
      }
    }, 33);
  }

  // 13. Copy Email to Clipboard
  const copyBtn = document.getElementById('btn-copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-clipboard');
      navigator.clipboard.writeText(email).then(() => {
        sound.playSuccess();
        showToast(`📋 Đã sao chép: ${email}`);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã chép!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 2200);
      });
    });
  }

  // 14. Interactive Contact Form with Confetti
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;

      sound.playSuccess();

      // Trigger Celebration Confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b']
      });

      showToast(`🎉 Cảm ơn ${name}! Tin nhắn đã gửi thành công tới Duy.`);
      contactForm.reset();
    });
  }

  // 15. Mobile Navigation Toggle
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      sound.playClick();
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Helper: Toast Notifications
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }
});
