const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Shared detailed text modules to build 2500+ words on each page
const TEXT_MODULES = {
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
        <h3 class="font-display text-2xl font-bold text-[#0B1F3A] mb-4">Altitude Acclimatization and Health Advisory</h3>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
            Kashmir features variable high altitudes. Srinagar rests at approximately 5,200 feet (1,585 meters), Pahalgam at 7,200 feet (2,200 meters), Gulmarg at 8,694 feet (2,650 meters), and Phase II of the Gulmarg Gondola at Apharwat Peak ascends to over 13,780 feet (4,200 meters).
        </p>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
            To prevent Altitude Mountain Sickness (AMS), we suggest a slow pacing strategy: spend the first 24-48 hours relaxing in Srinagar or Pahalgam before visiting high-altitude spots in Gulmarg Phase II. Stay hydrated, avoid heavy physical activities on arrival day, and consult a doctor if you have a history of respiratory or cardiovascular issues.
        </p>
    `,
    bookingGuide: `
        <h3 class="font-display text-2xl font-bold text-[#0B1F3A] mb-4">How to Plan and Secure Your Kashmir Tour Booking</h3>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
            Planning a trip to Kashmir is straightforward when booked directly with a local operator:
        </p>
        <ul class="space-y-3 text-sm text-gray-650 mb-6">
            <li class="flex items-start gap-2"><i class="fas fa-check text-green-500 mt-1"></i> <span><strong>Step 1: Choose Your Travel Season.</strong> Pick spring (April-May) for tulips, summer (June-August) for cool meadows, autumn (September-November) for gold Chinars, or winter (December-February) for snow.</span></li>
            <li class="flex items-start gap-2"><i class="fas fa-check text-green-500 mt-1"></i> <span><strong>Step 2: Share Guest Details.</strong> Provide traveler counts, date options, and preferred stay styles (Standard, Deluxe, or Luxury 5-star alpine resorts).</span></li>
            <li class="flex items-start gap-2"><i class="fas fa-check text-green-500 mt-1"></i> <span><strong>Step 3: Secure Gulmarg Gondola Tickets.</strong> Gondola tickets must be booked online in advance. We assist in reserving tickets for both Phase 1 and Phase 2.</span></li>
            <li class="flex items-start gap-2"><i class="fas fa-check text-green-500 mt-1"></i> <span><strong>Step 4: Receive Custom Quote.</strong> We design a personalized itinerary with hotels, transport, and local guides, delivering a transparent cost breakdown.</span></li>
        </ul>
    `,
    handicrafts: `
        <h3 class="font-display text-2xl font-bold text-[#0B1F3A] mb-4">Preserving Kashmiri Arts & Handicraft Heritage</h3>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
            Shopping in Kashmir is a cultural experience. The valley is known for its heritage handicrafts:
        </p>
        <ul class="space-y-2 text-sm text-gray-650 mb-4">
            <li><strong>Pashmina Shawls:</strong> Woven from pure Cashmere goat wool, famous for warmth and soft texture.</li>
            <li><strong>Silk Carpets:</strong> Hand-knotted carpets featuring Persian and local geometric motifs.</li>
            <li><strong>Paper-Mâché Art:</strong> Decorative boxes, ornaments, and vases hand-painted by local artisans.</li>
            <li><strong>Walnut Wood Carvings:</strong> Furniture, bowls, and trays carved from seasoned walnut timber.</li>
        </ul>
        <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
            To ensure authenticity, look for the government-approved GI (Geographical Indication) registration label when buying premium items like pure Pashmina.
        </p>
    `
};

const PAGES_DATA = [
    // --- Package Pages ---
    {
        route: 'kashmir-tour-packages',
        type: 'package',
        title: 'Kashmir Tour Packages | Custom Kashmir Holiday Itineraries',
        description: 'Book customized Kashmir tour packages with Northwind Kashmir. Discover Srinagar houseboats, Gulmarg Gondola rides, and Pahalgam river valleys with local travel experts.',
        h1: 'Kashmir Tour Packages',
        subtitle: 'Custom-planned Kashmir holidays with premium hotel stays, private transfers, and local guide support.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Planning Your Kashmir Tour Package</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        The Kashmir Valley is a premier travel destination, featuring alpine landscapes, lakes, and a rich local culture. Booking a customized package allows you to visit major destinations like Srinagar, Gulmarg, Pahalgam, and Sonmarg without the hassle of managing individual bookings.
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mt-3">
                        Our packages are designed to match your specific preferences, offering choices of hotel stays, private transport, and local guides. Whether you are traveling as a couple, family, or group, we provide tailored itineraries with direct on-ground assistance from our office in Tangmarg.
                    </p>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">2. Core Highlights of the Kashmir Valley</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-4">
                        A typical Kashmir itinerary covers a range of activities and scenic destinations:
                    </p>
                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="premium-card p-6">
                            <h3 class="font-display text-xl font-bold text-[#0B1F3A] mb-2">Srinagar Sightseeing</h3>
                            <p class="text-sm text-gray-650">Stay in traditional wood-carved houseboats on Nigeen or Dal Lake, take a sunset Shikara ride, and explore the terraced pathways of Shalimar and Nishat Mughal gardens.</p>
                        </div>
                        <div class="premium-card p-6">
                            <h3 class="font-display text-xl font-bold text-[#0B1F3A] mb-2">Gulmarg Meadows</h3>
                            <p class="text-sm text-gray-650">Ride the Gulmarg Gondola to Apharwat Peak, enjoy winter skiing and snowboarding, and walk through scenic pine-forested alpine trails.</p>
                        </div>
                        <div class="premium-card p-6">
                            <h3 class="font-display text-xl font-bold text-[#0B1F3A] mb-2">Pahalgam Valleys</h3>
                            <p class="text-sm text-gray-650">Walk along the banks of the Lidder River, visit Betaab and Aru valleys, and take pony rides across the scenic meadows of Baisaran (Mini Switzerland).</p>
                        </div>
                        <div class="premium-card p-6">
                            <h3 class="font-display text-xl font-bold text-[#0B1F3A] mb-2">Sonmarg Glaciers</h3>
                            <p class="text-sm text-gray-650">Explore the Meadow of Gold, hike to the Thajiwas Glacier, and take in views of the Sindh River valleys at the gateway to the Silk Road.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">3. Comparison Matrix: Budget, Deluxe & Luxury Options</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mb-6">
                        We offer three tiers of package customization to align with your travel style and budget:
                    </p>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse border border-gray-200 text-sm">
                            <thead>
                                <tr class="bg-[#0B1F3A] text-white">
                                    <th class="p-3 border border-gray-200">Feature</th>
                                    <th class="p-3 border border-gray-200">Standard / Budget</th>
                                    <th class="p-3 border border-gray-200">Deluxe / Premium</th>
                                    <th class="p-3 border border-gray-200">Luxury / VIP</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-white">
                                    <td class="p-3 border border-gray-200 font-semibold">Accommodations</td>
                                    <td class="p-3 border border-gray-200">3-Star Hotels / Standard Houseboats</td>
                                    <td class="p-3 border border-gray-200">4-Star Resorts / Luxury Houseboats</td>
                                    <td class="p-3 border border-gray-200">5-Star Alpine Retreats / Heritage Houseboats</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="p-3 border border-gray-200 font-semibold">Transportation</td>
                                    <td class="p-3 border border-gray-200">Sedan (Etios / Dzire)</td>
                                    <td class="p-3 border border-gray-200">MUV (Innova / Ertiga)</td>
                                    <td class="p-3 border border-gray-200">Premium SUV (Innova Crysta / 4x4 Fortuner)</td>
                                </tr>
                                <tr class="bg-white">
                                    <td class="p-3 border border-gray-200 font-semibold">Sightseeing</td>
                                    <td class="p-3 border border-gray-200">Standard Itinerary</td>
                                    <td class="p-3 border border-gray-200">Custom Pacing & Union Rides</td>
                                    <td class="p-3 border border-gray-200">Private Guides, VIP passes, Helicopter options</td>
                                </tr>
                                <tr class="bg-gray-50">
                                    <td class="p-3 border border-gray-200 font-semibold">Meals Included</td>
                                    <td class="p-3 border border-gray-200">Breakfast & Dinner</td>
                                    <td class="p-3 border border-gray-200">Breakfast & Dinner + Local Snacks</td>
                                    <td class="p-3 border border-gray-200">All Meals + Kashmiri Wazwan dining</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">4. Suggested Itinerary: The Best of Kashmir (6 Days / 5 Nights)</h2>
                    <ul class="space-y-4 text-sm text-gray-700">
                        <li><strong>Day 1: Arrival in Srinagar.</strong> Pickup from Srinagar airport, check-in to a Dal Lake houseboat, and take a sunset Shikara ride.</li>
                        <li><strong>Day 2: Srinagar Local Sightseeing.</strong> Explore Shalimar, Nishat, and Chashme Shahi gardens, Shankaracharya Temple, and old town markets.</li>
                        <li><strong>Day 3: Srinagar to Gulmarg.</strong> Drive to Gulmarg (54 km), ride the Gondola (Phase 1 & 2), and overnight stay in a mountain hotel.</li>
                        <li><strong>Day 4: Gulmarg to Pahalgam.</strong> Travel to Pahalgam (140 km), passing saffron fields in Pampore, and check-in to a riverside resort.</li>
                        <li><strong>Day 5: Pahalgam Sightseeing & Return.</strong> Explore Betaab and Aru valleys in local union taxis, and return to Srinagar for an overnight stay.</li>
                        <li><strong>Day 6: Departure.</strong> Breakfast at hotel, souvenir shopping, and transfer to Srinagar airport.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        route: 'kashmir-honeymoon-package',
        type: 'package',
        title: 'Kashmir Honeymoon Packages | Romantic Kashmir Stays',
        description: 'Plan a romantic Kashmir honeymoon package with Northwind Kashmir. Private Dal Lake houseboats, flower shikaras, and luxury resort stays in Gulmarg & Pahalgam.',
        h1: 'Kashmir Honeymoon Packages',
        subtitle: 'Bespoke romantic escapes in the valley with decorated stays, candlelit dining, and private transfers.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Planning Your Romantic Kashmir Honeymoon</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Jammu & Kashmir is one of the most romantic destinations in Asia, offering a blend of quiet alpine settings, historic lakes, and private retreat hotels. We customize honeymoon itineraries to allow for comfortable pacing, private dining, and memorable photography points.
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mt-3">
                        Our honeymoon packages include special details like rooms decorated with fresh flowers, customized candlelit dinners on a lake houseboat veranda, and private, comfortable transfer services between Srinagar, Gulmarg, and Pahalgam.
                    </p>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">2. Core Honeymoon Experiences in Kashmir</h2>
                    <ul class="space-y-3 text-sm text-gray-700">
                        <li><strong>Sunset Shikara Cruise:</strong> Take a private, decorated wooden boat ride across the quiet waters of Nigeen Lake during sunset.</li>
                        <li><strong>Overnight in a Traditional Houseboat:</strong> Stay in a hand-carved cedar houseboat featuring classic local woodwork and lakeside verandas.</li>
                        <li><strong>Gulmarg Gondola Ride:</strong> Ascend via the cable car to see panoramic views of the Pir Panjal range.</li>
                        <li><strong>Romantic Riverside Walks:</strong> Stroll along the banks of the Lidder River in Pahalgam, surrounded by tall pine forests.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        route: 'kashmir-family-package',
        type: 'package',
        title: 'Kashmir Family Tour Packages | Family Holiday Itineraries',
        description: 'Book customized family tour packages in Kashmir. Safe private vehicles, kid-friendly hotels, and family sightseeing in Srinagar, Gulmarg, and Pahalgam.',
        h1: 'Kashmir Family Tour Packages',
        subtitle: 'Create memorable family vacations in Kashmir with comfortable stays, custom pacing, and on-ground support.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Planning Your Family Trip to Kashmir</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        A family vacation to Kashmir offers a variety of experiences for all generations. From children enjoying snow sledging in Gulmarg to grandparents relaxing in Mughal gardens, we customize itineraries to ensure comfortable pacing and safe logistics.
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mt-3">
                        We prioritize booking hotels with active central heating during winter, select restaurants with kid-friendly menus, and arrange spacious MUVs like the Innova Crysta for comfortable group travel across mountain routes.
                    </p>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">2. Top Family-Friendly Activities in Kashmir</h2>
                    <ul class="space-y-3 text-sm text-gray-700">
                        <li><strong>Gulmarg Gondola Ride:</strong> Asia's highest cable car is a key attraction for families, offering views of the Pir Panjal range.</li>
                        <li><strong>Shikara Rides & Houseboat Stays:</strong> Staying in traditional houseboats on Nigeen or Dal Lake provides a unique experience.</li>
                        <li><strong>Pony Rides in Baisaran Meadow:</strong> Baisaran, often called "Mini Switzerland," is a popular spot for horse rides and family picnics.</li>
                        <li><strong>Mughal Garden Explorations:</strong> The wide lawns of Nishat and Shalimar gardens in Srinagar are ideal for relaxing walks.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        route: 'kashmir-luxury-package',
        type: 'package',
        title: 'Kashmir Luxury Tour Packages | Premium Kashmir Travel',
        description: 'Experience Kashmir in absolute style. Book 5-star mountain resorts, private luxury SUV transport, and customized VIP tours with Northwind Kashmir.',
        h1: 'Kashmir Luxury Tour Packages',
        subtitle: 'Experience the finer side of the Kashmir Valley with premium stays, private chauffeurs, and customized itineraries.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Customized Luxury Travel in Kashmir</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Our luxury packages are tailored for travelers looking for premium comfort and service. We partner with the valley's top boutique properties and 5-star resorts, such as The Khyber Himalayan Resort & Spa in Gulmarg and Radisson Collection in Srinagar.
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mt-3">
                        Travel comfortably in private, premium SUVs driven by experienced chauffeurs. We handle all logistics, including securing Gondola tickets in advance and arranging private local guides.
                    </p>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">2. Premium Amenities & Stays</h2>
                    <ul class="space-y-3 text-sm text-gray-700">
                        <li><strong>5-Star Resorts:</strong> Stay in alpine properties featuring central heating, spas, and views of snow-clad mountains.</li>
                        <li><strong>Bespoke Houseboats:</strong> Traditional houseboats featuring historic cedar wood carvings, antique furnishings, and private chefs.</li>
                        <li><strong>Private Transport:</strong> Late-model Innova Crysta or luxury SUVs with dedicated local drivers.</li>
                        <li><strong>Concierge Service:</strong> 24/7 on-ground assistance and local support from our Tangmarg office.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        route: 'kashmir-group-tour-package',
        type: 'package',
        title: 'Kashmir Group Tour Packages | Corporate & College Group Travel',
        description: 'Plan group tours to Kashmir with Northwind Kashmir. Customized corporate escapes, college trips, and budget group itineraries with safe transport.',
        h1: 'Kashmir Group Tour Packages',
        subtitle: 'Custom group travel itineraries, corporate retreats, and shared packages in Jammu & Kashmir.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Planning Group Tours in Kashmir</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Traveling in groups is an excellent way to explore the beauty of Kashmir while optimizing costs. We arrange customized packages for corporate retreats, family reunions, and college adventure trips.
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mt-3">
                        We coordinate larger vehicles like Tempo Travellers or multiple SUVs to ensure comfortable group transport. We select hotels that can accommodate large groups and organize shared activities like lakeside bonfires.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'kashmir-adventure-package',
        type: 'package',
        title: 'Kashmir Adventure Tour Packages | Gulmarg Winter Activities',
        description: 'Plan a Kashmir adventure package with Gulmarg winter activities including skiing, snowboarding, Gondola viewpoints, snow walks, and guided mountain experiences.',
        h1: 'Kashmir Adventure Tour Packages',
        subtitle: 'Build an adventure holiday around Gulmarg skiing, snowboarding, Gondola views, trekking, and guided outdoor activities.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Gulmarg Snow &amp; Adventure Activities</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        When winter arrives, Gulmarg transforms into a snow-covered Himalayan wonderland. Snowy meadows, pine forests, and mountain views create an exciting setting for visitors who want to learn winter sports or simply enjoy their first experience in the snow.
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mt-3">
                        Northwind Kashmir can arrange a Gulmarg-focused winter holiday or combine these activities with Srinagar, Pahalgam, and Sonmarg. Availability depends on snowfall, weather, official operations, local regulations, and your experience level.
                    </p>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">2. Skiing Courses in Gulmarg</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Gulmarg is an exceptional destination to learn and experience skiing, with spectacular Himalayan scenery and terrain for different skill levels. We arrange skiing courses for beginners and enthusiasts with professional instruction, quality equipment, suitable training areas, comfortable accommodation, and local support.
                    </p>
                    <div class="mt-6 grid gap-5 md:grid-cols-3">
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-calendar-day"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">3-Day Skiing Course</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">An introduction to skiing fundamentals and the thrill of gliding across Gulmarg's snow-covered slopes.</p></div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-person-skiing"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">5-Day Skiing Course</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">More time to develop balance, confidence, turning technique, and overall skiing ability.</p></div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-mountain"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">10-Day Skiing Course</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">An extended learning experience for travellers who want progressive practice with professional guidance.</p></div>
                    </div>
                    <p class="mt-5 text-sm font-semibold text-[#0B1F3A]">Skiing programs may include professional instruction, equipment, safety guidance, practical training, accommodation, travel assistance, and local support. Confirm the exact inclusions in your quotation.</p>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">3. Snowboarding Courses in Gulmarg</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Experience snowboarding against the spectacular Himalayan backdrop. Whether you are new to the sport or want to improve your riding, a structured course can combine professional instruction, quality equipment, safety guidance, practical training, and comfortable accommodation.
                    </p>
                    <div class="mt-6 grid gap-5 md:grid-cols-3">
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-calendar-day"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">3-Day Snowboarding Course</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">Learn basic stance, balance, movement, stopping, and turning with an introductory program.</p></div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-snowboarding"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">5-Day Snowboarding Course</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">Build board control, confidence, and turning technique through additional practice days.</p></div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-mountain"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">10-Day Snowboarding Course</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">A comprehensive option for travellers seeking extended practice and deeper instruction.</p></div>
                    </div>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">4. More Gulmarg Winter Experiences</h2>
                    <div class="grid gap-5 md:grid-cols-2">
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-motorcycle"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">Snow Bike or Snowmobile</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">Ride across Gulmarg's snowy landscape while surrounded by mountain and forest scenery. Permitted areas and availability depend on conditions and local regulations.</p></div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-truck-monster"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">ATV Ride</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">Explore designated routes by all-terrain vehicle and combine off-road adventure with winter mountain views. Routes and operating areas may vary.</p></div>
                        <div class="premium-card p-6">
                            <div class="icon-badge mb-4"><i class="fas fa-cable-car"></i></div>
                            <h3 class="font-display text-xl font-bold text-[#0B1F3A]">Gulmarg Gondola</h3>
                            <p class="mt-2 text-sm leading-relaxed text-gray-600">Ride Phase 1 toward Kongdoori or continue to Phase 2 and Apharwat Peak when official tickets, operating conditions, and weather allow. See our <a class="font-semibold text-[#D4AF37] underline" href="/gulmarg-gondola-tickets/">Gulmarg Gondola ticket guide</a> before booking.</p>
                        </div>
                        <div class="premium-card p-6">
                            <div class="icon-badge mb-4"><i class="fas fa-person-walking"></i></div>
                            <h3 class="font-display text-xl font-bold text-[#0B1F3A]">Snow Walks and Sledging</h3>
                            <p class="mt-2 text-sm leading-relaxed text-gray-600">Enjoy easy snow walks or traditional sledging with family, children, or friends. Use waterproof footwear, warm layers, and agreed local rates for activities.</p>
                        </div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-circle"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">Snow Tubing and Snow Play</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">Simple recreational snow activities are especially popular with families and visitors experiencing snow for the first time.</p></div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-horse"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">Pony Riding</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">Explore Gulmarg's surroundings on horseback. Routes and availability depend on local operating conditions.</p></div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-camera"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">Snow Photography</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">Capture snow-covered meadows, pine forests, Himalayan peaks, and winter memories with your loved ones.</p></div>
                        <div class="premium-card p-6"><div class="icon-badge mb-4"><i class="fas fa-hotel"></i></div><h3 class="font-display text-xl font-bold text-[#0B1F3A]">Comfortable Stays</h3><p class="mt-2 text-sm leading-relaxed text-gray-600">Choose accommodation according to your comfort level, budget, and availability so you can recharge after a day in the snow.</p></div>
                        </div>
                </div>

                <div class="rounded-3xl border border-[#D4AF37]/20 bg-[#f8f5ee] p-6 sm:p-8">
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">5. What to Pack for a Gulmarg Winter Adventure</h2>
                    <div class="grid gap-4 sm:grid-cols-2">
                        <ul class="space-y-3 text-sm text-gray-700">
                            <li><i class="fas fa-check mr-2 text-green-600"></i> Thermal base layers and an insulated waterproof jacket</li>
                            <li><i class="fas fa-check mr-2 text-green-600"></i> Waterproof gloves, wool socks, and a warm hat</li>
                            <li><i class="fas fa-check mr-2 text-green-600"></i> Waterproof snow boots with good grip</li>
                        </ul>
                        <ul class="space-y-3 text-sm text-gray-700">
                            <li><i class="fas fa-check mr-2 text-green-600"></i> Sunglasses or snow goggles and high-SPF sunscreen</li>
                            <li><i class="fas fa-check mr-2 text-green-600"></i> Personal medicines, water, and a charged phone</li>
                            <li><i class="fas fa-check mr-2 text-green-600"></i> Travel insurance suitable for winter activities</li>
                        </ul>
                    </div>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">6. Safety and Planning Advice</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Winter mountain activities require flexibility. Check weather and road conditions before leaving Srinagar, allow extra time for traffic or snow, and follow instructions from official operators and qualified guides. Do not enter closed slopes or attempt unfamiliar terrain without professional guidance. Visitors arriving at high altitude should pace themselves, stay hydrated, and seek medical advice for serious symptoms.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'kashmir-winter-package',
        type: 'package',
        title: 'Kashmir Winter Tour Packages | Winter Wonderland Stays',
        description: 'Explore Kashmir in winter. Book winter tour packages with snow stays in Gulmarg, ski courses, frozen lake visits, and heated luxury resorts.',
        h1: 'Kashmir Winter Tour Packages',
        subtitle: 'Experience the winter landscape of Kashmir with skiing, sledging, and cozy heated stays.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Planning Your Kashmir Winter Trip</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        From late December to February, Kashmir turns into a winter destination. The snow-draped landscapes of Gulmarg and Pahalgam offer opportunities for winter photography and snow sports.
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mt-3">
                        Our winter packages prioritize hotels with reliable central heating or electric blankets, include 4x4 vehicles for snow-covered roads, and assist in booking ski activities.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'kashmir-summer-package',
        type: 'package',
        title: 'Kashmir Summer Tour Packages | Summer Holiday Travel',
        description: 'Book Kashmir summer tour packages. Escape the heat in green meadows, stay on houseboats, and trek alpine lake trails in Srinagar, Gulmarg, and Pahalgam.',
        h1: 'Kashmir Summer Tour Packages',
        subtitle: 'Escape the heat in the green valleys and alpine meadows of Kashmir.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Summer Travel in the Kashmir Valley</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Summer is the most popular season for visiting Kashmir. With temperatures ranging from 15°C to 30°C, the weather is comfortable for sightseeing and exploring the meadows of Gulmarg, Sonmarg, and Pahalgam.
                    </p>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base mt-3">
                        We design summer packages with lake houseboats, walks through Mughal gardens, and high-altitude trekking.
                    </p>
                </div>
            </div>
        `
    },

    // --- Destination Pages ---
    {
        route: 'srinagar-tourism',
        type: 'destination',
        title: 'Srinagar Tourism Guide | Houseboats, Lakes & Mughal Gardens',
        description: 'Explore Srinagar, the summer capital of Jammu & Kashmir. Discover Nigeen and Dal Lake houseboats, terraced gardens, and travel tips with local experts.',
        h1: 'Srinagar Tourism Guide',
        subtitle: 'Explore the summer capital of Kashmir, famous for houseboats, lakes, and gardens.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. About Srinagar</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Srinagar, situated on the banks of the Jhelum River, is the summer capital of Jammu & Kashmir. The city is known for its historic houseboats, Shikara rides on Dal Lake, and terraced Mughal gardens.
                    </p>
                </div>

                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">2. Top Places to Visit in Srinagar</h2>
                    <ul class="space-y-3 text-sm text-gray-700">
                        <li><strong>Dal Lake:</strong> The central attraction, featuring floating markets and houseboats.</li>
                        <li><strong>Nishat Bagh & Shalimar Bagh:</strong> Historic terraced gardens built by Mughal emperors.</li>
                        <li><strong>Shankaracharya Temple:</strong> Located on a hilltop, offering views of the city.</li>
                        <li><strong>Nigeen Lake:</strong> A quieter lake, ideal for peaceful stays.</li>
                    </ul>
                </div>
            </div>
        `
    },
    {
        route: 'gulmarg-tourism',
        type: 'destination',
        title: 'Gulmarg Tourism Guide | Gondola Rides, Skiing & Alpine Meadows',
        description: 'Read the ultimate Gulmarg travel guide. Learn about the Gulmarg Gondola, winter skiing, alpine meadows, prices, weather, and luxury stay reviews.',
        h1: 'Gulmarg Tourism Guide',
        subtitle: 'Discover the Meadow of Flowers, home to Asia\'s highest cable car and winter snow sports.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Guide to Gulmarg</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Gulmarg, located at 8,694 feet in the Pir Panjal range, is a popular destination in Kashmir. It serves as a meadow retreat in summer and a ski resort in winter.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'pahalgam-tourism',
        type: 'destination',
        title: 'Pahalgam Tourism Guide | Lidder River, Aru Valley & Horse Riding',
        description: 'Comprehensive Pahalgam tourism guide. Discover Aru Valley, Betaab Valley, Lidder River walks, horse riding guides, and safety tips for families.',
        h1: 'Pahalgam Tourism Guide',
        subtitle: 'Explore the Valley of Shepherds, famous for the Lidder River and scenic pine forests.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Discovering Pahalgam</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Pahalgam is a mountain town known for its pine forests and the Lidder River. It serves as a popular location for hiking, pony trekking, and family outings.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'sonmarg-tourism',
        type: 'destination',
        title: 'Sonmarg Tourism Guide | Thajiwas Glacier & Sindh River Valley',
        description: 'Read our ultimate Sonmarg travel guide. Learn how to visit Thajiwas Glacier, Sindh River rafting, weather forecasts, road accessibility, and hotels.',
        h1: 'Sonmarg Tourism Guide',
        subtitle: 'Explore the Meadow of Gold, the gateway to glaciers and ancient trade routes.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. About Sonmarg</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Sonmarg, located along the Sindh River, is known for its glaciers and alpine vistas. It serves as the gateway to the Ladakh region and is popular for day trips from Srinagar.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'doodhpathri-tourism',
        type: 'destination',
        title: 'Doodhpathri Tourism Guide | Milk Meadows & Pine Forests',
        description: 'Plan your trip to Doodhpathri with our travel guide. Discover the milk-colored Shaliganga river, pine valleys, horse riding rates, and route maps.',
        h1: 'Doodhpathri Tourism Guide',
        subtitle: 'Discover the Meadow of Milk, an offbeat valley with pine forests and streams.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Offbeat Kashmir: Doodhpathri</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Doodhpathri is a quiet meadow valley located about 42 km from Srinagar. The name means "Meadow of Milk," referring to the fast-flowing, frothy waters of the Shaliganga River.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'yusmarg-tourism',
        type: 'destination',
        title: 'Yusmarg Tourism Guide | Meadow of Jesus, Serene Forests & Treks',
        description: 'Explore Yusmarg, the Meadow of Jesus. Plan hikes to Nilnag Lake, Doodh Ganga River walks, forest trails, and find lodging reviews.',
        h1: 'Yusmarg Tourism Guide',
        subtitle: 'Explore the Meadow of Jesus, a peaceful retreat surrounded by pine forests.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. About Yusmarg</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Yusmarg is located in the Badgam district, about 47 km from Srinagar. It is a quiet meadow surrounded by pine forests and the Doodh Ganga River, popular for day hikes and nature walks.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'gurez-tourism',
        type: 'destination',
        title: 'Gurez Valley Tourism Guide | Habba Khatoon Peak & Border Travel',
        description: 'Gurez Valley travel guide. Learn about border travel permits, the Kishan Ganga river, Habba Khatoon peak, local culture, and summer road guides.',
        h1: 'Gurez Valley Tourism Guide',
        subtitle: 'Discover Gurez, a high-altitude border valley with unique culture and landscapes.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Travel to Gurez Valley</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Gurez Valley, located about 123 km from Srinagar, is a high-altitude border region. It features the Kishan Ganga River and the Habba Khatoon Peak, offering a glimpse into traditional Dardic culture.
                    </p>
                </div>
            </div>
        `
    },

    // --- Gondola Pages ---
    {
        route: 'gulmarg-gondola-tickets',
        type: 'gondola',
        title: 'Gulmarg Gondola Tickets | Advance Online Cable Car Booking',
        description: 'Learn how to book Gulmarg Gondola tickets online. Phase 1 & 2 ticket availability, pricing updates, timing, and direct travel desk assistance.',
        h1: 'Gulmarg Gondola Tickets',
        subtitle: 'Secure your cable car tickets for Phase 1 and Phase 2 online.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Booking Gulmarg Gondola Tickets</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        The Gulmarg Gondola is a primary attraction in Kashmir. Due to high demand, tickets must be booked online in advance. We assist in reserving tickets for both Phase 1 and Phase 2.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'gulmarg-gondola-booking',
        type: 'gondola',
        title: 'Gulmarg Gondola Ride Booking | WhatsApp Reservation Desk',
        description: 'Request Gulmarg Gondola bookings via our local travel desk. Direct booking assistance for Phase 1, Phase 2, and customized packages.',
        h1: 'Gulmarg Gondola Ride Booking',
        subtitle: 'Book your tickets and customize your tour with our local travel desk.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Booking Assistance</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Submit your details below to request ticket booking assistance and package customization via WhatsApp.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'gondola-phase-1',
        type: 'gondola',
        title: 'Gulmarg Gondola Phase 1 Guide | Gulmarg to Kongdoori Valley',
        description: 'Detailed guide to Gulmarg Gondola Phase 1. Tickets, altitude, boarding timings, sights, pine forest walks, and horse union guidelines.',
        h1: 'Gulmarg Gondola Phase 1 Guide',
        subtitle: 'Travel from Gulmarg to Kongdoori Valley through scenic pine forests.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Gondola Phase 1</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Phase 1 of the Gondola takes you from the base station in Gulmarg to the Kongdoori Valley at 10,050 feet. It is suitable for families and offers mountain and forest views.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'gondola-phase-2',
        type: 'gondola',
        title: 'Gulmarg Gondola Phase 2 Guide | Kongdoori to Apharwat Peak',
        description: 'Ultimate guide to Gulmarg Gondola Phase 2. Learn about the high-altitude Apharwat peak (13,780 ft), weather rules, and oxygen tips.',
        h1: 'Gulmarg Gondola Phase 2 Guide',
        subtitle: 'Ascend to Apharwat Peak at 13,780 feet for panoramic Himalayan views.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Gondola Phase 2</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Phase 2 ascends to Apharwat Peak at 13,780 feet. It offers views of snow-clad ridges and is popular for winter skiing and snowboarding.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'gondola-faq',
        type: 'gondola',
        title: 'Gulmarg Gondola FAQs | Ticket Rules, Timings & Weather Policy',
        description: 'Common questions about the Gulmarg Gondola. Refund policies, weather closures, child ticketing rules, ID requirements, and local union guides.',
        h1: 'Gulmarg Gondola FAQs',
        subtitle: 'Get answers to common questions about ticket bookings and guidelines.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Frequently Asked Questions</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Explore our comprehensive list of answers to common queries regarding ticketing, timings, and high-altitude travel.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'gondola-prices',
        type: 'gondola',
        title: 'Gulmarg Gondola Prices | Current Ticket Rates & Cost Breakdowns',
        description: 'Updated ticket prices for the Gulmarg Gondola. Rates for Phase 1, Phase 2, child pricing, local tax additions, and booking desk service charges.',
        h1: 'Gulmarg Gondola Prices',
        subtitle: 'View current ticket rates and booking costs.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Ticket Rates</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        View current ticket rates for Phase 1 and Phase 2. Note that children under 3 years travel free, while separate tickets are required for older children.
                    </p>
                </div>
            </div>
        `
    },
    {
        route: 'gondola-guide',
        type: 'gondola',
        title: 'Gulmarg Gondola Guide | Boarding Tips, Timings & Gear Checklists',
        description: 'Complete guide to riding the Gulmarg Gondola. Boarding pass tips, timing schedules, winter gear hire rules, and safety tips for all travelers.',
        h1: 'Gulmarg Gondola Travel Guide',
        subtitle: 'Boarding tips, winter gear checklists, and timing guidelines.',
        content: `
            <div class="space-y-8">
                <div>
                    <h2 class="font-display text-3xl font-bold text-[#0B1F3A] mb-4">1. Riding the Gondola</h2>
                    <p class="text-sm text-gray-700 leading-relaxed sm:text-base">
                        Plan your visit with our boarding tips and timing guidelines to ensure a smooth travel experience.
                    </p>
                </div>
            </div>
        `
    }
];

const HTML_TEMPLATE = (page) => `<!DOCTYPE html>
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
        }
      ]
    }
    </script>
</head>

<body class="bg-[#f7f4ec] text-gray-900 font-sans">
    <div id="app" class="min-h-screen">
        <nav class="site-nav backdrop-blur-md bg-[#0B1F3A]/90 border-b border-[#D4AF37]/20 shadow-lg">
            <!-- Populated by sync script -->
        </nav>

        <!-- Premium Destination/Package Hero -->
        <section class="page-top-offset relative overflow-hidden bg-[#0B1F3A] text-white">
            <div class="absolute inset-0 bg-cover bg-center opacity-40" style="background-image: url('/assets/images/hero/hero1.jpg');"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0B1F3A]/80 to-black/70"></div>
            <div class="section-shell relative py-20 sm:py-24 md:py-28">
                <div class="mx-auto max-w-4xl text-center" data-aos="fade-up">
                    <span class="section-eyebrow border-white/20 bg-white/10 text-[#f5d77f]">${page.type.toUpperCase()} GUIDE</span>
                    <h1 class="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                        ${page.h1}
                    </h1>
                    <p class="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
                        ${page.subtitle || page.description}
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
                        <!-- Primary Content -->
                        <div>
                            ${page.content}
                        </div>

                        <!-- Safety block -->
                        <div class="border-t border-gray-100 pt-8">
                            ${TEXT_MODULES.safety}
                        </div>

                        <!-- Acclimatization block -->
                        <div class="border-t border-gray-100 pt-8">
                            ${TEXT_MODULES.acclimatization}
                        </div>

                        <!-- Handicraft block -->
                        <div class="border-t border-gray-100 pt-8">
                            ${TEXT_MODULES.handicrafts}
                        </div>

                        <!-- Booking Guide -->
                        <div class="border-t border-gray-100 pt-8">
                            ${TEXT_MODULES.bookingGuide}
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

// Run page generation
PAGES_DATA.forEach(page => {
    const dirPath = path.join(root, page.route);

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const htmlContent = HTML_TEMPLATE(page);
    const filePath = path.join(dirPath, 'index.html');

    fs.writeFileSync(filePath, htmlContent, 'utf-8');
    console.log(`Generated page: ${page.route}/index.html`);
});

console.log('All 22 cluster pages generated successfully!');
