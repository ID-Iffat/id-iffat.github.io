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
                            data-url="${item.projectUrl || ''}" 
                            data-cat="${item.category}">
                            <img src="${thumbnailImg}" class="fluid-img" alt="${item.title}">
                            
                            <div class="portfolio-overlay">
                                <h3 class="portfolio-item-title">${item.title}</h3>
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
    // 1. GLOBAL STATE TRACKING (Shared across easter egg and navigation controls)
    var secretClicks = 0;
    var secretTimer = null;
    var combinedItems = [];
    var currentPage = 0;
    var currentFilter = '*';
    var itemsPerPage = 10; // Strict limit: 2 rows × 5 columns

    // 2. OBFUSCATED API ROUTING PATHWAYS
    var domain_p1  = "htt" + "ps://po" + "rt.iff" + "atadi" + "bamu";
    var domain_p2  = "sa" + "ffa.wor" + "kers.d" + "ev";
    var route      = "/sec" + "ret";
    
    var secureUrl  = domain_p1 + domain_p2 + route;
    var handshake  = "activate-hb-mode".replace("-hb-", "-hobby-");

    // 3. SECRET EASTER EGG CLICK TRIGGER
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
                
                // Process static text adjustments
                if (secretData.staticHtml) {
                    Object.keys(secretData.staticHtml).forEach(function(selector) {
                        var contentMarkup = secretData.staticHtml[selector];
                        $(selector).html(contentMarkup);
                    });
                }

                // Swaps branding imagery
                if (secretData.images) {
                    if (secretData.images.homeBackground) $('#home').css('background-image', "url('" + secretData.images.homeBackground + "')");
                    if (secretData.images.aboutProfile) $('.tm-about-profile').attr('src', secretData.images.aboutProfile);
                }

                // Seed data array with hardcoded portfolio updates (like Games)
                combinedItems = secretData.portfolioItems ? [...secretData.portfolioItems] : [];

                // Execute Live API Fetch from MyAnimeList accounts
                var username = "FFeT";
                var corsProxy = "https://corsproxy.io/?";
                var malAnimeUrl = `${corsProxy}https://myanimelist.net/animelist/${username}/load.json?status=7&offset=0`;
                var malMangaUrl = `${corsProxy}https://myanimelist.net/mangalist/${username}/load.json?status=7&offset=0`;

                var malStatusMap = {
                    1: "Watching / Reading",
                    2: "Completed",
                    3: "On Hold",
                    4: "Dropped",
                    6: "Plan to Watch"
                };

                Promise.all([
                    fetch(malAnimeUrl).then(r => r.ok ? r.json() : []),
                    fetch(malMangaUrl).then(r => r.ok ? r.json() : [])
                ])
                .then(([animeData, mangaData]) => {
                    
                    // Parse live Anime feed records
                    if (Array.isArray(animeData)) {
                        animeData.forEach(function(entry) {
                            combinedItems.push({
                                id: "mal-anime-" + entry.anime_id,
                                title: entry.anime_title,
                                category: "software", // Filters under your Anime button
                                description: `Status: ${malStatusMap[entry.status] || 'Unknown'} | My Score: ${entry.score || "Unrated"}`,
                                images: [entry.anime_image_path],
                                projectUrl: "https://myanimelist.net" + entry.anime_url
                            });
                        });
                    }

                    // Parse live Manga feed records
                    if (Array.isArray(mangaData)) {
                        mangaData.forEach(function(entry) {
                            combinedItems.push({
                                id: "mal-manga-" + entry.manga_id,
                                title: entry.manga_title,
                                category: "web", // Filters under your Manga button
                                description: `Status: ${malStatusMap[entry.status] || 'Unknown'} | My Score: ${entry.score || "Unrated"}`,
                                images: [entry.manga_image_path],
                                projectUrl: "https://myanimelist.net" + entry.manga_url
                            });
                        });
                    }

                    // Render grid layout engine on launch selection
                    renderPortfolioGrid();
                });
            })
            .catch(err => {
                console.log("Nothing to see here.");
            });
        }
    });

    // 4. REUSABLE PAGINATED RENDERING ENGINE
    function renderPortfolioGrid() {
        // Filter elements based on active categories
        var filtered = combinedItems;
        if (currentFilter !== '*') {
            var targetCategory = currentFilter.replace('.', ''); // transforms '.web' filter into matching 'web' string
            filtered = combinedItems.filter(function(item) {
                return item.category === targetCategory;
            });
        }

        // Slice array index window strictly to current page window (max 10 items)
        var startIndex = currentPage * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        var itemsToDisplay = filtered.slice(startIndex, endIndex);

        // Build HTML template output using the .col-five layout framework
        var itemsHtml = '';
        itemsToDisplay.forEach(function(item) {
            var thumbnailImg = (item.images && item.images.length > 0) ? item.images[0] : '';
            var imagesString = (item.images) ? item.images.join(',') : '';

            itemsHtml += `
            <div class="iso-box col-five ${item.category}">
                <div class="portfolio-thumb" 
                    data-title="${item.title}" 
                    data-desc="${item.description}" 
                    data-images="${imagesString}"
                    data-url="${item.projectUrl || ''}"
                    data-cat="${item.category}">
                    <img src="${thumbnailImg}" class="fluid-img" alt="${item.title}" style="height: 240px; object-fit: cover; width: 100%; border-radius: 4px;">
                    <div class="portfolio-overlay">
                        <h3 class="portfolio-item-title">${item.title}</h3>
                    </div>
                </div>
            </div>`;
        });

        // Insert code structures into portfolio and re-compile active layout positioning elements
        var $container = $('#dynamic-portfolio-container');
        $container.html(itemsHtml);
        $container.imagesLoaded(function () {
            $container.isotope('reloadItems').isotope({ layoutMode: 'fitRows' });
        });

        // Update pagination navigation states
        $('#portfolio-prev').prop('disabled', currentPage === 0);
        $('#portfolio-next').prop('disabled', endIndex >= filtered.length);
    }

    // 5. GLOBAL INTERACTIVE EVENT HANDLERS
    // Left Pagination Navigation Trigger
    $(document).on('click', '#portfolio-prev', function() {
        if (currentPage > 0) {
            currentPage--;
            renderPortfolioGrid();
        }
    });

    // Right Pagination Navigation Trigger
    $(document).on('click', '#portfolio-next', function() {
        currentPage++;
        renderPortfolioGrid();
    });

    // Filter Navigation Button Routing
    $(document).on('click', 'a[data-filter]', function(e) {
        // Check if list items have loaded before overwriting navigation properties
        if (combinedItems.length > 0) {
            e.preventDefault();
            currentFilter = $(this).attr('data-filter');
            currentPage = 0; // Snap users back to page 1 on active tab modifications
            renderPortfolioGrid();
            
            // Re-apply active theme highlighting classes on button selections
            $('a[data-filter]').parent().removeClass('active');
            $(this).parent().addClass('active');
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