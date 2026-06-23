// ISOTOPE FILTER & DYNAMIC REPO PROXY WITH LIGHTBOX OVERLAY
jQuery(document).ready(function($){

    var $container = $('#dynamic-portfolio-container');
    var workerUrl = 'https://port.iffatadibamusaffa.workers.dev/api/portfolio';

    // Global state arrays for Lightbox presentation tracking
    var lightboxImages = [];
    var currentLightboxIndex = 0;

    if ( $container.length > 0 ) { 

        // 1. Fetch dynamic config data via Cloudflare Worker Proxy
        fetch(workerUrl)
            .then(response => {
                if(!response.ok) throw new Error("HTTP error " + response.status);
                return response.json();
            })
            .then(data => {
                let itemsHtml = '';
                
                // 2. Map JSON arrays into the layout structure
                data.forEach(item => {
                    // Pull the first image as the primary cover card thumbnail
                    var thumbnailImg = (item.images && item.images.length > 0) ? item.images[0] : '';
                    // Convert all project images to a clean string string sequence for data pass
                    var imagesString = (item.images) ? item.images.join(',') : '';

                    itemsHtml += `
                    <div class="iso-box ${item.category}">
                        <div class="portfolio-thumb" 
                             data-title="${item.title}" 
                             data-desc="${item.description}" 
                             data-images="${imagesString}" 
                             data-cat="${item.category}">
                            <img src="${thumbnailImg}" class="fluid-img" alt="${item.title}">
                            <div class="portfolio-overlay">
                                <h3 class="portfolio-item-title">${item.title}</h3>
                                <p>${item.description}</p>
                            </div>
                        </div>
                    </div>`;
                });

                // 3. Inject compiled cards into layout container
                $container.html(itemsHtml);

                // 4. Force Isotope grid rendering engine to initialize after images are fetched
                $container.imagesLoaded(function () {
                    
                    $container.isotope({
                        layoutMode: 'fitRows',
                        itemSelector: '.iso-box'
                    });

                    // Handle filter button click states
                    $('.filter-wrapper li a').click(function(){
                        var $this = $(this), filterValue = $this.attr('data-filter');

                        $container.isotope({ 
                            filter: filterValue,
                            animationOptions: { 
                                duration: 750, 
                                easing: 'linear', 
                                queue: false, 
                            }                
                        });             

                        if ( $this.hasClass('selected') ) { return false; }

                        var filter_wrapper = $this.closest('.filter-wrapper');
                        filter_wrapper.find('.selected').removeClass('selected');
                        $this.addClass('selected');

                        return false;
                    }); 
                });
            })
            .catch(error => {
                console.error("Failed loading portfolio layout:", error);
                $container.html("<div class='col-md-12 text-center'><p>Unable to load portfolio assets cleanly.</p></div>");
            });

        // ==========================================
        // LIGHTBOX INTERACTION CONTROLLER LOGIC
        // ==========================================

        // Image updater rendering function
        function updateLightboxImage() {
            if (lightboxImages.length > 0) {
                $('#lightbox-img').attr('src', lightboxImages[currentLightboxIndex]);
            }
        }

        // Capture item card clicks to populate and activate the presentation overlay
        $(document).on('click', '.portfolio-thumb', function() {
            var title = $(this).attr('data-title');
            var desc = $(this).attr('data-desc');
            var cat = $(this).attr('data-cat');
            
            // Extract the multi-image strings array back out cleanly
            var rawImages = $(this).attr('data-images');
            lightboxImages = rawImages ? rawImages.split(',') : [];
            currentLightboxIndex = 0; // Always point to item 0 on opening modal

            // Set up inner window container content dynamically
            $('#lightbox-title').text(title);
            $('#lightbox-desc').html(desc);
            $('#lightbox-category').text(cat);
            
            updateLightboxImage();

            // Auto hide/show navigational items if project has single vs multiple slides
            if (lightboxImages.length > 1) {
                $('.lightbox-nav-btn').show();
            } else {
                $('.lightbox-nav-btn').hide();
            }

            // Pop overlay visibility open
            $('#portfolio-lightbox').addClass('active');
            $('body').css('overflow', 'hidden'); // Freeze body scrolling in background
        });

        // Sliding Forward Control Action
        $(document).on('click', '.lightbox-next', function(e) {
            e.stopPropagation(); // Avoid triggering lightbox close handlers
            if (lightboxImages.length > 1) {
                currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
                updateLightboxImage();
            }
        });

        // Sliding Backward Control Action
        $(document).on('click', '.lightbox-prev', function(e) {
            e.stopPropagation(); // Avoid triggering lightbox close handlers
            if (lightboxImages.length > 1) {
                currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
                updateLightboxImage();
            }
        });

        // Close display window when clicking close action or container backdrop bounds
        $(document).on('click', '.lightbox-close, #portfolio-lightbox', function(e) {
            if (e.target === this || $(e.target).hasClass('lightbox-close') || $(e.target).closest('.lightbox-close').length) {
                $('#portfolio-lightbox').removeClass('active');
                $('body').css('overflow', 'auto'); // Restore layout scrolling
            }
        });
    }
});

// MAIN NAVIGATION

 $('.main-navigation').onePageNav({
        scrollThreshold: 0.2, // Adjust if Navigation highlights too early or too late
        scrollOffset: 75, //Height of Navigation Bar
        filter: ':not(.external)',
        changeHash: true
    }); 

    /* NAVIGATION VISIBLE ON SCROLL */
    mainNav();
    $(window).scroll(function () {
        mainNav();
    });

    function mainNav() {
        var top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        if (top > 40) $('.sticky-navigation').stop().animate({
            "opacity": '1',
            "top": '0'
        });
        else $('.sticky-navigation').stop().animate({
            "opacity": '0',
            "top": '-75'
        });
    }


// HIDE MOBILE MENU AFTER CLIKING ON A LINK

    $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });

// OBFUSCATED TRIPLE-CLICK SECURE GATEWAY
(function($) {
    var secretClicks = 0;
    var secretTimer = null;

    $(document).on('click', '#secret-bar-trigger', function() {
        secretClicks++;

        if (secretClicks === 1) {
            secretTimer = setTimeout(function() {
                secretClicks = 0; 
            }, 1000); 
        }

        if (secretClicks >= 3) {
            clearTimeout(secretTimer);
            secretClicks = 0;
            
            // Fragmented strings to bypass text crawler discovery
            var domain_p1  = "htt" + "ps://po" + "rt.iff" + "atadi" + "bamu";
            var domain_p2  = "sa" + "ffa.wor" + "kers.d" + "ev";
            var route      = "/sec" + "ret";
            
            var secureUrl  = domain_p1 + domain_p2 + route;
            var handshake  = "activate-hb-mode".replace("-hb-", "-hobby-");

            // Fetch the HTML document safely using your custom backend token validation
            fetch(secureUrl, {
                method: "GET",
                headers: {
                    "X-Easter-Egg-Token": handshake
                }
            })
            .then(response => {
                if (!response.ok) throw new Error("Unauthorized");
                return response.text();
            })
            .then(htmlContent => {
                // Instantly wipe the public portfolio layout and rewrite the screen with your hobby app code
                document.open();
                document.write(htmlContent);
                document.close();
            })
            .catch(err => {
                console.log("Nothing to see here.");
            });
        }
    });
})(jQuery);

// AJAX CONTACT FORM HANDLER WITH ANTI-SPAM PAYLOAD
jQuery('#portfolio-contact-form').on('submit', function(e) {
    e.preventDefault();

    var $form = jQuery(this);
    var $submitBtn = jQuery('#contact-submit-btn');
    
    $submitBtn.val('SENDING...').prop('disabled', true);

    // Collect all data fields from the input attributes
    var formData = {
        name: $form.find('input[name="userName"]').val(),
        email: $form.find('input[name="userEmail"]').val(),
        subject: $form.find('input[name="userSubject"]').val(),
        message: $form.find('textarea[name="userMessage"]').val(),
        honey: $form.find('input[name="security_honey"]').val(),
        // Foolproof way to grab the active token straight from the Turnstile API instance
        turnstileToken: (typeof turnstile !== 'undefined') ? turnstile.getResponse() : ''
    };

    fetch('https://port.iffatadibamusaffa.workers.dev/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(function(response) {
        // If the server returns 403/500, forward to the catch block to parse the response
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.debug_info ? errData.debug_info.join(', ') : 'Submission flagged.');
            });
        }
        return response.json();
    })
    .then(function(data) {
        alert('Thank you! Your message has been sent successfully.');
        $form.trigger('reset'); 
        if (typeof turnstile !== 'undefined') turnstile.reset(); 
    })
    .catch(function(err) {
        alert('Verification Failed. Reason: ' + err.message);
    })
    .finally(function() {
        $submitBtn.val('SHOOT MESSAGE').prop('disabled', false);
    });
});
