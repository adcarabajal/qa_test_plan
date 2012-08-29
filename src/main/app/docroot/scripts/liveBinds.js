function uiBinds(){
$('.portlet-header .ui-icon').live({
	  click: function(e) {
		  		e.stopPropagation();
	        	$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
	    		$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
	  }
	});

$('.portlet-header.tc-header').live({
	click: function(){
//		if ($(this).parents('.portletContainer').hasClass('tcSelected') == false){
			$('.portletContainer').removeClass('tcSelected');
			$(this).parents('.portletContainer').addClass('tcSelected');
			ajaxEngine.requestHandler("getSteps",$(this).parent().attr('testid'))
//			$('.middleContainer').animate({
//				left: "toggle", opacity: 1
//			}, { duration: 400, queue: false });
			
//		}
	}
})

$('.portlet-header.step-header').live({
	click: function(){
//		if ($(this).parents('.portletContainer').hasClass('tcSelected') == false){
			$('.portletContainer').removeClass('stepSelected');
			$(this).parents('.portletContainer').addClass('stepSelected');
//			$('.middleContainer').animate({
//				left: "toggle", opacity: 1
//			}, { duration: 400, queue: false });
			
//		}
	}
})

};

function animateMiddlePanel(){
	$('.middleContainer').animate({
		left: "toggle", opacity: 1
	}, { duration: 400, queue: false });
}
