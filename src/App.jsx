import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Globe,
  Box,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  GraduationCap,
  MapPin,
  Briefcase,
  FolderGit2,
  Send,
  Mail,
  Copy,
  Check,
  ExternalLink,
  User,
  Compass,
  Star,
  Brain,
  Layers,
  ShieldCheck,
  Server,
  Layout,
  Database,
  Network,
  Zap,
  CreditCard,
  Bot,
  CheckCircle2,
  GitFork,
  FileText
} from 'lucide-react';
import { Scene3D } from './scene3d.js';
import { sound } from './audio.js';
import { translations } from './translations.js';

// Native Clean Brand SVGs (100% reliable, zero external CDN dependency)
function FacebookIcon({ size = 16, style = {}, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, ...style }} className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function GithubIcon({ size = 16, style = {}, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, ...style }} className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

function InstagramIcon({ size = 16, style = {}, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function TikTokIcon({ size = 16, style = {}, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, ...style }} className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 10.84 4.45 6.27 6.27 0 0 0 1.84-4.47V8.58a8.28 8.28 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.01z"/>
    </svg>
  );
}

export default function App() {
  const [lang, setLang] = useState('vi');
  const [theme, setTheme] = useState('sakura');
  const [sakuraBackdrop, setSakuraBackdrop] = useState(true);
  const [showSakuraModal, setShowSakuraModal] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [projectFilter, setProjectFilter] = useState('all');
  const [toasts, setToasts] = useState([]);
  const [gitData, setGitData] = useState({ public_repos: 13, avatar_url: 'https://avatars.githubusercontent.com/u/167149668?v=4' });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null);

  const canvasRef = useRef(null);
  const scene3dRef = useRef(null);

  const t = translations[lang];

  // Toast Dispatcher
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  };

  // 1. Initialize 3D Engine
  useEffect(() => {
    if (canvasRef.current && !scene3dRef.current) {
      try {
        const scene = new Scene3D(canvasRef.current);
        scene3dRef.current = scene;
      } catch (err) {
        console.warn('3D Scene init error:', err);
      }
    }
  }, []);

  // 2. Sync Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (scene3dRef.current) {
      scene3dRef.current.setTheme(theme);
    }
  }, [theme]);

  // 3. Wireframe Toggle
  const toggleWireframe = () => {
    if (scene3dRef.current) {
      const wire = scene3dRef.current.toggleWireframe();
      setIsWireframe(wire);
      sound.playBlip(880, 0.08);
      showToast(wire ? 'Chế độ 3D: Khung lưới (Wireframe)' : 'Chế độ 3D: Khối đặc (Solid)');
    }
  };

  // 4. Audio SFX Toggle
  const toggleSound = () => {
    const enabled = sound.toggle();
    setSoundActive(enabled);
    showToast(enabled ? 'Âm thanh tương tác: BẬT' : 'Âm thanh tương tác: TẮT');
  };

  // 5. Scroll Spy & 3D Camera Coordination
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      const sectionIds = ['hero', 'about', 'education', 'skills', 'projects', 'stats', 'contact'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            if (scene3dRef.current) {
              const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
              const progress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
              scene3dRef.current.onScroll(progress, id);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 6. Canvas Click Shockwave
  const handleCanvasClick = (e) => {
    sound.playLaser();
    if (scene3dRef.current) {
      const nodeData = scene3dRef.current.onPointerClick(e);
      if (nodeData && nodeData.name) {
        sound.playChime(660, 990, 0.2);
        showToast(`${nodeData.name} • ${nodeData.tag}`);
      }
    }
  };

  // 7. Live GitHub API Sync
  useEffect(() => {
    fetch('https://api.github.com/users/dieydev')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.public_repos) {
          setGitData({
            public_repos: data.public_repos,
            avatar_url: data.avatar_url || 'https://avatars.githubusercontent.com/u/167149668?v=4'
          });
        }
      })
      .catch(() => {});
  }, []);

  // 8. Typewriter Titles
  const [typewriterText, setTypewriterText] = useState('');
  useEffect(() => {
    const phrases = lang === 'vi' ? [
      'Sinh viên Kỹ thuật Phần mềm @ ĐH Thủ Dầu Một',
      'Fullstack Developer (.NET Core & React.js)',
      'Viện Công nghệ số • Niên khóa 2022 - 2027',
      'Sẵn sàng đón nhận cơ hội Thực tập sinh & Junior'
    ] : [
      'Software Engineering Student @ TDMU',
      'Fullstack Developer (.NET Core & React.js)',
      'Digital Technology Institute • Cohort 2022 - 2027',
      'Open to Internship & Junior Fullstack Roles'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer = null;

    const tick = () => {
      const full = phrases[phraseIdx];
      if (isDeleting) {
        setTypewriterText(full.substring(0, charIdx - 1));
        charIdx--;
      } else {
        setTypewriterText(full.substring(0, charIdx + 1));
        charIdx++;
      }

      let speed = isDeleting ? 25 : 60;

      if (!isDeleting && charIdx === full.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
      }

      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, [lang]);

  // 9. Copy Email
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('dieydev04@gmail.com').then(() => {
      sound.playSuccess();
      setCopiedEmail(true);
      showToast('Đã sao chép: dieydev04@gmail.com');
      setTimeout(() => setCopiedEmail(false), 2400);
    });
  };

  // 10. Real Form Submit to Gmail (dieydev04@gmail.com)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form['contact-name'].value.trim();
    const email = form['contact-email'].value.trim();
    const message = form['contact-message'].value.trim();

    if (!name || !email || !message) {
      showToast(lang === 'vi' ? 'Vui lòng điền đầy đủ các mục!' : 'Please fill in all fields!');
      return;
    }

    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/dieydev04@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `[DieyDev Profile] Tin nhắn liên hệ từ ${name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        sound.playSuccess();
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.65 },
          colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b']
        });
        showToast(lang === 'vi' ? 'Đã gửi tin nhắn đến Gmail dieydev04@gmail.com!' : 'Message sent to dieydev04@gmail.com!');
        setSubmitFeedback({
          type: 'success',
          message: lang === 'vi' 
            ? 'Cảm ơn bạn! Tin nhắn đã được gửi thành công đến hòm thư dieydev04@gmail.com của Duy.' 
            : 'Thank you! Your message was sent successfully to dieydev04@gmail.com.'
        });
        form.reset();
      } else if (data.message && data.message.includes('Activation')) {
        sound.playSuccess();
        showToast(lang === 'vi' ? 'Đã kết nối tới Gmail dieydev04@gmail.com!' : 'Connected to Gmail dieydev04@gmail.com!');
        setSubmitFeedback({
          type: 'info',
          message: lang === 'vi' 
            ? 'Hệ thống đã kết nối tới dieydev04@gmail.com (Vui lòng bấm link kích hoạt trong Gmail lần đầu tiên để nhận tin nhắn tự động).' 
            : 'Connected to dieydev04@gmail.com (Check your inbox to activate one-time form).'
        });
        form.reset();
      } else {
        throw new Error(data.message || 'Submit error');
      }
    } catch (err) {
      console.warn('Form submit fallback:', err);
      // Fallback mở mail client
      sound.playSuccess();
      const mailtoUrl = `mailto:dieydev04@gmail.com?subject=${encodeURIComponent(`[DieyDev Profile] Tin nhắn từ ${name}`)}&body=${encodeURIComponent(`Họ và tên: ${name}\nEmail: ${email}\n\nNội dung liên hệ:\n${message}`)}`;
      window.open(mailtoUrl, '_blank');
      showToast(lang === 'vi' ? 'Đang mở hộp thư để gửi trực tiếp đến dieydev04@gmail.com...' : 'Opening email client for direct send...');
      setSubmitFeedback({
        type: 'info',
        message: lang === 'vi' ? 'Đã mở ứng dụng gửi mail đến dieydev04@gmail.com!' : 'Opened email composer for dieydev04@gmail.com!'
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  // 11. Open Gmail Web Compose Direct
  const handleOpenGmailDirect = () => {
    const form = document.getElementById('contact-form');
    const name = form ? form['contact-name'].value.trim() : '';
    const email = form ? form['contact-email'].value.trim() : '';
    const message = form ? form['contact-message'].value.trim() : '';

    const subject = name ? `[Liên hệ DieyDev Profile] Từ ${name}` : '[Liên hệ DieyDev Profile]';
    const body = `Xin chào Duy,\n\nHọ và tên: ${name || '(Chưa nhập)'}\nEmail: ${email || '(Chưa nhập)'}\n\nNội dung liên hệ:\n${message || '(Chưa nhập)'}\n\nTrân trọng!`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=dieydev04@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
    sound.playSuccess();
    showToast(lang === 'vi' ? 'Đang mở tab soạn thư Gmail gửi đến dieydev04@gmail.com...' : 'Opening Gmail composer for dieydev04@gmail.com...');
  };

  return (
    <>
      {/* 3D WebGL Background Canvas */}
      <canvas
        id="webgl-canvas"
        ref={canvasRef}
        onClick={handleCanvasClick}
        title="Bấm vào không gian 3D để phát xung sóng năng lượng"
      />

      {/* Sakura Monolith Ancient Tree Atmospheric Backdrop */}
      <div className={`sakura-backdrop-layer ${sakuraBackdrop ? '' : 'hidden'}`}></div>

      {/* Ambient Aurora Light Orbs */}
      <div className="ambient-glow glow-top-left"></div>
      <div className="ambient-glow glow-bottom-right"></div>

      {/* Header & Cyber HUD */}
      <header className="cyber-header">
        <div className="header-inner">
          <a href="#hero" className="brand-logo" onMouseEnter={() => sound.playBlip(600, 0.03)}>
            <div className="logo-icon-3d">TD</div>
            <span>diey<span style={{ color: 'var(--theme-secondary)' }}>.dev</span></span>
            <div className="logo-badge">
              <span className="badge-dot"></span>
              <span>{t.statusBadge}</span>
            </div>
          </a>

          {/* Navigation Links */}
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} id="nav-menu">
            <li>
              <a
                href="#about"
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>01.</span>{t.nav.about}
              </a>
            </li>
            <li>
              <a
                href="#education"
                className={`nav-link ${activeSection === 'education' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>02.</span>{t.nav.education}
              </a>
            </li>
            <li>
              <a
                href="#skills"
                className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>03.</span>{t.nav.skills}
              </a>
            </li>
            <li>
              <a
                href="#projects"
                className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>04.</span>{t.nav.projects}
              </a>
            </li>
            <li>
              <a
                href="#stats"
                className={`nav-link ${activeSection === 'stats' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>05.</span>{t.nav.stats}
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>06.</span>{t.nav.contact}
              </a>
            </li>
          </ul>

          {/* HUD Tools */}
          <div className="hud-controls">
            {/* Language Switcher */}
            <button
              className="btn-hud"
              onClick={() => {
                const nextLang = lang === 'vi' ? 'en' : 'vi';
                setLang(nextLang);
                sound.playBlip(800, 0.05);
                showToast(`Ngôn ngữ: ${nextLang === 'vi' ? 'Tiếng Việt' : 'English'}`);
              }}
              title="Chuyển đổi ngôn ngữ Tiếng Việt / English"
            >
              <Globe size={15} />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Theme Picker */}
            <div className="theme-dropdown" title="Tùy chọn tông màu giao diện">
              <button
                className={`theme-pill pill-sakura ${theme === 'sakura' ? 'active' : ''}`}
                onClick={() => { setTheme('sakura'); sound.playChime(600, 900, 0.2); }}
                title="🌸 Sakura Blossom (Hoa Anh Đào Hồng)"
              />
              <button
                className={`theme-pill pill-violet ${theme === 'violet' ? 'active' : ''}`}
                onClick={() => { setTheme('violet'); sound.playChime(500, 750, 0.2); }}
                title="Cyber Violet"
              />
              <button
                className={`theme-pill pill-matrix ${theme === 'matrix' ? 'active' : ''}`}
                onClick={() => { setTheme('matrix'); sound.playChime(500, 750, 0.2); }}
                title="Emerald Matrix"
              />
              <button
                className={`theme-pill pill-sunset ${theme === 'sunset' ? 'active' : ''}`}
                onClick={() => { setTheme('sunset'); sound.playChime(500, 750, 0.2); }}
                title="Sunset Synthwave"
              />
            </div>

            {/* Sakura Backdrop Toggle */}
            <button
              className={`btn-hud ${sakuraBackdrop ? 'active' : ''}`}
              onClick={() => {
                const next = !sakuraBackdrop;
                setSakuraBackdrop(next);
                sound.playBlip(880, 0.05);
                showToast(next ? '🌸 Nền Cây Hoa Anh Đào 3D: BẬT' : '🌸 Nền Cây Hoa Anh Đào 3D: TẮT');
              }}
              title="Bật/Tắt hình nền Cây Hoa Anh Đào Cổ Thụ & Monolith"
            >
              <span>🌸 Sakura BG</span>
            </button>

            {/* 3D Wireframe */}
            <button
              className={`btn-hud ${isWireframe ? 'active' : ''}`}
              onClick={toggleWireframe}
              title="Chuyển chế độ 3D Wireframe"
            >
              <Box size={15} />
              <span>3D Wire</span>
            </button>

            {/* SFX Audio */}
            <button
              className={`btn-hud sound-toggle ${soundActive ? 'active' : ''}`}
              onClick={toggleSound}
              title="Bật/Tắt âm thanh Cyber SFX"
            >
              {soundActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>SFX</span>
            </button>

            {/* Mobile Nav Toggle */}
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <div className="content-wrapper">

        {/* HERO SECTION */}
        <section className="hero-section" id="hero">
          <div className="hero-grid">
            <div className="hero-content interactive-area">
              <div className="hero-subheading">
                <Sparkles size={16} style={{ color: 'var(--theme-secondary)' }} />
                <span>{t.hero.greeting}</span>
              </div>

              <h1 className="hero-name">
                {t.hero.titlePrefix} <span className="gradient-text">{t.hero.titleSuffix}</span>
              </h1>

              <div className="hero-role-typewriter">
                <span>{typewriterText}</span>
                <span className="cursor-typing"></span>
              </div>

              <p className="hero-bio">{t.hero.bio}</p>

              <div className="hero-badges-row">
                {/* Official University Badge with Logo */}
                <div className="hero-pill hero-pill-uni">
                  <img src="/tdmu-logo.png" alt="TDMU Logo" className="uni-logo-small" />
                  <span>{t.hero.tdmuBadge}</span>
                </div>
                <div className="hero-pill">
                  <MapPin size={14} style={{ color: 'var(--theme-primary)' }} />
                  <span>{t.hero.locationBadge}</span>
                </div>
                <div className="hero-pill">
                  <Briefcase size={14} style={{ color: '#10b981' }} />
                  <span>{t.hero.internBadge}</span>
                </div>
              </div>

              <div className="hero-actions">
                <a href="#projects" className="btn-cyber-primary">
                  <FolderGit2 size={16} />
                  <span>{t.hero.btnProjects}</span>
                </a>
                <a href="https://www.facebook.com/dieydev04" target="_blank" rel="noopener noreferrer" className="btn-cyber-secondary" style={{ borderColor: 'rgba(24, 119, 242, 0.5)' }}>
                  <FacebookIcon size={16} style={{ color: '#1877f2' }} />
                  <span>Facebook</span>
                </a>
                <a href="https://github.com/DieyDev" target="_blank" rel="noopener noreferrer" className="btn-cyber-secondary">
                  <GithubIcon size={16} />
                  <span>GitHub</span>
                </a>
                <a href="#contact" className="btn-cyber-secondary">
                  <Send size={16} />
                  <span>{t.hero.btnContact}</span>
                </a>
              </div>
            </div>

            {/* HERO PROFILE SPOTLIGHT CARD */}
            <div className="hero-3d-card interactive-area">
              <div className="card-hologram-header">
                <div className="hologram-status">
                  <span className="badge-dot"></span>
                  <span>HỒ SƠ CÁ NHÂN</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  @dieydev04
                </div>
              </div>

              {/* Avatar + Main Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '18px', padding: '3px', background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))', flexShrink: 0 }}>
                  <img src={gitData.avatar_url} alt="Nguyễn Thanh Duy" style={{ width: '100%', height: '100%', borderRadius: '15px', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Nguyễn Thanh Duy</h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--theme-secondary)', fontWeight: 700 }}>Fullstack Developer (.NET Core + React)</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Viện Công nghệ số • ĐH Thủ Dầu Một</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Lớp: D22KTPM01 • Niên khóa: 2022 - 2027</div>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="card-stats-grid">
                <div className="stat-box">
                  <div className="stat-value">{gitData.public_repos}<span>+</span></div>
                  <div className="stat-label">{t.hero.statRepos}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">.NET<span>+React</span></div>
                  <div className="stat-label">Chuyên môn chính</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">TDMU</div>
                  <div className="stat-label">Viện CNS</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">2004</div>
                  <div className="stat-label">07/11/2004</div>
                </div>
              </div>

              {/* Social Quick Links Row - 5 Channels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(86px, 1fr))', gap: '0.45rem', marginBottom: '1.25rem' }}>
                <a
                  href="https://www.facebook.com/dieydev04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cyber-secondary"
                  style={{ padding: '0.5rem 0.5rem', fontSize: '0.73rem', justifyContent: 'center', borderColor: 'rgba(24, 119, 242, 0.4)' }}
                  title="Facebook: dieydev04"
                >
                  <FacebookIcon size={14} style={{ color: '#1877f2' }} /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/_dieynguyen.04/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cyber-secondary"
                  style={{ padding: '0.5rem 0.5rem', fontSize: '0.73rem', justifyContent: 'center', borderColor: 'rgba(225, 48, 108, 0.4)' }}
                  title="Instagram: @_dieynguyen.04"
                >
                  <InstagramIcon size={14} style={{ color: '#e1306c' }} /> Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@_dieynguyen.04"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cyber-secondary"
                  style={{ padding: '0.5rem 0.5rem', fontSize: '0.73rem', justifyContent: 'center', borderColor: 'rgba(0, 242, 254, 0.4)' }}
                  title="TikTok: @_dieynguyen.04"
                >
                  <TikTokIcon size={14} style={{ color: '#00f2fe' }} /> TikTok
                </a>
                <a
                  href="https://github.com/DieyDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cyber-secondary"
                  style={{ padding: '0.5rem 0.5rem', fontSize: '0.73rem', justifyContent: 'center' }}
                  title="GitHub: DieyDev"
                >
                  <GithubIcon size={14} /> GitHub
                </a>
                <a
                  href="mailto:dieydev04@gmail.com"
                  className="btn-cyber-secondary"
                  style={{ padding: '0.5rem 0.5rem', fontSize: '0.73rem', justifyContent: 'center' }}
                  title="Email: dieydev04@gmail.com"
                >
                  <Mail size={14} /> Email
                </a>
              </div>

              {/* Status Banner */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="badge-dot" style={{ flexShrink: 0 }}></span>
                <span style={{ fontSize: '0.8rem', color: '#10b981', lineHeight: 1.4 }}>
                  Mục tiêu hiện tại: Tìm kiếm vị trí Thực tập sinh / Junior Fullstack Developer tại TP. Hồ Chí Minh & Bình Dương.
                </span>
              </div>

              {/* Sakura Monolith 3D Interactive Card */}
              <div
                className="sakura-showcase-box"
                onClick={() => {
                  setShowSakuraModal(true);
                  sound.playChime(700, 1050, 0.25);
                }}
                title="Bấm để xem chi tiết tác phẩm 3D CGI Cây Anh Đào Monolith"
              >
                <img src="/sakura-monolith.jpg" alt="Sakura Monolith 3D" className="sakura-thumb" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#f472b6' }}>
                    <Sparkles size={14} />
                    <span>Sakura Monolith 3D Art</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Cây Anh Đào Cổ Thụ & Lõi Đa Diện 3D
                  </div>
                </div>
                <ExternalLink size={14} style={{ color: 'var(--theme-primary)', flexShrink: 0 }} />
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="about">
          <div className="section-tag interactive-area">
            <User size={14} />
            <span>{t.about.tag}</span>
          </div>
          <h2 className="section-title interactive-area">
            {t.about.titlePrefix} <span className="gradient-text">{t.about.titleSuffix}</span>
          </h2>
          <p className="section-desc interactive-area">{t.about.desc}</p>

          <div className="about-grid interactive-area">
            {/* Left: Avatar & University Credential Card */}
            <div className="avatar-hologram-wrap glass-panel">
              <div className="avatar-frame">
                <img
                  src={gitData.avatar_url}
                  alt="Nguyễn Thanh Duy"
                  className="avatar-img"
                />
                <div className="scan-line"></div>
              </div>
              <div className="avatar-meta">
                <strong>Nguyễn Thanh Duy</strong>
                <span style={{ color: 'var(--theme-secondary)' }}>@dieydev04</span>
              </div>

              {/* Official University Card with Logo */}
              <div className="university-card">
                <div className="university-logo-wrap">
                  <img src="/tdmu-logo.png" alt="Trường Đại học Thủ Dầu Một" className="university-logo-img" />
                </div>
                <div className="university-details">
                  <div className="university-name">{t.about.uniName}</div>
                  <div className="university-sub">{t.about.uniSub}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem', fontWeight: 600 }}>
                    {t.about.major}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--theme-secondary)', marginTop: '0.15rem' }}>
                    {t.about.classInfo}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {t.about.dobInfo}
                  </div>
                </div>
              </div>

              <div className="quote-card">
                <p>{t.about.quote}</p>
                <span className="quote-author">Nguyễn Thanh Duy</span>
              </div>
            </div>

            {/* Right: Personal Story, Vision & Strengths */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Story Card */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Compass size={20} style={{ color: 'var(--theme-secondary)' }} />
                  <span>{t.about.storyTitle}</span>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                  {t.about.storyP1}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.7 }}>
                  {t.about.storyP2}
                </p>
              </div>

              {/* Strengths Grid */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Star size={20} style={{ color: '#f59e0b' }} />
                  <span>{t.about.strengthsTitle}</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(var(--theme-primary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--theme-primary)', flexShrink: 0 }}>
                      <Brain size={18} />
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem', display: 'block' }}>Tự học & Nghiên cứu công nghệ độc lập</strong>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.about.strength1}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(var(--theme-secondary-rgb), 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--theme-secondary)', flexShrink: 0 }}>
                      <Layers size={18} />
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem', display: 'block' }}>Tư duy hệ thống & Clean Architecture</strong>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.about.strength2}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem', display: 'block' }}>Trách nhiệm cao & Tinh thần đồng đội</strong>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.about.strength3}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION & STUDENT CREDENTIALS SECTION */}
        <section className="education-section" id="education">
          <div className="section-tag interactive-area">
            <GraduationCap size={14} />
            <span>{t.education.tag}</span>
          </div>
          <h2 className="section-title interactive-area">
            {t.education.titlePrefix} <span className="gradient-text">{t.education.titleSuffix}</span>
          </h2>
          <p className="section-desc interactive-area">{t.education.desc}</p>

          <div className="education-grid interactive-area">
            {/* Left: Official Student Credential Card */}
            <div className="student-card-official">
              <div className="school-header-bar">
                <img src="/tdmu-logo.png" alt="Trường Đại học Thủ Dầu Một" className="school-logo-large" />
                <div className="school-title-group">
                  <h3>{t.education.schoolCardTitle}</h3>
                  <div className="school-institute">{t.education.institute}</div>
                </div>
              </div>

              <div className="credential-table">
                <div className="credential-item">
                  <div className="credential-label">Họ và tên</div>
                  <div className="credential-val">Nguyễn Thanh Duy</div>
                </div>

                <div className="credential-item">
                  <div className="credential-label">Ngày sinh</div>
                  <div className="credential-val">07/11/2004 (Nam)</div>
                </div>

                <div className="credential-item">
                  <div className="credential-label">Chuyên ngành</div>
                  <div className="credential-val">Kỹ thuật Phần mềm</div>
                </div>

                <div className="credential-item">
                  <div className="credential-label">Lớp sinh viên</div>
                  <div className="credential-val" style={{ color: 'var(--theme-secondary)' }}>D22KTPM01</div>
                </div>

                <div className="credential-item">
                  <div className="credential-label">Hệ đào tạo</div>
                  <div className="credential-val">Đại học chính quy</div>
                </div>

                <div className="credential-item">
                  <div className="credential-label">Niên khóa đào tạo</div>
                  <div className="credential-val" style={{ color: '#10b981' }}>2022 - 2027</div>
                </div>
              </div>

              <div className="student-status-badge-row">
                <span className="badge-dot"></span>
                <span>Tình trạng học tập: Đang theo học chính quy tại Trường Đại học Thủ Dầu Một</span>
              </div>
            </div>

            {/* Right: Career Vision & Philosophy */}
            <div className="career-vision-panel">
              <div className="vision-card">
                <div className="vision-card-title">
                  <Sparkles size={18} style={{ color: 'var(--theme-primary)' }} />
                  <span>{t.education.goalsTitle}</span>
                </div>
                <p className="vision-card-desc" style={{ marginBottom: '0.85rem' }}>
                  {t.education.goalShortTerm}
                </p>
                <p className="vision-card-desc">
                  {t.education.goalLongTerm}
                </p>
              </div>

              <div className="vision-card">
                <div className="vision-card-title">
                  <Star size={18} style={{ color: '#f59e0b' }} />
                  <span>{t.education.philosophyTitle}</span>
                </div>
                <p className="vision-card-desc">
                  {t.education.philosophyDesc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <a href="#contact" className="btn-cyber-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Send size={16} />
                  <span>Liên Hệ Thực Tập / Việc Làm</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TECH STACK SECTION */}
        <section className="skills-section" id="skills">
          <div className="section-tag interactive-area">
            <Zap size={14} />
            <span>{t.skills.tag}</span>
          </div>
          <h2 className="section-title interactive-area">
            {t.skills.titlePrefix} <span className="gradient-text">{t.skills.titleSuffix}</span>
          </h2>
          <p className="section-desc interactive-area">{t.skills.desc}</p>

          <div className="skills-grid interactive-area">
            {/* Backend */}
            <div className="skill-category-card glass-panel">
              <div className="category-header">
                <div className="category-icon">
                  <Server size={22} />
                </div>
                <div>
                  <div className="category-title">{t.skills.backendTitle}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.skills.backendSub}</span>
                </div>
              </div>

              <div className="skills-list">
                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">.NET 8 / C# & ASP.NET Core</span>
                    <span className="skill-pct">90%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '90%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">Microservices & YARP Gateway</span>
                    <span className="skill-pct">85%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '85%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">Apache Kafka (Event-Driven)</span>
                    <span className="skill-pct">80%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '80%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">FastAPI & Python Services</span>
                    <span className="skill-pct">78%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '78%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">Redis Caching & Celery</span>
                    <span className="skill-pct">82%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '82%' }}></div></div>
                </div>
              </div>

              <div className="tech-tags-cloud">
                <span className="tech-tag">RESTful API</span>
                <span className="tech-tag">Clean Architecture</span>
                <span className="tech-tag">EF Core 8</span>
                <span className="tech-tag">JWT & RBAC</span>
                <span className="tech-tag">CQRS / MediatR</span>
              </div>
            </div>

            {/* Frontend & Web */}
            <div className="skill-category-card glass-panel">
              <div className="category-header">
                <div className="category-icon">
                  <Layout size={22} />
                </div>
                <div>
                  <div className="category-title">{t.skills.frontendTitle}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.skills.frontendSub}</span>
                </div>
              </div>

              <div className="skills-list">
                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">React 19 & TypeScript</span>
                    <span className="skill-pct">82%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '82%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">Three.js (WebGL 3D)</span>
                    <span className="skill-pct">75%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '75%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">HTML5 / Vanilla CSS3</span>
                    <span className="skill-pct">88%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '88%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">Flutter / Dart Mobile</span>
                    <span className="skill-pct">72%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '72%' }}></div></div>
                </div>
              </div>

              <div className="tech-tags-cloud">
                <span className="tech-tag">Vite</span>
                <span className="tech-tag">Chart.js</span>
                <span className="tech-tag">AJAX / Fetch</span>
                <span className="tech-tag">Responsive UI</span>
              </div>
            </div>

            {/* Database & Infrastructure */}
            <div className="skill-category-card glass-panel">
              <div className="category-header">
                <div className="category-icon">
                  <Database size={22} />
                </div>
                <div>
                  <div className="category-title">{t.skills.devopsTitle}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.skills.devopsSub}</span>
                </div>
              </div>

              <div className="skills-list">
                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">PostgreSQL & SQL Server</span>
                    <span className="skill-pct">85%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '85%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">Docker Containers</span>
                    <span className="skill-pct">80%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '80%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">MySQL Database</span>
                    <span className="skill-pct">80%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '80%' }}></div></div>
                </div>

                <div className="skill-item">
                  <div className="skill-info">
                    <span className="skill-name">Git & GitHub Actions</span>
                    <span className="skill-pct">85%</span>
                  </div>
                  <div className="skill-bar"><div className="skill-fill" style={{ width: '85%' }}></div></div>
                </div>
              </div>

              <div className="tech-tags-cloud">
                <span className="tech-tag">Thiết kế CSDL</span>
                <span className="tech-tag">Tối ưu Query</span>
                <span className="tech-tag">Docker Compose</span>
                <span className="tech-tag">Vercel Deployment</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="projects-section" id="projects">
          <div className="section-tag interactive-area">
            <FolderGit2 size={14} />
            <span>{t.projects.tag}</span>
          </div>
          <h2 className="section-title interactive-area">
            {t.projects.titlePrefix} <span className="gradient-text">{t.projects.titleSuffix}</span>
          </h2>
          <p className="section-desc interactive-area">{t.projects.desc}</p>

          <div className="project-filter-tabs interactive-area">
            <button
              className={`filter-tab ${projectFilter === 'all' ? 'active' : ''}`}
              onClick={() => { setProjectFilter('all'); sound.playClick(); }}
            >
              {t.projects.tabAll}
            </button>
            <button
              className={`filter-tab ${projectFilter === 'microservices' ? 'active' : ''}`}
              onClick={() => { setProjectFilter('microservices'); sound.playClick(); }}
            >
              {t.projects.tabMicroservices}
            </button>
            <button
              className={`filter-tab ${projectFilter === 'web' ? 'active' : ''}`}
              onClick={() => { setProjectFilter('web'); sound.playClick(); }}
            >
              {t.projects.tabWeb}
            </button>
            <button
              className={`filter-tab ${projectFilter === 'mobile-ai' ? 'active' : ''}`}
              onClick={() => { setProjectFilter('mobile-ai'); sound.playClick(); }}
            >
              {t.projects.tabMobileAi}
            </button>
          </div>

          <div className="projects-grid interactive-area">

            {/* Flagship: LMS Microservices */}
            {(projectFilter === 'all' || projectFilter === 'microservices') && (
              <div className="project-card glass-panel flagship">
                <div className="project-banner">
                  <div className="project-badge">
                    <Sparkles size={14} style={{ marginRight: '0.35rem' }} />
                    <span>{t.projects.highlightLabel}</span>
                  </div>
                  <div className="project-stars">
                    dieydev/lms-microservices
                  </div>
                </div>

                <h3 className="project-title">
                  <span className="project-title-badge">
                    <Bot size={18} style={{ color: 'var(--theme-secondary)' }} />
                  </span>
                  LMS - Nền Tảng Học Trực Tuyến Microservices (.NET 8 + Kafka)
                </h3>

                <p className="project-desc">
                  Hệ thống quản lý đào tạo trực tuyến quy mô lớn xây dựng theo mô hình Microservices độc lập. Tích hợp định tuyến API Gateway tập trung, xử lý thanh toán thực tế (MoMo & VNPAY), giao tiếp bất đồng bộ qua hàng đợi thông điệp và trợ lý học tập AI Advisor.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center' }}>
                      <Network size={16} style={{ color: 'var(--theme-secondary)', marginRight: '0.4rem' }} />
                      API Gateway & Định tuyến
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Sử dụng Microsoft YARP cân bằng tải và bảo mật các endpoints nội bộ.
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center' }}>
                      <Zap size={16} style={{ color: 'var(--theme-primary)', marginRight: '0.4rem' }} />
                      Event-Driven với Kafka
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Xử lý đăng ký khóa học và kích hoạt quyền truy cập bất đồng bộ, chịu tải cao.
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center' }}>
                      <CreditCard size={16} style={{ color: '#10b981', marginRight: '0.4rem' }} />
                      Cổng Thanh Toán MoMo / VNPAY
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Xác thực chữ ký số HMAC, xử lý IPN Webhook tự động cập nhật đơn hàng.
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center' }}>
                      <Bot size={16} style={{ color: '#f59e0b', marginRight: '0.4rem' }} />
                      Dịch vụ AI Advisor (FastAPI)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Tư vấn lộ trình học tập cá nhân hóa xây dựng bằng Python kết nối Celery worker.
                    </div>
                  </div>
                </div>

                <div className="project-tech-stack">
                  <span className="tech-chip">.NET 8</span>
                  <span className="tech-chip">FastAPI</span>
                  <span className="tech-chip">Apache Kafka</span>
                  <span className="tech-chip">Redis</span>
                  <span className="tech-chip">Docker</span>
                  <span className="tech-chip">YARP Gateway</span>
                  <span className="tech-chip">PostgreSQL</span>
                </div>

                <div className="project-links">
                  <a href="https://github.com/dieydev/lms-microservices" target="_blank" rel="noopener noreferrer" className="btn-repo">
                    <GithubIcon size={15} />
                    <span>{t.projects.btnViewGithub}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}

            {/* Spicy Noodle System */}
            {(projectFilter === 'all' || projectFilter === 'web') && (
              <div className="project-card glass-panel">
                <div className="project-banner">
                  <div className="project-badge">
                    <span>HỆ THỐNG THỰC TẾ</span>
                  </div>
                  <div className="project-stars">dieydev/DuAnMiCayy</div>
                </div>

                <h3 className="project-title">
                  <span className="project-title-badge">
                    <Layers size={18} style={{ color: 'var(--theme-primary)' }} />
                  </span>
                  Hệ Thống Quản Lý Đặt Món Mì Cay
                </h3>
                <p className="project-desc">
                  Giải pháp trọn gói phục vụ khách hàng đặt món và ban quản lý vận hành: phân quyền người dùng RBAC, mã hóa mật khẩu an toàn với BCrypt, tính năng khôi phục tài khoản qua OTP và bảng điều khiển trực quan hóa doanh thu theo thời gian thực.
                </p>

                <ul className="project-features">
                  <li><CheckCircle2 size={15} style={{ color: 'var(--theme-secondary)', flexShrink: 0 }} /> Đầy đủ phân hệ Khách hàng (Menu, Giỏ hàng, Đặt món) và Quản trị viên (Kho, Đơn hàng, Thống kê)</li>
                  <li><CheckCircle2 size={15} style={{ color: 'var(--theme-secondary)', flexShrink: 0 }} /> Quản lý trạng thái giao dịch với Database Transaction an toàn dữ liệu</li>
                  <li><CheckCircle2 size={15} style={{ color: 'var(--theme-secondary)', flexShrink: 0 }} /> Trực quan hóa doanh thu và số lượng đơn hàng qua biểu đồ Chart.js</li>
                </ul>

                <div className="project-tech-stack">
                  <span className="tech-chip">ASP.NET MVC 5</span>
                  <span className="tech-chip">SQL Server</span>
                  <span className="tech-chip">Entity Framework 6</span>
                  <span className="tech-chip">Bootstrap</span>
                  <span className="tech-chip">AJAX</span>
                </div>

                <div className="project-links">
                  <a href="https://github.com/dieydev/DuAnMiCayy" target="_blank" rel="noopener noreferrer" className="btn-repo">
                    <GithubIcon size={15} />
                    <span>{t.projects.btnViewGithub}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}

            {/* Hospital AI */}
            {(projectFilter === 'all' || projectFilter === 'mobile-ai') && (
              <div className="project-card glass-panel">
                <div className="project-banner">
                  <div className="project-badge">
                    <span>ỨNG DỤNG Y TẾ AI</span>
                  </div>
                  <div className="project-stars">dieydev/hospital_ai</div>
                </div>

                <h3 className="project-title">
                  <span className="project-title-badge">
                    <Sparkles size={18} style={{ color: '#10b981' }} />
                  </span>
                  Hospital AI Assistant
                </h3>
                <p className="project-desc">
                  Ứng dụng di động y tế đa nền tảng tích hợp trí tuệ nhân tạo, cho phép người bệnh tra cứu triệu chứng ban đầu, tìm kiếm bác sĩ chuyên khoa phù hợp và đặt lịch khám tiện lợi.
                </p>

                <ul className="project-features">
                  <li><CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} /> Giao diện di động hiện đại phát triển bằng Flutter và Dart</li>
                  <li><CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} /> Tích hợp mô hình AI phân tích triệu chứng và đưa ra hướng dẫn sơ cứu kịp thời</li>
                  <li><CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} /> Quản lý lịch khám bệnh và đồng bộ thông tin hồ sơ người dùng</li>
                </ul>

                <div className="project-tech-stack">
                  <span className="tech-chip">Flutter</span>
                  <span className="tech-chip">Dart</span>
                  <span className="tech-chip">RESTful API</span>
                  <span className="tech-chip">AI Consultation</span>
                </div>

                <div className="project-links">
                  <a href="https://github.com/dieydev/hospital_ai" target="_blank" rel="noopener noreferrer" className="btn-repo">
                    <GithubIcon size={15} />
                    <span>{t.projects.btnViewGithub}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}

            {/* NexusFlow */}
            {(projectFilter === 'all' || projectFilter === 'microservices') && (
              <div className="project-card glass-panel">
                <div className="project-banner">
                  <div className="project-badge">
                    <span>TỰ ĐỘNG HÓA PIPELINE</span>
                  </div>
                  <div className="project-stars">dieydev/NexusFlow</div>
                </div>

                <h3 className="project-title">
                  <span className="project-title-badge">
                    <Zap size={18} style={{ color: '#f59e0b' }} />
                  </span>
                  NexusFlow - Pipeline Automation Engine
                </h3>
                <p className="project-desc">
                  Engine xử lý chuỗi công việc tự động theo kiến trúc module hóa hướng dữ liệu viết bằng TypeScript, giúp các hệ thống dịch vụ dễ dàng kết nối và kích hoạt tác vụ theo chuỗi tuần tự hoặc song song.
                </p>

                <ul className="project-features">
                  <li><CheckCircle2 size={15} style={{ color: '#f59e0b', flexShrink: 0 }} /> Cơ chế thực thi pipeline bất đồng bộ linh hoạt và an toàn kiểu dữ liệu</li>
                  <li><CheckCircle2 size={15} style={{ color: '#f59e0b', flexShrink: 0 }} /> Cho phép chèn middleware kiểm tra và xử lý lỗi tại từng mắt xích</li>
                </ul>

                <div className="project-tech-stack">
                  <span className="tech-chip">TypeScript</span>
                  <span className="tech-chip">Node.js</span>
                  <span className="tech-chip">Async Event Pipeline</span>
                </div>

                <div className="project-links">
                  <a href="https://github.com/dieydev/NexusFlow" target="_blank" rel="noopener noreferrer" className="btn-repo">
                    <GithubIcon size={15} />
                    <span>{t.projects.btnViewGithub}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* GITHUB STATS */}
        <section className="github-section" id="stats">
          <div className="section-tag interactive-area">
            <GitFork size={14} />
            <span>{t.stats.tag}</span>
          </div>
          <h2 className="section-title interactive-area">
            {t.stats.titlePrefix} <span className="gradient-text">{t.stats.titleSuffix}</span>
          </h2>
          <p className="section-desc interactive-area">{t.stats.desc}</p>

          <div className="github-stats-grid interactive-area">
            <div className="github-card-box">
              <div className="github-card-header">
                <span>{t.stats.publicRepos}</span>
                <GitFork size={18} style={{ color: 'var(--theme-primary)' }} />
              </div>
              <div className="github-card-num">{gitData.public_repos}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                .NET, React, TypeScript, Flutter
              </div>
            </div>

            <div className="github-card-box">
              <div className="github-card-header">
                <span>{t.stats.primaryBackend}</span>
                <Layers size={18} style={{ color: 'var(--theme-secondary)' }} />
              </div>
              <div className="github-card-num">FULLSTACK</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                .NET Core + React.js
              </div>
            </div>

            <div className="github-card-box">
              <div className="github-card-header">
                <span>{t.stats.gradTarget}</span>
                <GraduationCap size={18} style={{ color: '#10b981' }} />
              </div>
              <div className="github-card-num">2022-27</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                ĐH Thủ Dầu Một (Viện CNS)
              </div>
            </div>

            <div className="github-card-box">
              <div className="github-card-header">
                <span>{t.stats.status}</span>
                <Briefcase size={18} style={{ color: '#f59e0b' }} />
              </div>
              <div className="github-card-num" style={{ fontSize: '1.45rem', color: '#10b981' }}>SẴN SÀNG</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Thực tập / Junior Developer
              </div>
            </div>
          </div>

          <div className="github-readme-stats-wrap interactive-area">
            <img
              src="https://github-readme-stats.vercel.app/api?username=DieyDev&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0d1117&title_color=a78bfa&icon_color=a78bfa&text_color=c9d1d9&rank_icon=github"
              alt="GitHub Stats"
              loading="lazy"
            />
            <img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=DieyDev&layout=compact&theme=tokyonight&hide_border=true&bg_color=0d1117&title_color=a78bfa&text_color=c9d1d9&langs_count=8"
              alt="Top Languages"
              loading="lazy"
            />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="contact-section" id="contact">
          <div className="section-tag interactive-area">
            <Send size={14} />
            <span>{t.contact.tag}</span>
          </div>
          <h2 className="section-title interactive-area">
            {t.contact.titlePrefix} <span className="gradient-text">{t.contact.titleSuffix}</span>
          </h2>
          <p className="section-desc interactive-area">{t.contact.desc}</p>

          <div className="contact-grid interactive-area">
            <div className="contact-info-list">
              {/* Facebook Card */}
              <div className="contact-method-card" style={{ borderColor: 'rgba(24, 119, 242, 0.4)' }}>
                <div className="contact-icon-box" style={{ background: 'rgba(24, 119, 242, 0.15)', color: '#1877f2' }}>
                  <FacebookIcon size={20} />
                </div>
                <div className="contact-method-texts">
                  <div className="contact-method-label">{t.contact.facebookLabel}</div>
                  <a href="https://www.facebook.com/dieydev04" target="_blank" rel="noopener noreferrer" className="contact-method-val">
                    facebook.com/dieydev04
                  </a>
                </div>
                <a href="https://www.facebook.com/dieydev04" target="_blank" rel="noopener noreferrer" className="btn-copy">
                  <ExternalLink size={13} /> Kết nối
                </a>
              </div>

              {/* Instagram Card */}
              <div className="contact-method-card" style={{ borderColor: 'rgba(225, 48, 108, 0.4)' }}>
                <div className="contact-icon-box" style={{ background: 'rgba(225, 48, 108, 0.15)', color: '#e1306c' }}>
                  <InstagramIcon size={20} />
                </div>
                <div className="contact-method-texts">
                  <div className="contact-method-label">{t.contact.instagramLabel}</div>
                  <a href="https://www.instagram.com/_dieynguyen.04/" target="_blank" rel="noopener noreferrer" className="contact-method-val">
                    instagram.com/_dieynguyen.04
                  </a>
                </div>
                <a href="https://www.instagram.com/_dieynguyen.04/" target="_blank" rel="noopener noreferrer" className="btn-copy">
                  <ExternalLink size={13} /> Theo dõi
                </a>
              </div>

              {/* TikTok Card */}
              <div className="contact-method-card" style={{ borderColor: 'rgba(0, 242, 254, 0.4)' }}>
                <div className="contact-icon-box" style={{ background: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe' }}>
                  <TikTokIcon size={20} />
                </div>
                <div className="contact-method-texts">
                  <div className="contact-method-label">{t.contact.tiktokLabel}</div>
                  <a href="https://www.tiktok.com/@_dieynguyen.04" target="_blank" rel="noopener noreferrer" className="contact-method-val">
                    tiktok.com/@_dieynguyen.04
                  </a>
                </div>
                <a href="https://www.tiktok.com/@_dieynguyen.04" target="_blank" rel="noopener noreferrer" className="btn-copy">
                  <ExternalLink size={13} /> Khám phá
                </a>
              </div>

              {/* Email Card */}
              <div className="contact-method-card">
                <div className="contact-icon-box">
                  <Mail size={20} />
                </div>
                <div className="contact-method-texts">
                  <div className="contact-method-label">{t.contact.emailLabel}</div>
                  <a href="mailto:dieydev04@gmail.com" className="contact-method-val">dieydev04@gmail.com</a>
                </div>
                <button
                  className="btn-copy"
                  onClick={handleCopyEmail}
                  title="Sao chép email"
                >
                  {copiedEmail ? <Check size={14} /> : <Copy size={14} />} {copiedEmail ? t.contact.copiedBtn : t.contact.copyBtn}
                </button>
              </div>

              {/* GitHub Card */}
              <div className="contact-method-card">
                <div className="contact-icon-box">
                  <GithubIcon size={20} />
                </div>
                <div className="contact-method-texts">
                  <div className="contact-method-label">{t.contact.githubLabel}</div>
                  <a href="https://github.com/DieyDev" target="_blank" rel="noopener noreferrer" className="contact-method-val">github.com/DieyDev</a>
                </div>
                <a href="https://github.com/DieyDev" target="_blank" rel="noopener noreferrer" className="btn-copy">
                  <ExternalLink size={13} /> Ghé thăm
                </a>
              </div>

              {/* Location Card */}
              <div className="contact-method-card">
                <div className="contact-icon-box">
                  <MapPin size={20} />
                </div>
                <div className="contact-method-texts">
                  <div className="contact-method-label">{t.contact.locationLabel}</div>
                  <div className="contact-method-val">{t.contact.locationVal}</div>
                </div>
              </div>

              {/* University Card in Contact with Official Logo */}
              <div className="contact-method-card" style={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}>
                <div className="university-logo-wrap" style={{ width: '48px', height: '48px', padding: '4px' }}>
                  <img src="/tdmu-logo.png" alt="TDMU" className="university-logo-img" />
                </div>
                <div className="contact-method-texts">
                  <div className="contact-method-label">{t.contact.uniLabel}</div>
                  <div className="contact-method-val" style={{ fontSize: '0.86rem' }}>
                    {t.contact.uniVal}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Lớp D22KTPM01 • Niên khóa 2022 - 2027
                  </div>
                </div>
              </div>
            </div>

            {/* Message Form */}
            <div className="glass-panel">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                  <Send size={18} style={{ color: 'var(--theme-secondary)', marginRight: '0.5rem' }} />
                  {t.contact.formTitle}
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <span className="badge-dot"></span>
                  <span>dieydev04@gmail.com</span>
                </div>
              </div>

              <form id="contact-form" className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label">{t.contact.formName}</label>
                  <input type="text" id="contact-name" className="form-input" placeholder="VD: Anh/Chị Tuyển dụng hoặc Doanh nghiệp" required />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label">{t.contact.formEmail}</label>
                  <input type="email" id="contact-email" className="form-input" placeholder="email@company.com" required />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-message" className="form-label">{t.contact.formMsg}</label>
                  <textarea id="contact-message" className="form-textarea" placeholder="Xin chào Duy, chúng tôi muốn trao đổi về cơ hội làm việc..." required></textarea>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    className="btn-cyber-primary"
                    disabled={isSubmitting}
                    style={{
                      flex: '1 1 200px',
                      justifyContent: 'center',
                      opacity: isSubmitting ? 0.75 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="badge-dot" style={{ background: '#ffffff' }}></span>
                        <span>{lang === 'vi' ? 'Đang gửi...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>{t.contact.formSubmit}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenGmailDirect}
                    className="btn-cyber-secondary"
                    style={{
                      flex: '1 1 200px',
                      justifyContent: 'center',
                      borderColor: 'rgba(234, 67, 53, 0.45)',
                      color: 'var(--text-primary)'
                    }}
                    title="Mở tab Gmail để gửi thư trực tiếp đến dieydev04@gmail.com"
                  >
                    <Mail size={16} style={{ color: '#ea4335' }} />
                    <span>{lang === 'vi' ? 'Mở Gmail gửi trực tiếp' : 'Compose in Gmail'}</span>
                  </button>
                </div>

                {submitFeedback && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: submitFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(6, 182, 212, 0.12)',
                    border: `1px solid ${submitFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(6, 182, 212, 0.35)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    fontSize: '0.82rem',
                    color: submitFeedback.type === 'success' ? '#10b981' : 'var(--theme-secondary)'
                  }}>
                    {submitFeedback.type === 'success' ? <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> : <Sparkles size={16} style={{ flexShrink: 0 }} />}
                    <span>{submitFeedback.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="cyber-footer">
        <div className="footer-inner">
          <div>
            <span style={{ color: 'var(--theme-primary)' }}>{t.footer.copy}</span>
          </div>

          <div className="footer-links">
            <a href="#hero">{t.footer.top}</a>
            <a href="https://www.facebook.com/dieydev04" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.instagram.com/_dieynguyen.04/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@_dieynguyen.04" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://github.com/DieyDev" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="mailto:dieydev04@gmail.com">dieydev04@gmail.com</a>
          </div>
        </div>
      </footer>

      {/* Sakura Monolith Modal Viewer */}
      {showSakuraModal && (
        <div className="sakura-modal-overlay" onClick={() => setShowSakuraModal(false)}>
          <div className="sakura-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6', fontWeight: 700, fontSize: '0.95rem' }}>
                <Sparkles size={16} />
                <span>Sakura Monolith • 3D CGI Masterpiece (Unreal Engine 5 Style)</span>
              </div>
              <button
                onClick={() => setShowSakuraModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                title="Đóng"
              >
                <X size={20} />
              </button>
            </div>
            <img src="/sakura-monolith.jpg" alt="Sakura Monolith 8K CGI" className="sakura-modal-img" />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              🌸 <strong>Ý tưởng thiết kế:</strong> Cây hoa anh đào cổ thụ ngàn năm nở rộ rực rỡ, ôm trọn và hợp nhất cùng khối cấu trúc đa diện hình học (Icosahedron, Octahedron và Torus Knot). Tại tâm điểm là nguồn năng lượng Glowing Core phát ánh sáng neon hồng phấn huyền ảo, tỏa những cánh hoa anh đào bay bổng lơ lửng trong không gian 3D.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container" id="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
