  $(function(){  
              
        //attach autocomplete  
        $("#to").autocomplete({  
                      
            //define callback to format results  
            source: function(req, add){  
                      
                //pass request to server  
                $.getJSON("http://localhost:8085/db/getLabels/5", req, function(data) {  
                              
                    //create array for response objects  
                    var suggestions = [{"id":5,"name":"Sanity"}];  
                              
                    //process response  
                    $.each(data, function(i, val){                                
                    suggestions.push(val.name);  
                });  
                              
                //pass array to callback  
                add(suggestions);  
            });  
        },  
                      
        //define select handler  
        select: function(e, ui) {  
                          
            //create formatted friend  
            var friend = ui.item.value,  
                span = $("<span>").text(friend),  
                a = $("<a>").addClass("remove").attr({  
                    href: "javascript:",  
                    title: "Remove " + friend  
                }).text("x").appendTo(span);  
                          
                //add friend to friend div  
                span.insertBefore("#to");  
            },  
                      
            //define select handler  
            change: function() {  
                          
                //prevent 'to' field being updated and correct position  
                $("#to").val("").css("top", 2);  
            }  
        });                       
    });  