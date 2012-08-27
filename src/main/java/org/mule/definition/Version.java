package org.mule.definition;

import org.codehaus.jackson.annotate.JsonAutoDetect;

@JsonAutoDetect
public class Version {
	private long id;
	private String version;
	
	public Version(long id, String version)	{
		this.id = id;
		this.version = version;
	}
	
	public void setLabel(String label) {
		this.version = label;
	}
	public String getLabel() {
		return version;
	}
	public void setId(long id) {
		this.id = id;
	}
	public long getId() {
		return id;
	}
}
