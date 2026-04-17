const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

let isOpen = false;

menuBtn.addEventListener("click", () => {
    if (!isOpen) {
        mobileMenu.classList.remove("max-h-0", "opacity-0");
        mobileMenu.classList.add("max-h-96", "opacity-100");
    } else {
        mobileMenu.classList.remove("max-h-96", "opacity-100");
        mobileMenu.classList.add("max-h-0", "opacity-0");
    }
    isOpen = !isOpen;
});
// Lightbox functionality
document.addEventListener("DOMContentLoaded", () => {

    const galleryImages = document.querySelectorAll(".gallery-img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDesc = document.getElementById("lightbox-desc");
    const closeLightbox = document.getElementById("close-lightbox");

    galleryImages.forEach(img => {
        img.addEventListener("click", () => {

            lightbox.classList.remove("hidden");
            lightbox.classList.add("flex");

            lightboxImg.src = img.src;

            // Set title & description
            lightboxTitle.textContent = img.getAttribute("data-title");
            lightboxDesc.textContent = img.getAttribute("data-desc");
        });
    });

    closeLightbox.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("flex");
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
            lightbox.classList.remove("flex");
        }
    });

});
// Gallery Slideshow
document.addEventListener("DOMContentLoaded", () => {

    let slides = document.querySelectorAll(".slide");
    let currentIndex = 0;

    const slideTitle = document.getElementById("slide-title");
    const slideDesc = document.getElementById("slide-desc");

    if (slides.length === 0) return;

    // Set initial caption
    slideTitle.textContent = slides[0].getAttribute("data-title");
    slideDesc.textContent = slides[0].getAttribute("data-desc");

    function showNextSlide() {

        slides[currentIndex].classList.remove("opacity-100");
        slides[currentIndex].classList.add("opacity-0");

        currentIndex = (currentIndex + 1) % slides.length;

        slides[currentIndex].classList.remove("opacity-0");
        slides[currentIndex].classList.add("opacity-100");

        // update caption
        slideTitle.textContent = slides[currentIndex].getAttribute("data-title");
        slideDesc.textContent = slides[currentIndex].getAttribute("data-desc");
    }

    setInterval(showNextSlide, 3000);

});
// Package Filter
document.addEventListener("DOMContentLoaded", () => {

    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".package-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            const filter = btn.getAttribute("data-filter");

            cards.forEach(card => {
                const category = card.getAttribute("data-category");

                if (filter === "all" || category === filter) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });

            // active button style
            filterButtons.forEach(b => {
                b.classList.remove("bg-[#0B1F3A]", "text-white");
                b.classList.add("bg-gray-200");
            });

            btn.classList.remove("bg-gray-200");
            btn.classList.add("bg-[#0B1F3A]", "text-white");
        });
    });

});
//whats app logic//
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const inputs = form.querySelectorAll("input, select, textarea");

            const name = inputs[0].value;
            const phone = inputs[1].value;
            const packageType = inputs[2].value;
            const date = inputs[3].value;
            const message = inputs[4].value;

            const text = 
`Hello, I want to book a Kashmir tour.

Name: ${name}
Phone: ${phone}
Package: ${packageType}
Travel Date: ${date}
Details: ${message}`;

            const encodedText = encodeURIComponent(text);

            window.open(`https://wa.me/919541615419?text=${encodedText}`, "_blank");
        });
    }

});