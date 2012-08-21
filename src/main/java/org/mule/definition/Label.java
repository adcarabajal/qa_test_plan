package org.mule.definition;

public class Label {
	private int id;
	private String label;
	
	public Label(int id, String label)	{
		this.id = id;
		this.label = label;
	}
	
	public void setLabel(String label) {
		this.label = label;
	}
	public String getLabel() {
		return label;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getId() {
		return id;
	}
}
