package org.mule.definition;

import org.codehaus.jackson.annotate.JsonAutoDetect;

@JsonAutoDetect
public class Label {
	private long id;
	private String label;
	
	public Label(long id, String label)	{
		this.id = id;
		this.label = label;
	}
	
	public void setLabel(String label) {
		this.label = label;
	}
	public String getLabel() {
		return label;
	}
	public void setId(long id) {
		this.id = id;
	}
	public long getId() {
		return id;
	}
}
