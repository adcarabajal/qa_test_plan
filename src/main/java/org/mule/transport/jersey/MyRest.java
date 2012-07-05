package org.mule.transport.jersey;

import java.util.ArrayList;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.mule.definition.*;

@Path("/")
public class MyRest {

    @GET
    @Produces("application/json")
    @Path("/get")
    public Response getJson() {
    	
    	
    	ArrayList<Node> childNode = new ArrayList<Node>();
    	childNode.add(new Node("2", "nodo 2", new ArrayList<String>(), null));
    	childNode.add(new Node("3", "nodo 3", new ArrayList<String>(), null));
    	childNode.add(new Node("4", "nodo 4", new ArrayList<String>(), null));
    	
    	Node Tree = new Node("1","Root", new ArrayList<String>(), childNode);
    	
    	ResponseBuilder builder = Response.ok(Tree);
    	builder.header("Access-Control-Allow-Origin", "*");
    	builder.header("Access-Control-Max-Age", "3600");
    	builder.header("Access-Control-Allow-Methods", "GET");
    	builder.header("Access-Control-Allow-Headers", "X-Requested-With,Host,User-Agent,Accept,Accept-Language,Accept-Encoding,Accept-Charset,Keep-Alive,Connection,Referer,Origin");
    	 
    	return builder.build();
    }
}