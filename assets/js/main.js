// Wait until the DOM is fully loaded before initializing all features
document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();       // Handles mobile menu toggle behavior
    initActiveNav();        // Highlights current page in navbar
    initFadeSlider("#hero-slider", 5000); // Hero slider (no captions)
    initFadeSlider("#slider", 5000, {     // Secondary slider with captions
        titleId: "slide-title",
        descId: "slide-desc",
    });
    initLightbox();         // Image gallery lightbox
    initPackageFilters();   // Tour package filtering system
    initContactForm();      // Contact form + WhatsApp integration
    initAOS();              // Scroll animations (AOS library)
    initExitIntent();       // Exit-intent conversion popup
    initMobileStickyBar();  // Mobile sticky bottom action bar
    initInteractivePlanner(); // Kashmir travel calculator, AI itinerary, Gondola alert
});


/* =========================
   MOBILE MENU FUNCTIONALITY
========================= */
function initMobileMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    // Exit if required elements are missing
    if (!menuBtn || !mobileMenu) return;

    let isOpen = false;

    // Accessibility attribute
    menuBtn.setAttribute("aria-expanded", "false");

    // Function to toggle menu state
    const setMenuState = (open) => {
        // Toggle height and visibility classes
        mobileMenu.classList.toggle("max-h-0", !open);
        mobileMenu.classList.toggle("opacity-0", !open);
        mobileMenu.classList.toggle("max-h-[calc(100svh-5rem)]", open);
        mobileMenu.classList.toggle("sm:max-h-[calc(100svh-5rem)]", open);
        mobileMenu.classList.toggle("opacity-100", open);

        // Prevent body scrolling when menu is open
        document.body.classList.toggle("overflow-hidden", open);

        // Update accessibility state
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");

        isOpen = open;
    };

    // Toggle menu on button click
    menuBtn.addEventListener("click", () => {
        setMenuState(!isOpen);
    });

    // Close menu when any mobile link is clicked
    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });

    // Close menu when ESC key is pressed
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen) {
            setMenuState(false);
        }
    });
}


/* =========================
   ACTIVE NAV LINK HIGHLIGHT
========================= */
function initActiveNav() {
    // Get current page name
    const page = window.location.pathname.split("/").pop() || "index.html";

    // Select all navigation links
    const navLinks = document.querySelectorAll('a[href$=".html"]');

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");

        // Highlight link if it matches current page
        if (href !== page) return;

        link.classList.add("text-[#D4AF37]");

        // Additional styling for mobile links
        if (link.classList.contains("mobile-link")) {
            link.classList.add("font-semibold");
        }
    });
}


/* =========================
   FADE SLIDER (REUSABLE)
========================= */
function initFadeSlider(containerSelector, interval, captionElements = {}) {
    const slider = document.querySelector(containerSelector);
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    if (slides.length === 0) return;

    // Optional caption elements
    const titleElement = captionElements.titleId
        ? document.getElementById(captionElements.titleId)
        : null;

    const descElement = captionElements.descId
        ? document.getElementById(captionElements.descId)
        : null;

    let currentIndex = 0;

    // Update slide captions (title + description)
    const updateCaption = (slide) => {
        if (titleElement) {
            titleElement.textContent = slide.getAttribute("data-title") || "";
        }
        if (descElement) {
            descElement.textContent = slide.getAttribute("data-desc") || "";
        }
    };

    // Initialize first caption
    updateCaption(slides[currentIndex]);

    // Auto-slide interval
    window.setInterval(() => {
        // Hide current slide
        slides[currentIndex].classList.remove("opacity-100");
        slides[currentIndex].classList.add("opacity-0");

        // Move to next slide (loop back if needed)
        currentIndex = (currentIndex + 1) % slides.length;

        // Show next slide
        slides[currentIndex].classList.remove("opacity-0");
        slides[currentIndex].classList.add("opacity-100");

        // Update captions
        updateCaption(slides[currentIndex]);
    }, interval);
}


/* =========================
   LIGHTBOX (GALLERY VIEW)
========================= */
function initLightbox() {
    const galleryImages = document.querySelectorAll(".gallery-img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDesc = document.getElementById("lightbox-desc");
    const closeLightbox = document.getElementById("close-lightbox");

    // Exit if required elements are missing
    if (
        galleryImages.length === 0 ||
        !lightbox ||
        !lightboxImg ||
        !lightboxTitle ||
        !lightboxDesc ||
        !closeLightbox
    ) {
        return;
    }

    // Open lightbox when image is clicked
    galleryImages.forEach((img) => {
        img.addEventListener("click", () => {
            lightbox.classList.remove("hidden");
            lightbox.classList.add("flex");

            lightboxImg.src = img.src;
            lightboxImg.alt =
                img.alt || img.getAttribute("data-title") || "Gallery image";

            lightboxTitle.textContent =
                img.getAttribute("data-title") || "Northwind Kashmir";

            lightboxDesc.textContent =
                img.getAttribute("data-desc") || "";
        });
    });

    // Close button
    closeLightbox.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("flex");
    });

    // Close when clicking outside image
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            lightbox.classList.add("hidden");
            lightbox.classList.remove("flex");
        }
    });
}


/* =========================
   PACKAGE FILTER SYSTEM
========================= */
function initPackageFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".package-card");

    if (filterButtons.length === 0 || cards.length === 0) return;

    // Function to show/hide cards based on filter
    const applyFilter = (filter) => {
        cards.forEach((card) => {
            const category = card.getAttribute("data-category");

            const visible = filter === "all" || category === filter;

            card.style.display = visible ? "block" : "none";
            card.style.opacity = visible ? "1" : "0";
            card.style.transform = visible ? "scale(1)" : "scale(0.95)";
        });
    };

    filterButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            // Reset all buttons
            filterButtons.forEach((btn) => {
                btn.classList.remove("bg-[#0B1F3A]", "text-white");
                btn.classList.add("bg-gray-200", "text-gray-800");
            });

            // Activate selected button
            button.classList.remove("bg-gray-200", "text-gray-800");
            button.classList.add("bg-[#0B1F3A]", "text-white");

            applyFilter(button.getAttribute("data-filter"));
        });

        // Set first button as active by default
        if (index === 0) {
            button.classList.add("bg-[#0B1F3A]", "text-white");
            button.classList.remove("bg-gray-200", "text-gray-800");
        }
    });

    // Default filter
    applyFilter("all");
}


/* =========================
   CONTACT FORM + WHATSAPP
========================= */
function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get form values
        const name = document.getElementById("name")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const packageType = document.getElementById("package")?.value.trim();
        const date = document.getElementById("travel-date")?.value.trim();
        const details = document.getElementById("details")?.value.trim();

        // Basic validation
        if (!name || !phone || !packageType || !date) {
            window.alert("Please fill in all required fields.");
            return;
        }

        // Create WhatsApp message
        const message = [
            "Hello, I want to book a Kashmir tour.",
            "",
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Package: ${packageType}`,
            `Travel Date: ${date}`,
            `Details: ${details || "No extra details provided."}`,
        ].join("\n");

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);

        // Open WhatsApp chat
        window.open(
            `https://wa.me/919541615419?text=${encodedMessage}`,
            "_blank"
        );

        // Reset form after submission
        form.reset();
    });
}


/* =========================
   AOS (ANIMATE ON SCROLL)
========================= */
function initAOS() {
    // Ensure AOS library is loaded
    if (!window.AOS) return;

    window.AOS.init({
        duration: 1000,     // Animation duration (ms)
        once: false,        // Repeat animation on scroll
        easing: "ease-in-out",
        mirror: true,       // Animate on scroll up as well
    });
}

/* =========================
   EXIT INTENT POPUP
========================= */
function initExitIntent() {
    // If popup already exists in HTML, skip injection
    let popup = document.getElementById("exit-intent-popup");
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "exit-intent-popup";
        popup.className = "exit-intent-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60 opacity-0 pointer-events-none transition-all duration-300";
        popup.innerHTML = `
            <div class="exit-intent-modal relative mx-4 w-full max-w-lg scale-95 rounded-3xl bg-white p-6 shadow-2xl sm:p-8 transition-all duration-300">
                <button id="close-exit-popup" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="fas fa-times text-xl"></i>
                </button>
                <div class="text-center">
                    <span class="inline-block rounded-full bg-[#D4AF37]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Exclusive Offer</span>
                    <h3 class="mt-4 font-display text-2xl font-bold text-[#0B1F3A] sm:text-3xl">Free Kashmir Guide & Custom Quote</h3>
                    <p class="mt-2 text-sm text-gray-600">Enter your contact details to receive our premium curated travel guide and get a custom itinerary designed by local experts in 5 minutes!</p>
                </div>
                <form id="exit-popup-form" class="mt-6 space-y-4">
                    <input type="text" id="exit-name" placeholder="Your Name" class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none text-black" required>
                    <input type="tel" id="exit-phone" placeholder="WhatsApp Number" class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none text-black" required>
                    <button type="submit" class="w-full rounded-xl bg-green-500 py-3 font-semibold text-white transition hover:bg-green-600 flex items-center justify-center gap-2">
                        <i class="fab fa-whatsapp text-lg"></i> Get Free Guide on WhatsApp
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(popup);
    }

    const modal = popup.querySelector(".exit-intent-modal");
    const closeBtn = document.getElementById("close-exit-popup");
    const form = document.getElementById("exit-popup-form");

    let hasShown = sessionStorage.getItem("exit_popup_shown") === "true";

    const showPopup = () => {
        if (hasShown) return;
        popup.classList.remove("opacity-0", "pointer-events-none");
        popup.classList.add("opacity-100", "pointer-events-auto");
        modal.classList.remove("scale-95");
        modal.classList.add("scale-100");
        sessionStorage.setItem("exit_popup_shown", "true");
        hasShown = true;
    };

    const hidePopup = () => {
        popup.classList.remove("opacity-100", "pointer-events-auto");
        popup.classList.add("opacity-0", "pointer-events-none");
        modal.classList.remove("scale-100");
        modal.classList.add("scale-95");
    };

    // Trigger on mouse leave top of screen (desktop)
    document.addEventListener("mouseleave", (e) => {
        if (e.clientY < 20) {
            showPopup();
        }
    });

    // Trigger on mobile after 25 seconds
    setTimeout(() => {
        if (window.innerWidth < 768) {
            showPopup();
        }
    }, 25000);

    if (closeBtn) {
        closeBtn.addEventListener("click", hidePopup);
    }

    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            hidePopup();
        }
    });

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("exit-name").value.trim();
            const phone = document.getElementById("exit-phone").value.trim();

            const message = `Hello Northwind Kashmir, I want to get the Free Kashmir Travel Guide and a custom itinerary.\n\nName: ${name}\nWhatsApp: ${phone}`;
            window.open(`https://wa.me/919541615419?text=${encodeURIComponent(message)}`, "_blank");
            hidePopup();
            form.reset();
        });
    }
}

/* =========================
   MOBILE STICKY ACTION BAR
========================= */
function initMobileStickyBar() {
    // If a mobile sticky bar already exists, remove it first
    const existing = document.querySelector(".dynamic-sticky-bar");
    if (existing) {
        existing.remove();
    }

    const bar = document.createElement("div");
    bar.className = "dynamic-sticky-bar fixed bottom-0 left-0 z-45 flex w-full items-center justify-around border-t border-[#D4AF37]/20 bg-[#0B1F3A]/95 backdrop-blur-md px-2 py-2.5 shadow-2xl md:hidden";
    bar.innerHTML = `
        <a href="tel:+919541615419" class="flex min-w-[64px] flex-col items-center gap-1 px-1 py-0.5 text-[0.68rem] font-medium text-white transition hover:text-[#D4AF37]">
            <i class="fas fa-phone text-base"></i>
            <span>Call</span>
        </a>
        <a href="https://wa.me/919541615419" target="_blank" rel="noopener noreferrer" class="flex min-w-[64px] flex-col items-center gap-1 px-1 py-0.5 text-[0.68rem] font-medium text-green-400 transition hover:text-green-500">
            <i class="fab fa-whatsapp text-base"></i>
            <span>WhatsApp</span>
        </a>
        <a href="/gulmarg-gondola-booking/" class="flex min-w-[64px] flex-col items-center gap-1 px-1 py-0.5 text-[0.68rem] font-medium text-[#D4AF37] transition hover:text-yellow-400">
            <i class="fas fa-ticket text-base"></i>
            <span>Gondola</span>
        </a>
        <a href="/packages.html" class="flex min-w-[64px] flex-col items-center gap-1 px-1 py-0.5 text-[0.68rem] font-medium text-white transition hover:text-[#D4AF37]">
            <i class="fas fa-plane text-base"></i>
            <span>Packages</span>
        </a>
    `;
    document.body.appendChild(bar);

    // Add extra padding to body bottom on mobile
    const style = document.createElement("style");
    style.innerHTML = `
        @media (max-width: 767px) {
            body {
                padding-bottom: 65px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

/* ==========================================================================
   INTERACTIVE TRAVEL PLANNER (CALCULATOR, AI ITINERARY, GONDOLA SLOT ALERTS)
   ========================================================================== */
function initInteractivePlanner() {
    // 1. Tab Switching Functionality
    const tabBtnCalc = document.getElementById("tab-btn-calc");
    const tabBtnAi = document.getElementById("tab-btn-ai");
    const tabBtnAlert = document.getElementById("tab-btn-alert");

    const tabContentCalc = document.getElementById("tab-content-calc");
    const tabContentAi = document.getElementById("tab-content-ai");
    const tabContentAlert = document.getElementById("tab-content-alert");

    if (!tabBtnCalc || !tabContentCalc) return; // Exit if not on the Trip Planner page

    const tabs = [
        { btn: tabBtnCalc, content: tabContentCalc },
        { btn: tabBtnAi, content: tabContentAi },
        { btn: tabBtnAlert, content: tabContentAlert }
    ];

    tabs.forEach(tab => {
        if (!tab.btn) return;
        tab.btn.addEventListener("click", () => {
            // Hide all tab contents and reset button styles
            tabs.forEach(t => {
                if (!t.btn) return;
                t.content.classList.add("hidden");
                t.btn.className = "flex items-center gap-2 px-5 py-3 rounded-xl font-accent font-semibold text-sm transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200";
            });

            // Show selected tab content and set active style
            tab.content.classList.remove("hidden");
            tab.btn.className = "flex items-center gap-2 px-5 py-3 rounded-xl font-accent font-semibold text-sm transition-all duration-200 bg-[#0B1F3A] text-white shadow-md";
        });
    });

    // 2. Kashmir Trip Cost Calculator Logic
    const inTravelers = document.getElementById("calc-in-travelers");
    const inDays = document.getElementById("calc-in-days");
    const inHotels = document.getElementById("calc-in-hotels");
    const inVehicle = document.getElementById("calc-in-vehicle");
    const inSeason = document.getElementById("calc-in-season");

    const valTravelers = document.getElementById("calc-val-travelers");
    const valDays = document.getElementById("calc-val-days");

    const outHotels = document.getElementById("calc-out-hotels");
    const outTransport = document.getElementById("calc-out-transport");
    const outPermits = document.getElementById("calc-out-permits");
    const outMeals = document.getElementById("calc-out-meals");
    const outTotal = document.getElementById("calc-out-total");

    const calcLeadForm = document.getElementById("calc-lead-form");

    let currentTotal = 0;

    const calculateCost = () => {
        const travelers = parseInt(inTravelers.value, 10);
        const days = parseInt(inDays.value, 10);
        const hotelTier = inHotels.value;
        const vehicle = inVehicle.value;
        const season = inSeason.value;

        // Update labels
        valTravelers.textContent = travelers;
        valDays.textContent = days;

        // Rooms needed (1 room per 2 guests)
        const rooms = Math.ceil(travelers / 2);

        // Standard Rates (INR per night / day)
        let hotelRate = 5500; // Deluxe default
        if (hotelTier === "budget") hotelRate = 2500;
        if (hotelTier === "luxury") hotelRate = 15000;

        let vehicleRate = 4000; // MUV default
        if (vehicle === "sedan") vehicleRate = 3000;
        if (vehicle === "suv") vehicleRate = 6000;

        // Season adjustment
        let multiplier = 1.0;
        if (season === "summer") multiplier = 1.20;
        if (season === "winter") multiplier = 1.15;
        if (season === "spring") multiplier = 1.10;

        // Calculate components
        const hotelCost = rooms * hotelRate * days * multiplier;
        const transportCost = vehicleRate * days * multiplier;
        const permitsCost = 2000 * travelers; // Gondola passes, Mughal garden entries, taxi union local cars
        const mealsCost = 500 * travelers * days; // Lunch costs (Breakfast/Dinner included in deluxe/luxury packages)

        currentTotal = hotelCost + transportCost + permitsCost + mealsCost;

        // Render values
        outHotels.textContent = "₹" + Math.round(hotelCost).toLocaleString("en-IN");
        outTransport.textContent = "₹" + Math.round(transportCost).toLocaleString("en-IN");
        outPermits.textContent = "₹" + Math.round(permitsCost).toLocaleString("en-IN");
        outMeals.textContent = "₹" + Math.round(mealsCost).toLocaleString("en-IN");
        outTotal.textContent = "₹" + Math.round(currentTotal).toLocaleString("en-IN");
    };

    // Bind calculator events
    [inTravelers, inDays, inHotels, inVehicle, inSeason].forEach(el => {
        if (el) el.addEventListener("input", calculateCost);
    });

    // Initial calculation run
    calculateCost();

    // Calculator WhatsApp Quote Submission
    if (calcLeadForm) {
        calcLeadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("calc-lead-name").value.trim();
            const phone = document.getElementById("calc-lead-phone").value.trim();

            const hotelText = inHotels.options[inHotels.selectedIndex].text;
            const vehicleText = inVehicle.options[inVehicle.selectedIndex].text;
            const seasonText = inSeason.options[inSeason.selectedIndex].text;

            const msg = [
                "Hello Northwind Kashmir, I calculated a travel quote on your website:",
                "",
                `Name: ${name}`,
                `WhatsApp: ${phone}`,
                `Number of Travelers: ${inTravelers.value}`,
                `Duration: ${inDays.value} Days`,
                `Hotel Accommodation: ${hotelText}`,
                `Private Car Option: ${vehicleText}`,
                `Travel Season: ${seasonText}`,
                `Estimated Budget: ₹${Math.round(currentTotal).toLocaleString("en-IN")}`,
                "",
                "Please review this and share a detailed itinerary with me."
            ].join("\n");

            window.open(`https://wa.me/919541615419?text=${encodeURIComponent(msg)}`, "_blank");
            calcLeadForm.reset();
        });
    }

    // 3. AI Itinerary Builder Logic
    const aiDuration = document.getElementById("ai-in-duration");
    const aiStyle = document.getElementById("ai-in-style");
    const aiBudget = document.getElementById("ai-in-budget");
    const aiBtnGenerate = document.getElementById("ai-btn-generate");
    const aiSpinner = document.getElementById("ai-spinner");
    const aiItineraryResult = document.getElementById("ai-itinerary-result");
    const aiTimelineContainer = document.getElementById("ai-timeline-container");
    const aiWhatsAppCta = document.getElementById("ai-whatsapp-cta");

    const ITINERARY_DATA = {
        honeymoon: [
            { day: 1, title: "Romantic Srinagar Houseboat Arrival", desc: "Arrive at Srinagar airport. Our private luxury vehicle transfers you to a premium cedar wood houseboat on Dal/Nigeen Lake. In the evening, enjoy a private, flower-decorated Shikara cruise during sunset." },
            { day: 2, title: "Royal Mughal Gardens Sightseeing", desc: "Explore the terraced Shalimar Bagh, Nishat Bagh, and the natural spring-fed Chashme Shahi. Enjoy a romantic candlelit Wazwan dinner at a local heritage restaurant." },
            { day: 3, title: "Scenic Drive to Pahalgam & Lidder Strolls", desc: "Travel to Pahalgam (140 km) through Pampore saffron fields. Check-in to a cozy riverside resort. Take a slow evening stroll along the banks of the rushing Lidder River." },
            { day: 4, title: "Romantic Valleys of Betaab & Aru", desc: "Sightsee the movie-famous Betaab Valley and Aru Valley in local union taxis. Capture memories in traditional Kashmiri outfits, and return to Srinagar for stay." },
            { day: 5, title: "Alpine Escape to Gulmarg & Gondola Ride", desc: "Drive to Gulmarg. Ride the Gulmarg Gondola (Asia's highest cable car) through Phase 1 & Phase 2 up to Apharwat Peak. Overnight stay in a cozy heated room." },
            { day: 6, title: "Meadow Strolls & Return to Srinagar", desc: "Scenic walks around Gulmarg golf course. Transfer back to Srinagar for carpet & souvenir shopping at Lal Chowk." },
            { day: 7, title: "Old Srinagar Bridges Walk & Shikara Shopping", desc: "Take a historical walk around the old city wooden bridges, visit Jamia Masjid, and enjoy tea on a floating lake shop." },
            { day: 8, title: "Bid Farewell to the Valleys", desc: "Enjoy your morning lake views and Shikara breakfast. Pack bags for airport transfers." }
        ],
        family: [
            { day: 1, title: "Srinagar Arrival & Dal Lake Check-in", desc: "Arrive in Srinagar, check-in to a cozy family houseboat. Take a relaxing 2-hour Shikara ride looking at floating gardens and water bazaars." },
            { day: 2, title: "Garden Walks & Indira Gandhi Memorial Garden", desc: "Visit Shalimar Bagh and the expansive Botanical Gardens. Perfect day for kids to run around and elderly parents to relax in the shade." },
            { day: 3, title: "Sonmarg Day Picnic & Thajiwas Glacier", desc: "Day excursion to Sonmarg (90 km). Take pony rides with children to the Thajiwas Glacier, enjoying snow slides and views of the Sindh River." },
            { day: 4, title: "Srinagar to Pahalgam Transit & Pony Rides", desc: "Drive to Pahalgam. Check-in to hotel and take pony rides together across the scenic pine woods of Baisaran (Mini Switzerland)." },
            { day: 5, title: "Betaab Valley & Wildlife Sanctuary Visit", desc: "Explore Betaab Valley and Chandanwari. Walk through local pine forests and visit the Pahalgam Zoo/Deer Park." },
            { day: 6, title: "Pahalgam to Gulmarg Transit & Sledging", desc: "Drive to Gulmarg, ride Gondola Phase 1 to Kongdoori. Enjoy snow sledging and winter sports with family." },
            { day: 7, title: "Gulmarg to Srinagar & Local Souvenir Buying", desc: "Drive back to Srinagar. Shop for walnuts, almonds, saffron, and Pashmina shawls for friends back home." },
            { day: 8, title: "Srinagar Airport Departure", desc: "Breakfast at hotel and private transfer to Srinagar airport for departure flight." }
        ],
        adventure: [
            { day: 1, title: "Srinagar Airport to Sonmarg Glaciers", desc: "Direct transfer from Srinagar Airport to Sonmarg. Acclimatize to altitude in a mountain cottage." },
            { day: 2, title: "Glacier Trekking & Sindh White-Water Rafting", desc: "Trek to the base of Thajiwas Glacier. In the afternoon, gear up for an exciting white-water rafting run on the Sindh River." },
            { day: 3, title: "Sonmarg to Pahalgam via Pampore", desc: "Scenic highway drive to Pahalgam. Visit local ruins and saffron fields en route." },
            { day: 4, title: "Betaab Valley Hike & Camping Setup in Aru", desc: "Trek through the Aru Wildlife sanctuary trails, setting up tents or checking into adventure camps in Aru Valley." },
            { day: 5, title: "Pahalgam to Gulmarg Transit & Mountain Transit", desc: "Drive to Gulmarg. In the evening, explore local Pine Trails and prepare ski gear for the next day." },
            { day: 6, title: "Gondola Phase 2 Skiing & Apharwat Ridges Trek", desc: "Board the Phase II cable car up to 13,780 feet. Trek along the Apharwat Ridge, or ski down back-country powder bowls." },
            { day: 7, title: "Offbeat Day Trip to Doodhpathri Meadows", desc: "Day trip to Doodhpathri, walking along the rocky Jhelum tributaries and pine forests." },
            { day: 8, title: "Srinagar Local Sightsee & Airport Flight", desc: "Quick visit to Shankaracharya Hill Temple and drop off at Srinagar airport." }
        ],
        leisure: [
            { day: 1, title: "Srinagar Lake Resort Check-in", desc: "Arrive in Srinagar. Check-in to a luxury lake-view resort. Spend a relaxed afternoon drinking saffron Kahwa." },
            { day: 2, title: "Houseboat Stay & Heritage Garden Walks", desc: "Transfer to a premium heritage houseboat. Spend the day sitting on the wooden deck overlooking Dal Lake." },
            { day: 3, title: "Old City Srinagar Heritage Tour", desc: "Slow walk around historical shrines (Hazratbal Mosque, Shah-e-Hamdan) and view ancient wood carvings." },
            { day: 4, title: "Pahalgam Pine Resort Transit", desc: "Drive to Pahalgam. Enjoy a quiet, slow-paced resort stay surrounded by high cedar forests." },
            { day: 5, title: "Lidder River Picnic & Valley Walks", desc: "Pack a picnic lunch and relax in Aru Valley meadows without strenuous hikes." },
            { day: 6, title: "Pahalgam to Gulmarg Scenic Drive", desc: "Travel to Gulmarg in a comfortable SUV. Check-in to a heated retreat." },
            { day: 7, title: "Gulmarg Gondola Phase 1 Scenic Ride", desc: "Take a calm Gondola ride to Phase 1. Enjoy hot tea and pine forest views." },
            { day: 8, title: "Airport Departure Transfer", desc: "Leisurely breakfast, check-out and private transfer to Srinagar airport." }
        ]
    };

    if (aiBtnGenerate) {
        aiBtnGenerate.addEventListener("click", () => {
            // Show loading spinner
            aiSpinner.classList.remove("hidden");
            aiBtnGenerate.setAttribute("disabled", "true");

            setTimeout(() => {
                const duration = parseInt(aiDuration.value, 10);
                const style = aiStyle.value;
                const budget = aiBudget.value;

                // Clear previous result
                aiTimelineContainer.innerHTML = "";

                // Get selected category template and slice to requested days
                const baseItinerary = ITINERARY_DATA[style] || ITINERARY_DATA.leisure;
                const selectedItinerary = baseItinerary.slice(0, duration);

                // Build HTML structure
                selectedItinerary.forEach(day => {
                    const dayCard = document.createElement("div");
                    dayCard.className = "relative pl-8 pb-8 last:pb-0";
                    dayCard.innerHTML = `
                        <!-- Timeline circle marker -->
                        <span class="absolute left-[-9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] border-2 border-white"></span>
                        <div>
                            <span class="text-xs uppercase font-bold text-[#D4AF37]">Day ${day.day}</span>
                            <h4 class="font-display text-lg font-bold text-[#0B1F3A] mt-1">${day.title}</h4>
                            <p class="text-sm text-gray-650 mt-2 leading-relaxed">${day.desc}</p>
                            <span class="inline-block mt-3 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold uppercase">
                                Accommodation: ${budget === "luxury" ? "5-Star Luxury Resort" : (budget === "deluxe" ? "4-Star Deluxe Hotel" : "3-Star Standard Lodge")}
                            </span>
                        </div>
                    `;
                    aiTimelineContainer.appendChild(dayCard);
                });

                // Show itinerary container
                aiSpinner.classList.add("hidden");
                aiBtnGenerate.removeAttribute("disabled");
                aiItineraryResult.classList.remove("hidden");

                // Scroll down to results smoothly
                aiItineraryResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 800);
        });
    }

    // AI Itinerary WhatsApp CTA
    if (aiWhatsAppCta) {
        aiWhatsAppCta.addEventListener("click", () => {
            const duration = aiDuration.value;
            const styleText = aiStyle.options[aiStyle.selectedIndex].text;
            const budgetText = aiBudget.options[aiBudget.selectedIndex].text;

            const msg = [
                "Hello Northwind Kashmir, I generated a customized AI Itinerary on your website:",
                `- Style: ${styleText}`,
                `- Duration: ${duration} Days`,
                `- Budget Tier: ${budgetText}`,
                "",
                "Please verify availability and pricing for these days."
            ].join("\n");

            window.open(`https://wa.me/919541615419?text=${encodeURIComponent(msg)}`, "_blank");
        });
    }

    // 4. Gondola Alert System Logic
    const alertForm = document.getElementById("alert-form");
    const alertRegistryStatus = document.getElementById("alert-registry-status");
    const alertRegistryMsg = document.getElementById("alert-registry-msg");

    const sidebarAlertForm = document.getElementById("sidebar-alert-form");
    const sidebarAlertRegistryStatus = document.getElementById("sidebar-alert-registry-status");
    const sidebarAlertRegistryMsg = document.getElementById("sidebar-alert-registry-msg");

    const checkActiveAlert = () => {
        const stored = localStorage.getItem("gondola_alert_reg");
        if (stored) {
            const data = JSON.parse(stored);
            const msgText = `Active Alert for ${data.name} on WhatsApp (+${data.phone}) for dates starting ${data.date} (Guests: ${data.guests}).`;
            
            if (alertRegistryStatus && alertRegistryMsg) {
                alertRegistryMsg.textContent = msgText;
                alertRegistryStatus.classList.remove("hidden");
            }
            if (sidebarAlertRegistryStatus && sidebarAlertRegistryMsg) {
                sidebarAlertRegistryMsg.textContent = msgText;
                sidebarAlertRegistryStatus.classList.remove("hidden");
            }
        }
    };

    // Load active alert on startup
    checkActiveAlert();

    const handleAlertSubmit = (e, suffix = "") => {
        e.preventDefault();
        const name = document.getElementById(`alert-name${suffix}`).value.trim();
        const email = document.getElementById(`alert-email${suffix}`).value.trim();
        const phone = document.getElementById(`alert-phone${suffix}`).value.trim();
        const date = document.getElementById(`alert-date${suffix}`).value;
        const guests = document.getElementById(`alert-guests${suffix}`).value;

        // Save to localStorage
        const payload = { name, email, phone, date, guests };
        localStorage.setItem("gondola_alert_reg", JSON.stringify(payload));

        // Show active status banner
        checkActiveAlert();

        // WhatsApp confirmation redirect
        const msg = [
            "Hi Northwind Kashmir, I registered a Gondola Slot Availability Alert on your website:",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `WhatsApp Number: ${phone}`,
            `Preferred Date: ${date}`,
            `Number of Guests: ${guests}`,
            "",
            "Please notify me the moment Gulmarg Gondola slot booking windows open."
        ].join("\n");

        window.open(`https://wa.me/919541615419?text=${encodeURIComponent(msg)}`, "_blank");
        e.target.reset();
    };

    if (alertForm) {
        alertForm.addEventListener("submit", (e) => handleAlertSubmit(e, ""));
    }
    if (sidebarAlertForm) {
        sidebarAlertForm.addEventListener("submit", (e) => handleAlertSubmit(e, "-sidebar"));
    }
}