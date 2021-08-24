package org.gemoc.liviz.eclipse.ui.views;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class Http {
	
	public static void Send(String uri,String method,Map<String,String> parameters) throws UnsupportedEncodingException, IOException
	{
		URL url = new URL(uri);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		con.setRequestMethod(method);
		
		con.setDoOutput(true);
		DataOutputStream out = new DataOutputStream(con.getOutputStream());
		out.writeBytes(ParameterStringBuilder.getParamsString(parameters));
		out.flush();
		out.close();
		
	}
	
	public static class ParameterStringBuilder 
	{
	    public static String getParamsString(Map<String, String> params)  throws UnsupportedEncodingException
	    {
	        StringBuilder result = new StringBuilder();

	        for (Map.Entry<String, String> entry : params.entrySet()) 
	        {
	          result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
	          result.append("=");
	          result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
	          result.append("&");
	        }

	        String resultString = result.toString();
	        return resultString.length() > 0
	          ? resultString.substring(0, resultString.length() - 1)
	          : resultString;
	    }
	}
}

