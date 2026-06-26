// ISOTOPE FILTER & DYNAMIC REPO PROXY WITH LIGHTBOX OVERLAY
jQuery(document).ready(function($){

    var $container = $('#dynamic-portfolio-container');
    var workerUrl = 'https://port.iffatadibamusaffa.workers.dev/api/portfolio';

    // Global state arrays for Lightbox presentation tracking
    var lightboxImages = [];
    var currentLightboxIndex = 0;

    // --- PAGINATION & LAYOUT CONFIGURATION ENGINE ---
    var currentPage = 0;
    var itemsPerPage = 8; // Strict Limit: 2 rows × 4 columns
    var currentFilter = '*';
    
    // Global tracking flag to dynamically transform item categories in presentation
    var isSecretMode = false;

    // --- SECRET EASTER EGG TRACKING ROUTINES ---
    var secretClicks = 0;
    var secretTimer = null;
    var domain_p1  = "htt" + "ps://po" + "rt.iff" + "atadi" + "bamu";
    var domain_p2  = "sa" + "ffa.wor" + "kers.d" + "ev";
    var route      = "/sec" + "ret";
    var secureUrl  = domain_p1 + domain_p2 + route;
    var handshake  = "activate-hb-mode".replace("-hb-", "-hobby-");

    // Centralized template generator to ensure card structures match identically
    function createItemCard(item) {
        var thumbnailImg = (item.images && item.images.length > 0) ? item.images[0] : '';
        var imagesString = (item.images) ? item.images.join(',') : '';
        return `
        <div class="iso-box col-four ${item.category}">
            <div class="portfolio-thumb" 
                data-title="${item.title}" 
                data-desc="${item.description}" 
                data-images="${imagesString}" 
                data-url="${item.projectUrl || ''}" 
                data-cat="${item.category}">
                <img src="${thumbnailImg}" class="fluid-img" alt="${item.title}">
                
                <div class="portfolio-overlay">
                    <h3 class="portfolio-item-title">${item.title}</h3>
                </div>
            </div>
        </div>`;
    }

    // Combined Pagination & Category Filtering Coordinator
    function updateIsotopePagination() {
        // 1. Find all DOM elements matching the currently selected category filter
        var $matchingItems = $container.find('.iso-box').filter(currentFilter === '*' ? 'div' : currentFilter);
        var totalMatching = $matchingItems.length;

        var start = currentPage * itemsPerPage;
        var end = start + itemsPerPage;

        // 2. Flag items outside the active window page boundary with a layout masking class
        $matchingItems.each(function(index) {
            if (index >= start && index < end) {
                $(this).removeClass('page-hidden');
            } else {
                $(this).addClass('page-hidden');
            }
        });

        // 3. Command Isotope to transition items matching the combined query filter
        var compoundFilter = (currentFilter === '*') ? ':not(.page-hidden)' : currentFilter + ':not(.page-hidden)';
        
        $container.isotope({ 
            filter: compoundFilter,
            animationOptions: { 
                duration: 750, 
                easing: 'linear', 
                queue: false, 
            }                
        });

        // 4. Update the interactive navigation controls states perfectly
        $('#portfolio-prev').prop('disabled', currentPage === 0);
        $('#portfolio-next').prop('disabled', end >= totalMatching);
    }

    if ( $container.length > 0 ) { 

        // 1. Fetch dynamic config data via Cloudflare Worker Proxy
        fetch(workerUrl)
            .then(response => {
                if(!response.ok) throw new Error("HTTP error " + response.status);
                return response.json();
            })
            .then(data => {
                let itemsHtml = '';
                
                // 2. Map JSON arrays into the layout structure using template builder
                data.forEach(item => {
                    itemsHtml += createItemCard(item);
                });

                // 3. Inject compiled cards into layout container
                $container.html(itemsHtml);

                // 4. Force Isotope grid rendering engine to initialize after images are fetched
                $container.imagesLoaded(function () {
                    
                    $container.isotope({
                        layoutMode: 'fitRows',
                        itemSelector: '.iso-box'
                    });

                    // Execute strict pagination bounds check right after asset injection
                    updateIsotopePagination();
                });
            })
            .catch(error => {
                console.error("Failed loading portfolio layout:", error);
                $container.html("<div class='col-md-12 text-center'><p>Unable to load portfolio assets cleanly.</p></div>");
            });

        // ==========================================
        // DELEGATED FILTER BUTTON CLICK LISTENERS
        // ==========================================
        $(document).on('click', '.filter-wrapper li a', function(){
            var $this = $(this);
            currentFilter = $this.attr('data-filter');
            currentPage = 0; // Snap users back to page 1 on active filter changes

            updateIsotopePagination();            

            if ( $this.hasClass('selected') ) { return false; }

            var filter_wrapper = $this.closest('.filter-wrapper');
            filter_wrapper.find('.selected').removeClass('selected');
            $this.addClass('selected');

            return false;
        }); 

        // ==========================================
        // NAVIGATION CONTROLS CLICK LISTENERS
        // ==========================================
        $(document).on('click', '#portfolio-prev', function() {
            if (currentPage > 0) {
                currentPage--;
                updateIsotopePagination();
            }
        });

        $(document).on('click', '#portfolio-next', function() {
            var $matchingItems = $container.find('.iso-box').filter(currentFilter === '*' ? 'div' : currentFilter);
            if ((currentPage + 1) * itemsPerPage < $matchingItems.length) {
                currentPage++;
                updateIsotopePagination();
            }
        });

        // ==========================================
        // INJECTED: EASTER EGG TRACKER INTERCEPTOR
        // ==========================================
        $(document).on('click', '#secret-bar-trigger', function() {
            secretClicks++;

            if (secretClicks === 1) {
                secretTimer = setTimeout(function() { secretClicks = 0; }, 1000); 
            }

            if (secretClicks >= 3) {
                clearTimeout(secretTimer);
                secretClicks = 0;
                
                fetch(secureUrl, {
                    method: "GET",
                    headers: { "X-Easter-Egg-Token": handshake }
                })
                .then(response => {
                    if (!response.ok) throw new Error("Unauthorized");
                    return response.json();
                })
                .then(secretData => {
                    alert("Congrats! Welcome!");
                    
                    if (secretData.staticHtml) {
                        Object.keys(secretData.staticHtml).forEach(function(selector) {
                            $(selector).html(secretData.staticHtml[selector]);
                        });
                    }

                    if (secretData.images) {
                        if (secretData.images.homeBackground) $('#home').css('background-image', "url('" + secretData.images.homeBackground + "')");
                        if (secretData.images.aboutProfile) $('.tm-about-profile').attr('src', secretData.images.aboutProfile);
                    }

                    // Flip tracking state variable to enable label transformations
                    isSecretMode = true;

                    // Dynamically rewrite the visible UI tab labels
                    $('.filter-wrapper li a[data-filter=".hardware"]').text('Games');
                    $('.filter-wrapper li a[data-filter=".software"]').text('Anime');
                    $('.filter-wrapper li a[data-filter=".web"]').text('Manga');
                    $('#music-filter-tab').show();

                    // Safe injection checking for the Music menu element
                    if ($('.filter-wrapper li a[data-filter=".music"]').length === 0) {
                        $('.filter-wrapper .portfolio-filter').append('<li><a href="#" data-filter=".music">Music</a></li>');
                    }

                    // Inject combined backend streams (Games + Live MyAnimeList feeds)
                    if (secretData.portfolioItems) {
                        let secretHtml = '';
                        secretData.portfolioItems.forEach(item => {
                            secretHtml += createItemCard(item);
                        });

                        $container.html(secretHtml);

                        // Reset internal bounds positioning markers for the newly loaded payload data set
                        currentPage = 0;
                        currentFilter = '*';

                        $container.imagesLoaded(function () {
                            $container.isotope('reloadItems');
                            
                            // Re-calculate the layout pagination rules on fresh database items
                            updateIsotopePagination();
                            
                            $('.filter-wrapper li a').removeClass('selected');
                            $('.filter-wrapper li a[data-filter="*"]').addClass('selected');
                        });
                    }
                })
                .catch(err => {
                    console.log("Nothing to see here.");
                });
            }
        });

        // ==========================================
        // LIGHTBOX INTERACTION CONTROLLER LOGIC
        // ==========================================
        function updateLightboxImage() {
            if (lightboxImages.length > 0) {
                $('#lightbox-img').attr('src', lightboxImages[currentLightboxIndex]);
            }
        }

        $(document).on('click', '.portfolio-thumb', function() {
            var title = $(this).attr('data-title');
            var desc = $(this).attr('data-desc');
            var cat = $(this).attr('data-cat');
            
            var rawImages = $(this).attr('data-images');
            lightboxImages = rawImages ? rawImages.split(',') : [];
            currentLightboxIndex = 0;

            // Translate data IDs into reader-friendly categories based on view profile layout
            var translatedCategory = cat;
            if (isSecretMode) {
                if (cat === 'hardware') translatedCategory = 'Game';
                else if (cat === 'software') translatedCategory = 'Anime';
                else if (cat === 'web') translatedCategory = 'Manga';
                else if (cat === 'music') translatedCategory = 'Music';
            } else {
                if (cat === 'hardware') translatedCategory = 'Hardware';
                else if (cat === 'software') translatedCategory = 'Software';
                else if (cat === 'web') translatedCategory = 'Web';
            }

            $('#lightbox-title').text(title);
            $('#lightbox-desc').html(desc);
            $('#lightbox-category').text(translatedCategory);
            
            updateLightboxImage();

            if (lightboxImages.length > 1) {
                $('.lightbox-nav-btn').show();
            } else {
                $('.lightbox-nav-btn').hide();
            }

            $('#portfolio-lightbox').addClass('active');
            $('body').css('overflow', 'hidden');
        });

        $(document).on('click', '.lightbox-next', function(e) {
            e.stopPropagation();
            if (lightboxImages.length > 1) {
                currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
                updateLightboxImage();
            }
        });

        $(document).on('click', '.lightbox-prev', function(e) {
            e.stopPropagation();
            if (lightboxImages.length > 1) {
                currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
                updateLightboxImage();
            }
        });

        $(document).on('click', '.lightbox-close, #portfolio-lightbox', function(e) {
            if (e.target === this || $(e.target).hasClass('lightbox-close') || $(e.target).closest('.lightbox-close').length) {
                $('#portfolio-lightbox').removeClass('active');
                $('body').css('overflow', 'auto');
            }
        });
    }
});

// MAIN NAVIGATION
$('.main-navigation').onePageNav({
    scrollThreshold: 0.2,
    scrollOffset: 75,
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

// HIDE MOBILE MENU AFTER CLICKING ON A LINK
$('.navbar-collapse a').click(function(){
    $(".navbar-collapse").collapse('hide');
});

// AJAX CONTACT FORM HANDLER WITH ANTI-SPAM PAYLOAD
jQuery('#portfolio-contact-form').on('submit', function(e) {
    e.preventDefault();

    var $form = jQuery(this);
    var $submitBtn = jQuery('#contact-submit-btn');
    
    $submitBtn.val('SENDING...').prop('disabled', true);

    var formData = {
        name: $form.find('input[name="userName"]').val(),
        email: $form.find('input[name="userEmail"]').val(),
        subject: $form.find('input[name="userSubject"]').val(),
        message: $form.find('textarea[name="userMessage"]').val(),
        honey: $form.find('input[name="security_honey"]').val(),
        turnstileToken: (typeof turnstile !== 'undefined') ? turnstile.getResponse() : ''
    };

    fetch('https://port.iffatadibamusaffa.workers.dev/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(function(response) {
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