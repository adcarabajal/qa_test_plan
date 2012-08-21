package org.mule.definition;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mule.api.MuleMessage;
import org.mule.api.transformer.TransformerException;
import org.mule.transformer.AbstractMessageTransformer;
import org.mule.util.CaseInsensitiveHashMap;

public class TestCaseTransformer extends AbstractMessageTransformer{

	@Override
	public Object transformMessage(MuleMessage message, String outputEncoding){
		Iterable<CaseInsensitiveHashMap> iter = (Iterable<CaseInsensitiveHashMap>) message.getPayload();
		ArrayList<TestCase> testCases = new ArrayList<TestCase>();
		HashMap<Integer, List<Label>> Test_label = new HashMap<Integer, List<Label>>();
		
		int previousId = 0;
		
		//get labels for tests
		for(CaseInsensitiveHashMap map: iter){
			Label label = new Label( (Integer) map.get("labelId"), (String) map.get("label") );
			
			if(Test_label.containsKey((Integer) map.get("id")) )	{
				Test_label.get((Integer) map.get("id")).add(label);
			}else{
				ArrayList<Label> list = new ArrayList<Label>();
				list.add(label);
				Test_label.put((Integer) map.get("id"), list);
			}
			
		}
		
		//Add Test Cases
		for(CaseInsensitiveHashMap map: iter){
			ArrayList<Label> auxLabels = new ArrayList<Label>();
			
			if(previousId !=  (Integer) map.get("id")){
				
				if(Test_label.containsKey( (Integer) map.get("id") ) )
				{
					auxLabels = (ArrayList<Label>) Test_label.get((Integer) map.get("id")) ;
				}
						
				TestCase test = new TestCase( (Integer) map.get("id"), (String) map.get("name"), (String)map.get("description"), (Integer) map.get("order"), (String)map.get("creator"), (String)map.get("type"), auxLabels );
				
				testCases.add(test);
			}
			
			previousId=  (Integer) map.get("id");
		}
		
		return testCases;
	}
	

}
