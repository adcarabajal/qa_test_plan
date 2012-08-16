/*
*	DEMO HELPERS
*/


/**
 *	debugData
 *
 *	Pass me a data structure {} and I'll output all the key/value pairs - recursively
 *
 *	@example var HTML = debugData( oElem.style, "Element.style", { keys: "top,left,width,height", recurse: true, sort: true, display: true, returnHTML: true });	
 *
 *	@param Object	o_Data   A JSON-style data structure
 *	@param String	s_Title  Title for dialog (optional)
 *	@param Hash		options  Pass additional options in a hash
 */


/**
* showOptions
*
* Pass a layout-options object, and the pane/key you want to display
*/
function showOptions (o_Settings, key) {
	var data = o_Settings.options;
	$.each(key.split("."), function() {
		data = data[this]; // resurse through multiple levels
	});
	debugData( data, 'options.'+key );
}

/**
* showState
*
* Pass a layout-options object, and the pane/key you want to display
*/
function showState (o_Settings, key) {
	debugData( o_Settings.state[key], 'state.'+key );
}


/**
* createInnerLayout
*/
function createInnerLayout () {
	// innerLayout is INSIDE the center-pane of the outerLayout
	//debugData( layoutSettings_Inner );
	innerLayout = $( outerLayout.options.center.paneSelector ).layout( layoutSettings_Inner );
	// hide 'Create Inner Layout' commands and show the list of testing commands
	$('#createInner').hide();
	$('#createInner2').hide();
	$('#innerCommands').show();
}

