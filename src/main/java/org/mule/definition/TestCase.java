package org.mule.definition;

import java.util.ArrayList;

import org.codehaus.jackson.annotate.JsonAutoDetect;

@JsonAutoDetect
public class TestCase {
	private int id;
    private String name;
    private String description;
    private int order;
    private String creator;
    private String type;
    private ArrayList<Label> labels;
    private ArrayList<Version> versions;
    
    public TestCase(int id, String name, String description, int order, String creator, String type, ArrayList<Label> labels, ArrayList<Version> versions){
    	this.setId(id);
    	this.setName(name);
    	this.setDescription(description);
    	this.setOrder(order);
    	this.setCreator(creator);
    	this.setType(type);	
    	this.setLabels(labels); 
    	this.setVersions(versions);
    }

	public void setId(int id) {
		this.id = id;
	}

	public int getId() {
		return id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public void setOrder(int order) {
		this.order = order;
	}

	public int getOrder() {
		return order;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getCreator() {
		return creator;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getType() {
		return type;
	}

	public void setLabels(ArrayList<Label> labels) {
		this.labels = labels;
	}

	public ArrayList<Label> getLabels() {
		return labels;
	}

	public void setVersions(ArrayList<Version> versions) {
		this.versions = versions;
	}

	public ArrayList<Version> getVersions() {
		return versions;
	}

	
}
