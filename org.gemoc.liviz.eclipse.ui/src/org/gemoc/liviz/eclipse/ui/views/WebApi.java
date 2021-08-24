package org.gemoc.liviz.eclipse.ui.views;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

public class WebApi 
{
	private static final String URL = "http://localhost:3000";
	
	public static void SendConfiguration(String config) throws UnsupportedEncodingException, IOException
	{
		Map<String,String> params = new HashMap<String,String>();
		params.put("config", config);
		Http.Send(URL+"/config", "PUT", params);
	}
}
