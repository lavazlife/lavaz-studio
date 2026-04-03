document.addEventListener('DOMContentLoaded', () => {
    const appForm = document.getElementById('appForm');
    const assetGrid = document.getElementById('assetGrid');
    const previewFrame = document.getElementById('previewFrame');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadStatus = document.getElementById('downloadStatus');
    const generateBtn = document.getElementById('generateBtn');

    // Load assets preview
    const assets = [
        'assets/logo-lld-neon.png',
        'assets/logo-ll-metal.png',
        'assets/logo-ln-circle.png',
        'assets/character-rb.png',
        'assets/texture-carbon.png',
        'assets/video-promo.mp4'
    ];
    assetGrid.innerHTML = assets.map(src => `
        <div class="asset-item">
            ${src.endsWith('.mp4') ? `<video src="${src}" muted loop playsinline></video>` : `<img src="${src}" alt="Asset">`}
        </div>
    `).join('');

    let generatedAppHTML = '';
    let generatedAppFilename = 'app.html';

    generateBtn.addEventListener('click', () => {
        if (!appForm.checkValidity()) {
            appForm.reportValidity();
            return;
        }
        const appName = document.getElementById('appName').value.trim();
        const appType = document.getElementById('appType').value;
        const features = document.getElementById('features').value.trim();
        const theme = document.getElementById('theme').value;

        const themes = {
            'neon-cyber': {
                accent: '#00ffff',
                accentDim: 'rgba(0,255,255,0.15)',
                accentBorder: 'rgba(0,255,255,0.4)',
                bg: 'linear-gradient(135deg,#0a0a0a 0%,#1a0a2e 60%,#0a0a1a 100%)',
                surface: 'rgba(255,255,255,0.04)',
                text: '#e0e0ff',
                muted: 'rgba(224,224,255,0.55)'
            },
            'carbon-metal': {
                accent: '#c0c0c0',
                accentDim: 'rgba(192,192,192,0.12)',
                accentBorder: 'rgba(192,192,192,0.35)',
                bg: 'linear-gradient(135deg,#111 0%,#1c1c1c 50%,#2a2a2a 100%)',
                surface: 'rgba(255,255,255,0.05)',
                text: '#d8d8d8',
                muted: 'rgba(216,216,216,0.5)'
            },
            'dark-gradient': {
                accent: '#a78bfa',
                accentDim: 'rgba(167,139,250,0.15)',
                accentBorder: 'rgba(167,139,250,0.4)',
                bg: 'linear-gradient(135deg,#0d0d0d 0%,#16213e 50%,#0f3460 100%)',
                surface: 'rgba(255,255,255,0.05)',
                text: '#e8e8ff',
                muted: 'rgba(232,232,255,0.5)'
            }
        };
        const t = themes[theme] || themes['neon-cyber'];
        const themeLabel = theme.replace(/-/g, ' ');

        const featureItems = features
            ? features.split(',').map(f => f.trim()).filter(Boolean)
            : ['Responsive Layout', 'Modern Design', 'Fast Performance'];

        // Shared base CSS injected into every generated page
        const baseCSS = `
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --accent: ${t.accent};
      --accent-dim: ${t.accentDim};
      --accent-border: ${t.accentBorder};
      --surface: ${t.surface};
      --text: ${t.text};
      --muted: ${t.muted};
    }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Orbitron', monospace;
      background: ${t.bg};
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }
    a { color: var(--accent); text-decoration: none; }
    /* NAV */
    nav {
      position: fixed; top: 0; width: 100%;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(12px);
      z-index: 100;
      border-bottom: 1px solid var(--accent-border);
    }
    .nav-inner {
      max-width: 1100px; margin: 0 auto;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.9rem 2rem;
    }
    .nav-brand { font-size: 1.1rem; font-weight: 700; color: var(--accent); letter-spacing: 2px; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { font-size: 0.8rem; letter-spacing: 1px; transition: color 0.2s; opacity: 0.8; }
    .nav-links a:hover { color: var(--accent); opacity: 1; }
    /* HERO */
    .hero {
      min-height: 100vh;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center;
      padding: 8rem 2rem 4rem;
    }
    .hero-eyebrow {
      font-size: 0.75rem; letter-spacing: 4px; text-transform: uppercase;
      color: var(--accent); margin-bottom: 1.5rem; opacity: 0.85;
    }
    .hero h1 {
      font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 900;
      line-height: 1.05; letter-spacing: -1px;
      text-shadow: 0 0 40px var(--accent);
      margin-bottom: 1.5rem;
    }
    .hero p {
      font-size: clamp(0.9rem, 2vw, 1.15rem);
      color: var(--muted); max-width: 600px; line-height: 1.7;
      margin-bottom: 2.5rem;
    }
    .btn {
      display: inline-block;
      background: var(--accent); color: #000;
      font-family: 'Orbitron', monospace;
      font-weight: 700; font-size: 0.85rem;
      letter-spacing: 2px; text-transform: uppercase;
      padding: 0.9rem 2.5rem; border-radius: 50px;
      border: none; cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 0 20px var(--accent-border);
    }
    .btn:hover { transform: scale(1.05); box-shadow: 0 0 35px var(--accent); }
    .btn-outline {
      background: transparent; color: var(--accent);
      border: 2px solid var(--accent);
    }
    .btn-outline:hover { background: var(--accent-dim); }
    /* SECTIONS */
    .section { padding: 6rem 2rem; max-width: 1100px; margin: 0 auto; }
    .section-label {
      text-align: center; font-size: 0.7rem;
      letter-spacing: 4px; text-transform: uppercase;
      color: var(--accent); margin-bottom: 1rem;
    }
    .section-title {
      text-align: center; font-size: clamp(1.8rem, 4vw, 3rem);
      margin-bottom: 1rem; text-shadow: 0 0 15px var(--accent-border);
    }
    .section-sub {
      text-align: center; color: var(--muted);
      font-size: 0.95rem; line-height: 1.7;
      max-width: 600px; margin: 0 auto 3.5rem;
    }
    /* CARDS / GRID */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background: var(--surface);
      border: 1px solid var(--accent-border);
      border-radius: 16px;
      padding: 2rem 1.75rem;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px var(--accent-dim); }
    .card-icon { font-size: 2rem; margin-bottom: 1rem; }
    .card h3 { font-size: 1rem; letter-spacing: 1px; margin-bottom: 0.65rem; color: var(--accent); }
    .card p { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }
    /* DIVIDER */
    .divider {
      width: 60px; height: 3px;
      background: var(--accent);
      margin: 0 auto 1rem;
      border-radius: 2px;
      box-shadow: 0 0 10px var(--accent);
    }
    /* FOOTER */
    footer {
      text-align: center; padding: 3rem 2rem;
      background: rgba(0,0,0,0.6);
      border-top: 1px solid var(--accent-border);
    }
    footer p { font-size: 0.75rem; color: var(--muted); letter-spacing: 1px; }
    footer .footer-brand { color: var(--accent); font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    /* RESPONSIVE */
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .card-grid { grid-template-columns: 1fr; }
    }`;

        const navLinks = {
            portfolio:  ['#about', 'About', '#work', 'Work', '#contact', 'Contact'],
            landing:    ['#features', 'Features', '#about', 'About', '#contact', 'Contact'],
            builder:    ['#features', 'Features', '#demo', 'Demo', '#start', 'Get Started'],
            custom:     ['#about', 'About', '#features', 'Features', '#contact', 'Contact']
        };

        const buildNav = (type) => {
            const links = navLinks[type] || navLinks.custom;
            const items = [];
            for (let i = 0; i < links.length; i += 2) {
                items.push(`<li><a href="${links[i]}">${links[i + 1]}</a></li>`);
            }
            return `<nav>
  <div class="nav-inner">
    <span class="nav-brand">${appName}</span>
    <ul class="nav-links">${items.join('')}</ul>
  </div>
</nav>`;
        };

        const buildFooter = () => `<footer>
  <p class="footer-brand">${appName}</p>
  <p>Built with Lavaz Studio &mdash; Lavaz Life Designs &copy; ${new Date().getFullYear()}</p>
</footer>`;

        const featureCards = (icons) => featureItems.map((f, i) => `
    <div class="card">
      <div class="card-icon">${icons[i % icons.length]}</div>
      <h3>${f}</h3>
      <p>Delivering ${f.toLowerCase()} to create seamless, engaging user experiences.</p>
    </div>`).join('');

        let bodyContent = '';

        if (appType === 'portfolio') {
            bodyContent = `
${buildNav('portfolio')}
<section class="hero">
  <p class="hero-eyebrow">Welcome &mdash; ${themeLabel}</p>
  <h1>${appName}</h1>
  <p>Creative developer &amp; designer. I build polished digital experiences that leave a lasting impression.</p>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center">
    <a class="btn" href="#work">View My Work</a>
    <a class="btn btn-outline" href="#contact">Get In Touch</a>
  </div>
</section>

<section id="about">
  <div class="section">
    <p class="section-label">About Me</p>
    <div class="divider"></div>
    <h2 class="section-title">Who I Am</h2>
    <p class="section-sub">A passionate creator focused on crafting modern web experiences. I combine design sensibility with technical depth to deliver work that stands out.</p>
    <div class="card-grid">
      <div class="card"><div class="card-icon">🎨</div><h3>Design</h3><p>Pixel-perfect interfaces with a focus on clarity and visual hierarchy.</p></div>
      <div class="card"><div class="card-icon">⚙️</div><h3>Development</h3><p>Clean, maintainable code built to scale and perform.</p></div>
      <div class="card"><div class="card-icon">🚀</div><h3>Delivery</h3><p>Fast turnaround without compromising quality or attention to detail.</p></div>
    </div>
  </div>
</section>

<section id="work">
  <div class="section">
    <p class="section-label">Portfolio</p>
    <div class="divider"></div>
    <h2 class="section-title">Selected Work</h2>
    <p class="section-sub">A collection of projects that showcase skills across ${featureItems.slice(0, 3).join(', ')}.</p>
    <div class="card-grid">
      ${featureItems.map((f, i) => `<div class="card"><div class="card-icon">${['🖥️','📱','🎬','🔧','💡','🌐'][i % 6]}</div><h3>Project ${i + 1}: ${f}</h3><p>An in-depth exploration of ${f.toLowerCase()} — designed, built, and deployed with care.</p></div>`).join('')}
    </div>
  </div>
</section>

<section id="contact">
  <div class="section" style="text-align:center">
    <p class="section-label">Contact</p>
    <div class="divider"></div>
    <h2 class="section-title">Let&rsquo;s Work Together</h2>
    <p class="section-sub">Have a project in mind? I&apos;d love to hear about it. Reach out and let&apos;s create something great.</p>
    <a class="btn" href="mailto:hello@example.com">Send a Message</a>
  </div>
</section>

${buildFooter()}`;

        } else if (appType === 'landing') {
            bodyContent = `
${buildNav('landing')}
<section class="hero">
  <p class="hero-eyebrow">Introducing &mdash; ${appName}</p>
  <h1>The Future of<br>${featureItems[0] || 'Your Product'}</h1>
  <p>Everything you need to launch, grow, and scale — in one powerful platform built for modern teams.</p>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center">
    <a class="btn" href="#features">Explore Features</a>
    <a class="btn btn-outline" href="#contact">Request Demo</a>
  </div>
</section>

<section id="features">
  <div class="section">
    <p class="section-label">Features</p>
    <div class="divider"></div>
    <h2 class="section-title">Everything You Need</h2>
    <p class="section-sub">Packed with capabilities that help you move faster, work smarter, and build better products.</p>
    <div class="card-grid">${featureCards(['⚡','🛡️','📊','🔗','🎯','🧩'])}</div>
  </div>
</section>

<section id="about">
  <div class="section">
    <p class="section-label">Why ${appName}</p>
    <div class="divider"></div>
    <h2 class="section-title">Built for Results</h2>
    <p class="section-sub">We obsess over the details so you can focus on what matters — growing your product and delighting your users.</p>
    <div class="card-grid">
      <div class="card"><div class="card-icon">📈</div><h3>Performance First</h3><p>Engineered for speed. Your users will never wait.</p></div>
      <div class="card"><div class="card-icon">🔒</div><h3>Secure by Design</h3><p>Enterprise-grade security baked in from day one.</p></div>
      <div class="card"><div class="card-icon">🌍</div><h3>Scale Globally</h3><p>Infrastructure that grows with you — anywhere in the world.</p></div>
    </div>
  </div>
</section>

<section id="contact">
  <div class="section" style="text-align:center">
    <p class="section-label">Get Started</p>
    <div class="divider"></div>
    <h2 class="section-title">Ready to Launch?</h2>
    <p class="section-sub">Join thousands of teams already using ${appName} to build the next big thing.</p>
    <a class="btn" href="#features">Start for Free</a>
  </div>
</section>

${buildFooter()}`;

        } else if (appType === 'builder') {
            bodyContent = `
${buildNav('builder')}
<section class="hero">
  <p class="hero-eyebrow">No-Code Builder &mdash; ${appName}</p>
  <h1>Build Anything.<br>Deploy in Seconds.</h1>
  <p>A powerful drag-and-drop builder that turns your ideas into production-ready web apps without writing a single line of code.</p>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center">
    <a class="btn" href="#features">See How It Works</a>
    <a class="btn btn-outline" href="#demo">View Demo</a>
  </div>
</section>

<section id="features">
  <div class="section">
    <p class="section-label">Capabilities</p>
    <div class="divider"></div>
    <h2 class="section-title">Powerful Features</h2>
    <p class="section-sub">Everything a modern builder needs — from layout tools to deployment pipelines.</p>
    <div class="card-grid">${featureCards(['🧩','⚡','🎨','📦','🔗','☁️'])}</div>
  </div>
</section>

<section id="demo">
  <div class="section">
    <p class="section-label">Live Demo</p>
    <div class="divider"></div>
    <h2 class="section-title">See It in Action</h2>
    <p class="section-sub">A simulated preview of the ${appName} dashboard interface.</p>
    <div style="background:var(--surface);border:1px solid var(--accent-border);border-radius:20px;padding:2rem;display:grid;grid-template-columns:220px 1fr;gap:1.5rem;min-height:300px">
      <div style="border-right:1px solid var(--accent-border);padding-right:1.5rem">
        <p style="font-size:0.7rem;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem">Components</p>
        ${['Layout', 'Typography', 'Media', 'Forms', 'Navigation'].map(c => `<div style="padding:0.6rem 1rem;margin-bottom:0.5rem;border-radius:8px;background:var(--accent-dim);font-size:0.8rem;cursor:pointer">${c}</div>`).join('')}
      </div>
      <div>
        <p style="font-size:0.7rem;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem">Canvas</p>
        <div style="border:2px dashed var(--accent-border);border-radius:12px;height:200px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:0.85rem">Drop components here to build your layout</div>
      </div>
    </div>
  </div>
</section>

<section id="start">
  <div class="section" style="text-align:center">
    <p class="section-label">Get Started</p>
    <div class="divider"></div>
    <h2 class="section-title">Start Building Today</h2>
    <p class="section-sub">No credit card required. Get your first app live in under 5 minutes.</p>
    <a class="btn" href="#features">Open Builder</a>
  </div>
</section>

${buildFooter()}`;

        } else {
            // custom — generic multi-section
            bodyContent = `
${buildNav('custom')}
<section class="hero">
  <p class="hero-eyebrow">${appName} &mdash; ${themeLabel}</p>
  <h1>${appName}</h1>
  <p>A custom-built web experience crafted with purpose, precision, and personality.</p>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center">
    <a class="btn" href="#features">Discover More</a>
    <a class="btn btn-outline" href="#contact">Contact Us</a>
  </div>
</section>

<section id="about">
  <div class="section">
    <p class="section-label">About</p>
    <div class="divider"></div>
    <h2 class="section-title">What We Do</h2>
    <p class="section-sub">We deliver exceptional digital experiences through thoughtful design and solid engineering.</p>
    <div class="card-grid">
      <div class="card"><div class="card-icon">💡</div><h3>Vision</h3><p>Big ideas backed by clear strategy and purposeful execution.</p></div>
      <div class="card"><div class="card-icon">🛠️</div><h3>Craft</h3><p>Every detail considered, every interaction refined.</p></div>
      <div class="card"><div class="card-icon">🤝</div><h3>Partnership</h3><p>We work closely with you from concept through launch and beyond.</p></div>
    </div>
  </div>
</section>

<section id="features">
  <div class="section">
    <p class="section-label">Features</p>
    <div class="divider"></div>
    <h2 class="section-title">Core Capabilities</h2>
    <p class="section-sub">The key strengths that define ${appName} and drive real results.</p>
    <div class="card-grid">${featureCards(['✨','🔧','📡','🎯','🌐','🔐'])}</div>
  </div>
</section>

<section id="contact">
  <div class="section" style="text-align:center">
    <p class="section-label">Contact</p>
    <div class="divider"></div>
    <h2 class="section-title">Get In Touch</h2>
    <p class="section-sub">Have a question or want to work together? We&apos;d love to hear from you.</p>
    <a class="btn" href="mailto:hello@example.com">Send a Message</a>
  </div>
</section>

${buildFooter()}`;
        }

        const generatedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
  <style>${baseCSS}
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;

        previewFrame.srcdoc = generatedHTML;
        downloadBtn.disabled = false;
        downloadStatus.textContent = `Generated: ${appName} (${appType})`;
        generatedAppHTML = generatedHTML;
        generatedAppFilename = (appName || 'app').replace(/\s+/g, '-').toLowerCase() + '.html';
    });

    downloadBtn.addEventListener('click', () => {
        if (!generatedAppHTML) return;
        const link = document.createElement('a');
        link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(generatedAppHTML);
        link.download = generatedAppFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloadStatus.textContent = `Downloaded: ${generatedAppFilename}`;
    });

    // Smooth scroll for nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});