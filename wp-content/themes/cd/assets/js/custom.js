// window.onload = function() {
//     const badgesBox = document.querySelector('.badges-box');   
//     if(badgesBox){         
//         function addActiveClass() {      
//             badgesBox.classList.add('active');
            
//             setTimeout(function() {
//                 badgesBox.classList.remove('active');
//             }, 1000);
//         }
//         const observer = new IntersectionObserver((entries, observer) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {               
//                     addActiveClass();
//                     observer.disconnect();
//                 }
//             });
//         }, {
//             threshold: 0.5
//         });      
//         observer.observe(badgesBox);
//     }
// };

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");
    const speed = 250;
    if(counters){         
        const animateCounter = (counter) => {
            const updateCount = () => {
                const target = +counter.getAttribute("data-target");
                const count = +counter.innerText;
                const increment = Math.ceil(target / speed);

                if (count < target) {
                    counter.innerText = count + increment;
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCount();
        };

        const observerOptions = {
            root: null, 
            threshold: 0.1, 
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach((counter) => {
            observer.observe(counter);
        });
    }
});

jQuery.noConflict();
jQuery(".header-top .mob-menu, .menu-close").click(function() {
    jQuery(".header-right").slideToggle();
});

/*document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".brand-slider .brand-item");
    let lastIndex = -1;
    if(items){ 
        if(items.length > 0){ 
            function showRandomItem() {
                items.forEach(item => item.classList.remove("active"));

                let index;
                do {
                    index = Math.floor(Math.random() * items.length);
                } while (index === lastIndex);

                lastIndex = index;
                items[index].classList.add("active");
            }

            setInterval(showRandomItem, 1500);            
            showRandomItem();
        }
    }
});*/

/*Working code
document.addEventListener("DOMContentLoaded", () => {
    const brandItems = document.querySelectorAll(".brand-slider .brand-item");
    const totalItems = brandItems.length;
    const visibleCount = 6;

    // Array to track currently visible items
    let visibleIndices = [];

    // Function to initialize visible images
    function initializeVisibleImages() {
        visibleIndices = [];
        while (visibleIndices.length < visibleCount) {
            const randomIndex = Math.floor(Math.random() * totalItems);
            if (!visibleIndices.includes(randomIndex)) {
                visibleIndices.push(randomIndex);
            }
        }

        // Show only the initially selected images
        brandItems.forEach((item, index) => {
            if (visibleIndices.includes(index)) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });
    }

    // Function to replace one image at a time
    function replaceOneImage() {
        // Pick a random index from currently visible items
        const randomVisibleIndex = Math.floor(Math.random() * visibleIndices.length);
        const indexToReplace = visibleIndices[randomVisibleIndex];

        // Find a new random index that is not currently visible
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * totalItems);
        } while (visibleIndices.includes(newIndex));

        // Update the visible indices
        visibleIndices[randomVisibleIndex] = newIndex;

        // Transition: Hide the old image and show the new one
        brandItems[indexToReplace].classList.add("hidden"); // Hide old image
        brandItems[newIndex].classList.remove("hidden"); // Show new image
    }

    // Initial setup
    initializeVisibleImages();

    // Change one image every 5 seconds
    setInterval(replaceOneImage, 5000);
});
*/
document.addEventListener("DOMContentLoaded", () => {
    const brandItems = Array.from(document.querySelectorAll(".brand-slider .brand-item"));
    if (brandItems.length === 0) return; // Exit if no brand items exist

    const hiddenLogosContainer = document.querySelector(".hidden-logos");
    if (!hiddenLogosContainer) return; // Exit if hidden logos container doesn't exist

    const hiddenLogos = Array.from(hiddenLogosContainer.querySelectorAll(".brand-item"));
    const visibleCount = 6;

    let visibleIndices = [0, 1, 2, 3, 4, 5]; // First 6 items are visible
    let remainingLogos = [...hiddenLogos]; // Rest of the logos are hidden initially
    let usedLogos = []; // Track logos that have already been used in this cycle
    let usedVisibleIndices = []; // To track visible logos that have been used

    // Function to initialize visible images
    function initializeVisibleImages() {
        brandItems.forEach((item, index) => {
            if (visibleIndices.includes(index)) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });
    }

    // Function to replace one image at a time
    function replaceOneImage() {
    if (remainingLogos.length > 0 || usedVisibleIndices.length < visibleCount) {
        let indexToReplace;

        if (usedVisibleIndices.length === visibleCount) {
            usedVisibleIndices = [];
            indexToReplace = Math.floor(Math.random() * visibleIndices.length);
        } else {
            const availableVisibleIndices = visibleIndices.filter(index => !usedVisibleIndices.includes(index));
            indexToReplace = availableVisibleIndices[Math.floor(Math.random() * availableVisibleIndices.length)];
        }

        // Get currently visible logos
        const visibleLogos = visibleIndices.map(i => brandItems[i].querySelector("img").src);

        // Ensure a new logo is chosen that isn't already in the visible set
        const unusedLogos = remainingLogos.filter(logo => 
            !usedLogos.includes(logo) && !visibleLogos.includes(logo.querySelector("img").src)
        );

        if (unusedLogos.length > 0) {
            const randomLogoIndex = Math.floor(Math.random() * unusedLogos.length);
            const newImage = unusedLogos[randomLogoIndex];

            const newImageSrc = newImage.querySelector("img").src;
            const imgElementToReplace = brandItems[indexToReplace].querySelector("img");

            imgElementToReplace.classList.add("fade-out");

            setTimeout(() => {
                imgElementToReplace.src = newImageSrc;
                imgElementToReplace.classList.remove("fade-out");
                imgElementToReplace.classList.add("fade-in");
            }, 500);

            setTimeout(() => {
                imgElementToReplace.classList.remove("fade-in");
            }, 1000);

            usedLogos.push(newImage);
            remainingLogos.splice(remainingLogos.indexOf(newImage), 1);
            usedVisibleIndices.push(indexToReplace);
        }
    }

    if (remainingLogos.length === 0 && usedLogos.length === hiddenLogos.length) {
        usedLogos = [];
        usedVisibleIndices = [];
        remainingLogos = [...hiddenLogos];
        shuffleArray(remainingLogos);
    }
}


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    initializeVisibleImages();
        setInterval(replaceOneImage, 6000);
});



// gallery script start
/*
jQuery(document).ready(function () {
    var $slider = jQuery('.gallery-slider').slick({
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        // autoplay: false,
        variableWidth: true,
        centerMode: true,
        // autoplaySpeed: 10000,

        responsive: [
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    arrows: true,
                    centerMode: true,
                    variableWidth: false
                }
            }
        ]
    });

    // Timeout for auto-slide functionality on centered slide
    var timeoutId = null;
    function handleSlideOpen(index) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        var $targetSlide;

        if (typeof index !== 'undefined') {
            // Find the slide by its slick index
            $targetSlide = jQuery('.gallery-slider .slick-slide[data-slick-index="' + index + '"]');
        } else {
            // Find the currently centered slide
            $targetSlide = jQuery('.gallery-slider .slick-slide.slick-center');
        }

        jQuery('.gallery-item').removeClass('inactive'); // Reset all slides
        $targetSlide.find('.gallery-item').addClass('inactive'); // Mark the selected slide

        // Close the slide and reset state after 5 seconds
        timeoutId = setTimeout(function () {
            $targetSlide.find('.gallery-item').removeClass('inactive'); // Close the slide
        }, 5000);
    }
    $slider.on('setPosition', function () {
        handleSlideOpen(jQuery('.gallery-slider .slick-slide.slick-center').data('slick-index'));
    });


    // Trigger the first slide open when page loads
    handleSlideOpen();

    // Handle manual slide clicks
    jQuery(document).on('click', '.gallery-item', function (event) {
        event.stopPropagation();
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        jQuery('.gallery-item').removeClass('inactive'); // Reset all slides
        jQuery(this).addClass('inactive'); // Mark clicked slide

        var slideIndex = jQuery(this).closest('.slick-slide').data('slick-index');
        $slider.slick('slickGoTo', slideIndex, true); // Navigate to clicked slide

        // Restart the open-close cycle
        timeoutId = setTimeout(function () {
            jQuery('.gallery-item').removeClass('inactive');
            handleSlideOpen();
        }, 5000);
    });
}); 
*/

jQuery(document).ready(function () {
    var $slider = jQuery('.gallery-slider').slick({
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        // autoplay: true,
        variableWidth: true,
        centerMode: true,
        // autoplaySpeed: 10000,
        speed: 800, // 🔹 Smooth transition speed
        cssEase: 'ease-in-out', // 🔹 Smooth easing function

        responsive: [
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    arrows: true,
                    centerMode: true,
                    variableWidth: false,
                }
            }
        ]
    });

    var timeoutId = null;
    var lastCenteredSlide = null;

    function handleSlideOpen(index, isAutoScroll = false) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        //var $targetSlide = jQuery('.gallery-slider .slick-slide[data-slick-index="' + index + '"]');

        var $targetSlide;

        if (typeof index !== 'undefined') {
            // Find the slide by its slick index
            $targetSlide = jQuery('.gallery-slider .slick-slide[data-slick-index="' + index + '"]');
        } else {
            // Find the currently centered slide
            $targetSlide = jQuery('.gallery-slider .slick-slide.slick-center');
        }

        console.log('index');
        console.log(index);

        
        jQuery('.gallery-item').removeClass('inactive'); // Reset all slides
        jQuery('.gallery-item').removeClass('centered left-slide right-slide'); // Reset classes
        
        $targetSlide.find('.gallery-item').addClass('inactive centered'); // Mark the center slide

        // 🔹 Smooth effect for left & right slides
        var $leftSlide = $targetSlide.prev('.slick-slide');
        var $rightSlide = $targetSlide.next('.slick-slide');

        $leftSlide.find('.gallery-item').addClass('left-slide'); // Left slide effect
        $rightSlide.find('.gallery-item').addClass('right-slide'); // Right slide effect

        timeoutId = setTimeout(function () {
            // jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide'); 
        }, 5000);

        console.log('isAutoScroll');
        console.log(isAutoScroll);
        console.log('lastCenteredSlide');
        console.log(lastCenteredSlide);

        // Prevent unnecessary jumps on autoplay
        //if (isAutoScroll && lastCenteredSlide !== index) {
        //if ( isAutoScroll && lastCenteredSlide !== index && typeof index !== 'undefined' ) {
            //lastCenteredSlide = index;
            //console.log('inside if lastCenteredSlide=index=');
        //console.log(lastCenteredSlide);
            //$slider.slick('slickGoTo', index, true);
        //}

        if (isAutoScroll && lastCenteredSlide !== index) {
            lastCenteredSlide = index;
            $slider.slick('slickGoTo', index, true); // Go directly to the slide
        } else if (!isAutoScroll && lastCenteredSlide === null) {
            // Initialize lastCenteredSlide on first manual interaction
            lastCenteredSlide = index;
            $slider.slick('slickGoTo', index, true); // Center the slide instantly
        }
    }

    // ✅ Auto-scroll behavior with smooth adjustments
    $slider.on('afterChange', function (event, slick, currentSlide) {
        handleSlideOpen(currentSlide, true);
    });

    // ✅ Click to center slide and adjust left/right
    jQuery(document).on('click', '.gallery-item', function (event) {
        event.stopPropagation();
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide'); 
        jQuery(this).addClass('inactive centered'); 

        var slideIndex = jQuery(this).closest('.slick-slide').data('slick-index');
        lastCenteredSlide = slideIndex;

        $slider.slick('slickGoTo', slideIndex, true);

        timeoutId = setTimeout(function () {
            jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide');
            handleSlideOpen(slideIndex);
        }, 5000);
    });

    // ✅ Ensure center slide opens first
    setTimeout(function () {
        var initialIndex = jQuery('.gallery-slider .slick-slide.slick-center').data('slick-index');
        handleSlideOpen(initialIndex);
        //handleSlideOpen();
    }, 500);
});

/*
jQuery(document).ready(function () {
    var $slider = jQuery('.gallery-slider').slick({
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: true,
        variableWidth: true,
        centerMode: true,
        autoplaySpeed: 5000,
        speed: 800, // 🔹 Smooth transition speed
        cssEase: 'ease-in-out', // 🔹 Smooth easing function

        responsive: [
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    arrows: true,
                    centerMode: true,
                    variableWidth: false,
                }
            }
        ]
    });

    var timeoutId = null;
    var lastCenteredSlide = null;

    // Ensure proper handling of slide when it opens
    function handleSlideOpen(index, isAutoScroll = false) {
        /*if (timeoutId) {
            clearTimeout(timeoutId);
        }
        */
        /*
        console.log('index');
        console.log(index);
        console.log('isAutoScroll');
        console.log(isAutoScroll);

        var $targetSlide = jQuery('.gallery-slider .slick-slide[data-slick-index="' + index + '"]');
        
        // Reset the classes for a clean slate
        jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide');
        $targetSlide.find('.gallery-item').addClass('inactive centered');

        // Get the left and right adjacent slides
        var $leftSlide = $targetSlide.prev('.slick-slide');
        var $rightSlide = $targetSlide.next('.slick-slide');

        // Add the necessary classes to the adjacent slides for styling
        $leftSlide.find('.gallery-item').addClass('left-slide');
        $rightSlide.find('.gallery-item').addClass('right-slide');

        console.log('timeoutId');
        console.log(timeoutId);

        // Clear the "inactive" state after 5 seconds
        timeoutId = setTimeout(function () {
            jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide');
        }, 5000);

        console.log('after timeoutId');
        console.log(timeoutId);

        // Handle auto-scroll to ensure it doesn't shift left
        if (isAutoScroll && lastCenteredSlide !== index) {
            lastCenteredSlide = index;
            $slider.slick('slickGoTo', index, true); // Go directly to the slide
        } else if (!isAutoScroll && lastCenteredSlide === null) {
            // Initialize lastCenteredSlide on first manual interaction
            lastCenteredSlide = index;
            $slider.slick('slickGoTo', index, true); // Center the slide instantly
        }
    }

    // Handle auto-scroll behavior to ensure smooth transition
    $slider.on('afterChange', function (event, slick, currentSlide) {
        handleSlideOpen(currentSlide, true); // Auto scroll should behave like click
    });

    // Handle click to open the slide and stop autoplay
    jQuery(document).on('click', '.gallery-item', function (event) {
        event.stopPropagation();
        /*if (timeoutId) {
            clearTimeout(timeoutId);
        }*/

       /* console.log('timeoutId');
        console.log(timeoutId);

        var slideIndex = jQuery(this).closest('.slick-slide').data('slick-index');

        // Prevent re-centering if already centered
        if (slideIndex === lastCenteredSlide) {
            return;
        }

        lastCenteredSlide = slideIndex;
        $slider.slick('slickPause'); // Pause autoplay on manual selection
        $slider.slick('slickGoTo', slideIndex, true); // Go to the clicked slide

        jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide');
        jQuery(this).addClass('inactive centered'); // Mark the clicked slide as centered

        timeoutId = setTimeout(function () {
            jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide');
            
            // Resume autoplay after 5 seconds
            $slider.slick('slickPlay');  
        }, 5000);

        console.log('after timeoutId');
        console.log(timeoutId);
    });

    // Ensure the first slide is centered when the page loads
    setTimeout(function () {
        var initialIndex = jQuery('.gallery-slider .slick-slide.slick-center').data('slick-index');
        handleSlideOpen(initialIndex); // Open the first centered slide
    }, 500);
});
*/

/*
jQuery(document).ready(function () {
    var $slider = jQuery('.gallery-slider').slick({
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: true,
        variableWidth: true,
        centerMode: true,
        autoplaySpeed: 5000, 
        speed: 800, 
        cssEase: 'ease-in-out',

        responsive: [
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    arrows: true,
                    centerMode: true,
                    variableWidth: false,
                }
            }
        ]
    });

    var timeoutId = null;
    var lastCenteredSlide = null;
    var nextSlideIndex = null;

    function handleSlideOpen(index, isAutoScroll = false) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        var $targetSlide = jQuery('.gallery-slider .slick-slide[data-slick-index="' + index + '"]');

        jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide');
        $targetSlide.find('.gallery-item').addClass('inactive centered');

        var $leftSlide = $targetSlide.prev('.slick-slide');
        var $rightSlide = $targetSlide.next('.slick-slide');

        $leftSlide.find('.gallery-item').addClass('left-slide');
        $rightSlide.find('.gallery-item').addClass('right-slide');

        timeoutId = setTimeout(function () {
            jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide');

            // 🔹 Immediately open next slide after closing
            if (isAutoScroll) {
                let nextIndex = nextSlideIndex !== null ? nextSlideIndex : (index + 1) % $slider.slick("getSlick").slideCount;
                lastCenteredSlide = nextIndex;
                $slider.slick('slickGoTo', nextIndex, true);
                handleSlideOpen(nextIndex, true);
            }
        }, 5000);

        if (isAutoScroll) {
            lastCenteredSlide = index;
            $slider.slick('slickGoTo', index, true);
        } else if (lastCenteredSlide === null) {
            lastCenteredSlide = index;
            $slider.slick('slickGoTo', index, true);
        }
    }

    $slider.on('afterChange', function (event, slick, currentSlide) {
        handleSlideOpen(currentSlide, true);
    });

    jQuery(document).on('click', '.gallery-item', function (event) {
        event.stopPropagation();
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        var slideIndex = jQuery(this).closest('.slick-slide').data('slick-index');

        if (slideIndex === lastCenteredSlide) {
            return;
        }

        lastCenteredSlide = slideIndex;
        $slider.slick('slickPause'); 
        $slider.slick('slickGoTo', slideIndex, true);

        var $clickedSlide = jQuery(this).closest('.slick-slide');
        var $nextSlide = $clickedSlide.next('.slick-slide');

        nextSlideIndex = $nextSlide.length ? $nextSlide.data('slick-index') : 0;

        jQuery('.gallery-item').removeClass('inactive centered left-slide right-slide');
        jQuery(this).addClass('inactive centered');

        timeoutId = setTimeout(function () {
            $slider.slick('slickPlay');
            handleSlideOpen(nextSlideIndex, true);
        }, 5000);
    });

    setTimeout(function () {
        var initialIndex = jQuery('.gallery-slider .slick-slide.slick-center').data('slick-index');
        handleSlideOpen(initialIndex);
    }, 500);
});
*/





/*jQuery(document).ready(function () {
jQuery('.gallery-slider').slick({
 dots: false,           
 arrows: true,          
 infinite: true,        
 speed: 300,            
 slidesToShow: 5,       
 slidesToScroll: 4,     
 autoplay: false,        
 autoplaySpeed: 2000,   
 variableWidth: true,   

 responsive: [
   {
     breakpoint: 900,
     settings: {
       slidesToShow: 3,
     }
   },
   {
     breakpoint: 600,
     settings: {
       slidesToShow: 1,
       slidesToShow: 1,          
       arrows: true,
       centerMode: true,
     }
   }
 ]
});
});

jQuery(document).on('click', '.gallery-item', function () {
jQuery('.gallery-item').removeClass('inactive');
jQuery(this).addClass('inactive');
}); */

// gallery script end



jQuery(document).ready(function () {
    jQuery('.provenResults-slider').slick({
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1, 
        autoplay: true,
        draggable: true,
        autoplaySpeed: 0,
        speed: 10000, 
        cssEase: 'linear',
        pauseOnHover: false,  // Prevent pause on hover
        pauseOnFocus: false,  // Prevent pause on focus
        draggable: false,  // Disable mouse dragging
        swipe: false,  // Disable touch swiping
        touchMove: false,  // Disable touch interactions
        responsive: [
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 481,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
});

/*const targetElement = document.querySelector(".typing-effect");
if(targetElement){
    const texts = [
        "Welcome",
        "Web",
        "Development",
        "AI",
        "Health",
        "Government",
    ];

    const typingSpeed = 400;
    const erasingSpeed = 50;
    const delayBetweenTexts = 2000;
    let textIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < texts[textIndex].length) {
            targetElement.textContent += texts[textIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, delayBetweenTexts);
        }
    }

    function erase() {
        if (charIndex > 0) {
            targetElement.textContent = texts[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, typingSpeed);
        }
    }
    type();
}*/

const backToTop = document.getElementById('back-to-top');
if(backToTop){
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

const logoBackToTop = document.getElementById('backtotop');
if(logoBackToTop){
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            logoBackToTop.classList.add('show');
        } else {
            logoBackToTop.classList.remove('show');
        }
    });

    logoBackToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".banner-bottom-main img");

    if(elements){

        const observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.5 }
        );

        elements.forEach(element => observer.observe(element));
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const stepContents = document.querySelectorAll(".step-content");
  const processStepImages = document.querySelectorAll(".processStep-image");
  const processStepItem = document.querySelector(".processStep-item");
  const processStepContent = document.querySelector(".processStep-content");
  const processStepDots = document.querySelector(".processStep-dots");

  // Ensure first step-content and processStep-image has 'active' class initially
  if (stepContents.length > 0) {
    stepContents[0].classList.add("active");
  }

  if (processStepImages.length > 0) {
    processStepImages[0].classList.add("active");
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let activeIndex = -1; // Track current active index

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeIndex = Array.from(stepContents).indexOf(entry.target);
        }
      });

      if (activeIndex !== -1) {
        // Remove active from all and set it only on the current active index
        stepContents.forEach((step) => step.classList.remove("active"));
        processStepImages.forEach((image) => image.classList.remove("active"));

        stepContents[activeIndex].classList.add("active");
        processStepImages[activeIndex].classList.add("active");

        // Add active class to processStepItem if last step is active
        if (activeIndex === stepContents.length - 1) {
          processStepItem.classList.add("active");
        } else {
          processStepItem.classList.remove("active");
        }
      }
    },
    {
      threshold: 0.5,
    }
  );

  // Observe all steps
  stepContents.forEach((step) => observer.observe(step));

  // Scroll event listener for .processStep-content
  processStepContent.addEventListener("scroll", () => {
    if (processStepContent.scrollTop > 50) {
      processStepDots.classList.add("active");
    } else {
      processStepDots.classList.remove("active");
    }
  });
});





// Pause the YouTube video when modal is closed
  jQuery('#myVideo').on('hidden.bs.modal', function () {
    var iframe = document.getElementById('youtubeVideo');
    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  });

window.onload = function () {
const companies = document.querySelector('.companies');
const badgesText1 = document.querySelector('.badges-text1');
const badgesText2 = document.querySelector('.badges-text2');
const badgesText3 = document.querySelector('.badges-text3');
const badgesText4 = document.querySelector('.badges-text4');
const badgesText5 = document.querySelector('.badges-text5');

let timeout1, timeout2, timeout3, timeout4;

if (companies) {
    function addActiveClasses() {
        badgesText1.classList.add('active');
        timeout1 = setTimeout(() => {
            badgesText1.classList.remove('active');
            badgesText2.classList.add('active');
        }, 1000);

        timeout2 = setTimeout(() => {
            badgesText2.classList.remove('active');
            badgesText3.classList.add('active');
        }, 2000);

        timeout3 = setTimeout(() => {
            badgesText3.classList.remove('active');
            badgesText4.classList.add('active');
        }, 3000);

        timeout4 = setTimeout(() => {
            badgesText4.classList.remove('active');
            badgesText5.classList.add('active');
        }, 4000);
    }

    function removeActiveClasses() {
        badgesText1.classList.remove('active');
        badgesText2.classList.remove('active');
        badgesText3.classList.remove('active');
        badgesText4.classList.remove('active');
        badgesText5.classList.remove('active');

        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        clearTimeout(timeout4);
    }

    companies.addEventListener('mouseenter', () => {
        addActiveClasses();
    });

    companies.addEventListener('mouseleave', () => {
        removeActiveClasses();
    });
}

// feature img box script
const badgesBoxes = document.querySelectorAll('.feature-img-box');
function addActiveClassToFeatureImgBox(box) {
    box.classList.add('active');
    setTimeout(function () {
        box.classList.remove('active');
    }, 1000);
}

const observer2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            addActiveClassToFeatureImgBox(entry.target);
            observer2.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

badgesBoxes.forEach(box => {
    observer2.observe(box);
});
};
