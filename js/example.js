var $el, $tempDiv, $tempButton, divHeight = 0;

$.fn.middleBoxButton = function(text, url) {
    
    return this.hover(function(e) {
			
        $el = $(this).css("border-color", "black");
	try {		
		//puts red border back around current playing vid
		document.getElementById(currentvid).style.border = "3px solid red";
	} catch (e) { }	
        divHeight = $el.height() + parseInt($el.css("padding-top")) + parseInt($el.css("padding-bottom"));
                
        $tempDiv = $("<div />", {
            "class": "overlay"
        });
            
		$tempButton = $("<a />", {
            "href": 'javascript:'+'deleteFromPlaylist("'+this.id+'");',
            "text": "X",
            "class": "widget-button-delete",
            "css": {
                "top": (divHeight / 2) - 7 + "px"
            }
        }).appendTo($tempDiv);
		
        $tempButton = $("<a />", {
            "href": 'javascript:'+'loadVideo("'+this.id+'", \'0\');',
            "text": "Play",
            "class": "widget-button-play rounded",
            "css": {
                "top": (divHeight / 2) - 7 + "px"
            }
        }).appendTo($tempDiv);
                
        $tempDiv.appendTo($el);
        
    }, function(e) {
        
        $(".overlay").fadeOut(50, function() {
            $(this).remove();
        })
    
    });
    
}
