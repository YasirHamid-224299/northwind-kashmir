const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const replacements = [
    { from: 'href="/srinagar-tourism/"', to: 'href="/destinations/srinagar-tourism/"' },
    { from: 'href="/gulmarg-tourism/"', to: 'href="/destinations/gulmarg-tourism/"' },
    { from: 'href="/pahalgam-tourism/"', to: 'href="/destinations/pahalgam-tourism/"' },
    { from: 'href="/sonmarg-tourism/"', to: 'href="/destinations/sonmarg-tourism/"' },
    { from: 'href="/gurez-tourism/"', to: 'href="/destinations/gurez-tourism/"' },
    { from: 'href="/doodhpathri-tourism/"', to: 'href="/destinations/doodhpathri-tourism/"' },
    { from: 'href="/yusmarg-tourism/"', to: 'href="/destinations/yusmarg-tourism/"' },
    { from: 'href="/kashmir-tour-packages/"', to: 'href="/packages/kashmir-tour-packages/"' },
    { from: 'href="/kashmir-7-day-itinerary/"', to: 'href="/packages/kashmir-7-day-itinerary/"' },
    { from: 'href="/kashmir-adventure-package/"', to: 'href="/packages/kashmir-adventure-package/"' },
    { from: 'href="/kashmir-family-package/"', to: 'href="/packages/kashmir-family-package/"' },
    { from: 'href="/kashmir-group-tour-package/"', to: 'href="/packages/kashmir-group-tour-package/"' },
    { from: 'href="/kashmir-honeymoon-package/"', to: 'href="/packages/kashmir-honeymoon-package/"' },
    { from: 'href="/kashmir-luxury-package/"', to: 'href="/packages/kashmir-luxury-package/"' },
    { from: 'href="/kashmir-summer-package/"', to: 'href="/packages/kashmir-summer-package/"' },
    { from: 'href="/kashmir-winter-package/"', to: 'href="/packages/kashmir-winter-package/"' },
    { from: 'href="/kashmir-tour-cost/"', to: 'href="/packages/kashmir-tour-cost/"' },
    { from: 'href="/gulmarg-tour-package/"', to: 'href="/packages/gulmarg-tour-package/"' },
    { from: 'href="/pahalgam-tour-package/"', to: 'href="/packages/pahalgam-tour-package/"' },
    { from: 'href="/sonmarg-tour-package/"', to: 'href="/packages/sonmarg-tour-package/"' },
    { from: 'href="/srinagar-tour-package/"', to: 'href="/packages/srinagar-tour-package/"' },
    { from: 'href="/gondola-faq/"', to: 'href="/gondola/gondola-faq/"' },
    { from: 'href="/gondola-guide/"', to: 'href="/gondola/gondola-guide/"' },
    { from: 'href="/gondola-phase-1/"', to: 'href="/gondola/gondola-phase-1/"' },
    { from: 'href="/gondola-phase-2/"', to: 'href="/gondola/gondola-phase-2/"' },
    { from: 'href="/gondola-prices/"', to: 'href="/gondola/gondola-prices/"' },
    { from: 'href="/gulmarg-gondola-booking/"', to: 'href="/gondola/gulmarg-gondola-booking/"' },
    { from: 'href="/gulmarg-gondola-tickets/"', to: 'href="/gondola/gulmarg-gondola-tickets/"' },
    { from: 'href="/gulmarg-hotels/"', to: 'href="/hotels/gulmarg-hotels/"' },
    { from: 'href="/pahalgam-hotels/"', to: 'href="/hotels/pahalgam-hotels/"' },
    { from: 'href="/sonmarg-hotels/"', to: 'href="/hotels/sonmarg-hotels/"' },
    { from: 'href="/srinagar-hotels/"', to: 'href="/hotels/srinagar-hotels/"' }
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    replacements.forEach(rep => {
        if (content.includes(rep.from)) {
            // Global replace
            content = content.split(rep.from).join(rep.to);
            changed = true;
        }
    });
    
    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated links in ${file}`);
    }
});
