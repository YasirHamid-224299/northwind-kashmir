const fs = require('fs');
const path = require('path');

const packageDirs = [
    'gulmarg-tour-package',
    'kashmir-honeymoon-package',
    'kashmir-tour-packages',
    'pahalgam-tour-package',
    'sonmarg-tour-package',
    'srinagar-tour-package'
];

packageDirs.forEach(dir => {
    const filePath = path.join(process.cwd(), dir, 'index.html');
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping: ${filePath} (not found)`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Desktop Nav Update
    const desktopTarget = '<a href="/gallery.html" class="transition hover:text-[#D4AF37]">Gallery</a>';
    const desktopReplacement = '<a href="/gondola.html" class="transition hover:text-[#D4AF37]">Gondola</a>\n                            <a href="/gallery.html" class="transition hover:text-[#D4AF37]">Gallery</a>';
    if (content.includes(desktopTarget) && !content.includes('/gondola.html" class="transition')) {
        content = content.replace(desktopTarget, desktopReplacement);
        changed = true;
    }

    // 2. Mobile Nav Update
    const mobileTarget = '<a href="/gallery.html"\n                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gallery</a>';
    const mobileTargetAlt = '<a href="/gallery.html"\n                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gallery</a>';
    const mobileReplacement = '<a href="/gondola.html"\n                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gondola</a>\n                        <a href="/gallery.html"\n                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gallery</a>';
    
    // Fallback simple replace for mobile
    const simpleMobileTarget = '<a href="/gallery.html"\n                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gallery</a>';
    
    // Let's do a regex or string search for the mobile menu links block
    const mobilePattern = /<a href="\/gallery\.html"\s+class="mobile-link[^"]*">Gallery<\/a>/g;
    if (content.match(mobilePattern) && !content.includes('href="/gondola.html"\n                            class="mobile-link')) {
        content = content.replace(mobilePattern, '<a href="/gondola.html"\n                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gondola</a>\n                        <a href="/gallery.html"\n                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gallery</a>');
        changed = true;
    }

    // 3. Footer Links Update
    const footerTarget = '<li><a href="/gallery.html" class="transition hover:text-[#D4AF37]">Gallery</a></li>';
    const footerReplacement = '<li><a href="/gondola.html" class="transition hover:text-[#D4AF37]">Gondola</a></li>\n                            <li><a href="/gallery.html" class="transition hover:text-[#D4AF37]">Gallery</a></li>';
    if (content.includes(footerTarget) && !content.includes('href="/gondola.html" class="transition hover:text-[#D4AF37]">Gondola')) {
        content = content.replace(footerTarget, footerReplacement);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully updated: ${filePath}`);
    } else {
        console.log(`No changes needed or matched: ${filePath}`);
    }
});
