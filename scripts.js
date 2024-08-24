// Selecting elements
const testimonials = document.querySelectorAll('.testimonial-item');
const carouselContainer = document.querySelector('.testimonial-carousel');
const nextBtn = document.createElement('button');
const prevBtn = document.createElement('button');
const indicators = document.createElement('div');
let currentTestimonial = 0;
let autoSlideInterval;
let isPaused = false;

// Setting up buttons and indicators
nextBtn.innerText = 'Next';
prevBtn.innerText = 'Previous';
nextBtn.classList.add('carousel-btn', 'next-btn');
prevBtn.classList.add('carousel-btn', 'prev-btn');
indicators.classList.add('indicators');

carouselContainer.appendChild(prevBtn);
carouselContainer.appendChild(nextBtn);
carouselContainer.appendChild(indicators);

testimonials.forEach((_, index) => {
    const indicator = document.createElement('span');
    indicator.classList.add('indicator');
    indicator.dataset.index = index;
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    indicators.appendChild(indicator);
});

const updateIndicators = () => {
    const allIndicators = document.querySelectorAll('.indicator');
    allIndicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentTestimonial) {
            indicator.classList.add('active');
        }
    });
};

const showTestimonial = index => {
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.remove('active', 'fade-in');
        if (i === index) {
            testimonial.classList.add('active', 'fade-in');
        }
    });
    updateIndicators();
};

const nextTestimonial = () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
};

const prevTestimonial = () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
};

const startAutoSlide = () => {
    autoSlideInterval = setInterval(nextTestimonial, 5000);
};

const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
};

// Button Event Listeners
nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextTestimonial();
    if (!isPaused) startAutoSlide();
});

prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevTestimonial();
    if (!isPaused) startAutoSlide();
});

// Indicator Event Listener
indicators.addEventListener('click', e => {
    if (e.target.classList.contains('indicator')) {
        stopAutoSlide();
        currentTestimonial = parseInt(e.target.dataset.index);
        showTestimonial(currentTestimonial);
        if (!isPaused) startAutoSlide();
    }
});

// Touch Support
let startX = 0;
let endX = 0;

const handleTouchStart = e => {
    startX = e.touches[0].clientX;
};

const handleTouchMove = e => {
    endX = e.touches[0].clientX;
};

const handleTouchEnd = () => {
    if (startX > endX + 50) {
        nextTestimonial();
    } else if (startX < endX - 50) {
        prevTestimonial();
    }
    startX = 0;
    endX = 0;
};

carouselContainer.addEventListener('touchstart', handleTouchStart);
carouselContainer.addEventListener('touchmove', handleTouchMove);
carouselContainer.addEventListener('touchend', handleTouchEnd);

// Pause/Resume on Hover and Focus
carouselContainer.addEventListener('mouseenter', () => {
    stopAutoSlide();
    isPaused = true;
});

carouselContainer.addEventListener('mouseleave', () => {
    isPaused = false;
    startAutoSlide();
});

[nextBtn, prevBtn, indicators].forEach(element => {
    element.addEventListener('focusin', () => {
        stopAutoSlide();
    });

    element.addEventListener('focusout', () => {
        if (!isPaused) startAutoSlide();
    });
});

// Keyboard Navigation
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
        nextBtn.click();
    } else if (e.key === 'ArrowLeft') {
        prevBtn.click();
    }
});

// Initialize
showTestimonial(currentTestimonial);
startAutoSlide();
