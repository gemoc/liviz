package org.gemoc.liviz.ui.network;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class WebApi 
{
	public static final String URL = "http://localhost:3000/";
	
	public static void putConfiguration(String configuration) throws IOException
	{ 
		
		Http.put("http://localhost:3000/config",configuration);
		
	}

	public static void putValues(String raw) throws IOException
	{
		Http.put("http://localhost:3000/graphs/myGraph",raw);
		
	}
}
