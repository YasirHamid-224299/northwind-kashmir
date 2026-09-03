const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Master Templates (Absolute Root-Relative Links)
const MASTER_NAV_CONTENT = `
                <div class="mx-auto max-w-7xl px-3 sm:px-6 lg:px-12">
                    <div class="flex h-16 items-center justify-between sm:h-20">
                        <div class="flex items-center gap-3 sm:gap-4">
                            <a href="/" class="flex items-center gap-2 sm:gap-3">
                                <img src="/assets/images/logo/logo.png" alt="Northwind Kashmir Logo"
                                    class="h-10 sm:h-20 md:h-16 w-auto object-contain">
                                <span class="site-logo-text">
                                    <span class="text-[#D4AF37]">Northwind</span>
                                    <span class="text-white">Kashmir</span>
                                </span>
                            </a>
                        </div>

                        <div class="hidden items-center gap-8 text-sm font-medium md:flex">
                            <a href="/" class="transition hover:text-[#D4AF37]">Home</a>
                            <a href="/about.html" class="transition hover:text-[#D4AF37]">About</a>
                            <a href="/packages.html" class="transition hover:text-[#D4AF37]">Packages</a>
                            <a href="/hotels.html" class="transition hover:text-[#D4AF37]">Hotels</a>
                            <a href="/gulmarg-gondola-booking/" class="transition hover:text-[#D4AF37]">Gondola</a>
                            <a href="/plan-your-trip/" class="transition hover:text-[#D4AF37]">Planner</a>
                            <a href="/contact.html" class="transition hover:text-[#D4AF37]">Contact</a>
                            <a href="/packages.html"
                                class="rounded-full bg-[#D4AF37] px-5 py-2 font-semibold text-[#0B1F3A] transition duration-300 hover:bg-yellow-400">
                                Explore Packages
                            </a>
                        </div>
 
                        <div class="md:hidden">
                            <button id="menu-btn" class="site-menu-button" aria-label="Open menu">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
 
                <div id="mobile-menu" class="mobile-drawer">
                    <div class="py-6 space-y-3">
                        <a href="/"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Home</a>
                        <a href="/about.html"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">About</a>
                        <a href="/packages.html"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Packages</a>
                        <a href="/hotels.html"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Hotels</a>
                        <a href="/gulmarg-gondola-booking/"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gondola</a>
                        <a href="/plan-your-trip/"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Planner</a>
                        <a href="/trip-stories/"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Trip Stories</a>
                        <a href="/gallery.html"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Gallery</a>
                        <a href="/contact.html"
                            class="mobile-link block py-2 text-sm transition hover:text-[#D4AF37]">Contact</a>
                        <a href="/packages.html"
                            class="mobile-link mt-4 block rounded-full bg-[#D4AF37] py-3 text-center text-sm font-semibold text-[#0B1F3A] transition hover:bg-yellow-400">
                            Explore Packages
                        </a>
                    </div>
                </div>
`;

const MASTER_FOOTER_CONTENT = `
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 class="font-display text-xl font-bold text-[#D4AF37] sm:text-2xl">Northwind Kashmir</h3>
                        <p class="mt-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                            Beyond the itinerary, into Kashmir.
                        </p>
                        <ul class="mt-6 space-y-2 text-sm text-gray-400">
                            <li><i class="fas fa-phone mr-2 text-[#D4AF37]"></i> +91 9541615419</li>
                            <li><i class="fas fa-envelope mr-2 text-[#D4AF37]"></i> northwindkashmir@gmail.com</li>
                            <li><i class="fas fa-map-marker-alt mr-2 text-[#D4AF37]"></i> Chandilora, Tangmarg, Kashmir</li>
                        </ul>
                    </div>
 
                    <div>
                        <h4 class="mb-4 text-lg font-semibold sm:text-xl">Quick Links</h4>
                        <ul class="space-y-2 text-sm text-gray-300 sm:text-base">
                            <li><a href="/" class="transition hover:text-[#D4AF37]">Home</a></li>
                            <li><a href="/about.html" class="transition hover:text-[#D4AF37]">About</a></li>
                            <li><a href="/gallery.html" class="transition hover:text-[#D4AF37]">Gallery</a></li>
                            <li><a href="/trip-stories/" class="transition hover:text-[#D4AF37]">Trip Stories</a></li>
                            <li><a href="/plan-your-trip/" class="transition hover:text-[#D4AF37]">Trip Planner</a></li>
                            <li><a href="/kashmir-tour-cost/" class="transition hover:text-[#D4AF37]">Kashmir Tour Cost</a></li>
                            <li><a href="/kashmir-7-day-itinerary/" class="transition hover:text-[#D4AF37]">7-Day Kashmir Itinerary</a></li>
                            <li><a href="/contact.html" class="transition hover:text-[#D4AF37]">Contact</a></li>
                        </ul>
                        <h4 class="mt-6 mb-4 text-lg font-semibold sm:text-xl">Follow Us</h4>
                        <div class="flex gap-4 text-2xl">
                            <a href="https://www.instagram.com/northwindkashmiradventure/" target="_blank"
                                rel="noopener noreferrer" class="text-gray-300 transition hover:text-[#D4AF37]">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.facebook.com/p/North-Wind-100076957834119" target="_blank"
                                rel="noopener noreferrer" class="text-gray-300 transition hover:text-[#D4AF37]">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a href="https://www.youtube.com/@northwindkashmir5419" target="_blank"
                                rel="noopener noreferrer" class="text-gray-300 transition hover:text-[#D4AF37]">
                                <i class="fab fa-youtube"></i>
                            </a>
                            <a href="https://wa.me/919541615419" target="_blank" rel="noopener noreferrer"
                                class="text-green-300 transition hover:text-green-500">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
 
                    <div>
                        <h4 class="mb-4 text-lg font-semibold sm:text-xl">Destinations</h4>
                        <ul class="space-y-2 text-sm text-gray-300 sm:text-base">
                            <li><a href="/srinagar-tourism/" class="transition hover:text-[#D4AF37]">Srinagar Guide</a></li>
                            <li><a href="/gulmarg-tourism/" class="transition hover:text-[#D4AF37]">Gulmarg Guide</a></li>
                            <li><a href="/pahalgam-tourism/" class="transition hover:text-[#D4AF37]">Pahalgam Guide</a></li>
                            <li><a href="/sonmarg-tourism/" class="transition hover:text-[#D4AF37]">Sonmarg Guide</a></li>
                            <li><a href="/gurez-tourism/" class="transition hover:text-[#D4AF37]">Gurez Valley Guide</a></li>
                            <li><a href="/doodhpathri-tourism/" class="transition hover:text-[#D4AF37]">Doodhpathri Guide</a></li>
                            <li><a href="/yusmarg-tourism/" class="transition hover:text-[#D4AF37]">Yusmarg Guide</a></li>
                        </ul>
                    </div>
 
                    <div>
                        <h4 class="mb-4 text-lg font-semibold sm:text-xl">Theme Packages</h4>
                        <ul class="space-y-2 text-sm text-gray-300 sm:text-base">
                            <li><a href="/kashmir-honeymoon-package/" class="transition hover:text-[#D4AF37]">Honeymoon Package</a></li>
                            <li><a href="/kashmir-family-package/" class="transition hover:text-[#D4AF37]">Family Tour</a></li>
                            <li><a href="/kashmir-luxury-package/" class="transition hover:text-[#D4AF37]">Luxury Retreat</a></li>
                            <li><a href="/kashmir-winter-package/" class="transition hover:text-[#D4AF37]">Winter Package</a></li>
                            <li><a href="/kashmir-adventure-package/" class="transition hover:text-[#D4AF37]">Adventure Tour</a></li>
                            <li><a href="/gulmarg-gondola-booking/" class="transition hover:text-[#D4AF37]">Gondola Booking</a></li>
                            <li><a href="/hotels.html" class="transition hover:text-[#D4AF37]">Hotels Directory</a></li>
                        </ul>
                    </div>
                </div>
 
                <div class="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-400 sm:text-sm space-y-2">
                    <p>&copy; 2026 Northwind Kashmir. All Rights Reserved.</p>
                    <p class="text-gray-500 font-sans">Registered Office: Chandilora, Tangmarg, J&K. Proprietor: Ajaz Ahmad Mir | GSTIN: 01DUSPA3710C3ZA</p>
                </div>
            </div>
`;

// Helper to recursively find all HTML files
function getHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        // Skip build directories
        if (file.toLowerCase() === 'node_modules' || file.toLowerCase() === 'dist' || file.startsWith('.') || file.includes('_to_delete')) return;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHtmlFiles(filePath));
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    });
    return results;
}

// Perform replacements on all pages
const htmlFiles = getHtmlFiles(root);
console.log(`Found ${htmlFiles.length} HTML files to sync layouts.`);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace Navbar
    const navRegex = /<nav class="site-nav[^>]*>([\s\S]*?)<\/nav>/;
    if (content.match(navRegex)) {
        content = content.replace(navRegex, (match) => {
            // Retain classes but replace content
            const openingTag = match.match(/<nav class="site-nav[^>]*>/)[0];
            return `${openingTag}${MASTER_NAV_CONTENT}</nav>`;
        });
        changed = true;
    }

    // Replace Footer
    const footerRegex = /<footer class="bg-\[#0B1F3A\][^>]*>([\s\S]*?)<\/footer>/;
    if (content.match(footerRegex)) {
        content = content.replace(footerRegex, (match) => {
            const openingTag = match.match(/<footer class="bg-\[#0B1F3A\][^>]*>/)[0];
            return `${openingTag}${MASTER_FOOTER_CONTENT}</footer>`;
        });
        changed = true;
    }

    // Adjust scripts output.css paths for nested files vs root files
    // (If the file is in a nested folder, the output.css path should be /output.css)
    const relativePath = path.relative(root, file);
    const isNested = relativePath.includes(path.sep);

    if (isNested) {
        // Enforce root-relative path for output.css and main.js in nested files
        if (content.includes('href="output.css"')) {
            content = content.replace('href="output.css"', 'href="/output.css"');
            changed = true;
        }
        if (content.includes('href="../output.css"')) {
            content = content.replace('href="../output.css"', 'href="/output.css"');
            changed = true;
        }
        if (content.includes('src="assets/js/main.js"')) {
            content = content.replace('src="assets/js/main.js"', 'src="/assets/js/main.js"');
            changed = true;
        }
        if (content.includes('src="../assets/js/main.js"')) {
            content = content.replace('src="../assets/js/main.js"', 'src="/assets/js/main.js"');
            changed = true;
        }
        if (content.includes('src="assets/images/logo/logo.png"')) {
            content = content.replace('src="assets/images/logo/logo.png"', 'src="/assets/images/logo/logo.png"');
            changed = true;
        }
    }

    // Ensure every page exposes the brand icon in browser and search results.
    if (!content.includes('rel="icon"')) {
        content = content.replace('</head>', '    <link rel="icon" type="image/png" href="/assets/images/logo/logo.png">\n</head>');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Synced layout templates in: ${relativePath}`);
    }
});

console.log('Layout template synchronization completed successfully!');
