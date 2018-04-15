/*
 * Created by hamidteimouri on 2016-06-26.
 */
(function ($) {
    $.fn.htSlider = function (userOption) {
        var options = $.extend({
            slideTime: 3000,              // in ms
            speed: 1000,                   // in ms
            inAnimation: "fade",          // fade , swipeLeft , swipeRight , slide , random
            outAnimation: "fade",         // fade , swipeLeft , swipeRight , slide , random
            pauseOnHover: true,           // pause slider when mouse hover on slide
            swipeSupport: true,           // touch in mobile devices (need  jquery.mobile)
            displayOrder: "sequential",   // sequential , random
            showCaption: true,            // show caption
            showNextPrev: true,           // show next and previous button
            showSliderCounter: true,      // show slider counter
            showControls: true            // show number buttons


        }, userOption);

        var slider = this;
        var slides = slider.find("ul").children();
        var slideCount = slides.length;
        var i = 0;    // current slide index

        $(document).ready(function () {

            // add slider counter to html
            var counterTag = $("<span>").addClass("sliderCounter");
            if (options.showSliderCounter) {
                slider.append(counterTag);
                counterTag.html((i + 1) + " / " + slideCount);
            }

            // add caption to slider
            var captionTag = $("<div>").addClass("sliderCaption");
            if (options.showCaption) {
                slider.append(captionTag);
                if ($(slides[i]).is("[title]")) {
                    captionTag.html($(slides[i]).attr("title")).fadeIn(options.speed);
                }

            }

            // add Next / Prev button
            if (options.showNextPrev) {
                var nextTag = $("<span>").addClass("next");
                var prevTag = $("<span>").addClass("prev");
                slider.append(nextTag, prevTag);
                nextTag.click(function () {   // next slide
                    showSlideByIndex(i + 1);
                });
                prevTag.click(function () {   // prev slide
                    showSlideByIndex(i - 1);
                });
            }
            // add controls buttons to slider
            if (options.showControls) {

                var buttonsRowTag = $("<div>").addClass("buttonsRow");
                for (var j = 0; j < slideCount; j++) {
                    buttonsRowTag.append($("<span>").attr("data-sn", j).html(j + 1));
                }
                slider.append(buttonsRowTag);
                slider.find("div.buttonsRow span").click(function () {
                    var slideNum = Number($(this).attr("data-sn"));
                    if (slideNum != i) {
                        showSlideByIndex(slideNum);
                    }
                });

            }

            var iv = setInterval(autoSlide, options.slideTime);

            function autoSlide() {
                if (options.displayOrder == "sequential") {
                    showSlideByIndex(i + 1);
                } else {
                    var rn = rand(0, slideCount - 1);
                    if (rn == i) {
                        showSlideByIndex(rn + 1);
                    } else {
                        showSlideByIndex(rn);
                    }
                }
            }

            if (options.pauseOnHover) {
                slider.hover(function () {
                    // stop
                    clearInterval(iv);
                }, function () {
                    // start again
                    iv = setInterval(autoSlide, options.slideTime);
                })
            }

            // support for touch device
            if (options.swipeSupport && $.fn.swipe) { // if has in options && has (swipe method)
                slider.on("dragsart", function (ev) {
                    ev.preventDefault();
                });
                slider.swiperight(function () {
                    showSlideByIndex(i - 1, "fade", "swipeRight");
                });
                slider.swipeleft(function () {
                    showSlideByIndex(i + 1, "fade", "swipeLeft");
                });
            }
            function slideOut(customAnimation) { // function for select slideIn animation
                var anim = (typeof customAnimation !== "undefined") ? customAnimation : options.outAnimation;
                if (anim == "random") {
                    var anims = ["fade", "slide", "swipeLeft", "swipeRight"];
                    anim = anims[rand(0, anims.length)];
                }
                var slide = $(slides[i]);
                slide.removeClass("currentSlide");
                switch (anim) {

                    case "swipeRight":
                        slide.animate({left: slider.width()}, options.speed, function () {
                            slide.css({left: 0, display: "none"})
                        });
                        break;
                    case "swipeLeft":
                        slide.animate({left: (-1 * slider.width())}, options.speed, function () {
                            slide.css({left: 0, display: "none"})
                        });
                        break;
                    case "slide":
                        slide.slideUp(options.speed);
                        break;
                    case "fade":
                    default :
                        slide.fadeOut(options.speed);

                }


            }

            function slideIn(customAnimation) { // function for select slideOut animation
                var anim = (typeof customAnimation !== "undefined") ? customAnimation : options.inAnimation;
                if (anim == "random") {
                    var anims = ["fade", "slide", "swipeLeft", "swipeRight"];
                    anim = anims[rand(0, anims.length)];
                }
                var slide = $(slides[i]);
                slide.addClass("currentSlide");
                switch (anim) {
                    case "swipeRight":
                        slide.css({left: (-1 * slide.width()), display: "list-item"});
                        slide.animate({left: 0}, options.speed);
                        break;
                    case "swipeLeft":
                        slide.css({left: slide.width(), display: "list-item"});
                        slide.animate({left: 0}, options.speed);
                        break;
                    case "slide":
                        slide.slideDown(options.speed);
                        break;
                    case "fade":
                    default :
                        slide.fadeIn(options.speed);
                }
            }

            function showSlideByIndex(s, outAnimationEffect, inAnimationEffect) {
                slideOut(outAnimationEffect);
                i = ( (s + slideCount) % slideCount );
                slideIn(inAnimationEffect);

                if (options.showCaption) {  // show slide's caption
                    if ($(slides[i]).is("[title]")) {   // if has title
                        captionTag.html($(slides[i]).attr("title")).fadeIn(options.speed);
                    } else {
                        captionTag.html("").fadeOut(options.speed);
                    }
                }

                if (options.showSliderCounter) { // update slider's counter
                    counterTag.text(i + 1 + " / " + slideCount);
                }
                if (options.showControls) {

                    slider.find("div.buttonsRow span").removeClass("curr");
                    slider.find("div.buttonsRow span:eq(" + (i) + ")").addClass("curr");
                }
            }

            function rand(start, end) {
                return ( start + Math.floor(Math.random() * (end - start)));
            }


        });
    }
})(jQuery);