/**
 * reloadContent [c]2016, @n_cholas, OmCore Ltd. MIT/GPL
 *
 * https://github.com/nicholaswright/reload-content
 */
;(function($) {
    'use strict';
    $.fn.reloadContent = function(options) {
        return this.each(function() {
            
            var defaults = {
                onComplete: function() {}
                //variationIdSelector: '[data-variation-id]',
            };
            
            var settings = $.extend({}, defaults, options),
                el = $(this);
                
            // Convert the existing query string into an object
            // We must pass this to the AJAX request so that the content type generated
            // will include all of the settings. E.g. ?tag=blahblah
            var match,
                pl     = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { 
                    return decodeURIComponent(s.replace(pl, " ")); 
                },
                query  = window.location.search.substring(1),
            	urlParams = {};
            
            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);
        
            $.get('/admin/controller/Content/loadContent', {
                contentId: el.attr('data-reload-content'),
                getVars: urlParams
            }, function(msg) {
                
                var newEl = $(msg);
                el.replaceWith(newEl);
                newEl.css({
                    visibility: 'visible',
                    display: 'block'
                });
                
                settings.onComplete.call();
                
            /*
                // If Bootstrap JS is loaded then any carousels that are reloaded
                // must be started again.
                var bootstrap3_enabled = (typeof $().emulateTransitionEnd == 'function');
                if (bootstrap3_enabled) {
                    $('.carousel').carousel();
                }
        
                if ($.omcoreLightbox) {
                    $.omcoreLightbox();
                }
            */
            
            });
        });
    };
})(jQuery);