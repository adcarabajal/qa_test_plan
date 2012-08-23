
function resizeCenterContainer(){
	$( ".ui-layout-content" ).css("height",$(".ui-layout-center").height() - 10 -$(".ui-layout-center .footer").outerHeight()*2)
}

var conf ={
		server: "localhost",
		port:":8085"
}

var currentContext={
		projectId: 5
}
var ajaxEngine = {
		
		requestHandler:function(operation, id){
			reqId = id || "dummy";
			requestUrl = "http://" + conf.server + conf.port + "/db/" + operation + "/" +reqId;
			this.makeCall(requestUrl);
		},
		makeCall:function(requestUrl){
			$.ajax({
			    type: "GET",
			    url: requestUrl,
			    dataType:"json",
			    cache: false,
			    success: function(data){
			    	ajaxEngine.responseHandler(data);
		    	}
			})
		},
		responseHandler:function(response){
			$(response).each(function(){
					dbObjectsContainer.addObject(this.type, this);
			});
		}
}

var dbObjectsContainer ={
		
		_thisHTML: function(){
			return $( ".column" )
		},
		create: function(){ 
			this._thisHTML()
			.sortable({
				connectWith: ".column",
				axis: 'y'
			});
			
			this._thisHTML().disableSelection();
		},
		destroy: function(){
			this._thisHTML().sortable("destroy");
		},
		addObject: function(objectType, element){
			switch(true){
				case objectType == "tc":
					objectToAdd = new testCaseObject(element.id, element.name, element.description, element.order)
					break;
			}
			this.destroy();
			this._thisHTML().append(objectToAdd.htmlCode);
			this.create();
			this.bindEvents(element);
		},
		bindEvents: function(element){
			$('[projectid='+ element.id +']').find('.labelContainer').tokenInput( "http://" + conf.server + conf.port + "/db/getLabels/" + currentContext.projectId , {
				prePopulate: element.labels,
//				jsonContainer: "labels",
				propertyToSearch:"label",
	            preventDuplicates: true,
	            theme: "facebook",
	            hintText:"Search lables",
	            onReady:function(){
	            	$('#token-input-').css('backround','none')
	            }
	        });
		}
		
}

function projectObject(projectId, projectName, projectDesc){
		
		this.projectId = projectId;
		this.projectName = projectName;
		this.htmlCode = '<div projectid="'+ projectId +'" class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all project"><div class="portlet-header ui-widget-header ui-corner-all"><span class="ui-icon ui-icon-plusthick"></span>' + projectName  + '</div><div class="portlet-content"style="display:none;">' + projectDesc  + '</div></div>';

}

function labelObject(labelId, labelName){
	
	this.labelId = labelId;
	this.name = labelName;
	this.htmlCode = '';

}

function testCaseObject(testCaseId, testCaseName, testCaseDescription, testCaseOrder){
	
	this.id = testCaseId;
	this.name = testCaseName;
	this.description = testCaseDescription;
	this.order = testCaseOrder;
	this.htmlCode = '<div projectid="'+ testCaseId +'"class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all testCase"><div class="portlet-header ui-widget-header ui-corner-all"><span class="ui-icon ui-icon-plusthick"></span>' + testCaseName  + '</div><div class="portlet-content"style="display:none;">' + testCaseDescription  + '</div><input class="labelContainer" ></input></div>';
}

function stepObject(stepId, stepName, stepDescription, stepOrder){
	
	this.id = stepId;
	this.name = stepName;
	this.description = stepDescription;
	this.order = stepOrder;
	this.htmlCode = '<div projectid="'+ stepId +'"class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all step"><div class="portlet-header ui-widget-header ui-corner-all"><span class="ui-icon ui-icon-plusthick"></span>' + stepName  + '</div><div class="portlet-content"style="display:none;">' + stepDescription  + '</div></div>';

}
