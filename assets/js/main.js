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