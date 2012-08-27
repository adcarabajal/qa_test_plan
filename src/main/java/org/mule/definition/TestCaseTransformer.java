package org.mule.definition;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.mule.api.MuleMessage;
import org.mule.transformer.AbstractMessageTransformer;
import org.mule.util.CaseInsensitiveHashMap;

public class TestCaseTransformer extends AbstractMessageTransformer{

	@Override
	public Object transformMessage(MuleMessage message, String outputEncoding){
		@SuppressWarnings("unchecked")
		Iterable<CaseInsensitiveHashMap> iter = (Iterable<CaseInsensitiveHashMap>) message.getPayload();
		ArrayList<TestCase> testCases = new ArrayList<TestCase>();
		HashMap<Integer, List<Label>> Test_label = new HashMap<Integer, List<Label>>();
		HashMap<Integer, List<Version>> Test_version = new HashMap<Integer, List<Version>>();
		int previousId = 0;
		
		//get labels for tests
		for(CaseInsensitiveHashMap map: iter){
			if(map.get("labelid") != null){
				Label label = null;
				
				try{
					label = new Label( (Long) map.get("labelid"), (String) map.get("label") );
				}catch(ClassCastException e){
					label = new Label( (Integer) map.get("labelid"), (String) map.get("label") );
				}
				
				if(Test_label.containsKey((Integer) map.get("id")) )	{
					Test_label.get((Integer) map.get("id")).add(label);
				}else{
					ArrayList<Label> list = new ArrayList<Label>();
					list.add(label);
					Test_label.put((Integer) map.get("id"), list);
				}
			}
		}
		
		//get versions for tests
		for(CaseInsensitiveHashMap map: iter){
			if(map.get("versionid") != null){
				Version version = new Version( (Long) map.get("versionid"), (String) map.get("version") );
				
				if(Test_version.containsKey((Integer) map.get("id")) )	{
					Test_version.get((Integer) map.get("id")).add(version);
				}else{
					ArrayList<Version> list = new ArrayList<Version>();
					list.add(version);
					Test_version.put((Integer) map.get("id"), list);
				}
			}
		}
		
		//Add Test Cases
		for(CaseInsensitiveHashMap map: iter){
			ArrayList<Label> auxLabels = new ArrayList<Label>();
			ArrayList<Version> auxVersions = new ArrayList<Version>();
			
			if(previousId !=  (Integer) map.get("id")){
				
				if(Test_label.containsKey( (Integer) map.get("id") ) )
				{
					auxLabels = (ArrayList<Label>) Test_label.get((Integer) map.get("id")) ;
				}
				
				if(Test_version.containsKey( (Integer) map.get("id") ) )
				{
					auxVersions = (ArrayList<Version>) Test_version.get((Integer) map.get("id")) ;
				}
						
				TestCase test = new TestCase( (Integer) map.get("id"), (String) map.get("name"), (String)map.get("description"), (Integer) map.get("order"), (String)map.get("creator"), (String)map.get("type"), auxLabels, auxVersions );
				
				testCases.add(test);
			}
			
			previousId=  (Integer) map.get("id");
		}
		
		return testCases;
	}
	

}
