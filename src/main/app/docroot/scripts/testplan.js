var labelType, useGradients, nativeTextSupport, animate;
var json, st;
(function() {
	var ua = navigator.userAgent,
	iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
	typeOfCanvas = typeof HTMLCanvasElement,
	nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
	textSupport = nativeCanvasSupport 
	&& (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
	//I'm setting this based on the fact that ExCanvas provides text support for IE
	//and that as of today iPhone/iPad current text support is lame
	labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
	nativeTextSupport = labelType == 'Native';
	useGradients = nativeCanvasSupport;
	animate = !(iStuff || !nativeCanvasSupport);
})();

var buttons = $('<div class="buttons"></div>');
$('<img id="add" src="images/add.png" class="btn btn-small add" >').on('click',function() { addNode(node) }).appendTo(buttons);
$('<img id="remove" src="images/remove.png" class="btn btn-small delete" />').on('click', function(){ removeNode(node) } ).appendTo(buttons);

function init(){
	st = new $jit.ST({
		injectInto: 'infovis',
		duration: 200,	
		transition: $jit.Trans.Quart.easeInOut,
		//set distance between node and its children
		levelDistance: 50,
		orientation:'top',

		//enable panning
		Navigation: {
			enable:true,
			panning:true
		},

		Node: {
			height: 40,  
			width: 95,
			type: 'rectangle',
			overridable: true
		},

		Edge: {
			type: 'bezier',
			overridable: true
		},

		onCreateLabel: function(label, node){
			label.id = node.id;            

			$(label).addClass('node');
			$(label).append( $('<div class="stepName">' + node.data.stepName + '</div>') );
			$(label).append( $('<div class="Summary">' + node.data.stepSummary + '</div>') );
			
			if(node.selected){
				$(label).append(buttons);
			}
			
			label.onclick = function(){
				$(label).siblings().removeClass('active-node');
				$(label).addClass('active-node'); 
				$("div.buttons").appendTo($(label));
				$("div.buttons img#add").off('click');
				$("div.buttons img#remove").off('click');
				$("div.buttons img#add").on('click',function() { addNode(node) });
				$("div.buttons img#remove").on('click',function() { removeNode(node) });
				
				$(label).off('dblclick');
				$(label).on('dblclick', function(){showDetails(label, node) });
				
				var m ={
						offsetX: st.canvas.translateOffsetX,
						offsetY: st.canvas.translateOffsetY
				};

				st.onClick(node.id, { Move: m }); 
			}; 
			/////
		},


		onBeforePlotNode: function(node){
			node.data.$color=  "#ccc";
			if(node.selected){
				node.data.$color = "#cc9";

			}
		},

		onBeforePlotLine: function(adj){
			if (adj.nodeFrom.selected && adj.nodeTo.selected) {
				adj.data.$color = "#eed";
				adj.data.$lineWidth = 3;
			}
			else {
				delete adj.data.$color;
				delete adj.data.$lineWidth;
			}
		}
	});



	$.getJSON("/api/db/1", function(p_json){
		json = p_json[0];
		computeTree();
	});    
}

function computeTree(){
	st.loadJSON(json);
	st.compute();
	st.geom.translate(new $jit.Complex(-200, 0), "current");
	st.onClick(st.root);
}

function addNode(node){
	
	addNodeToJson(node.id, json);
		
	st.loadJSON(json);
	st.compute();
	
	st.onClick(node.id);
}

function addNodeToJson(id, p_json){
	
	if(p_json.id == id){
		if( p_json.children != null){
			
			p_json.children.push({ "id" : id + "-" + p_json.children.length, "name" : "nodo nuevo" , "data" : { "stepName" : "nodoNuevo" , "stepSummary" : "summar nuevo"} , "children" :  null });
		}else{
			p_json.children = [{ "id" : id + "-1" , "name" : "nodo nuevo" , "data" : { "stepName" : "nodoNuevo" , "stepSummary" : "summar nuevo"} , "children" :  null }];
		}
	}else{
		if( p_json.children != null){
			p_json.children.forEach( function(node){ addNodeToJson(id, node) } );
		}
	}
	
	
}

function removeNode(node){
	
	var parentId = $jit.Graph.Util.getParents(node)[0].id;
	removeNodefromJson(node.id, json);
	
	st.loadJSON(json);
	st.compute();
	st.onClick(parentId);
}

function removeNodefromJson(id, p_json){
	
	for(var i=0; i < p_json.children.length; i++){
		if(p_json.children[i].id == id)
		{
			p_json.children.pop(i);
			return;
		}else{
			if(p_json.children[i].children !=null){
				removeNodefromJson(id, p_json.children[i]);
			}
		}
	}
}

function findNode(p_id, p_json){
	
	$.each(p_json.id, function(i, v) {
		
        if (v == p_id) {
        	alert(i);
            return v;
        }else{
        	findNode(p_id, p_json.children)
        }
    });
}

function save(){
	console.log(json)
	$.ajax({
        url: '/api/db/1',
        type: "PUT",
        data: JSON.stringify(json),
        dataType: "json",
        contentType:"application/json; charset=utf-8",
        success: function(result) {
        	console.log(result);
        }
	}	);
	

	
}



function showDetails(label, node){
	//Get the screen height and width
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();
	
	
	
	var divContainer = $("<div id='detailsContainer' class='window'></div>");
	var divDetails = $("<div class='details' ></div>");
	var divButtons = $("<div class='buttons' ></div>");
	
	divDetails.append($("<label for='lblStepname'>Step Name</label><input id='stepName' type='text' value='" + node.data.stepName + "'></div><br>"));
	divDetails.append($("<label for='lblStepname'>Step Summary</label><input id='stepSummary' type='text' value='" + node.data.stepSummary + "'></div><br>"));
	divButtons.append($("<input type='button' value='save'/>").on('click', function(){saveDetails(label, node);} ));
	divButtons.append($("<input type='button' value='cancel'/>").on('click', function(){ $("#mask").remove(); $('#detailsContainer').remove(); }) );
	
	divContainer.append(divDetails);
	divContainer.append(divButtons);
	$('body').append("<div id='mask'></div>")
	$('body').append(divContainer);
	
	
	
	//Set height and width to mask to fill up the whole screen
    $('#mask').css({'width':maskWidth,'height':maskHeight});
    $('#mask').css({'top':0,'left':0});
     
    //transition effect    
    $('#mask').fadeIn(1000);   
    $('#mask').fadeTo("slow",0.8);  

	//Get the window height and width
	var winH = $(window).height();
	var winW = $(window).width();
	       
	//Set the popup window to center
	$("#detailsContainer").css('top',  winH/2-$("#detailsContainer").height()/2);
	$("#detailsContainer").css('left', winW/2-$("#detailsContainer").width()/2);

	//transition effect
	$("#detailsContainer").fadeIn(2000); 
	
}

function saveDetails(label, node){
	updateNodeData(node.id, json);
	
	st.loadJSON(json);
	st.compute();
	
	st.onClick(node.id);
	$("#mask").remove(); 
	$('#detailsContainer').remove();
}

function updateNodeData(id, p_json){
	
	if(p_json.id == id){
		
		p_json.data = {"stepName": $("input#stepName")[0].value, "stepSummary": $("input#stepSummary")[0].value};
		
	}else{
		if( p_json.children != null){
			p_json.children.forEach( function(node){ updateNodeData(id, node) } );
		}
	}
	
	
}