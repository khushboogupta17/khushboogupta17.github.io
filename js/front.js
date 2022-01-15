$(function () {

    /* =========================================
     * tooltip
     *  =======================================*/

    $('.customer img').tooltip();


    /* =========================================
     * counters
     *  =======================================*/

    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

    /* =================================================
     * Preventing URL update on navigation link click
     *  ==============================================*/

    $('.link-scroll').on('click', function (e) {
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 1000);
        e.preventDefault();
    });


    /* =========================================
     *  Scroll Spy
     *  =======================================*/

    $('body').scrollspy({
        target: '#navbarcollapse',
        offset: 80
    });


    /* =========================================
     * testimonial slider
     *  =======================================*/
  
    $('.team-slider').owlCarousel({
        loop: false,            
        nav: false,
        autoplay: true,
        autoplayTimeout: 8000,
        smartSpeed: 450,
        margin: 0,

        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            991: {
                items: 3
            },
            1200: {
                items: 3
            },
            1920: {
                items: 3
            }
        }

        
    });

    checkClasses();
    $('.team-slider').on('translated.owl.carousel', function(event) {
        checkClasses();
    });

    function checkClasses(){
        var total = $('.team-slider .owl-stage .owl-item.active').length;
        
        $('.team-slider .owl-stage .owl-item').each(function(index){
            $(this).removeClass('vertical-gradient');
        });
        // $('.team-slider .owl-stage .owl-item').removeClass('firstActiveItem lastActiveItem');
        
        $('.team-slider .owl-stage .owl-item.active').each(function(index){
            if (index === 0) {
                // this is the first one
                $(this).removeClass('vertical-gradient');
                return;
            }
            // if (index === total - 1 && total>1) {
            //     // this is the last one
            //     $(this).removeClass('vertical-gradient');
            //     return;
            // }
         $(this).addClass('vertical-gradient');

        });
    }

    /* =========================================
     * Leflet map
     *  =======================================*/
    map();


    /* =========================================
     * parallax
     *  =======================================*/
    $(window).scroll(function () {

        var scroll = $(this).scrollTop();

        if ($(window).width() > 1250) {
            $('.parallax').css({
                'background-position': 'left -' + scroll / 8 + 'px'
            });
        } else {
            $('.parallax').css({
                'background-position': 'center center'
            });
        }
    });

    /* =========================================
     * filter
     *  =======================================*/

    $('#filter a').click(function (e) {
        e.preventDefault();

        $('#filter li').removeClass('active');
        $(this).parent('li').addClass('active');

        var categoryToFilter = $(this).attr('data-filter');

        $('.reference-item').each(function () {

            if ($(this).data('category') === categoryToFilter || categoryToFilter === 'all') {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

    });


    /* =========================================
     * reference functionality
     *  =======================================*/
    $('.reference a').on('click', function (e) {

        e.preventDefault();

        var title = $(this).find('.reference-title').text(),
            description = $(this).siblings('.reference-description').html();

        $('#detail-title').text(title);
        $('#detail-content').html(description);

        var images = $(this).siblings('.reference-description').data('images').split(',');
        if (images.length > 0) {
            sliderContent = '';
            for (var i = 0; i < images.length; ++i) {
                sliderContent = sliderContent + '<div class="item"><img src=' + images[i] + ' alt="" class="img-fluid"></div>';

               
            }
        } else {
            sliderContent = '';
        }

        openReference(sliderContent);

    });

    function openReference(sliderContent) {
        $('#detail').slideDown();
        $('#references-masonry').slideUp();


        if (sliderContent !== '') {

            var slider = $('#detail-slider');

            if (slider.hasClass('owl-loaded')) {
                slider.trigger('replace.owl.carousel', sliderContent);
            } else {
                slider.html(sliderContent);
                slider.owlCarousel({
                    nav: false,
                    dots: true,
                    items: 1
                });

            }
        }
    }


    function closeReference() {
        $('#references-masonry').slideDown();
        $('#detail').slideUp();
    }

    $('#filter button, #detail .close').on('click', function () {
        closeReference();
    });


    /* =========================================
     *  animations
     *  =======================================*/

    delayTime = 0;

    $('[data-animate]').waypoint(function (direction) {
        delayTime += 250;

        var element = $(this.element);

        $(this.element).delay(delayTime).queue(function (next) {
            element.toggleClass('animated');
            element.toggleClass(element.data('animate'));
            delayTime = 0;
            next();
        });

        this.destroy();

    }, {
        offset: '90%'
    });
    
    $('[data-animate-hover]').hover(function () {
        $(this).css({
            opacity: 1
        });
        $(this).addClass('animated');
        $(this).removeClass($(this).data('animate'));
        $(this).addClass($(this).data('animate-hover'));
    }, function () {
        $(this).removeClass('animated');
        $(this).removeClass($(this).data('animate-hover'));
    });

    /* =========================================
     * for demo purpose
     *  =======================================*/

    var stylesheet = $('link#theme-stylesheet');
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $('link#new-stylesheet');

    if ($.cookie("theme_csspath")) {
        alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function () {

        if ($(this).val() !== '') {

            var theme_csspath = 'css/style.' + $(this).val() + '.css';

            alternateColour.attr("href", theme_csspath);

            $.cookie("theme_csspath", theme_csspath, {
                expires: 365,
                path: document.URL.substr(0, document.URL.lastIndexOf('/'))
            });

        }

        return false;
    });

});



/* =========================================
 * styled Leaflet Map
 *  =======================================*/
// ------------------------------------------------------ //
// styled Leaflet  Map
// ------------------------------------------------------ //

function map() {

    var mapId = 'map',
        mapCenter = [53.14, 8.22],
        mapMarker = true;

    if ($('#' + mapId).length > 0) {

        var icon = L.icon({
            iconUrl: 'img/marker.png',
            iconSize: [25, 37.5],
            popupAnchor: [0, -18],
            tooltipAnchor: [0, 19]
        });

        var dragging = false,
            tap = false;

        if ($(window).width() > 700) {
            dragging = true;
            tap = true;
        }

        var map = L.map(mapId, {
            center: mapCenter,
            zoom: 13,
            dragging: dragging,
            tap: tap,
            scrollWheelZoom: false
        });

        var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });

        Stamen_TonerLite.addTo(map);

        map.once('focus', function () {
            map.scrollWheelZoom.enable();
        });

        if (mapMarker) {
            var marker = L.marker(mapCenter, {
                icon: icon
            }).addTo(map);

            marker.bindPopup("<div class='p-4'><h5>Info Window Content</h5><p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p></div>", {
                minwidth: 200,
                maxWidth: 600,
                className: 'map-custom-popup'
            })

        }
    }


   
   

}



function DownloadResume() {
    var response = confirm("Do you want to view the resume?");
    if (response) {
        location.href = 'downloads/Khushboo_April2021.pdf'
    }
    return false;

};



function OnFilterButtonPressed(value) {
    if (value != "all") {
        var x = document.getElementsByClassName('grid__item');


        $(".filter").fadeOut(300).promise().done(function () {
            $(this).filter('.' + value).fadeIn(100);
            AddVerticalLines();
        });

        var i;

        for (i = 0; i < x.length; i++) {
            if (x[i].classList.contains("show"))
                x[i].classList.remove("show");

            if (x[i].classList.contains(value)) {
                x[i].classList.add("show");

            }
        }

    }
    else {

        $(".filter").fadeOut(300).promise().done(function () {
            $(this).fadeIn(100);
            AddVerticalLines();
        });
        var allItems = $(".grid__item");
        allItems.addClass('show');

    }


}



var btns = document.getElementsByClassName("filter-button");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var buttons = document.getElementById('grid-options');
        var current = buttons.getElementsByClassName('active');
        current[0].classList.remove('active');
        this.classList.add('active');
        OnFilterButtonPressed($(this).attr('data-filter'));
    });
}

function AddVerticalLines() {
    var gridEle = document.getElementById('grid-list');
    var activeElements = gridEle.getElementsByClassName("show"), ind;
    var isMultipleOf = 2;

    var isMobile = false

    if (window.innerWidth < 600)
        isMobile = true;


    for (ind = 0; ind < activeElements.length; ind++) {

        if (activeElements[ind].classList.contains("vertical"))
            activeElements[ind].classList.remove("vertical");

        if (activeElements[ind].classList.contains("vertical-right"))
            activeElements[ind].classList.remove("vertical-right");

        var t = ind % isMultipleOf;

        if (t != 0 && !isMobile) {
            if (activeElements[ind].offsetHeight > activeElements[ind - 1].offsetHeight)
                activeElements[ind].classList.add("vertical");
            else activeElements[ind - 1].classList.add("vertical-right");
        }

        if (isMobile)
            activeElements[ind].classList.add("vertical");
    }

}



// Get the modal
var modal = document.getElementById("myModal");
arr = [];
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementsByClassName("grid__img");
var AchievementsIMg = document.getElementsByClassName("img-fluid");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

for (var i = 0; i < img.length; i++) {
    img[i].onclick = OnModalCick;
}

for (var i = 0; i < AchievementsIMg.length; i++) {
    AchievementsIMg[i].onclick = OnModalCick;
}

function OnModalCick() {
    modal.style.display = "block";
    document.querySelector("body").style.overflow = 'hidden';
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
    document.querySelector("body").style.overflow = 'visible';
}

modal.onclick = function () {
    modal.style.display = "none";
    document.querySelector("body").style.overflow = 'visible';
}

$(document).ready(function () {
    // Gets the video src from the data-src on each button

    var $videoSrc;
    $(".video-btn").click(function () {
        $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);

    // when the modal is opened autoplay it
    $("#myModal").on("shown.bs.modal", function (e) {
        // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
        $("#video").attr(
            "src",
            $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
        );
    });

    // stop playing the youtube video when I close the modal
    $("#myModal").on("hide.bs.modal", function (e) {
        // a poor man's stop video
        $("#video").attr("src", $videoSrc);
    });

    // document ready
});


(function ($) {

    var $window = $(window),
        $body = $('body');

    $('.gallery')
        .on('click', 'a', function (event) {

            var $a = $(this),
                $gallery = $a.parents('.gallery'),
                $modal = $gallery.children('.modal'),
                $modalImg = $modal.find('img'),
                href = $a.attr('href');

            // Not an image? Bail.
            if (!href.match(/\.(jpg|gif|png|mp4)$/))
                return;

            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Locked? Bail.
            if ($modal[0]._locked)
                return;

            // Lock.
            $modal[0]._locked = true;

            // Set src.
            $modalImg.attr('src', href);

            // Set visible.
            $modal.addClass('visible');

            // Focus.
            $modal.focus();

            // Delay.
            setTimeout(function () {

                // Unlock.
                $modal[0]._locked = false;

            }, 600);

        })
        .on('click', '.modal', function (event) {

            var $modal = $(this),
                $modalImg = $modal.find('img');

            // Locked? Bail.
            if ($modal[0]._locked)
                return;

            // Already hidden? Bail.
            if (!$modal.hasClass('visible'))
                return;

            // Stop propagation.
            event.stopPropagation();

            // Lock.
            $modal[0]._locked = true;

            // Clear visible, loaded.
            $modal
                .removeClass('loaded')

            // Delay.
            setTimeout(function () {

                $modal
                    .removeClass('visible')

                setTimeout(function () {

                    // Clear src.
                    $modalImg.attr('src', '');

                    // Unlock.
                    $modal[0]._locked = false;

                    // Focus.
                    $body.focus();

                }, 475);

            }, 125);

        })
        .on('keypress', '.modal', function (event) {

            var $modal = $(this);

            // Escape? Hide modal.
            if (event.keyCode == 27)
                $modal.trigger('click');

        })
        .on('mouseup mousedown mousemove', '.modal', function (event) {

            // Stop propagation.
            event.stopPropagation();

        })
        .prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
        .find('img')
        .on('load', function (event) {

            var $modalImg = $(this),
                $modal = $modalImg.parents('.modal');

            setTimeout(function () {

                // No longer visible? Bail.
                if (!$modal.hasClass('visible'))
                    return;

                // Set loaded.
                $modal.addClass('loaded');

            }, 275);

        });

})(jQuery);





