package org.mule.definition;

import java.util.ArrayList;

import org.codehaus.jackson.annotate.JsonAutoDetect;
import org.codehaus.jackson.annotate.JsonAutoDetect.Visibility;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonPropertyOrder;

@JsonAutoDetect(fieldVisibility=Visibility.ANY, getterVisibility=Visibility.PUBLIC_ONLY)
@JsonPropertyOrder(value={"id", "name", "data", "children"})
@JsonIgnoreProperties("_id")
public class Node {
	private String id;
    private String name;
    private ArrayList<String> data;
    private ArrayList<Node> children;
    
    public Node(String id, String name, ArrayList<String> data, ArrayList<Node> childNode){
    	setId(id);
    	setName(name);
    	setData(data);
    	if(!(childNode==null)){ setChildren(childNode); }
    }
    public void setId(String id) {
		this.id = id;
	}
	public String getId() {
		return id;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}
	public void setData(ArrayList<String> data) {
		this.data = data;
	}
	public ArrayList<String> getData() {
		return data;
	}
	public void setChildren(ArrayList<Node> childNode) {
		this.children = childNode;
	}
	public ArrayList<Node> getChildren() {
		return children;
	}
}
