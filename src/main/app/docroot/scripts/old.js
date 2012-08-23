		
var stepSortable = {
		_thisHTML: function(){
			return $( ".column" )
		},
		create: function(){ 
			stepSortable._thisHTML()
			.sortable({
				connectWith: ".column",
				axis: 'y'
			});
			
			stepSortable._thisHTML().disableSelection();
		},
		destroy: function(){
			stepSortable._thisHTML().sortable("destroy");
		},
		createStepFromUIValues: function(){
			stepSortable.addStep($("#stepTitle").val(), $("#stepText").val(), null);
		},
		addStep: function(title,content,id,type,parentId,parentType){
			var steps = '<div objectId="'+ id +'" tipo="'+type+'"class="portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ' + type + ' "><div class="portlet-header ui-widget-header ui-corner-all"><span class="ui-icon ui-icon-plusthick"></span>' + title  + '</div><div class="portlet-content"style="display:none;">' + content  + '</div><input class="labelContainer" ></input></div>';
			stepSortable.renderStepToUI(steps, parentId, parentType)
		},
		cloneStep: function(){
			var httpCodeClone = $('.stepSelected').clone();
			stepSortable.renderStepToUI(httpCodeClone)
		},
		renderStepToUI: function(stepToAdd, parentId, parentType){
			if(typeof parentId == 'undefined'){
				stepSortable._thisHTML().append(stepToAdd);
			}else{
				stepSortable._thisHTML().find('[objectid='+parentId+'][tipo='+parentType+']').find('.portlet-content').append(stepToAdd);
			}
			stepSortable.destroy();
			stepSortable.bindEvents();
			stepSortable.create();
		},
		delStep: function(){
			$('.stepSelected').remove()
			stepSortable.destroy();
			stepSortable.bindEvents();
			stepSortable.create();
		},
		bindEvents: function(){
			
			$('.portlet-header').unbind('click')
			
			$('.portlet-header').click(function(event) {
				var selectVersion;
				var id;
				switch(true){
				case $(this).parents('.portlet').attr('tipo') == "project":
					selectType = "selectVersion";
					id = $(this).parents('.portlet').attr('objectid');
					$('.ui-layout-west .header').text('Versions of ' + $(this).text());
					$(this).parents( ".portlet:first" ).find( ".portlet-content" ).empty();
					dbTCManager.loadData(selectType, id, id, $(this).parents('.portlet:first').attr('tipo'))
					$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
					$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
					break;
				case $(this).parents('.portlet').attr('tipo') == "version":
					selectType = "selectSuite";
					id = $(this).parents('.portlet').attr('objectid');
					$(this).parents( ".portlet:first" ).find( ".portlet-content" ).empty();
//					$(stepSortable._thisHTML()).empty();
					dbTCManager.loadData(selectType, id, id, $(this).parents('.portlet').attr('tipo'))
					$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
    		$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
					break;
				case $(this).parents('.portlet').attr('tipo') == "suite":
					selectType = "selectTestCase";
					id = $(this).parents('.portlet').attr('objectid');
					$(this).parents( ".portlet:first" ).find( ".portlet-content" ).empty();
//					$(stepSortable._thisHTML()).empty();
					dbTCManager.loadData(selectType, id, id, $(this).parents('.portlet').attr('tipo'))
					$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
    		$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
					break;
				case $(this).parents('.portlet').attr('tipo') == "tc":
					selectType = "selectStep";
					id = $(this).parents('.portlet').attr('objectid');
					$(this).parents( ".portlet:first" ).find( ".portlet-content" ).empty();
//					$(stepSortable._thisHTML()).empty();
					dbTCManager.loadData(selectType, id, id, $(this).parents('.portlet').attr('tipo'))
					$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
    		$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
					break;
				case $(this).parents('.portlet').attr('tipo') == "step":
					break;
				}
				
			});
			$('.version').css("background", "grey")
			$('.tc').css("background", "grey")
		}
};

var stepSortableControls = {
		
		expandAll: function(){
			$( ".portlet-header .ui-icon" ).each(function() {
					if ($( this ).hasClass( "ui-icon-plusthick" )){
						$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
						$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
					}
			});
		},
		
		collapseAll: function(){
			$( ".portlet-header .ui-icon" ).each(function() {
					if ($( this ).hasClass( "ui-icon-minusthick" )){
						$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
						$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
					}
			});
		},
		selectAll: function(){
			$( ".portlet-header" ).each(function() {
					$( this ).parents('.portlet').addClass("stepSelected")
			});
		},
		unSelectAll: function(){
			$( ".portlet-header" ).each(function() {
					$( this ).parents('.portlet').removeClass("stepSelected")
			});
		},
		selectBlock: function(lastSelectedElement){
			$(lastSelectedElement).parents('.portlet').toggleClass("stepSelected");
			corr = [];
			$('.portlet').each(function(indice){
				if ($(this).hasClass("stepSelected")){
					corr[indice] = $(this).index();
				}
			})
			console.log(corr);
//			nextStep = $(lastSelectedElement).parents('.portlet').prev();
//			while(nextStep.hasClass("stepSelected") != "false"){
//				console.log(nextStep.hasClass("stepSelected"))
//				nextStep.toggleClass("stepSelected");
//				currentStep = $(nextStep).clone();
//				nextStep = $(currentStep).prev();
//			}
		},
		prevResults: function(){
			if (dbTCManager.state.currentLevel > 0){
				prevLevel = dbTCManager.state.currentLevel - 1;
				prevType = dbTCManager.callsHistory.history[prevLevel].split("|")[0]
				prevId = dbTCManager.callsHistory.history[prevLevel].split("|")[1];
				$(stepSortable._thisHTML()).empty();
				dbTCManager.loadData(prevType, prevId)
			}else{
				$("#backButton").attr("disabled",true);
			}
		}
}

var dbTCManager = {
		state:{
			currentLevel:-1,
			setCurrentLevel:function(selectType){
				switch(true){
				case selectType == "getProject":
					this.currentLevel = 0;
					$("#backButton").attr("disabled",true)
					break;
				case selectType == "selectVersion":
					this.currentLevel = 1;
					$("#backButton").attr("disabled",false)
					break;
				case selectType == "selectSuite":
					this.currentLevel = 2;
					$("#backButton").attr("disabled",false)
					break;
				case selectType == "selectTestCase":
					this.currentLevel = 3;
					$("#backButton").attr("disabled",false)
					break;
				case selectType == "selectStep":
					this.currentLevel = 4;
					$("#backButton").attr("disabled",false)
					break;
				}
			}
		},
		lastCallResponse: {
			type: "",
			id: "",
			fullResponse: "",
			success: false,
			setLastCallResonse: function(selectType, id, data, state){
				this.type = selectType;
				this.id = id;
				this.fullResponse = data;
				this.success = state;
				
			}
		},
		
		callsHistory: {
			history:[],
			setHistory: function(currentLevel, selectType, id){
					this.history[currentLevel] = selectType+"|"+id;
			}
		},
		
		loadData:function(selectType, id, parentId, parentType){
			$.ajax({
			    type: "GET",
			    url: "http://localhost:8085/db/"+ selectType+"/"+id,
			    dataType:"json",
			    cache: false,
			    success: function(data, state){
			    	dbTCManager.lastCallResponse.setLastCallResonse(selectType,id,data,state)
			    	dbTCManager.state.setCurrentLevel(selectType);
	    			dbTCManager.callsHistory.setHistory(dbTCManager.state.currentLevel, selectType, id);
	    			responseHandler(data);
		    	}
			})
		},
		
		responseHandler:function(data){
			
			$(data).each(function(){
				name = this.name
				if(this.type=="version"){
					name = this.version
				}
				stepSortable.addStep(name, this.description, this.id, this.type, parentId, parentType)
				if(this.type=="tc"){
					$('[objectid='+ this.id +'][tipo='+this.type+']').find('.labelContainer').tokenInput( "http://localhost:8085/db/getLabels/all" , {
						prePopulate: this.labels,
//						jsonContainer: "labels",
			            preventDuplicates: true,
			            theme: "facebook",
			            hintText:"Search lables"
			        });
					
				}
					
			})
			
		}
}


