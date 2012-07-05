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

			//set label styles
			var style = label.style;

			style.height= '40px';  
			style.width= '95px';
			style.cursor = 'pointer';
			style.color = '#333';
			style.fontSize = '0.8em';
			//style.textAlign= 'center';
			style.paddingTop = '3px';


			//Add Test Plan data to Nodes
			var nodeHTML = '';

			nodeHTML += '<div class="stepName">' + node.data.stepName + '</div>';
			nodeHTML += '<div class="Summary">' + node.data.stepSummary + '</div>';
			label.innerHTML = nodeHTML;
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
});
	
}