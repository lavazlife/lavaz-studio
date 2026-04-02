document.addEventListener('DOMContentLoaded', () => {
    const appForm = document.getElementById('appForm');
    const assetGrid = document.getElementById('assetGrid');
    const previewFrame = document.getElementById('previewFrame');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadStatus = document.getElementById('downloadStatus');

    // Load assets preview (simulate with your files; in prod, use File API for uploads)
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

    appForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(appForm);
        const appName = document.getElementById('appName').value;
        const appType = document.getElementById('appType').value;
        const features = document.getElementById('features').value;
        const theme = document.getElementById('theme').value;

        // Generate preview HTML (simple template; extend for full logic)
        const generatedHTML = `
            <!DOCTYPE html>
            <html>
            <head><title>${appName}</title><style>body{font-family:Orbitron;background:linear-gradient(135deg,#0a0a0a,#1a0a2e);color:#fff;padding:2rem;}</style></head>
            <body>
                <h1>${appName}</h1>
                <p>Type: ${appType} | Features: ${features} | Theme: ${theme}</p>
                <img src="assets/logo-ln-circle.png" alt="Logo" style="width:200px;">
                <p>Full app generated! Responsive, polished, ready to deploy.</p>
            </body>
            </html>
        `;
        previewFrame.srcdoc = generatedHTML;

        // Enable download (simulate ZIP with JSZip in prod)
        downloadBtn.disabled = false;
        downloadStatus.textContent = `Generated: ${appName} (${appType})`;
    });

    downloadBtn.addEventListener('click', () => {
        // In production: Use JSZip to bundle index.html, css, js, assets
        const zipName = 'lavaz-generated-app.zip';
        downloadStatus.textContent = `Download ${zipName} (simulated - add JSZip lib for real export)`;
        // alert('ZIP ready! Implement JSZip.download() here.');
        const link = document.createElement('a');
        link.href = previewFrame.srcdoc ? 'data:text/html,' + encodeURIComponent(previewFrame.srcdoc) : '#';
        link.download = 'preview.html';
        link.click();
    });

    // Smooth scroll for nav
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
});