// Here be dragons

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

if (jQuery("div#full_calendar_event").length) {
    var eventdetails = jQuery("div#full_calendar_event div.description");
    if (eventdetails.length) {
        var externalEvent = matchExternalEvent(eventdetails.html());
        if (externalEvent) {
            jQuery("aside#right-side ul.page-action-list li:not(:first-child) a").bind('click', false).addClass("ui-state-disabled");
        }
    }
}

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
