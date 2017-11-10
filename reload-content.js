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
                hiddenClass: 'hidden',
                onComplete: function() {}
                //variationIdSelector: '[data-variation-id]'
            };
            
            var settings = $.extend({}, defaults, options);
            var el = $(this);
            var params = {};
            
            var element = el.attr('data-reload-content-element');
            if (element) {
                if (element === 'true') {
                    el.on('click', function() {
                        reload();
                    });
                }
            } else {
                reload();
            }
            
            function reload() {
                setQueryStringParams();
                setParams();
                
                $.get('/controller/Content/loadContent', params, function(msg) {
                    
                    var targetSelector = el.attr('data-reload-content-target');
                    var targetEl = targetSelector ? $(targetSelector) : el;
                    
                    var newEl = $(msg);
                    targetEl.replaceWith(newEl);
                    newEl.removeClass(settings.hiddenClass);
                    
                    settings.onComplete.call();
                });
            }
            
            function setQueryStringParams() {
                // Convert the existing query string into an object
                // We must pass this to the AJAX request so that the content type generated
                // will include all of the settings. E.g. ?tag=blahblah
                var match,
                    pl     = /\+/g,  // Regex for replacing addition symbol with a space
                    search = /([^&=]+)=?([^&]*)/g,
                    decode = function (s) {
                        return decodeURIComponent(s.replace(pl, " "));
                    },
                    query  = window.location.search.substring(1);
                
                while (match = search.exec(query)) {
                    params[decode(match[1])] = decode(match[2]);
                }
            }
            
            function setParams() {
                params['contentId'] = el.attr('data-reload-content');
                
                // Add a flag to the content type to indicate that the content is being
                // reloaded. This indicator allows the content to output different when
                // it's reloaded, such as including some inline JavaScript which would
                // fail otherwise.
                params['reloadContent'] = true;
            }
            
        });
    };
})(jQuery);