function uiBinds(){
$('.portlet-header .ui-icon').live({
	  click: function() {
	        	$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
	    		$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
	  }
	});

};

