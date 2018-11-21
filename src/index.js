
    /**
     * Forced text replacement
     */

    // Based on location, do text replacement after 500ms
    if (location.href.indexOf('gradebook') != -1 && ENV.LOCALE == 'nb'){
        var karakterstatistikktimer = setInterval(karakterstatistikk, 500);
    }

    function karakterstatistikk(){
        $('[data-action=curveGrades]').text('Sett normalfordeling');
        $('span.ui-dialog-title').each(function(){
            $(this).text($(this).text().replace('Resultatstatistikk', 'Sett normalfordeling'));
        });
        $('span.ui-button-text').each(function(){
            $(this).text($(this).text().replace('Resultatstatistikk', 'Endre karakterer'));
        });
    }


    /**
     * Prevent save button in calendar event details for TP events
     */

    // Detail popup from calendar
    jQuery("body").on("DOMNodeInserted", "div.event-details div.event-details-content div.event-detail-overflow", null, function() {
        var eventdetails = jQuery("div.event-details div.event-details-content div.event-detail-overflow");
        if (!eventdetails.length) {
            return;
        }
        var externalEvent = matchExternalEvent(eventdetails.html());
        if (externalEvent) {
            jQuery("div.event-details div.event-details-footer button").prop('disabled', true);
        }

    });

    // Full-page detail view
    if (jQuery("div#full_calendar_event").length) {
        var eventdetails = jQuery("div#full_calendar_event div.description");
        if (eventdetails.length) {
            var externalEvent = matchExternalEvent(eventdetails.html());
            if (externalEvent) {
                jQuery("aside#right-side ul.page-action-list li:not(:first-child) a").bind('click', false).addClass("ui-state-disabled");
            }
        }
    }

    // Identify event as a TP event
    function matchExternalEvent(eventDetails) {
        var externalmatch = -1;
        externalmatch = eventDetails.search(/\<small\>Den må \<em\>ikke\<\/em\> redigeres i Canvas.\<\/small\>/);
        if (externalmatch != -1) {
            return true;
        }
        externalmatch = eventDetails.search(/\<span id="description-meta" style="display: none\;"\>/);
        if (externalmatch != -1) {
            return true;
        }
        return false;
    }


    /**
     * Hide any nodes with class uit_instructoronly for anyone without the teacher role
     */

    if (window.ENV.current_user_roles.indexOf('teacher') == -1) {
        var hiddenLinkEventObserver = new MutationObserver( function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                var $nodes = $( mutation.addedNodes ); // jQuery set
                $nodes.each( function() {
                    if (typeof this.querySelector === "function") {
                        var test = this.querySelector('.uit_instructoronly');
                        if (test !== null) {
                            test.remove();
                        }
                    }
                });
            }
        });
        hiddenLinkEventObserver.observe(document.body, { attributes: false, childList: true, subtree: true });
        $('.uit_instructoronly').remove();
    }


    /**
     * Prevent drag'n'drop in calendar for TP events
     */

    if (location.href.indexOf('calendar') != -1){
        var fcEventObserver = new MutationObserver( function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                var $nodes = $( mutation.addedNodes ); // jQuery set
                $nodes.each( function() {
                    if (typeof this.querySelector === "function") {
                        var test = this.querySelector('a.fc-event');
                        if (test !== null) {
                            handleCalendarEvent(test)
                        }
                    }
                });
            }
        });
        fcEventObserver.observe(document.body, { attributes: false, childList: true, subtree: true });
    }

    function handleCalendarEvent(eventNode) {
        var elements = [];
        $('div.fc.calendar').fullCalendar('clientEvents', calendarEventFilter).forEach(function(element) {
            element.editable = false;
            elements.push(element);
        });
        if (elements.length > 0) {
            $('div.fc.calendar').fullCalendar('updateEvents', elements);
            elements = [];
        }
    }

    function calendarEventFilter(event) {
        if (event.title.search(/[\u200B]{2}$/) == -1) {
            return false;
        }
        if (event.editable == false) {
            return false;
        }
        return true;
    }

    /**
     * Utility functions
     */

    // Possibly unused - get text from node, ignore children

    function getText(node)
    {
        var output = '';
        node.childNodes.forEach(function(item) {
            if (item.nodeType === Node.TEXT_NODE) {
                output += item.nodeValue;
            }
        });
        return output;
    }
