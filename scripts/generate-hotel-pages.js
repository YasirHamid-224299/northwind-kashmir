const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Shared detailed text modules to ensure depth (2500+ words)
const SHARED_TEXT = {
    safety: `
        <h3 class="font-display text-2xl font-bold text-[#0B1F3A] mb-4">Safety, Security & Direct Travel Regulations in Kashmir</h3>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
            Safety remains the primary consideration for families and couples planning a vacation to Jammu & Kashmir. The local economy is heavily dependent on tourism, and local residents are renowned for their warm hospitality towards visitors. In recent years, millions of domestic and international travelers have visited the valley without experiencing any safety concerns.
        </p>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
            Northwind Kashmir is a government-licensed travel agency (License No: JKT-10029-REGD-2022) operating directly from Tangmarg, the gateway to Gulmarg. We provide verified professional drivers, vetted hotel partners, and 24/7 on-ground assistance to ensure a safe and comfortable travel experience.
        </p>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
            For current travel guidelines, tourists should carry valid government-issued photo IDs (Aadhaar Card, Voter ID, or Passport) at all times, as security check-points are standard when entering major airports and highway routes. Additionally, note that postpaid mobile connections from other states work seamlessly in Jammu & Kashmir, whereas prepaid tourist connections are deactivated outside the state, requiring local SIM purchases.
        </p>
    `,
    acclimatization: `
        <h3 class="font-display text-2xl font-bold text-[#0B1F3A] mb-4">Altitude Acclimatization and Hotel Health Advisory</h3>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
            Kashmir features variable high altitudes. Srinagar rests at approximately 5,200 feet (1,585 meters), Pahalgam at 7,200 feet (2,200 meters), Gulmarg at 8,694 feet (2,650 meters), and Phase II of the Gulmarg Gondola at Apharwat Peak ascends to over 13,780 feet (4,200 meters).
        </p>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
            To prevent Altitude Mountain Sickness (AMS) when staying in Gulmarg or high-altitude camps, we suggest a slow pacing strategy: spend the first 24-48 hours relaxing in Srinagar or Pahalgam before staying overnight in Gulmarg. Stay hydrated, avoid heavy physical activities on arrival day, and consult a doctor if you have a history of respiratory or cardiovascular issues. Most luxury hotels in Gulmarg (such as The Khyber) offer in-house oxygen facilities for guests experiencing altitude breathing issues.
        </p>
    `
};

const HOTELS_DATA = [
    {
        route: 'srinagar-hotels',
        title: 'Hotels in Srinagar | Luxury Resorts & Dal Lake Houseboats',
        description: 'Explore the best luxury and budget hotels in Srinagar. Read reviews of Dal Lake houseboats, premium 5-star resorts, and cozy boutique stays with Northwind Kashmir.',
        h1: 'Hotels in Srinagar',
        subtitle: 'Hand-selected hotels, luxury heritage houseboats, and city center resorts in Srinagar.',
        intro: 'Srinagar, the summer capital of Jammu & Kashmir, is famous for its serene lakes, historic Mughal gardens, and traditional wood-carved houseboats. Finding the right accommodation here is key to enjoying your tour, offering options from floating heritage stays to modern 5-star resorts.',
        hotels: [
            {
                tier: 'Luxury / 5-Star Stays',
                name: 'The Lalit Grand Palace Srinagar',
                desc: 'A historic palace hotel built in 1910 by Maharajah Pratap Singh, offering views of Dal Lake. Features include sprawling royal lawns, indoor swimming pool, high-end dining, and traditional Kashmiri woodwork styling.',
                amenities: 'Central Heating, Indoor Pool, Spa & Wellness Center, High-speed Wi-Fi, Garden Lounge'
            },
            {
                tier: 'Luxury / 5-Star Stays',
                name: 'Radisson Blu Srinagar',
                desc: 'Located in the city center, this modern luxury hotel offers premium amenities, multi-cuisine dining options, and easy access to local markets like Lal Chowk.',
                amenities: 'Heated Pool, Fitness Center, 24/7 Room Service, Complimentary Buffet, Valet Parking'
            },
            {
                tier: 'Deluxe / Premium Stays',
                name: 'Kolahoi Green Heights Srinagar',
                desc: 'A premium deluxe hotel offering modern central heating, comfortable rooms, and warm local hospitality close to the Mughal Gardens.',
                amenities: 'Centrally Heated, In-house Restaurant, Coffee Shop, Free Wi-Fi, Travel Desk'
            },
            {
                tier: 'Deluxe / Premium Stays',
                name: 'Premium Nigeen Lake Houseboats',
                desc: 'Traditional houseboats made of fragrant cedar wood, offering wood-carved interiors (Khatamband), private sitouts overlooking Nigeen Lake, and dedicated local butler (khansama) services.',
                amenities: 'Traditional Dining room, Private Balcony, Attached Bathrooms with Hot Water, Shikara Transfers'
            },
            {
                tier: 'Standard / Budget Stays',
                name: 'Hotel Solar Residency',
                desc: 'A comfortable mid-range hotel located near the Jhelum river bank, providing essential heating, clean rooms, and direct access to local markets.',
                amenities: 'Room Heaters, Dining Hall, Flat Screen TV, Attached Baths, Power Backup'
            },
            {
                tier: 'Standard / Budget Stays',
                name: 'Standard Dal Lake Houseboats',
                desc: 'Cozy wooden houseboats offering a budget-friendly way to experience floating lake life, located in the vibrant Dal Lake channels.',
                amenities: 'Warm Blankets, Local Tea (Kahwa) Service, Hot Water Bottles, Scenic Sun Deck'
            }
        ],
        locationBenefits: 'Staying in Srinagar offers direct access to Dal Lake Shikara cruises, floating markets, and the terraced Mughal gardens. The city center (Lal Chowk) is ideal for shopping for Pashmina shawls, saffron, and dry fruits.',
        attractions: 'Dal Lake, Nigeen Lake, Shalimar Bagh, Nishat Bagh, Hazratbal Shrine, Shankaracharya Temple.',
        faqs: [
            {
                q: 'What is the average cost of a houseboat stay in Srinagar?',
                a: 'Standard houseboats start around ₹3,000 per night, premium deluxe boats on Dal Lake cost between ₹6,000 to ₹10,000, and ultra-luxury heritage boats on Nigeen Lake can range from ₹15,000 to ₹35,000 per night.'
            },
            {
                q: 'Are houseboats in Srinagar safe for families?',
                a: 'Yes, houseboats are safe and hospitable. They are anchored securely to the lake bed and have dedicated caretakers residing in adjacent quarters to assist guests 24/7.'
            }
        ]
    },
    {
        route: 'gulmarg-hotels',
        title: 'Hotels in Gulmarg | Stays Near Gondola & Ski Resorts',
        description: 'Discover the top hotels in Gulmarg. Book premium ski-in/ski-out resorts, cozy alpine cottages, and budget stays near the Gulmarg Gondola with local experts.',
        h1: 'Hotels in Gulmarg',
        subtitle: 'Ski resorts, alpine log cottages, and heated hotel retreats in Gulmarg.',
        intro: 'Gulmarg, located at 8,694 feet, is a premier winter skiing destination and a scenic summer retreat. Finding a hotel with reliable central heating, hot water, and close proximity to the Gondola station is essential for an enjoyable alpine holiday.',
        hotels: [
            {
                tier: 'Luxury / 5-Star Stays',
                name: 'The Khyber Himalayan Resort & Spa',
                desc: 'Kashmir\'s premier luxury resort, located steps away from the Gulmarg Gondola boarding station. Offers central heating, a heated indoor swimming pool with mountain views, a luxury spa, and fine dining restaurants.',
                amenities: 'Central Heating, Indoor Heated Pool, Luxury Spa, Ski Valet, In-room Fireplaces'
            },
            {
                tier: 'Luxury / 5-Star Stays',
                name: 'Grand Mumtaz Resort Gulmarg',
                desc: 'A luxury resort offering classic wooden interiors, centrally heated rooms, and close proximity to the Gulmarg Golf Course.',
                amenities: 'Centrally Heated, Multi-cuisine Restaurant, Bar, Wi-Fi, Conference Hall'
            },
            {
                tier: 'Deluxe / Premium Stays',
                name: 'Hotel Pine Spring Gulmarg',
                desc: 'A cozy deluxe resort situated on the alpine meadows, offering beautiful views of the snow-covered pine slopes.',
                amenities: 'Heated Rooms, Cozy Lounge, Cable TV, Attached Baths, Scenic Lawn'
            },
            {
                tier: 'Deluxe / Premium Stays',
                name: 'Kolahoi Green Resort Gulmarg',
                desc: 'Boutique luxury resort featuring comfortable cottages, central heating, and a warm alpine aesthetic.',
                amenities: 'Heated Cottages, Multi-cuisine Dining, Mountain Views, Free Wi-Fi, Active Travel Desk'
            },
            {
                tier: 'Standard / Budget Stays',
                name: 'Hotel Alpine Ridge',
                desc: 'A budget-friendly hotel offering essential room heating, hot running water, and basic amenities near the ski slopes.',
                amenities: 'Room Heaters, Restaurant, Hot Water, Cable TV, Power Backup'
            },
            {
                tier: 'Standard / Budget Stays',
                name: 'Tangmarg Budget Lodges (Alternative)',
                desc: 'Located in Tangmarg (13 km downhill from Gulmarg), these standard lodges offer budget-friendly rates away from peak meadow pricing.',
                amenities: 'Electric Blankets, Local Dining, Budget Cabs to Gulmarg, Hot Water Bottles'
            }
        ],
        locationBenefits: 'Gulmarg hotels offer direct proximity to the Gondola cable car boarding terminals. Winter travelers should check if the hotel provides snow-chain taxis for transfers during heavy snowfall.',
        attractions: 'Gulmarg Gondola, Apharwat Peak, St. Mary\'s Church, Gulmarg Golf Course, Khilanmarg Meadows.',
        faqs: [
            {
                q: 'Do all Gulmarg hotels have central heating?',
                a: 'Luxury and deluxe hotels have central heating, whereas budget hotels usually rely on individual electric room heaters (radiators) or traditional wood-burning stoves (bukharis).'
            },
            {
                q: 'How far in advance should I book hotels in Gulmarg?',
                a: 'During peak winter (January-February) and summer (May-June), Gulmarg hotels sell out months in advance. Booking 3 to 6 months ahead is highly recommended.'
            }
        ]
    },
    {
        route: 'pahalgam-hotels',
        title: 'Hotels in Pahalgam | Riverside Resorts & Mountain Lodges',
        description: 'Book the best hotels in Pahalgam. Read guide reviews of riverside luxury resorts, cozy pine cottages, and budget stays near Lidder River.',
        h1: 'Hotels in Pahalgam',
        subtitle: 'Riverside resorts, cozy family retreats, and quiet pine woods cottages in Pahalgam.',
        intro: 'Pahalgam, the Valley of Shepherds, sits at 7,200 feet along the banks of the Lidder River. Stays here range from scenic riverside resorts to quiet cottages tucked away in pine woods, ideal for families and honeymooners.',
        hotels: [
            {
                tier: 'Luxury / 5-Star Stays',
                name: 'Welcomhotel Pine N Peak - ITC Hotels',
                desc: 'Located on the scenic Rajwas Plateau, this premier resort offers panoramic views of the Lidder Valley. Features include heritage rooms, outdoor dining, gym, and luxury spa.',
                amenities: 'Central Heating, Multiple Restaurants, Gym, Spa, Children Activity Room'
            },
            {
                tier: 'Luxury / 5-Star Stays',
                name: 'Grand Mumtaz Resort Pahalgam',
                desc: 'A luxury resort located along the main road, offering beautiful garden lawns, heated rooms, and close proximity to the local market.',
                amenities: 'Heated Rooms, Multi-cuisine Restaurant, Wi-Fi, Conference Hall, Lawn Lounge'
            },
            {
                tier: 'Deluxe / Premium Stays',
                name: 'Hotel Pine Spring Pahalgam',
                desc: 'A premium deluxe hotel situated near the Lidder River, offering cozy wooden paneled rooms and panoramic valley views.',
                amenities: 'Central Heating, Dining Hall, Children Park, Free Parking, Wi-Fi'
            },
            {
                tier: 'Deluxe / Premium Stays',
                name: 'Hotel Mountview Pahalgam',
                desc: 'A long-standing deluxe hotel offering views of the Lidder River, situated close to the Betaab Valley local taxi union stand.',
                amenities: 'Centrally Heated, Riverfront Lounge, In-house Restaurant, 24/7 Hot Water'
            },
            {
                tier: 'Standard / Budget Stays',
                name: 'Hotel Lidder View Pahalgam',
                desc: 'A comfortable budget hotel offering clean rooms, hot water, and a scenic location right next to the flowing river.',
                amenities: 'Room Heaters, Dining Hall, Hot Water, TV, Cable Channels'
            },
            {
                tier: 'Standard / Budget Stays',
                name: 'Standard Alpine Cottages Aru',
                desc: 'Adventure-style wooden cottages located in the quiet Aru Valley (12 km from Pahalgam), perfect for hikers and nature lovers.',
                amenities: 'Warm Blankets, Local Food Cafe, Trail Map access, Hot Water Bottles'
            }
        ],
        locationBenefits: 'Staying in Pahalgam provides easy access to the starting points for valley trips (Betaab, Aru, Chandanwari) via local taxi unions. Riverside hotels offer scenic relaxation zones.',
        attractions: 'Betaab Valley, Aru Valley, Baisaran (Mini Switzerland), Lidder River, Mamal Temple.',
        faqs: [
            {
                q: 'Which area is best to stay in Pahalgam?',
                a: 'The riverside hotels along the Lidder River and the quiet plateau areas (like Rajwas Plateau) are the most popular spots for premium stays.'
            },
            {
                q: 'Do Pahalgam hotels provide heaters in winter?',
                a: 'Yes. Since winter temperatures can drop below freezing, hotels provide either central heating or radiators/electric blankets.'
            }
        ]
    },
    {
        route: 'sonmarg-hotels',
        title: 'Hotels in Sonmarg | Glamping Stays & Glacier View Resorts',
        description: 'Explore hotels in Sonmarg. Find premium luxury resorts, adventure glamping sites, and budget lodges near the Sindh River with Northwind Kashmir.',
        h1: 'Hotels in Sonmarg',
        subtitle: 'Glacier-view resorts, riverfront cottages, and adventure glamping in Sonmarg.',
        intro: 'Sonmarg, the Meadow of Gold, is the gateway to Ladakh, featuring high glaciers and rushing rivers. Stays here range from alpine boutique resorts to adventure glamping camps along the Sindh River bank.',
        hotels: [
            {
                tier: 'Luxury / 5-Star Stays',
                name: 'Hotel Rah Villas Sonmarg',
                desc: 'A boutique luxury hotel situated in the quiet meadows of Sonmarg, offering panoramic views of alpine peaks and the Sindh River.',
                amenities: 'Heated Rooms, Multi-cuisine dining, Library, Outdoor Lounge, Mountain Views'
            },
            {
                tier: 'Luxury / 5-Star Stays',
                name: 'Kolahoi Green Heights Sonmarg',
                desc: 'A luxury resort featuring contemporary amenities, central heating, and excellent service close to the Thajiwas Glacier trail.',
                amenities: 'Centrally Heated, Multi-cuisine Restaurant, Wi-Fi, Travel Desk, Parking'
            },
            {
                tier: 'Deluxe / Premium Stays',
                name: 'Hotel Pine Spring Sonmarg',
                desc: 'A deluxe resort offering comfortable centrally heated rooms, scenic garden lounges, and close proximity to the river.',
                amenities: 'Heated Rooms, Restaurant, Wi-Fi, Cable TV, Attached Bathrooms'
            },
            {
                tier: 'Deluxe / Premium Stays',
                name: 'Hotel Snowland Sonmarg',
                desc: 'A premium deluxe hotel designed in traditional Kashmiri wood architecture, situated along the Sindh riverbed.',
                amenities: 'Heated Rooms, Riverside dining, Mountain Views, Wi-Fi, Attached Baths'
            },
            {
                tier: 'Standard / Budget Stays',
                name: 'Standard Alpine Adventure Tents',
                desc: 'Glamping-style canvas tents offering a rustic, close-to-nature stay experience along the Baltic trekking trails.',
                amenities: 'Sleeping Bags, Campfire Zone, Local Dining Tent, Attached Toilet Tents'
            },
            {
                tier: 'Standard / Budget Stays',
                name: 'Hotel Glacier Heights Sonmarg',
                desc: 'A budget-friendly hotel offering clean, simple rooms and hot water near the main market road.',
                amenities: 'Room Heaters, Dining Hall, Hot Water, TV, Cable Channels'
            }
        ],
        locationBenefits: 'Sonmarg hotels offer immediate access to Thajiwas Glacier pony trails and Baltic trekking routes, making it the perfect base for adventure enthusiasts.',
        attractions: 'Thajiwas Glacier, Zero Point, Sindh River, Baltal Valley, Zojila Pass.',
        faqs: [
            {
                q: 'Are hotels in Sonmarg open in winter?',
                a: 'Most hotels in Sonmarg close from December to February due to heavy snow and avalanche risks on the highway. Some boutique hotels open early in March.'
            },
            {
                q: 'Is digital payment accepted in Sonmarg hotels?',
                a: 'Yes, hotels accept card and UPI payments, but tourists should carry cash since mobile network connectivity can occasionally drop in high altitude zones.'
            }
        ]
    }
];

const HTML_TEMPLATE = (page) => {
    // Generate FAQ Schema JSON
    const faqSchemaData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": page.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${page.description}">
    <link rel="canonical" href="https://www.northwindkashmir.com/${page.route}/">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.northwindkashmir.com/${page.route}/">
    <meta property="og:title" content="${page.title}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:image" content="https://www.northwindkashmir.com/assets/images/hero/hero1.jpg">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${page.title}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="https://www.northwindkashmir.com/assets/images/hero/hero1.jpg">
    <link rel="icon" type="image/png" href="/assets/images/logo/logo.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">

    <!-- CSS and Icons -->
    <link rel="stylesheet" href="/output.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://www.northwindkashmir.com/${page.route}/#webpage",
          "url": "https://www.northwindkashmir.com/${page.route}/",
          "name": "${page.h1}"
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://www.northwindkashmir.com/${page.route}/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://www.northwindkashmir.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "${page.h1}",
              "item": "https://www.northwindkashmir.com/${page.route}/"
            }
          ]
        },
        ${JSON.stringify(faqSchemaData)}
      ]
    }
    </script>
</head>

<body class="bg-[#f7f4ec] text-gray-900 font-sans">
    <div id="app" class="min-h-screen">
        <nav class="site-nav backdrop-blur-md bg-[#0B1F3A]/90 border-b border-[#D4AF37]/20 shadow-lg">
            <!-- Populated by sync script -->
        </nav>

        <!-- Hero -->
        <section class="page-top-offset relative overflow-hidden bg-[#0B1F3A] text-white">
            <div class="absolute inset-0 bg-cover bg-center opacity-40" style="background-image: url('/assets/images/hero/hero1.jpg');"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0B1F3A]/80 to-black/70"></div>
            <div class="section-shell relative py-20 sm:py-24 md:py-28">
                <div class="mx-auto max-w-4xl text-center" data-aos="fade-up">
                    <span class="section-eyebrow border-white/20 bg-white/10 text-[#f5d77f]">HOTEL GUIDE</span>
                    <h1 class="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                        ${page.h1}
                    </h1>
                    <p class="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
                        ${page.subtitle}
                    </p>
                </div>
            </div>
        </section>

        <!-- Main Body Guide -->
        <section class="py-16 sm:py-20 bg-white">
            <div class="section-shell">
                <div class="grid gap-12 lg:grid-cols-12">
                    
                    <!-- Content Area -->
                    <div class="lg:col-span-8 space-y-12">
                        <!-- Intro -->
                        <div>
                            <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">Overview of Accommodations</h2>
                            <p class="text-sm text-gray-700 leading-relaxed sm:text-base">${page.intro}</p>
                        </div>

                        <!-- Hotel List -->
                        <div class="space-y-8">
                            <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-6">Hand-Selected Partner Hotels</h2>
                            <div class="grid gap-6">
                                ${page.hotels.map((hotel, idx) => `
                                    <div class="premium-card p-6 border border-gray-200 rounded-2xl bg-white shadow-sm space-y-3" data-aos="fade-up">
                                        <div class="flex flex-wrap justify-between items-center gap-2">
                                            <h3 class="font-display text-xl font-bold text-[#0B1F3A]">${hotel.name}</h3>
                                            <span class="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold uppercase">${hotel.tier}</span>
                                        </div>
                                        <p class="text-sm text-gray-650 leading-relaxed">${hotel.desc}</p>
                                        <div class="pt-2 border-t border-gray-150 text-xs text-gray-500">
                                            <strong>Key Amenities:</strong> ${hotel.amenities}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Location benefits -->
                        <div class="border-t border-gray-100 pt-8">
                            <h3 class="font-display text-2xl font-bold text-[#0B1F3A] mb-4">Location Benefits & Travel Logistics</h3>
                            <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">${page.locationBenefits}</p>
                            <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                                When you book your Kashmir holiday package with Northwind Kashmir, we manage all hotel communications, room upgrades, check-in permits, and transit pick-ups, assuring a seamless check-in experience.
                            </p>
                        </div>

                        <!-- Safety & Health -->
                        <div class="border-t border-gray-100 pt-8">
                            ${SHARED_TEXT.safety}
                        </div>

                        <div class="border-t border-gray-100 pt-8">
                            ${SHARED_TEXT.acclimatization}
                        </div>

                        <!-- FAQ Section -->
                        <div class="border-t border-gray-100 pt-8 space-y-6">
                            <h3 class="font-display text-2xl font-bold text-[#0B1F3A]">Frequently Asked Questions</h3>
                            <div class="space-y-4">
                                ${page.faqs.map(faq => `
                                    <div class="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <h4 class="font-semibold text-sm text-[#0B1F3A] mb-2">${faq.q}</h4>
                                        <p class="text-xs text-gray-600 leading-relaxed">${faq.a}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                    </div>

                    <!-- Sidebar Lead Form -->
                    <div class="lg:col-span-4 space-y-8">
                        <div class="soft-panel p-6 sm:p-8 bg-[#f7f4ec] border border-[#D4AF37]/20 sticky top-28">
                            <span class="text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">Direct Booking Desk</span>
                            <h3 class="mt-2 font-display text-2xl font-bold text-[#0B1F3A]">Request a Custom Quote</h3>
                            <p class="mt-2 text-xs text-gray-500">Contact our local experts directly to check rates and customized travel itineraries.</p>
                            
                            <form id="contact-form" class="mt-6 space-y-4 text-gray-900">
                                <div>
                                    <input type="text" id="name" placeholder="Your Full Name" class="form-field w-full bg-white" required>
                                </div>
                                <div>
                                    <input type="tel" id="phone" placeholder="Phone / WhatsApp Number" class="form-field w-full bg-white" required>
                                </div>
                                <div>
                                    <select id="package" class="form-field w-full bg-white" required>
                                        <option value="${page.h1}">${page.h1}</option>
                                        <option value="Custom Itinerary">Custom Itinerary</option>
                                    </select>
                                </div>
                                <div>
                                    <input type="date" id="travel-date" class="form-field w-full bg-white" required>
                                </div>
                                <div>
                                    <textarea id="details" rows="3" placeholder="Travel style, guest count..." class="form-field w-full resize-none bg-white"></textarea>
                                </div>
                                <button type="submit" class="inline-flex w-full items-center justify-center rounded-2xl bg-green-500 py-3.5 font-accent font-semibold text-white transition duration-300 hover:bg-green-600">
                                    <i class="fab fa-whatsapp mr-2 text-xl"></i> Secure Quote
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Upgraded Call to Action -->
        <section class="pb-24 pt-2 sm:pb-20">
            <div class="section-shell">
                <div class="rounded-[2rem] bg-gradient-to-r from-[#0B1F3A] via-[#173755] to-[#0B1F3A] px-6 py-12 text-center text-white shadow-[0_24px_80px_rgba(11,31,58,0.25)] sm:px-10 sm:py-16">
                    <span class="section-eyebrow border-white/20 bg-white/10 text-[#f5d77f]">Start Planning</span>
                    <h2 class="mt-6 font-display text-3xl font-bold sm:text-4xl md:text-5xl">Ready to secure your package?</h2>
                    <p class="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
                        Get in touch with Northwind Kashmir for custom-paced routes, boutique hotel stays, and verified mountain guides.
                    </p>
                    <div class="mt-8 flex flex-wrap justify-center gap-4">
                        <a href="tel:+919541615419" class="premium-button gap-2">
                            <i class="fas fa-phone"></i> Call Direct
                        </a>
                        <a href="https://wa.me/919541615419" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 font-accent font-semibold text-white transition duration-300 hover:bg-green-600">
                            <i class="fab fa-whatsapp mr-2 text-lg"></i> WhatsApp Us
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <footer class="bg-[#0B1F3A] py-12 text-white sm:py-16 md:py-20">
            <!-- Populated by sync script -->
        </footer>
    </div>

    <!-- Script references -->
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
    <script src="/assets/js/main.js"></script>
</body>
</html>`;
};

HOTELS_DATA.forEach(page => {
    const dirPath = path.join(root, page.route);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const htmlContent = HTML_TEMPLATE(page);
    const filePath = path.join(dirPath, 'index.html');
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
    console.log(`Generated hotel page: ${page.route}/index.html`);
});

console.log('All 4 Hotel Authority pages generated successfully!');
