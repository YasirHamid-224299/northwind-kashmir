const fs = require('fs');
const path = require('path');

const root = process.cwd();

function getHtmlFiles(dir) {
    const files = [];
    for (const entry of fs.readdirSync(dir)) {
        if (['node_modules', 'dist'].includes(entry.toLowerCase()) || entry.startsWith('.')) continue;
        const file = path.join(dir, entry);
        if (fs.statSync(file).isDirectory()) files.push(...getHtmlFiles(file));
        else if (entry.endsWith('.html')) files.push(file);
    }
    return files;
}

const faq = `
                <div class="max-w-4xl mx-auto space-y-4">
                    <details class="group soft-panel p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-white transition duration-300 hover:shadow-lg" data-aos="fade-up">
                        <summary class="flex items-center justify-between gap-1.5 text-[#0B1F3A]"><h3 class="font-display text-lg font-bold">1. What is the best time to visit Kashmir?</h3><span class="text-[#D4AF37]"><i class="fas fa-plus group-open:hidden"></i><i class="fas fa-minus hidden group-open:inline"></i></span></summary>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">The best season depends on your plans: spring is good for gardens, summer for accessible meadows, autumn for clear scenery and winter for snow activities. Conditions vary by year and destination.</p>
                    </details>
                    <details class="group soft-panel p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-white transition duration-300 hover:shadow-lg" data-aos="fade-up">
                        <summary class="flex items-center justify-between gap-1.5 text-[#0B1F3A]"><h3 class="font-display text-lg font-bold">2. When can I expect snowfall?</h3><span class="text-[#D4AF37]"><i class="fas fa-plus group-open:hidden"></i><i class="fas fa-minus hidden group-open:inline"></i></span></summary>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">Snowfall is weather-dependent and cannot be guaranteed for a particular date. Check current forecasts and local advisories before travelling to high-altitude destinations.</p>
                    </details>
                    <details class="group soft-panel p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-white transition duration-300 hover:shadow-lg" data-aos="fade-up">
                        <summary class="flex items-center justify-between gap-1.5 text-[#0B1F3A]"><h3 class="font-display text-lg font-bold">3. How do I book Gulmarg Gondola tickets?</h3><span class="text-[#D4AF37]"><i class="fas fa-plus group-open:hidden"></i><i class="fas fa-minus hidden group-open:inline"></i></span></summary>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">Use the official <a class="text-[#D4AF37] underline" href="https://etickets.jammukashmircablecar.com/" target="_blank" rel="noopener noreferrer">J&amp;K Cable Car Corporation ticket portal</a>. Northwind Kashmir can help with itinerary and transport planning, but does not own or operate the government Gondola service.</p>
                    </details>
                    <details class="group soft-panel p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-white transition duration-300 hover:shadow-lg" data-aos="fade-up">
                        <summary class="flex items-center justify-between gap-1.5 text-[#0B1F3A]"><h3 class="font-display text-lg font-bold">4. Can you arrange airport pickup?</h3><span class="text-[#D4AF37]"><i class="fas fa-plus group-open:hidden"></i><i class="fas fa-minus hidden group-open:inline"></i></span></summary>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">Airport pickup can be requested as part of a customised itinerary. Vehicle type, timing and price are confirmed for your dates before booking.</p>
                    </details>
                    <details class="group soft-panel p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-white transition duration-300 hover:shadow-lg" data-aos="fade-up">
                        <summary class="flex items-center justify-between gap-1.5 text-[#0B1F3A]"><h3 class="font-display text-lg font-bold">5. Can you arrange hotels?</h3><span class="text-[#D4AF37]"><i class="fas fa-plus group-open:hidden"></i><i class="fas fa-minus hidden group-open:inline"></i></span></summary>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">We can suggest and request hotel options based on your route and budget. Facilities, rates and availability must be confirmed with the property for your dates.</p>
                    </details>
                    <details class="group soft-panel p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-white transition duration-300 hover:shadow-lg" data-aos="fade-up">
                        <summary class="flex items-center justify-between gap-1.5 text-[#0B1F3A]"><h3 class="font-display text-lg font-bold">6. Are family and honeymoon trips customisable?</h3><span class="text-[#D4AF37]"><i class="fas fa-plus group-open:hidden"></i><i class="fas fa-minus hidden group-open:inline"></i></span></summary>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">Yes. Routes, pacing, room preferences and activities can be discussed for a family, honeymoon or private trip. Final inclusions depend on the confirmed itinerary.</p>
                    </details>
                    <details class="group soft-panel p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-white transition duration-300 hover:shadow-lg" data-aos="fade-up">
                        <summary class="flex items-center justify-between gap-1.5 text-[#0B1F3A]"><h3 class="font-display text-lg font-bold">7. Which payment methods are available?</h3><span class="text-[#D4AF37]"><i class="fas fa-plus group-open:hidden"></i><i class="fas fa-minus hidden group-open:inline"></i></span></summary>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">Available payment methods and any advance required are explained in the quotation. Confirm payment details directly with Northwind Kashmir before transferring funds.</p>
                    </details>
                    <details class="group soft-panel p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-white transition duration-300 hover:shadow-lg" data-aos="fade-up">
                        <summary class="flex items-center justify-between gap-1.5 text-[#0B1F3A]"><h3 class="font-display text-lg font-bold">8. What is the cancellation policy?</h3><span class="text-[#D4AF37]"><i class="fas fa-plus group-open:hidden"></i><i class="fas fa-minus hidden group-open:inline"></i></span></summary>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600">Cancellation and refund terms vary by hotel, transport provider, Gondola ticket and package. They are shared with the booking confirmation; ask for the applicable terms before paying.</p>
                    </details>
                </div>`;

const routeCorrections = [
    ['/packages/kashmir-tour-cost/', '/packages/kashmir-tour-packages/'],
    ['/packages/srinagar-tour-package/', '/packages/kashmir-tour-packages/'],
    ['/packages/gulmarg-tour-package/', '/packages/kashmir-tour-packages/'],
    ['/packages/pahalgam-tour-package/', '/packages/kashmir-tour-packages/'],
    ['/packages/sonmarg-tour-package/', '/packages/kashmir-tour-packages/'],
    ['/srinagar-tourism/', '/destinations/srinagar-tourism/'],
    ['/gulmarg-tourism/', '/destinations/gulmarg-tourism/'],
    ['/pahalgam-tourism/', '/destinations/pahalgam-tourism/'],
    ['/sonmarg-tourism/', '/destinations/sonmarg-tourism/'],
    ['/gurez-tourism/', '/destinations/gurez-tourism/'],
    ['/doodhpathri-tourism/', '/destinations/doodhpathri-tourism/'],
    ['/yusmarg-tourism/', '/destinations/yusmarg-tourism/'],
    ['/gulmarg-gondola-booking/', '/gondola/gulmarg-gondola-booking/'],
    ['/gulmarg-gondola-tickets/', '/gondola/gulmarg-gondola-tickets/'],
    ['/gondola-faq/', '/gondola/gondola-faq/'],
    ['/gondola-guide/', '/gondola/gondola-guide/'],
    ['/gondola-phase-1/', '/gondola/gondola-phase-1/'],
    ['/gondola-phase-2/', '/gondola/gondola-phase-2/'],
    ['/gondola-prices/', '/gondola/gondola-prices/'],
    ['/gulmarg-hotels/', '/hotels/gulmarg-hotels/'],
    ['/pahalgam-hotels/', '/hotels/pahalgam-hotels/'],
    ['/sonmarg-hotels/', '/hotels/sonmarg-hotels/'],
    ['/srinagar-hotels/', '/hotels/srinagar-hotels/'],
    ['/kashmir-tour-packages/', '/packages/kashmir-tour-packages/'],
    ['/kashmir-adventure-package/', '/packages/kashmir-adventure-package/'],
    ['/kashmir-family-package/', '/packages/kashmir-family-package/'],
    ['/kashmir-group-tour-package/', '/packages/kashmir-group-tour-package/'],
    ['/kashmir-honeymoon-package/', '/packages/kashmir-honeymoon-package/'],
    ['/kashmir-luxury-package/', '/packages/kashmir-luxury-package/'],
    ['/kashmir-summer-package/', '/packages/kashmir-summer-package/'],
    ['/kashmir-winter-package/', '/packages/kashmir-winter-package/']
];

for (const file of getHtmlFiles(root)) {
    let html = fs.readFileSync(file, 'utf8');
    for (const [from, to] of routeCorrections) html = html.split(`href="${from}`).join(`href="${to}`);
    html = html
        .replace(/hero1\.jpg/g, 'hero1.webp')
        .replace(/Ajaz Ahmad Mir|Ajaz Ahmad/g, 'AJAZ AHMAD')
        .replace(/GSTIN:\s*01DUSPA3710C3ZA/gi, '')
        .replace(/\s*\(Ref:\s*JKT-10029-REGD-2022\)/gi, '')
        .replace(/government-licensed travel agency|tourism-registered tour operator/gi, 'local Kashmir travel-planning service')
        .replace(/24\/7(?: dedicated| on-ground)? (?:support|assistance|concierge service)/gi, 'responsive travel assistance during your confirmed arrangements')
        .replace(/dedicated 24\/7 on-ground concierge/gi, 'responsive local travel assistance')
        .replace(/24\/7 Room Service/gi, 'Room service')
        .replace(/24\/7 Hot Water/gi, 'Hot water subject to property confirmation')
        .replace(/guarantees direct, first-hand support/gi, 'can provide local travel-planning support')
        .replace(/government-registered guides/gi, 'guides subject to availability and confirmation')
        .replace(/verified (drivers|guides|logistics)/gi, 'carefully coordinated $1')
        .replace(/safe and comfortable travel experience/gi, 'well-planned travel arrangements');

    if (file === path.join(root, 'index.html')) {
        html = html.replace(/(<!-- Upgraded Accordion FAQ Section -->[\s\S]*?<div class="max-w-4xl mx-auto space-y-4">)[\s\S]*?(<\/section>)/, `$1\n${faq.replace(/^\s*<div class="max-w-4xl mx-auto space-y-4">|<\/div>$/, '')}\n                </div>\n            </div>\n        $2`);
        html = html.replace(/\n                <\/div>\n                <\/div>\n            <\/div>\n        <\/section>/, '\n                </div>\n            </div>\n        </section>');
        html = html.replace(/Jammu Tawi \(approximately 260 km from Srinagar\) remains a major well-connected railhead for onward road or air travel\./, 'Katra–Srinagar services now use the USBRL corridor, while connections from other Indian cities may still require a change at Jammu Tawi or another listed station. Check current Indian Railways schedules before travel.');
        html = html.replace(/A Kashmir tour package can range from INR 15,000 per person for budget options to over INR 75,000 per person for bespoke luxury tours\.[^"]*/g, 'Package pricing depends on dates, duration, occupancy, hotel availability, transport and confirmed inclusions. Request a written quotation for your itinerary.');
        html = html.replace(/Yes, Kashmir is exceptionally safe[^"]*/g, 'Kashmir travel conditions vary by route and season. Follow current government and local guidance, use reputable providers, and ask Northwind Kashmir to confirm the arrangements included in your itinerary.');
    }

    const relative = path.relative(root, file);
    if (relative.startsWith(`hotels${path.sep}`)) {
        html = html.replace(/<\/body>/, '<div class="mx-auto max-w-5xl px-4 pb-12 text-center text-sm text-gray-600"><strong>Rates and availability note:</strong> Hotel rates and availability may vary depending on travel dates, occupancy and season. Please contact us for the latest quotation. Rates are indicative unless confirmed in writing.</div>\n</body>');
    }
    if (relative.startsWith(`packages${path.sep}`)) {
        html = html.replace(/<\/body>/, '<div class="mx-auto max-w-5xl px-4 pb-12 text-center text-sm text-gray-600"><strong>Package pricing note:</strong> Package prices are indicative and may vary depending on travel dates, hotel availability, occupancy and seasonal demand. Contact us for a customized quotation. Inclusions and cancellation terms are confirmed with the final itinerary.</div>\n</body>');
    }
    if (relative === 'hotels.html') {
        html = html.replace(/<\/body>/, '<div class="mx-auto max-w-5xl px-4 pb-12 text-center text-sm text-gray-600"><strong>Rates and availability note:</strong> Hotel rates and availability may vary depending on travel dates, occupancy and season. Please contact us for the latest quotation. Listed rates are indicative per room per night unless confirmed.</div>\n</body>');
    }
    if (relative === 'packages.html') {
        html = html.replace(/<\/body>/, '<div class="mx-auto max-w-5xl px-4 pb-12 text-center text-sm text-gray-600"><strong>Package pricing note:</strong> Listed prices are indicative starting prices; the occupancy basis, meals, taxes, inclusions, and cancellation terms are confirmed in the quotation for your dates.</div>\n</body>');
    }
    if (relative === path.join('gondola', 'gulmarg-gondola-booking', 'index.html')) {
        html = html.replace(/Submit your details below to request ticket booking assistance and package customization via WhatsApp\./, 'Use the official J&amp;K Cable Car Corporation portal for Gondola tickets. Northwind Kashmir can assist with transport and itinerary planning; it does not own or operate the government Gondola service.');
    }

    fs.writeFileSync(file, html);
}

console.log(`Applied content corrections to ${getHtmlFiles(root).length} HTML files.`);
