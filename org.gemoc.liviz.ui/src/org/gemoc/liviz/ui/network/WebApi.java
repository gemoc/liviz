package org.gemoc.liviz.ui.network;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class WebApi 
{
	public static final String URL = "http://localhost:3000/";
	
	public static void putConfiguration(String configuration) throws IOException
	{ 
		Map<String,String> parameters = new HashMap<String,String>();
		Http.put(URL+"config",parameters);
		
	}
}
