;(function($) {
    'use strict';

    var container, currentSlide, nextSlide, $slides, interval, controls,
        optionsDataPrefix = 'jqc-',
        options = {},
        version = '20131217-0';

    $.fn.confetti_cycle = function() {
        container = this;
        options = getOptions(this);
        $slides = getSlides(this);

        startCycling();

        return this;
    };

    function getSlides(self) {
        return $(">li", self).not('.controls');
    }

    function getOptions(self) {
        var defaultOptions = {
                'duration': 4000,
                'trans_speed': 500,
                'load': 'normal',
                'pause_on_hover': false,
                'controls': false
            };

        // Iterate over opts array, substituting default values with declarative values from HTML, where they exists
        $.each(defaultOptions, function(option) {
            var optionName = optionsDataPrefix + option,
                optionDataValue = $(self).data(optionName);

            options[option] = optionDataValue ? optionDataValue : defaultOptions[option];
        });

        return options;
    }

    function startCycling(restart) {
        var totalSlideDuration = options.duration + options.trans_speed;

        restart = !!restart;

        if (!restart) {
            prepareSlides();
        }
        if ($slides.length > 1) {
            interval = setInterval(function () { swap(); }, totalSlideDuration);
        }
    }

    function addPagingControls() {
        controls = $('<li class="controls"><ul></ul></li>');

        $('ul', controls).append('<li class="prev"><a href="#">Previous</a></li>');

        $($slides).each(function(i) {
            var activeClass;

            activeClass = i === 0 ? ' class="activeSlide"' : '';

            $('ul', controls).append('<li><a' + activeClass + ' data-' + optionsDataPrefix + '-slide_no="' + i +
                '" href="#" ></a></li>');
        });

        $('ul', controls).append('<li class="next"><a href="#">Next</a></li>');

        container.append(controls);

        controls.on('click', 'a', function(e) {
            var slideNum = $(this).data(optionsDataPrefix + 'slide_no');

            e.preventDefault();

            changeToSlide(slideNum);
        });
    }

    function changeToSlide(slideNum) {
        nextSlide = slideNum;
        clearInterval(interval);
        setControlsActiveSlide(nextSlide);
        swap();
        startCycling(true);
    }

    function setControlsActiveSlide(slideNum) {
        var $pagingControlElems = $('li>a', controls).not('li.prev>a').not('li.prev>a');
        $pagingControlElems.removeClass('activeSlide');
        $($pagingControlElems[slideNum]).addClass('activeSlide');
    }

    function pauseOnHover() {
        $slides.hover(function() {
            clearInterval(interval);
        }, function() {
            startCycling(true);
        });
    }

    function prepareSlides() {
        currentSlide = 0;
        nextSlide = 1;
        $($slides[0]).parent().css({
            'position': 'relative'
        });
        $slides.each(function(i, e){
           $(e).css({
               'position': 'absolute',
               'top': 0,
               'left': 0,
               'z-index': 0
           });
        });
        $($slides[0]).css({
            'z-index': 1
        });
        if (options.pause_on_hover) {
            pauseOnHover();
        }
        if (options.controls) {
            addPagingControls();
        }
    }

    function swap() {
        var trans_speed = options.trans_speed;

        $($slides[currentSlide]).css({
            'z-index': 2
        });
        $($slides[nextSlide]).css({
            'display': 'block',
            'z-index': 1
        });

        $($slides[currentSlide]).fadeOut(trans_speed, function() {
            $($slides[currentSlide]).css({
                'z-index': '0',
                'display': 'block'
            });
            setControlsActiveSlide(nextSlide);
            incrementSlideCount();
            lazyLoadNextSlide();
        });
    }

    function lazyLoadNextSlide() {
        var $img = $(''), $link = $('');
        if (options.load === 'lazy') {
            if ($($slides[nextSlide]).data(optionsDataPrefix + 'lazy_img')) {
                $img = $('<img src="' + $($slides[nextSlide]).data(optionsDataPrefix + 'lazy_img') + '">');
                if ($($slides[nextSlide]).data(optionsDataPrefix + 'lazy_link')) {
                    $link = $('<a href="' + $($slides[nextSlide]).data(optionsDataPrefix + 'lazy_link') + '"></a>');
                }
                $link.append($img);
                $($slides[nextSlide]).append($link);
            }
        }
    }

    function incrementSlideCount() {
        var numberOfSlides = $slides.length;

        currentSlide = nextSlide;
        nextSlide = currentSlide < numberOfSlides - 1 ? nextSlide + 1 : 0;
    }

})(jQuery);

