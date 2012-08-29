$(document).ready(function(){
	ajaxEngine.requestHandler("getProjects","5")
		$( "#combobox" ).combobox()
		$('span > .ui-combobox-input').autocomplete({
			select:function(event,ui){
				$( ".column" ).empty()
				ajaxEngine.requestHandler("getTestCases",ui.item.option.value)
				}
		});
		uiBinds();
		
		
		$("#friends").click(function(){  
                      
		    //focus 'to' field  
		    $("#to").focus();  
		});  
		                  
		//add live handler for clicks on remove links  
		$(".remove", document.getElementById("friends")).live("click", function(){  
		                  
		    //remove current friend  
		    $(this).parent().remove();  
		                      
		    //correct 'to' field position  
		    if($("#friends span").length === 0) {  
		        $("#to").css("top", 0);  
		    }                 
		});  
		
//		animateMiddlePanel()
		
})


//End of DocumentREady

function resizeCenterContainer(){
	$( ".ui-layout-content" ).css("height",$(".ui-layout-center").height() - 10 -$(".ui-layout-center .footer").outerHeight()*2)
}

var conf ={
		server: "localhost",
		port:":8081"
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
			switch(true){
			case $(response)[0].type == "project":
				jsonResponses.projects = response
				$('#combobox').empty();
				addProject(response)
				break;
			case $(response)[0].type == "label":
				jsonResponses.labels = response
				break;
			case $(response)[0].type == "version":
				jsonResponses.versions = response
				break;
			case $(response)[0].type == "tc":
				jsonResponses.testCases = response
				break;
			case $(response)[0].type == "step":
				jsonResponses.steps = response
				break;
			}
			$(response).each(function(){
					dbObjectsContainer.addObject(this.type, this);
			});
		}
}

var jsonResponses = {
		projects:"",
		labels:"",
		versions:"",
		testCases:"",
		steps:""		
}

function addProject(response){
	$(response).each(function(){
		console.log(this)
		objectToAdd = new projectObject(this.id, this.name, this.description)
		console.log(objectToAdd.htmlCode)
		$('#combobox').append(objectToAdd.htmlCode);
	})
}

var dbObjectsContainer ={
		
		create: function(container){ 
			$(container)
			.sortable({
				connectWith: ".column",
				axis: 'y'
			});
			
			$(container).disableSelection();
		},
		destroy: function(container){
			$(container).sortable("destroy");
		},
		addObject: function(objectType, element){
			switch(true){
				case objectType == "project":
					objectToAdd = new projectObject(element.id, element.name, element.description)
					$('#conbobox').append(objectToAdd);
					break;
				case objectType == "tc":
					objectToAdd = new testCaseObject(element.id, element.name, element.description, element.order)
					this.destroy('.tcColumn');
					$('.tcColumn').append(objectToAdd.htmlCode);
					this.create('.tcColumn');
					this.bindEvents(element);
					break;
				case objectType == "step":
					objectToAdd = new stepObject(element.id, element.name, element.description, element.order)
					this.destroy('.stepColumn');
					$('.stepColumn').append(objectToAdd.htmlCode);
					this.create('.stepColumn');
					break;
			}
		},
		bindEvents: function(element){
			$('[testid='+ element.id +']').find('.labelContainer').tokenInput( "http://" + conf.server + conf.port + "/db/getLabels/" + currentContext.projectId , {
				prePopulate: element.labels,
//				jsonContainer: "labels",
				propertyToSearch:"label",
	            preventDuplicates: true,
	            theme: "facebook",
	            hintText:"Search lables",
	            onReady:function(){
	            	$('#token-input-').css('backround','none')
	            	$('.token-input-list-facebook').addClass('ui-corner-all')
	            }
	        });
			$('input[autocomplete=off]#token-input-').css('background','none')
		}
		
}

function projectObject(projectId, projectName, projectDesc){
		
		this.projectId = projectId;
		this.projectName = projectName;
		this.htmlCode = '<option value="'+projectId+'">'+projectName+'</option>';

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
	this.htmlCode = '<div class="portletContainer"><div testid="'+ testCaseId +'"class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all testCase"><div class="portlet-header ui-widget-header ui-corner-all tc-header"><span class="ui-icon ui-icon-plusthick"></span>' + testCaseName  + '</div><div class="portlet-content"style="display:none;">' + testCaseDescription  + '</div><input class="labelContainer" ></input><input class="labelContainer" ></input></div></div>';
}

function stepObject(stepId, stepName, stepDescription, stepOrder){
	
	this.id = stepId;
	this.name = stepName;
	this.description = stepDescription;
	this.order = stepOrder;
	this.htmlCode = '<div class="portletContainer"><div stepid="'+ stepId +'"class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all step"><div class="portlet-header ui-widget-header ui-corner-all step-header">' + stepName  + '</div></div></div>';

}

