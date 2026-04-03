document.addEventListener('DOMContentLoaded', () => {

    // ── DOM refs ──────────────────────────────────────────────────────────────
    const assetGrid        = document.getElementById('assetGrid');
    const assetUpload      = document.getElementById('assetUpload');
    const previewFrame     = document.getElementById('previewFrame');
    const downloadBtn      = document.getElementById('downloadBtn');
    const deployBtn        = document.getElementById('deployBtn');
    const downloadFormat   = document.getElementById('downloadFormat');
    const downloadStatus   = document.getElementById('downloadStatus');
    const generateBtn      = document.getElementById('generateBtn');
    const loadPreviousBtn  = document.getElementById('loadPreviousBtn');
    const aiGenerateBtn    = document.getElementById('aiGenerateBtn');
    const aiKey            = document.getElementById('aiKey');
    const accentColorInput = document.getElementById('accentColor');
    const accentColorHex   = document.getElementById('accentColorHex');
    const resetAccentBtn   = document.getElementById('resetAccentBtn');
    const fontFamilySelect = document.getElementById('fontFamily');
    const promptLibraryBtn = document.getElementById('promptLibraryBtn');
    const promptLibraryPanel = document.getElementById('promptLibraryPanel');
    const sectionOrderList = document.getElementById('sectionOrderList');
    const reorderSection   = document.getElementById('reorder');
    const deployModal      = document.getElementById('deployModal');
    const closeDeployModal = document.getElementById('closeDeployModal');

    // ── State ─────────────────────────────────────────────────────────────────
    const defaultAssets = [
        'assets/logo-lld-neon.png',
        'assets/logo-ll-metal.png',
        'assets/logo-ln-circle.png',
        'assets/character-rb.png',
        'assets/texture-carbon.png',
        'assets/video-promo.mp4'
    ];

    let uploadedAssets       = [];
    let generatedAppHTML     = '';
    let generatedAppFilename = 'app';
    let sectionOrder         = []; // [{id, label, icon, html}]
    let navHTML              = '';
    let footerHTML           = '';
    let generatedBaseCSS     = '';
    let generatedFontTag     = '';

    // ── Theme definitions ─────────────────────────────────────────────────────
    const THEMES = {
        'neon-cyber': {
            accent: '#00ffff', accentDim: 'rgba(0,255,255,0.15)',
            accentBorder: 'rgba(0,255,255,0.4)',
            bg: 'linear-gradient(135deg,#0a0a0a 0%,#1a0a2e 60%,#0a0a1a 100%)',
            surface: 'rgba(255,255,255,0.04)', text: '#e0e0ff', muted: 'rgba(224,224,255,0.55)'
        },
        'carbon-metal': {
            accent: '#c0c0c0', accentDim: 'rgba(192,192,192,0.12)',
            accentBorder: 'rgba(192,192,192,0.35)',
            bg: 'linear-gradient(135deg,#111 0%,#1c1c1c 50%,#2a2a2a 100%)',
            surface: 'rgba(255,255,255,0.05)', text: '#d8d8d8', muted: 'rgba(216,216,216,0.5)'
        },
        'dark-gradient': {
            accent: '#a78bfa', accentDim: 'rgba(167,139,250,0.15)',
            accentBorder: 'rgba(167,139,250,0.4)',
            bg: 'linear-gradient(135deg,#0d0d0d 0%,#16213e 50%,#0f3460 100%)',
            surface: 'rgba(255,255,255,0.05)', text: '#e8e8ff', muted: 'rgba(232,232,255,0.5)'
        },
        'light-clean': {
            accent: '#0066ff', accentDim: 'rgba(0,102,255,0.1)',
            accentBorder: 'rgba(0,102,255,0.3)',
            bg: 'linear-gradient(135deg,#f8faff 0%,#eef2ff 50%,#f0f4ff 100%)',
            surface: 'rgba(0,0,0,0.03)', text: '#1a1a2e', muted: 'rgba(26,26,46,0.55)'
        },
        'pastel-dream': {
            accent: '#ff6eb4', accentDim: 'rgba(255,110,180,0.12)',
            accentBorder: 'rgba(255,110,180,0.35)',
            bg: 'linear-gradient(135deg,#fdf6ff 0%,#fff0fa 50%,#f0f8ff 100%)',
            surface: 'rgba(255,110,180,0.04)', text: '#3d1a3d', muted: 'rgba(61,26,61,0.5)'
        },
        'minimal-dark': {
            accent: '#ffffff', accentDim: 'rgba(255,255,255,0.08)',
            accentBorder: 'rgba(255,255,255,0.15)',
            bg: 'linear-gradient(135deg,#080808 0%,#111 50%,#0d0d0d 100%)',
            surface: 'rgba(255,255,255,0.03)', text: '#e0e0e0', muted: 'rgba(224,224,224,0.45)'
        }
    };

    // ── Template gallery data ─────────────────────────────────────────────────
    const TEMPLATES = [
        {
            id: 'portfolio', name: 'Portfolio', icon: '🎨',
            description: 'Showcase your work, skills and story with a stunning personal site',
            gradient: 'linear-gradient(135deg,rgba(0,255,255,0.08),transparent)',
            defaultFeatures: 'UI Design, Web Development, Photography, Brand Identity',
            defaultTheme: 'neon-cyber',
            defaultSections: ['hero','about','work','skills','testimonials','gallery','contact']
        },
        {
            id: 'landing', name: 'Landing Page', icon: '🚀',
            description: 'Convert visitors into customers with a high-impact landing page',
            gradient: 'linear-gradient(135deg,rgba(167,139,250,0.08),transparent)',
            defaultFeatures: 'Lightning fast, SEO optimized, Analytics ready, Mobile first',
            defaultTheme: 'dark-gradient',
            defaultSections: ['hero','features','about','pricing','testimonials','faq','contact']
        },
        {
            id: 'blog', name: 'Blog', icon: '✍️',
            description: 'Share your ideas with a clean, readable blog layout',
            gradient: 'linear-gradient(135deg,rgba(255,110,180,0.08),transparent)',
            defaultFeatures: 'Technology, Design, Tutorials, Personal Stories',
            defaultTheme: 'light-clean',
            defaultSections: ['hero','recentPosts','categories','about','newsletter','contact']
        },
        {
            id: 'ecommerce', name: 'E-Commerce', icon: '🛍️',
            description: 'Sell products online with a modern storefront',
            gradient: 'linear-gradient(135deg,rgba(0,255,136,0.08),transparent)',
            defaultFeatures: 'Free Shipping, 30-Day Returns, Secure Checkout, 24/7 Support',
            defaultTheme: 'minimal-dark',
            defaultSections: ['hero','featuredProducts','features','about','testimonials','faq','contact']
        },
        {
            id: 'saas', name: 'SaaS Product', icon: '⚡',
            description: 'Launch your software product with a conversion-focused page',
            gradient: 'linear-gradient(135deg,rgba(99,102,241,0.1),transparent)',
            defaultFeatures: 'Team Collaboration, API Access, Analytics Dashboard, Custom Integrations',
            defaultTheme: 'dark-gradient',
            defaultSections: ['hero','features','pricing','about','testimonials','faq','contact']
        },
        {
            id: 'builder', name: 'App Builder', icon: '🧩',
            description: 'Present a no-code or low-code tool with a power-user aesthetic',
            gradient: 'linear-gradient(135deg,rgba(0,255,255,0.06),transparent)',
            defaultFeatures: 'Drag & Drop, 100+ Templates, One-Click Deploy, Real-time Preview',
            defaultTheme: 'neon-cyber',
            defaultSections: ['hero','features','demo','pricing','testimonials','contact']
        },
        {
            id: 'custom', name: 'Custom', icon: '✨',
            description: 'A blank slate — build any type of web presence from scratch',
            gradient: 'linear-gradient(135deg,rgba(255,255,255,0.04),transparent)',
            defaultFeatures: 'Modern Design, Responsive Layout, Fast Performance',
            defaultTheme: 'neon-cyber',
            defaultSections: ['hero','about','features','contact']
        }
    ];

    // ── Section definitions per app type ─────────────────────────────────────
    const SECTION_DEFS = {
        portfolio: [
            { id: 'hero',         label: 'Hero',           icon: '🏠' },
            { id: 'about',        label: 'About',          icon: '👤' },
            { id: 'work',         label: 'Work / Projects',icon: '💼' },
            { id: 'skills',       label: 'Skills',         icon: '⚙️' },
            { id: 'testimonials', label: 'Testimonials',   icon: '💬' },
            { id: 'gallery',      label: 'Gallery',        icon: '🖼️' },
            { id: 'contact',      label: 'Contact',        icon: '📧' }
        ],
        landing: [
            { id: 'hero',         label: 'Hero',           icon: '🏠' },
            { id: 'features',     label: 'Features',       icon: '⚡' },
            { id: 'about',        label: 'About',          icon: '👥' },
            { id: 'pricing',      label: 'Pricing',        icon: '💰' },
            { id: 'testimonials', label: 'Testimonials',   icon: '💬' },
            { id: 'faq',          label: 'FAQ',            icon: '❓' },
            { id: 'gallery',      label: 'Gallery',        icon: '🖼️' },
            { id: 'contact',      label: 'Contact',        icon: '📧' }
        ],
        blog: [
            { id: 'hero',        label: 'Hero / Banner',   icon: '🏠' },
            { id: 'recentPosts', label: 'Recent Posts',    icon: '📝' },
            { id: 'categories',  label: 'Categories',      icon: '🏷️' },
            { id: 'about',       label: 'About Author',    icon: '✍️' },
            { id: 'newsletter',  label: 'Newsletter',      icon: '📨' },
            { id: 'contact',     label: 'Contact',         icon: '📧' }
        ],
        ecommerce: [
            { id: 'hero',             label: 'Hero / Banner',    icon: '🏠' },
            { id: 'featuredProducts', label: 'Featured Products',icon: '🛍️' },
            { id: 'features',         label: 'Why Us',           icon: '✅' },
            { id: 'about',            label: 'About',            icon: '👥' },
            { id: 'testimonials',     label: 'Reviews',          icon: '⭐' },
            { id: 'faq',              label: 'FAQ',              icon: '❓' },
            { id: 'contact',          label: 'Contact',          icon: '📧' }
        ],
        saas: [
            { id: 'hero',         label: 'Hero',          icon: '🏠' },
            { id: 'features',     label: 'Features',      icon: '⚡' },
            { id: 'pricing',      label: 'Pricing',       icon: '💰' },
            { id: 'about',        label: 'About',         icon: '👥' },
            { id: 'testimonials', label: 'Testimonials',  icon: '💬' },
            { id: 'faq',          label: 'FAQ',           icon: '❓' },
            { id: 'contact',      label: 'Contact',       icon: '📧' }
        ],
        builder: [
            { id: 'hero',         label: 'Hero',          icon: '🏠' },
            { id: 'features',     label: 'Features',      icon: '⚡' },
            { id: 'demo',         label: 'Live Demo',     icon: '🖥️' },
            { id: 'pricing',      label: 'Pricing',       icon: '💰' },
            { id: 'testimonials', label: 'Testimonials',  icon: '💬' },
            { id: 'contact',      label: 'Contact',       icon: '📧' }
        ],
        custom: [
            { id: 'hero',         label: 'Hero',          icon: '🏠' },
            { id: 'about',        label: 'About',         icon: '👥' },
            { id: 'features',     label: 'Features',      icon: '⚡' },
            { id: 'pricing',      label: 'Pricing',       icon: '💰' },
            { id: 'faq',          label: 'FAQ',           icon: '❓' },
            { id: 'testimonials', label: 'Testimonials',  icon: '💬' },
            { id: 'gallery',      label: 'Gallery',       icon: '🖼️' },
            { id: 'contact',      label: 'Contact',       icon: '📧' }
        ]
    };

    // ── Prompt library ────────────────────────────────────────────────────────
    const PROMPT_LIBRARY = {
        portfolio: {
            label: 'Portfolio',
            prompts: [
                'UI/UX Design, Front-End Development, Motion Graphics, Brand Identity',
                'Full-Stack Engineering, Open Source, Technical Writing, Cloud Architecture',
                'Photography, Retouching, Video Editing, Social Media Content',
                'Mobile App Development, React Native, Flutter, App Store Optimization'
            ]
        },
        landing: {
            label: 'Landing Page',
            prompts: [
                'One-click signup, 14-day free trial, No credit card required, Money-back guarantee',
                'Real-time analytics, Seamless integrations, Enterprise security, 99.9% uptime',
                'AI-powered automation, Smart scheduling, Team collaboration, Detailed reporting',
                'Lightning fast delivery, SEO optimized, Mobile first, ADA compliant'
            ]
        },
        blog: {
            label: 'Blog',
            prompts: [
                'Web Development, CSS Tricks, JavaScript Tips, Career Advice',
                'Startup Stories, Product Design, Remote Work, Productivity Hacks',
                'Travel Journal, Local Culture, Photography, Food Reviews',
                'Fitness & Wellness, Recipes, Mental Health, Lifestyle'
            ]
        },
        ecommerce: {
            label: 'E-Commerce',
            prompts: [
                'Free Shipping Over $50, 30-Day Returns, Handmade Products, Eco-Friendly Materials',
                'Limited Edition Drops, Exclusive Members, Custom Orders, Worldwide Delivery',
                'Tech Accessories, Minimalist Design, Premium Materials, Next-Day Delivery',
                'Organic Ingredients, Cruelty-Free, Sustainable Packaging, Women-Owned Business'
            ]
        },
        saas: {
            label: 'SaaS',
            prompts: [
                'Team Collaboration, Real-time Updates, API Access, Advanced Analytics Dashboard',
                'AI Content Generation, Multi-language Support, Custom Workflows, White-label Options',
                'Project Management, Time Tracking, Invoice Generation, Client Portal',
                'Customer Support Automation, Live Chat, Knowledge Base, CRM Integration'
            ]
        },
        builder: {
            label: 'App Builder',
            prompts: [
                'Drag & Drop, 200+ Templates, One-Click Publish, Mobile Preview',
                'No Coding Required, Custom Domains, SEO Tools, E-commerce Ready',
                'Visual Editor, Component Library, Version History, Team Collaboration',
                'API Builder, Database GUI, Webhook Support, Role-based Access'
            ]
        },
        custom: {
            label: 'Custom',
            prompts: [
                'Modern Design, Responsive Layout, Fast Loading, Accessible',
                'Community Forum, Events Calendar, Member Directory, Resource Library',
                'Portfolio Gallery, Case Studies, Client Testimonials, Service Packages',
                'Corporate Training, Certification Programs, Progress Tracking, Assessments'
            ]
        }
    };

    // ── Template gallery ──────────────────────────────────────────────────────
    function renderTemplateGallery() {
        const grid = document.getElementById('templateGrid');
        grid.innerHTML = TEMPLATES.map(t => `
        <div class="template-card" data-id="${t.id}" style="--card-gradient:${t.gradient}">
            <div class="template-icon">${t.icon}</div>
            <div class="template-name">${t.name}</div>
            <div class="template-desc">${t.description}</div>
        </div>`).join('');

        grid.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const tmpl = TEMPLATES.find(t => t.id === card.dataset.id);
                if (!tmpl) return;
                document.getElementById('appType').value = tmpl.id;
                document.getElementById('theme').value   = tmpl.defaultTheme;
                if (!document.getElementById('features').value.trim()) {
                    document.getElementById('features').value = tmpl.defaultFeatures;
                }
                // Sync accent color to new theme
                const th = THEMES[tmpl.defaultTheme] || THEMES['neon-cyber'];
                accentColorInput.value = th.accent;
                accentColorHex.textContent = th.accent;
                accentColorHex.style.color = th.accent;
                updateComponentLibrary(tmpl.id, tmpl.defaultSections);
                grid.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
            });
        });

        const currentType = document.getElementById('appType').value;
        const active = grid.querySelector(`[data-id="${currentType}"]`);
        if (active) active.classList.add('selected');
    }

    // ── Component library ─────────────────────────────────────────────────────
    function updateComponentLibrary(appType, enabledIds) {
        const container = document.getElementById('componentLibrary');
        const defs = SECTION_DEFS[appType] || SECTION_DEFS.custom;
        container.innerHTML = defs.map(s => {
            const active = !enabledIds || enabledIds.includes(s.id);
            return `<button type="button" class="component-toggle${active ? ' active' : ''}" data-section="${s.id}">${s.icon} ${s.label}</button>`;
        }).join('');

        container.querySelectorAll('.component-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                if (sectionOrder.length) rebuildFromToggles();
            });
        });
    }

    function getEnabledSectionIds() {
        return Array.from(document.querySelectorAll('#componentLibrary .component-toggle.active'))
            .map(btn => btn.dataset.section);
    }

    // Re-build section order when user toggles a component
    function rebuildFromToggles() {
        const enabled = getEnabledSectionIds();
        sectionOrder = sectionOrder.filter(s => enabled.includes(s.id));
        updateSectionOrderUI();
        assembleAndPreview();
    }

    // ── Prompt library ────────────────────────────────────────────────────────
    promptLibraryBtn.addEventListener('click', () => {
        if (promptLibraryPanel.style.display !== 'none') {
            promptLibraryPanel.style.display = 'none';
            return;
        }
        renderPromptLibrary();
        promptLibraryPanel.style.display = '';
    });

    function renderPromptLibrary() {
        const currentType = document.getElementById('appType').value;
        const all = Object.entries(PROMPT_LIBRARY);
        const sorted = [...all.filter(([k]) => k === currentType), ...all.filter(([k]) => k !== currentType)];
        promptLibraryPanel.innerHTML =
            `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
                <span style="font-size:0.65rem;letter-spacing:2px;color:#00ffff;text-transform:uppercase">Prompt Library</span>
                <span style="font-size:0.73rem;color:rgba(255,255,255,0.4)">Click to use &rarr;</span>
            </div>` +
            sorted.map(([, cat]) => `
            <div class="prompt-category">
                <h4>${cat.label}</h4>
                <div class="prompt-chips">
                    ${cat.prompts.map(p => `<button type="button" class="prompt-chip" data-prompt="${p.replace(/"/g, '&quot;')}">${p.length > 42 ? p.substring(0, 42) + '…' : p}</button>`).join('')}
                </div>
            </div>`).join('');

        promptLibraryPanel.querySelectorAll('.prompt-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.getElementById('features').value = chip.dataset.prompt;
                promptLibraryPanel.style.display = 'none';
            });
        });
    }

    // Sync component library when app type changes
    document.getElementById('appType').addEventListener('change', e => {
        updateComponentLibrary(e.target.value, null);
        document.querySelectorAll('.template-card').forEach(c =>
            c.classList.toggle('selected', c.dataset.id === e.target.value));
    });

    // ── Accent color picker ───────────────────────────────────────────────────
    accentColorInput.addEventListener('input', () => {
        accentColorHex.textContent = accentColorInput.value;
        accentColorHex.style.color = accentColorInput.value;
    });

    resetAccentBtn.addEventListener('click', () => {
        const t = THEMES[document.getElementById('theme').value] || THEMES['neon-cyber'];
        accentColorInput.value = t.accent;
        accentColorHex.textContent = t.accent;
        accentColorHex.style.color = t.accent;
    });

    document.getElementById('theme').addEventListener('change', e => {
        const t = THEMES[e.target.value] || THEMES['neon-cyber'];
        accentColorInput.value = t.accent;
        accentColorHex.textContent = t.accent;
        accentColorHex.style.color = t.accent;
    });

    // ── Asset grid ────────────────────────────────────────────────────────────
    function renderAssetGrid() {
        const defaultItems = defaultAssets.map(src => `
        <div class="asset-item">
            ${src.endsWith('.mp4')
                ? `<video src="${src}" muted loop playsinline></video>`
                : `<img src="${src}" alt="Asset">`}
        </div>`).join('');

        const uploadedItems = uploadedAssets.map(a => `
        <div class="asset-item">
            <img src="${a.dataUrl}" alt="${a.name}">
            <p style="text-align:center;font-size:0.7rem;margin-top:0.3rem;color:#00ffff;
               overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 0.5rem">${a.name}</p>
        </div>`).join('');

        assetGrid.innerHTML = defaultItems + uploadedItems;
    }

    renderAssetGrid();

    // ── File upload ───────────────────────────────────────────────────────────
    assetUpload.addEventListener('change', () => {
        const files = Array.from(assetUpload.files);
        if (!files.length) return;

        Promise.all(files.map(file => new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve({ name: file.name, dataUrl: e.target.result, type: file.type });
            reader.readAsDataURL(file);
        }))).then(newAssets => {
            uploadedAssets = [...uploadedAssets, ...newAssets];
            renderAssetGrid();
        });

        assetUpload.value = '';
    });

    // ── Save / Load ───────────────────────────────────────────────────────────
    const STORAGE_KEY = 'lavazStudio_project';

    function saveProjectToStorage(name, type, features, theme, font, accent) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, type, features, theme, font, accent })); }
        catch (err) { console.warn('Could not save to localStorage:', err); }
    }

    function loadProjectFromStorage() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
        catch (err) { console.warn('Could not read localStorage:', err); return null; }
    }

    if (loadProjectFromStorage()) loadPreviousBtn.style.display = '';

    loadPreviousBtn.addEventListener('click', () => {
        const s = loadProjectFromStorage();
        if (!s) return;
        document.getElementById('appName').value  = s.name     || '';
        document.getElementById('appType').value  = s.type     || 'portfolio';
        document.getElementById('features').value = s.features || '';
        document.getElementById('theme').value    = s.theme    || 'neon-cyber';
        if (s.font) fontFamilySelect.value = s.font;
        if (s.accent) {
            accentColorInput.value = s.accent;
            accentColorHex.textContent = s.accent;
            accentColorHex.style.color = s.accent;
        }
        updateComponentLibrary(s.type || 'portfolio', null);
        loadPreviousBtn.style.display = 'none';
    });

    // ── Initialize ────────────────────────────────────────────────────────────
    renderTemplateGallery();
    updateComponentLibrary('portfolio', null);

    // ── Generate buttons ──────────────────────────────────────────────────────
    generateBtn.addEventListener('click', () => {
        const form = document.getElementById('appForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        doGenerate();
    });

    aiGenerateBtn.addEventListener('click', async () => {
        const key = aiKey.value.trim();
        if (!key) { alert('Please enter your OpenAI API key to use AI generation.'); return; }
        const form = document.getElementById('appForm');
        if (!form.checkValidity()) { form.reportValidity(); return; }

        aiGenerateBtn.textContent = '⏳ Generating…';
        aiGenerateBtn.disabled = true;

        try {
            const aiContent = await fetchAIContent(key);
            doGenerate(aiContent);
        } catch (err) {
            alert('AI generation failed: ' + err.message);
        } finally {
            aiGenerateBtn.textContent = '✦ Generate with AI';
            aiGenerateBtn.disabled = false;
        }
    });

    // ── AI fetch ──────────────────────────────────────────────────────────────
    async function fetchAIContent(apiKey) {
        const appName  = document.getElementById('appName').value.trim();
        const appType  = document.getElementById('appType').value;
        const features = document.getElementById('features').value.trim();

        const featureList = features
            ? features.split(',').map(f => f.trim()).filter(Boolean)
            : ['responsive layout', 'modern design', 'fast performance'];

        const typeDescriptions = {
            portfolio: 'a personal portfolio showcasing creative and professional work',
            landing:   'a marketing landing page designed to convert visitors',
            blog:      'a blog or content publication platform',
            ecommerce: 'an online store or e-commerce storefront',
            saas:      'a SaaS product or web application',
            builder:   'a no-code or low-code app builder tool',
            custom:    'a custom web application'
        };

        const typeHints = {
            portfolio: 'Use creative, personal, first-person tone. Focus on skill, passion, and unique value.',
            landing:   'Use persuasive, benefit-focused copy with strong CTAs and pain-point awareness.',
            blog:      'Use conversational, intellectual tone. Emphasize insights, community, and value.',
            ecommerce: 'Use purchase-motivating copy. Emphasize quality, value, trust, and urgency.',
            saas:      'Use outcome-focused copy. Emphasize ROI, efficiency gains, and team benefits.',
            builder:   'Use empowering, possibility-focused copy — "anyone can build" message.',
            custom:    'Use clear, compelling, professional copy appropriate for the described features.'
        };

        const prompt = `You are an expert web copywriter specializing in ${typeDescriptions[appType] || 'web apps'}.

App: "${appName}"
Type: ${appType} — ${typeDescriptions[appType] || ''}
Features/Topics (${featureList.length}): ${featureList.join(', ')}
Tone guide: ${typeHints[appType] || typeHints.custom}

Return ONLY valid JSON (no markdown fences) with these exact fields:
{
  "heroTagline": "bold punchy headline (5-10 words, may include \\n for line breaks)",
  "heroDesc": "compelling 2-sentence hero paragraph tailored to the app type and features",
  "featureDescs": ["one sharp description per feature — exactly ${featureList.length} items, same order as input"],
  "aboutDesc": "2-sentence about/mission copy that builds credibility and differentiates",
  "contactDesc": "1 punchy call-to-action sentence for the contact/closing section",
  "ctaText": "short primary CTA button label (2-4 words)",
  "pricingTease": "one benefit-driven sentence about pricing value (e.g. 'Start free, scale as you grow.')"
}`;

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
                max_tokens: 800
            })
        });

        if (!res.ok) {
            let errMsg = `HTTP ${res.status}`;
            try {
                const errData = await res.json();
                errMsg = errData.error?.message || errMsg;
            } catch (parseErr) {
                console.warn('Could not parse API error response:', parseErr);
            }
            throw new Error(errMsg);
        }

        const data = await res.json();
        return JSON.parse(data.choices[0].message.content);
    }

    // ── Build all sections for a given type ───────────────────────────────────
    function buildAllSections(appType, appName, t, featureItems, aiContent) {
        const heroTagline  = aiContent?.heroTagline || null;
        const heroDesc     = aiContent?.heroDesc    || null;
        const aboutDesc    = aiContent?.aboutDesc   || null;
        const contactDesc  = aiContent?.contactDesc || null;
        const ctaText      = aiContent?.ctaText     || null;
        const pricingTease = aiContent?.pricingTease || null;
        const featureDescs = Array.isArray(aiContent?.featureDescs) ? aiContent.featureDescs : [];

        const featureCards = (icons) => featureItems.map((f, i) => {
            const desc = featureDescs[i] || `Delivering ${f.toLowerCase()} to create seamless, engaging user experiences.`;
            return `<div class="card"><div class="card-icon">${icons[i % icons.length]}</div><h3>${f}</h3><p>${desc}</p></div>`;
        }).join('');

        const galleryHTML = uploadedAssets.length
            ? `<div class="card-grid">${uploadedAssets.map(a =>
                `<div class="card" style="padding:0;overflow:hidden"><img src="${a.dataUrl}" alt="${a.name}" style="width:100%;height:200px;object-fit:cover;display:block"></div>`
              ).join('')}</div>`
            : `<p style="text-align:center;color:var(--muted);font-size:0.85rem">Upload images in the Assets section to populate this gallery.</p>`;

        const testimonials = [
            { name: 'Alex Rivera', role: 'Product Designer', text: `${appName} completely transformed how I work. Highly recommended to anyone who values quality.` },
            { name: 'Jordan Kim',  role: 'Software Engineer', text: `I've tried many alternatives but nothing comes close. Absolutely brilliant.` },
            { name: 'Sam Patel',   role: 'Marketing Lead',    text: `The results speak for themselves. Our team's productivity doubled in the first month.` }
        ];

        const faqItems = [
            { q: `How do I get started with ${appName}?`,    a: 'Getting started takes less than 2 minutes. Create your account, follow the quick setup guide, and you\'re ready.' },
            { q: 'Is there a free trial available?',          a: 'Yes! We offer a full-featured 14-day free trial with no credit card required.' },
            { q: 'Can I change or cancel my plan at any time?', a: 'Absolutely. Upgrade, downgrade, or cancel any time from your account settings.' },
            { q: 'What kind of support is available?',         a: 'We offer 24/7 chat support, a comprehensive knowledge base, and dedicated onboarding for paid plans.' }
        ];

        const pricingTiers = [
            { name: 'Free',       price: '$0',    period: '/mo', features: ['Up to 3 projects','Core features','Community support','5 GB storage'], cta: 'Get Started',   outline: true  },
            { name: 'Pro',        price: '$29',   period: '/mo', features: ['Unlimited projects','All features','Priority support','100 GB storage','Custom domain'],  cta: 'Start Free Trial', highlight: true },
            { name: 'Enterprise', price: 'Custom', period: '',   features: ['Everything in Pro','SSO & SAML','Dedicated manager','SLA guarantee','Audit logs'],        cta: 'Contact Sales', outline: true }
        ];

        const s = {};

        // ── HERO ──────────────────────────────────────────────────────────────
        const heroTaglines = {
            portfolio: heroTagline || appName,
            landing:   heroTagline || `The Future of<br>${featureItems[0] || 'Your Product'}`,
            blog:      heroTagline || 'Ideas Worth<br>Sharing',
            ecommerce: heroTagline || 'Shop the<br>Difference',
            saas:      heroTagline || 'Work Smarter,<br>Grow Faster',
            builder:   heroTagline || 'Build Anything.<br>Deploy in Seconds.',
            custom:    heroTagline || appName
        };
        const heroDescs = {
            portfolio: heroDesc || 'Creative developer &amp; designer. I build polished digital experiences that leave a lasting impression.',
            landing:   heroDesc || 'Everything you need to launch, grow, and scale — in one powerful platform built for modern teams.',
            blog:      heroDesc || 'Thoughts, tutorials, and stories from the intersection of creativity and technology.',
            ecommerce: heroDesc || 'Discover products designed with care and crafted for those who expect only the best.',
            saas:      heroDesc || `The all-in-one platform that helps teams collaborate, automate, and ship faster than ever.`,
            builder:   heroDesc || 'A powerful no-code builder that turns your ideas into production-ready web apps without writing code.',
            custom:    heroDesc || 'A custom-built web experience crafted with purpose, precision, and personality.'
        };
        const heroEyebrows = {
            portfolio: 'Welcome', landing: `Introducing — ${appName}`, blog: appName,
            ecommerce: 'New Collection', saas: `Introducing — ${appName}`,
            builder: `No-Code Builder — ${appName}`, custom: appName
        };
        const heroCTAs = {
            portfolio: `<a class="btn" href="#work">View My Work</a><a class="btn btn-outline" href="#contact">Get In Touch</a>`,
            landing:   `<a class="btn" href="#features">${ctaText || 'Explore Features'}</a><a class="btn btn-outline" href="#contact">Request Demo</a>`,
            blog:      `<a class="btn" href="#recentPosts">Read Latest Posts</a><a class="btn btn-outline" href="#newsletter">Subscribe</a>`,
            ecommerce: `<a class="btn" href="#featuredProducts">Shop Now</a><a class="btn btn-outline" href="#about">Our Story</a>`,
            saas:      `<a class="btn" href="#features">${ctaText || 'Start Free Trial'}</a><a class="btn btn-outline" href="#pricing">See Pricing</a>`,
            builder:   `<a class="btn" href="#features">See How It Works</a><a class="btn btn-outline" href="#demo">View Demo</a>`,
            custom:    `<a class="btn" href="#features">Discover More</a><a class="btn btn-outline" href="#contact">Contact Us</a>`
        };
        const tagline = (heroTaglines[appType] || heroTaglines.custom).replace(/\n/g, '<br>');
        s.hero = { id: 'hero', label: 'Hero', icon: '🏠', html: `<section class="hero">
  <p class="hero-eyebrow">${heroEyebrows[appType] || appName}</p>
  <h1>${tagline}</h1>
  <p>${heroDescs[appType] || heroDescs.custom}</p>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center">${heroCTAs[appType] || heroCTAs.custom}</div>
</section>` };

        // ── ABOUT ─────────────────────────────────────────────────────────────
        const aboutRows = {
            portfolio: [['🎨','Design','Pixel-perfect interfaces with a focus on clarity and visual hierarchy.'],
                        ['⚙️','Development','Clean, maintainable code built to scale and perform.'],
                        ['🚀','Delivery','Fast turnaround without compromising quality.']],
            landing:   [['📈','Performance','Engineered for speed — your users will never wait.'],
                        ['🔒','Security','Enterprise-grade security baked in from day one.'],
                        ['🌍','Scale','Infrastructure that grows with you — anywhere in the world.']],
            blog:      [['✍️','Writing','In-depth articles that inform and inspire.'],
                        ['🔍','Research','Every post backed by solid research and real-world insights.'],
                        ['💡','Ideas','Fresh perspectives on the topics that matter most.']],
            ecommerce: [['🌿','Quality','Every product hand-picked for exceptional quality.'],
                        ['🚚','Fast Shipping','Free shipping on orders over $50.'],
                        ['♻️','Sustainable','Committed to eco-friendly packaging and practices.']],
            saas:      [['⚡','Speed','Ship faster with automation that does the heavy lifting.'],
                        ['🔐','Privacy','Your data is always encrypted and never shared.'],
                        ['🤝','Partnership','Dedicated support for every plan, every step of the way.']],
            builder:   [['🧩','Flexibility','Build any type of app — no limits, no lock-in.'],
                        ['⚡','Speed','Go from idea to live app in under 5 minutes.'],
                        ['☁️','Hosting','One-click publish with global CDN included.']],
            custom:    [['💡','Vision','Big ideas backed by clear strategy and purposeful execution.'],
                        ['🛠️','Craft','Every detail considered, every interaction refined.'],
                        ['🤝','Partnership','We work closely with you from concept through launch.']]
        };
        const aRows = aboutRows[appType] || aboutRows.custom;
        const aboutTitle = { portfolio: 'Who I Am', blog: 'About This Blog' };
        s.about = { id: 'about', label: 'About', icon: '👥', html: `<section id="about">
  <div class="section">
    <p class="section-label">About</p>
    <div class="divider"></div>
    <h2 class="section-title">${aboutTitle[appType] || 'About Us'}</h2>
    <p class="section-sub">${aboutDesc || 'We deliver exceptional digital experiences through thoughtful design and solid engineering.'}</p>
    <div class="card-grid">${aRows.map(([icon, title, desc]) => `<div class="card"><div class="card-icon">${icon}</div><h3>${title}</h3><p>${desc}</p></div>`).join('')}</div>
  </div>
</section>` };

        // ── FEATURES ──────────────────────────────────────────────────────────
        const iconSets = {
            portfolio: ['🖥️','📱','🎬','🔧','💡','🌐'],
            landing:   ['⚡','🛡️','📊','🔗','🎯','🧩'],
            saas:      ['⚡','🔐','📊','🤝','🌍','🔗'],
            ecommerce: ['🛍️','💳','🚚','🔒','⭐','🎁'],
            builder:   ['🧩','⚡','🎨','📦','🔗','☁️'],
            custom:    ['✨','🔧','📡','🎯','🌐','🔐']
        };
        s.features = { id: 'features', label: 'Features', icon: '⚡', html: `<section id="features">
  <div class="section">
    <p class="section-label">Features</p>
    <div class="divider"></div>
    <h2 class="section-title">${appType === 'ecommerce' ? 'Why Shop With Us' : 'Everything You Need'}</h2>
    <p class="section-sub">Packed with capabilities that help you move faster, work smarter, and build better.</p>
    <div class="card-grid">${featureCards(iconSets[appType] || iconSets.custom)}</div>
  </div>
</section>` };

        // ── WORK (portfolio) ──────────────────────────────────────────────────
        s.work = { id: 'work', label: 'Work / Projects', icon: '💼', html: `<section id="work">
  <div class="section">
    <p class="section-label">Portfolio</p>
    <div class="divider"></div>
    <h2 class="section-title">Selected Work</h2>
    <p class="section-sub">A curated collection of projects showcasing ${featureItems.slice(0, 3).join(', ')}.</p>
    <div class="card-grid">${featureItems.map((f, i) => `<div class="card"><div class="card-icon">${['🖥️','📱','🎬','🔧','💡','🌐'][i % 6]}</div><h3>Project ${i + 1}: ${f}</h3><p>${featureDescs[i] || `An in-depth exploration of ${f.toLowerCase()} — designed, built, and deployed with care.`}</p></div>`).join('')}</div>
  </div>
</section>` };

        // ── SKILLS (portfolio) ────────────────────────────────────────────────
        const skillsList = featureItems.length >= 4 ? featureItems : [...featureItems, 'Problem Solving', 'Communication', 'Leadership'];
        s.skills = { id: 'skills', label: 'Skills', icon: '⚙️', html: `<section id="skills">
  <div class="section">
    <p class="section-label">Skills</p>
    <div class="divider"></div>
    <h2 class="section-title">What I Bring</h2>
    <p class="section-sub">A versatile skill set developed through years of hands-on projects and continuous learning.</p>
    <div class="card-grid">${skillsList.map((sk, i) => `<div class="card" style="text-align:center"><div class="card-icon">${['💻','🎨','📊','🚀','🔧','💡','🌐','📱'][i % 8]}</div><h3>${sk}</h3><div style="margin-top:0.75rem;background:var(--accent-dim);border-radius:8px;height:6px"><div style="background:var(--accent);height:6px;border-radius:8px;width:${60 + (i * 13) % 35}%;box-shadow:0 0 8px var(--accent)"></div></div></div>`).join('')}</div>
  </div>
</section>` };

        // ── PRICING ───────────────────────────────────────────────────────────
        s.pricing = { id: 'pricing', label: 'Pricing', icon: '💰', html: `<section id="pricing">
  <div class="section">
    <p class="section-label">Pricing</p>
    <div class="divider"></div>
    <h2 class="section-title">Simple, Transparent Pricing</h2>
    <p class="section-sub">${pricingTease || 'Start free, upgrade as you grow.'}</p>
    <div class="card-grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      ${pricingTiers.map(tier => `<div class="card${tier.highlight ? '' : ''}" style="text-align:center;position:relative${tier.highlight ? ';border-color:var(--accent);box-shadow:0 0 30px var(--accent-dim)' : ''}">
        ${tier.highlight ? '<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--accent);color:#000;font-size:0.62rem;font-weight:700;padding:0.2rem 0.85rem;border-radius:20px;letter-spacing:1px;white-space:nowrap">MOST POPULAR</div>' : ''}
        <h3 style="font-size:1.1rem;margin-bottom:0.5rem">${tier.name}</h3>
        <div style="font-size:2.2rem;font-weight:900;color:var(--accent);margin:0.75rem 0">${tier.price}<span style="font-size:0.82rem;font-weight:400;color:var(--muted)">${tier.period}</span></div>
        <ul style="list-style:none;margin:1rem 0;text-align:left">${tier.features.map(f => `<li style="font-size:0.76rem;color:var(--muted);padding:0.3rem 0;border-bottom:1px solid var(--accent-border)">✓ ${f}</li>`).join('')}</ul>
        <a class="btn${tier.outline ? ' btn-outline' : ''}" href="#contact" style="font-size:0.76rem;padding:0.65rem 1.5rem;margin-top:1rem;display:inline-block">${tier.cta}</a>
      </div>`).join('')}
    </div>
  </div>
</section>` };

        // ── TESTIMONIALS ──────────────────────────────────────────────────────
        s.testimonials = { id: 'testimonials', label: 'Testimonials', icon: '💬', html: `<section id="testimonials">
  <div class="section">
    <p class="section-label">Testimonials</p>
    <div class="divider"></div>
    <h2 class="section-title">What People Say</h2>
    <p class="section-sub">Don't take our word for it — here's what our community thinks.</p>
    <div class="card-grid">${testimonials.map(tm => `<div class="card">
      <div style="font-size:1.3rem;color:var(--accent);margin-bottom:0.75rem">★★★★★</div>
      <p style="font-size:0.83rem;color:var(--muted);line-height:1.7;font-style:italic;margin-bottom:1rem">"${tm.text}"</p>
      <div style="display:flex;align-items:center;gap:0.75rem">
        <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-dim);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;color:var(--accent)">${tm.name[0]}</div>
        <div><p style="font-size:0.78rem;font-weight:700;color:var(--accent)">${tm.name}</p><p style="font-size:0.68rem;color:var(--muted)">${tm.role}</p></div>
      </div>
    </div>`).join('')}</div>
  </div>
</section>` };

        // ── FAQ ───────────────────────────────────────────────────────────────
        s.faq = { id: 'faq', label: 'FAQ', icon: '❓', html: `<section id="faq">
  <div class="section">
    <p class="section-label">FAQ</p>
    <div class="divider"></div>
    <h2 class="section-title">Frequently Asked Questions</h2>
    <p class="section-sub">Everything you need to know to get started with confidence.</p>
    <div style="max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:1rem">
      ${faqItems.map((item, i) => `<div class="card" style="cursor:pointer" onclick="const a=this.querySelector('.fa');a.style.display=a.style.display==='none'?'block':'none'">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <h3 style="font-size:0.88rem">${item.q}</h3>
          <span style="color:var(--accent);font-size:1.2rem;margin-left:1rem;flex-shrink:0">+</span>
        </div>
        <p class="fa" style="display:${i === 0 ? 'block' : 'none'};margin-top:0.75rem;font-size:0.8rem;color:var(--muted);line-height:1.7">${item.a}</p>
      </div>`).join('')}
    </div>
  </div>
</section>` };

        // ── GALLERY ───────────────────────────────────────────────────────────
        s.gallery = { id: 'gallery', label: 'Gallery', icon: '🖼️', html: `<section id="gallery">
  <div class="section">
    <p class="section-label">Gallery</p>
    <div class="divider"></div>
    <h2 class="section-title">Visual Showcase</h2>
    ${galleryHTML}
  </div>
</section>` };

        // ── BLOG: RECENT POSTS ────────────────────────────────────────────────
        const blogCats = featureItems.length ? featureItems : ['Technology', 'Design', 'Business', 'Lifestyle'];
        s.recentPosts = { id: 'recentPosts', label: 'Recent Posts', icon: '📝', html: `<section id="recentPosts">
  <div class="section">
    <p class="section-label">Latest</p>
    <div class="divider"></div>
    <h2 class="section-title">Recent Posts</h2>
    <div class="card-grid">${blogCats.slice(0, 3).map((cat, i) => `<div class="card">
      <div style="font-size:0.62rem;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:0.75rem">${cat}</div>
      <h3 style="margin-bottom:0.5rem;line-height:1.3">The Complete Guide to ${cat} in ${new Date().getFullYear()}</h3>
      <p style="font-size:0.78rem;color:var(--muted);line-height:1.6;margin-bottom:1rem">Explore the latest trends, best practices, and actionable insights in ${cat.toLowerCase()}.</p>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:0.68rem;color:var(--muted)">${new Date(Date.now() - i * 86400000 * 3).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
        <a href="#" style="font-size:0.73rem;color:var(--accent)">Read more →</a>
      </div>
    </div>`).join('')}</div>
  </div>
</section>` };

        // ── BLOG: CATEGORIES ──────────────────────────────────────────────────
        s.categories = { id: 'categories', label: 'Categories', icon: '🏷️', html: `<section id="categories">
  <div class="section">
    <p class="section-label">Explore</p>
    <div class="divider"></div>
    <h2 class="section-title">Browse by Category</h2>
    <div class="card-grid">${blogCats.map((cat, i) => `<div class="card" style="text-align:center;cursor:pointer"><div class="card-icon">${['💻','🎨','📊','🚀','🔧','💡','🌐','📱'][i % 8]}</div><h3>${cat}</h3><p>${5 + i * 3} articles</p></div>`).join('')}</div>
  </div>
</section>` };

        // ── BLOG: NEWSLETTER ──────────────────────────────────────────────────
        s.newsletter = { id: 'newsletter', label: 'Newsletter', icon: '📨', html: `<section id="newsletter">
  <div class="section" style="text-align:center">
    <p class="section-label">Newsletter</p>
    <div class="divider"></div>
    <h2 class="section-title">Stay in the Loop</h2>
    <p class="section-sub">Get the latest posts delivered straight to your inbox — no spam, unsubscribe anytime.</p>
    <form style="display:flex;gap:0.75rem;max-width:480px;margin:0 auto;flex-wrap:wrap;justify-content:center" onsubmit="return false">
      <input type="email" placeholder="your@email.com" style="flex:1;min-width:220px">
      <button type="submit" class="btn" style="font-size:0.8rem;padding:0.8rem 1.8rem">Subscribe</button>
    </form>
    <p style="font-size:0.7rem;color:var(--muted);margin-top:1rem">Join 2,400+ readers. Delivered weekly.</p>
  </div>
</section>` };

        // ── ECOMMERCE: FEATURED PRODUCTS ──────────────────────────────────────
        const productNames = featureItems.length >= 3 ? featureItems : ['Premium Bundle', 'Starter Kit', 'Pro Edition'];
        s.featuredProducts = { id: 'featuredProducts', label: 'Featured Products', icon: '🛍️', html: `<section id="featuredProducts">
  <div class="section">
    <p class="section-label">Shop</p>
    <div class="divider"></div>
    <h2 class="section-title">Featured Products</h2>
    <div class="card-grid">${productNames.slice(0, 4).map((name, i) => `<div class="card" style="padding:0;overflow:hidden">
      <div style="height:180px;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:3rem">${['🛍️','✨','💎','🎁'][i % 4]}</div>
      <div style="padding:1.25rem">
        <h3 style="font-size:0.9rem;margin-bottom:0.3rem">${name}</h3>
        <p style="font-size:0.75rem;color:var(--muted);margin-bottom:0.75rem">${featureDescs[i] || `Premium quality ${name.toLowerCase()} designed to exceed expectations.`}</p>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:1.1rem;font-weight:700;color:var(--accent)">$${29 + i * 20}.00</span>
          <button class="btn" style="font-size:0.7rem;padding:0.4rem 1rem;border:none;cursor:pointer">Add to Cart</button>
        </div>
      </div>
    </div>`).join('')}</div>
  </div>
</section>` };

        // ── BUILDER: DEMO ─────────────────────────────────────────────────────
        s.demo = { id: 'demo', label: 'Live Demo', icon: '🖥️', html: `<section id="demo">
  <div class="section">
    <p class="section-label">Live Demo</p>
    <div class="divider"></div>
    <h2 class="section-title">See It in Action</h2>
    <p class="section-sub">A simulated preview of the ${appName} builder interface.</p>
    <div style="background:var(--surface);border:1px solid var(--accent-border);border-radius:20px;padding:2rem;display:grid;grid-template-columns:200px 1fr;gap:1.5rem;min-height:300px">
      <div style="border-right:1px solid var(--accent-border);padding-right:1.5rem">
        <p style="font-size:0.62rem;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem">Components</p>
        ${['Layout','Typography','Media','Forms','Navigation'].map(c => `<div style="padding:0.6rem 1rem;margin-bottom:0.5rem;border-radius:8px;background:var(--accent-dim);font-size:0.78rem;cursor:pointer">${c}</div>`).join('')}
      </div>
      <div>
        <p style="font-size:0.62rem;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:1.5rem">Canvas</p>
        <div style="border:2px dashed var(--accent-border);border-radius:12px;height:200px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:0.83rem">Drop components here to build your layout</div>
      </div>
    </div>
  </div>
</section>` };

        // ── CONTACT ───────────────────────────────────────────────────────────
        const contactDescs = {
            portfolio: contactDesc || 'Have a project in mind? I&apos;d love to hear about it. Let&apos;s create something great.',
            landing:   contactDesc || `Join thousands of teams already using ${appName} to build the next big thing.`,
            blog:      contactDesc || 'Have a story tip, a collab idea, or just want to say hello? Drop me a line!',
            ecommerce: contactDesc || 'Questions about an order or a product? Our team is here to help 24/7.',
            saas:      contactDesc || `Ready to see what ${appName} can do for your team? Let&apos;s talk.`,
            builder:   contactDesc || 'No credit card required. Get your first app live in under 5 minutes.',
            custom:    contactDesc || 'Have a question or want to work together? We&apos;d love to hear from you.'
        };
        const contactTitles = {
            saas: 'Ready to Get Started?', landing: 'Ready to Launch?',
            portfolio: "Let's Work Together", blog: 'Get In Touch'
        };
        s.contact = { id: 'contact', label: 'Contact', icon: '📧', html: `<section id="contact">
  <div class="section" style="text-align:center">
    <p class="section-label">Contact</p>
    <div class="divider"></div>
    <h2 class="section-title">${contactTitles[appType] || 'Get In Touch'}</h2>
    <p class="section-sub">${contactDescs[appType] || contactDescs.custom}</p>
    <a class="btn" href="mailto:hello@example.com">Send a Message</a>
  </div>
</section>` };

        return s;
    }

    // ── Section reorder UI ────────────────────────────────────────────────────
    function updateSectionOrderUI() {
        if (!sectionOrder.length) { reorderSection.style.display = 'none'; return; }
        reorderSection.style.display = '';

        sectionOrderList.innerHTML = sectionOrder.map((sec, i) => `
        <div class="section-order-item" draggable="true" data-index="${i}" data-id="${sec.id}">
            <span class="section-drag-handle">⠿⠿</span>
            <span class="section-order-icon">${sec.icon}</span>
            <span class="section-order-label">${sec.label}</span>
        </div>`).join('');

        let dragSrc = null;

        sectionOrderList.querySelectorAll('.section-order-item').forEach(item => {
            item.addEventListener('dragstart', e => {
                dragSrc = +item.dataset.index;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                sectionOrderList.querySelectorAll('.section-order-item').forEach(i => i.classList.remove('drag-over'));
            });
            item.addEventListener('dragover', e => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                sectionOrderList.querySelectorAll('.section-order-item').forEach(i => i.classList.remove('drag-over'));
                item.classList.add('drag-over');
            });
            item.addEventListener('drop', e => {
                e.preventDefault();
                const target = +item.dataset.index;
                if (dragSrc === null || dragSrc === target) return;
                const moved = sectionOrder.splice(dragSrc, 1)[0];
                sectionOrder.splice(target, 0, moved);
                dragSrc = null;
                assembleAndPreview();
                updateSectionOrderUI();
            });
        });
    }

    // ── Assemble and preview ──────────────────────────────────────────────────
    function assembleAndPreview() {
        if (!sectionOrder.length) return;
        const body = sectionOrder.map(s => s.html).join('\n');
        const full = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${document.getElementById('appName').value.trim()}</title>
  ${generatedFontTag}
  <style>${generatedBaseCSS}</style>
</head>
<body>
${navHTML}
${body}
${footerHTML}
</body>
</html>`;
        previewFrame.srcdoc = full;
        generatedAppHTML = full;
    }

    // ── Main doGenerate ───────────────────────────────────────────────────────
    function doGenerate(aiContent) {
        const appName  = document.getElementById('appName').value.trim();
        const appType  = document.getElementById('appType').value;
        const features = document.getElementById('features').value.trim();
        const theme    = document.getElementById('theme').value;
        const font     = fontFamilySelect.value;
        const accent   = accentColorInput.value;

        saveProjectToStorage(appName, appType, features, theme, font, accent);

        // Build theme with custom accent override
        const baseTheme = THEMES[theme] || THEMES['neon-cyber'];
        const t = Object.assign({}, baseTheme);
        if (accent !== baseTheme.accent) {
            t.accent = accent;
            const r = parseInt(accent.slice(1, 3), 16);
            const g = parseInt(accent.slice(3, 5), 16);
            const b = parseInt(accent.slice(5, 7), 16);
            t.accentDim    = `rgba(${r},${g},${b},0.15)`;
            t.accentBorder = `rgba(${r},${g},${b},0.4)`;
        }

        const fontName   = font.replace(/\+/g, ' ');
        const fontStack  = font === 'Space+Mono' ? 'monospace' : font === 'Playfair+Display' ? 'serif' : 'sans-serif';
        const fontWeight = font === 'Playfair+Display' ? '400;700' : '400;700;900';
        generatedFontTag = `<link href="https://fonts.googleapis.com/css2?family=${font}:wght@${fontWeight}&display=swap" rel="stylesheet">`;

        generatedBaseCSS = `
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
    body { font-family: '${fontName}', ${fontStack}; background: ${t.bg}; color: var(--text); min-height: 100vh; overflow-x: hidden; }
    a { color: var(--accent); text-decoration: none; }
    nav { position: fixed; top: 0; width: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); z-index: 100; border-bottom: 1px solid var(--accent-border); }
    .nav-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 2rem; }
    .nav-brand { font-size: 1.1rem; font-weight: 700; color: var(--accent); letter-spacing: 2px; }
    .nav-links { display: flex; gap: 2rem; list-style: none; }
    .nav-links a { font-size: 0.8rem; letter-spacing: 1px; transition: color 0.2s; opacity: 0.8; }
    .nav-links a:hover { color: var(--accent); opacity: 1; }
    .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 8rem 2rem 4rem; }
    .hero-eyebrow { font-size: 0.75rem; letter-spacing: 4px; text-transform: uppercase; color: var(--accent); margin-bottom: 1.5rem; opacity: 0.85; }
    .hero h1 { font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 900; line-height: 1.05; letter-spacing: -1px; text-shadow: 0 0 40px var(--accent); margin-bottom: 1.5rem; }
    .hero p { font-size: clamp(0.9rem, 2vw, 1.15rem); color: var(--muted); max-width: 600px; line-height: 1.7; margin-bottom: 2.5rem; }
    .btn { display: inline-block; background: var(--accent); color: #000; font-family: inherit; font-weight: 700; font-size: 0.85rem; letter-spacing: 2px; text-transform: uppercase; padding: 0.9rem 2.5rem; border-radius: 50px; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 0 20px var(--accent-border); }
    .btn:hover { transform: scale(1.05); box-shadow: 0 0 35px var(--accent); }
    .btn-outline { background: transparent; color: var(--accent); border: 2px solid var(--accent); }
    .btn-outline:hover { background: var(--accent-dim); }
    .section { padding: 6rem 2rem; max-width: 1100px; margin: 0 auto; }
    .section-label { text-align: center; font-size: 0.7rem; letter-spacing: 4px; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; }
    .section-title { text-align: center; font-size: clamp(1.8rem, 4vw, 3rem); margin-bottom: 1rem; text-shadow: 0 0 15px var(--accent-border); }
    .section-sub { text-align: center; color: var(--muted); font-size: 0.95rem; line-height: 1.7; max-width: 600px; margin: 0 auto 3.5rem; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
    .card { background: var(--surface); border: 1px solid var(--accent-border); border-radius: 16px; padding: 2rem 1.75rem; transition: transform 0.25s, box-shadow 0.25s; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px var(--accent-dim); }
    .card-icon { font-size: 2rem; margin-bottom: 1rem; }
    .card h3 { font-size: 1rem; letter-spacing: 1px; margin-bottom: 0.65rem; color: var(--accent); }
    .card p { font-size: 0.85rem; color: var(--muted); line-height: 1.6; }
    .divider { width: 60px; height: 3px; background: var(--accent); margin: 0 auto 1rem; border-radius: 2px; box-shadow: 0 0 10px var(--accent); }
    footer { text-align: center; padding: 3rem 2rem; background: rgba(0,0,0,0.6); border-top: 1px solid var(--accent-border); }
    footer p { font-size: 0.75rem; color: var(--muted); letter-spacing: 1px; }
    footer .footer-brand { color: var(--accent); font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    input, textarea { background: var(--surface); border: 1px solid var(--accent-border); color: var(--text); border-radius: 8px; padding: 0.75rem 1rem; font-family: inherit; font-size: 0.85rem; width: 100%; outline: none; }
    input:focus, textarea:focus { border-color: var(--accent); }
    @media (max-width: 768px) { .nav-links { display: none; } .card-grid { grid-template-columns: 1fr; } }`;

        const navLinks = {
            portfolio: [['#about','About'],['#work','Work'],['#contact','Contact']],
            landing:   [['#features','Features'],['#pricing','Pricing'],['#contact','Contact']],
            blog:      [['#recentPosts','Posts'],['#categories','Topics'],['#newsletter','Subscribe']],
            ecommerce: [['#featuredProducts','Shop'],['#about','About'],['#contact','Contact']],
            saas:      [['#features','Features'],['#pricing','Pricing'],['#contact','Contact']],
            builder:   [['#features','Features'],['#demo','Demo'],['#pricing','Pricing']],
            custom:    [['#about','About'],['#features','Features'],['#contact','Contact']]
        };
        const links = navLinks[appType] || navLinks.custom;
        navHTML = `<nav>
  <div class="nav-inner">
    <span class="nav-brand">${appName}</span>
    <ul class="nav-links">${links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
  </div>
</nav>`;
        footerHTML = `<footer>
  <p class="footer-brand">${appName}</p>
  <p>Built with Lavaz Studio &mdash; Lavaz Life Designs &copy; ${new Date().getFullYear()}</p>
</footer>`;

        const featureItems = features
            ? features.split(',').map(f => f.trim()).filter(Boolean)
            : ['Responsive Layout', 'Modern Design', 'Fast Performance'];

        const allSections = buildAllSections(appType, appName, t, featureItems, aiContent);
        const defs = SECTION_DEFS[appType] || SECTION_DEFS.custom;
        const enabled = getEnabledSectionIds();

        sectionOrder = defs
            .filter(def => enabled.includes(def.id) && allSections[def.id])
            .map(def => allSections[def.id]);

        // Auto-add gallery if user has uploads and it wasn't already listed
        if (uploadedAssets.length && !sectionOrder.find(s => s.id === 'gallery') && allSections.gallery) {
            sectionOrder.push(allSections.gallery);
        }

        updateSectionOrderUI();
        assembleAndPreview();
        downloadBtn.disabled = false;
        deployBtn.disabled   = false;
        downloadStatus.textContent = `Generated: ${appName} (${appType})`;
        generatedAppFilename = (appName || 'app').replace(/\s+/g, '-').toLowerCase();
    }

    // ── Download ──────────────────────────────────────────────────────────────
    downloadBtn.addEventListener('click', async () => {
        if (!generatedAppHTML) return;
        if (downloadFormat && downloadFormat.value === 'zip') {
            await downloadAsZip();
        } else {
            downloadAsHTML();
        }
    });

    function downloadAsHTML() {
        const link = document.createElement('a');
        link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(generatedAppHTML);
        link.download = generatedAppFilename + '.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloadStatus.textContent = `Downloaded: ${generatedAppFilename}.html`;
    }

    async function downloadAsZip() {
        const zip = new JSZip();
        zip.file('index.html', generatedAppHTML);
        if (uploadedAssets.length) {
            const folder = zip.folder('assets');
            uploadedAssets.forEach(a => folder.file(a.name, a.dataUrl.split(',')[1], { base64: true }));
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = generatedAppFilename + '.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        downloadStatus.textContent = `Downloaded: ${generatedAppFilename}.zip`;
    }

    async function buildZipBlob() {
        const zip = new JSZip();
        zip.file('index.html', generatedAppHTML);
        if (uploadedAssets.length) {
            const folder = zip.folder('assets');
            uploadedAssets.forEach(a => folder.file(a.name, a.dataUrl.split(',')[1], { base64: true }));
        }
        return zip.generateAsync({ type: 'blob' });
    }

    // ── Deploy modal ──────────────────────────────────────────────────────────
    deployBtn.addEventListener('click', () => {
        if (!generatedAppHTML) return;
        deployModal.style.display = 'flex';
    });

    closeDeployModal.addEventListener('click', () => { deployModal.style.display = 'none'; });
    deployModal.addEventListener('click', e => { if (e.target === deployModal) deployModal.style.display = 'none'; });

    document.querySelectorAll('.deploy-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.deploy-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.deploy-tab-content').forEach(c => c.style.display = 'none');
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).style.display = '';
        });
    });

    // ── GitHub Pages deploy ───────────────────────────────────────────────────
    document.getElementById('deployGithubBtn').addEventListener('click', async () => {
        const token    = document.getElementById('ghToken').value.trim();
        const repoName = (document.getElementById('ghRepo').value.trim() || generatedAppFilename).replace(/[^a-z0-9._-]/gi, '-');
        const status   = document.getElementById('githubDeployStatus');

        if (!token) { status.textContent = '⚠ Please enter your GitHub Personal Access Token.'; status.className = 'deploy-status error'; return; }
        if (!generatedAppHTML) { status.textContent = '⚠ Generate your app first.'; status.className = 'deploy-status error'; return; }

        const btn = document.getElementById('deployGithubBtn');
        btn.textContent = '⏳ Deploying…';
        btn.disabled = true;
        status.className = 'deploy-status';
        status.textContent = 'Verifying token…';

        try {
            const userRes = await fetch('https://api.github.com/user', {
                headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'LavazStudio' }
            });
            if (!userRes.ok) throw new Error('Invalid GitHub token or insufficient permissions. Ensure it has the "repo" scope.');
            const user = await userRes.json();
            const owner = user.login;

            status.textContent = 'Creating repository…';
            const createRes = await fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'LavazStudio' },
                body: JSON.stringify({ name: repoName, description: 'Built with Lavaz Studio', private: false, auto_init: false })
            });
            if (!createRes.ok) {
                const err = await createRes.json();
                throw new Error(err.errors?.[0]?.message || err.message || 'Failed to create repository.');
            }

            status.textContent = 'Uploading index.html…';
            const content = btoa(new TextEncoder().encode(generatedAppHTML).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/index.html`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'LavazStudio' },
                body: JSON.stringify({ message: 'Initial deploy via Lavaz Studio', content })
            });
            if (!commitRes.ok) {
                const err = await commitRes.json();
                throw new Error(err.message || 'Failed to commit file.');
            }

            status.textContent = 'Enabling GitHub Pages…';
            await fetch(`https://api.github.com/repos/${owner}/${repoName}/pages`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'LavazStudio', Accept: 'application/vnd.github+json' },
                body: JSON.stringify({ source: { branch: 'main', path: '/' } })
            });

            const siteUrl = `https://${owner}.github.io/${repoName}/`;
            status.innerHTML = `✅ Deployed! Your site will be live shortly at:<br><a href="${siteUrl}" target="_blank">${siteUrl}</a><br><small style="color:var(--muted)">GitHub Pages may take 1–2 minutes to go live.</small>`;
            status.className = 'deploy-status success';
        } catch (err) {
            status.textContent = '❌ ' + err.message;
            status.className = 'deploy-status error';
        } finally {
            btn.textContent = 'Deploy to GitHub Pages';
            btn.disabled = false;
        }
    });

    // ── Netlify deploy ────────────────────────────────────────────────────────
    document.getElementById('deployNetlifyBtn').addEventListener('click', async () => {
        const token    = document.getElementById('netlifyToken').value.trim();
        const siteName = (document.getElementById('netlifySiteName').value.trim() || (generatedAppFilename + '-' + Date.now())).toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const status   = document.getElementById('netlifyDeployStatus');

        if (!token) { status.textContent = '⚠ Please enter your Netlify Access Token.'; status.className = 'deploy-status error'; return; }
        if (!generatedAppHTML) { status.textContent = '⚠ Generate your app first.'; status.className = 'deploy-status error'; return; }

        const btn = document.getElementById('deployNetlifyBtn');
        btn.textContent = '⏳ Deploying…';
        btn.disabled = true;
        status.className = 'deploy-status';
        status.textContent = 'Creating Netlify site…';

        try {
            const createRes = await fetch('https://api.netlify.com/api/v1/sites', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: siteName })
            });
            if (!createRes.ok) {
                const err = await createRes.json();
                throw new Error(err.message || 'Failed to create Netlify site. The site name may already be taken.');
            }
            const site = await createRes.json();

            status.textContent = 'Uploading files…';
            const zipBlob = await buildZipBlob();
            const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/deploys`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/zip' },
                body: zipBlob
            });
            if (!deployRes.ok) {
                const err = await deployRes.json();
                throw new Error(err.message || 'Failed to deploy files to Netlify.');
            }

            const siteUrl = site.ssl_url || site.url || `https://${siteName}.netlify.app`;
            status.innerHTML = `✅ Deployed! Your site is live at:<br><a href="${siteUrl}" target="_blank">${siteUrl}</a>`;
            status.className = 'deploy-status success';
        } catch (err) {
            status.textContent = '❌ ' + err.message;
            status.className = 'deploy-status error';
        } finally {
            btn.textContent = 'Deploy to Netlify';
            btn.disabled = false;
        }
    });

    // Download for deploy (manual tab)
    document.getElementById('downloadForDeployBtn').addEventListener('click', () => { downloadAsHTML(); });

    // ── Smooth scroll ─────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
