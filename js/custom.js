// ISOTOPE FILTER & DYNAMIC REPO PROXY WITH LIGHTBOX OVERLAY
jQuery(document).ready(function($){
    var $container = $('#dynamic-portfolio-container');
    var workerUrl = 'https://port.iffatadibamusaffa.workers.dev/api/portfolio';

    var lightboxImages = [];
    var currentLightboxIndex = 0;

    var currentPage = 0;
    var itemsPerPage = 8;
    var currentFilter = '*';

    var isSecretMode = false;
    var secretClicks = 0;
    var secretTimer = null;
    var domain_p1  = "htt" + "ps://po" + "rt.iff" + "atadi" + "bamu";
    var domain_p2  = "sa" + "ffa.wor" + "kers.d" + "ev";
    var route      = "/sec" + "ret";
    var secureUrl  = domain_p1 + domain_p2 + route;
    var handshake  = "activate-hb-mode".replace("-hb-", "-hobby-");

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

    function updateIsotopePagination() {
        var $matchingItems = $container.find('.iso-box').filter(currentFilter === '*' ? 'div' : currentFilter);
        var totalMatching = $matchingItems.length;

        var start = currentPage * itemsPerPage;
        var end = start + itemsPerPage;
        $matchingItems.each(function(index) {
            if (index >= start && index < end) {
                $(this).removeClass('page-hidden');
            } else {
                $(this).addClass('page-hidden');
            }
        });

        var compoundFilter = (currentFilter === '*') ? ':not(.page-hidden)' : currentFilter + ':not(.page-hidden)';
        $container.isotope({ 
            filter: compoundFilter,
            animationOptions: { 
                duration: 750, 
                easing: 'linear', 
                queue: false, 
            }                
        });

        $('#portfolio-prev').prop('disabled', currentPage === 0);
        $('#portfolio-next').prop('disabled', end >= totalMatching);
    }

    if ( $container.length > 0 ) { 

        fetch(workerUrl)
            .then(response => {
                if(!response.ok) throw new Error("HTTP error " + response.status);
                return response.json();
            })
            .then(data => {
                let itemsHtml = '';
                data.forEach(item => {
                    itemsHtml += createItemCard(item);
                });
                $container.html(itemsHtml);
                $container.imagesLoaded(function () {
                    
                    $container.isotope({
                        layoutMode: 'fitRows',
                        itemSelector: '.iso-box'
                    });

                    updateIsotopePagination();
                });
            })
            .catch(error => {
                console.error("Failed loading portfolio layout:", error);
                $container.html("<div class='col-md-12 text-center'><p>Unable to load portfolio assets cleanly.</p></div>");
            });
        $(document).on('click', '.filter-wrapper li a', function(){
            var $this = $(this);
            currentFilter = $this.attr('data-filter');
            currentPage = 0; 
            updateIsotopePagination();            
            if ( $this.hasClass('selected') ) { return false; }
            var filter_wrapper = $this.closest('.filter-wrapper');
            filter_wrapper.find('.selected').removeClass('selected');
            $this.addClass('selected');
            return false;
        }); 
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
                    isSecretMode = true;
                    $('.filter-wrapper li a[data-filter=".hardware"]').text('Games');
                    $('.filter-wrapper li a[data-filter=".software"]').text('Anime');
                    $('.filter-wrapper li a[data-filter=".web"]').text('Manga');
                    $('#music-filter-tab').show();
                    if ($('.filter-wrapper li a[data-filter=".music"]').length === 0) {
                        $('.filter-wrapper .portfolio-filter').append('<li><a href="#" data-filter=".music">Music</a></li>');
                    }
                    if (secretData.portfolioItems) {
                        let secretHtml = '';
                        secretData.portfolioItems.forEach(item => {
                            secretHtml += createItemCard(item);
                        });
                        $container.html(secretHtml);
                        currentPage = 0;
                        currentFilter = '*';
                        $container.imagesLoaded(function () {
                            $container.isotope('reloadItems');
                            updateIsotopePagination();
                            $('.filter-wrapper li a').removeClass('selected');
                            $('.filter-wrapper li a[data-filter="*"]').addClass('selected');
                        });
                    }
                    $('html, body').animate({ scrollTop: 0 }, 'slow');
                })
                .catch(err => {
                    console.log("Nothing to see here.");
                });
            }
        });
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


$('.main-navigation').onePageNav({
    scrollThreshold: 0.2,
    scrollOffset: 75,
    filter: ':not(.external)',
    changeHash: true
}); 

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


$('.navbar-collapse a').click(function(){
    $(".navbar-collapse").collapse('hide');
});


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