
package org.gemoc.liviz.ui.network;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.StringJoiner;


public class Http  
{

	public static void put(String url,Map<String,String> arguments) throws IOException	
	{
		URL uri = new URL(url);
		URLConnection con = uri.openConnection();
		HttpURLConnection http = (HttpURLConnection)con;
		http.setRequestMethod("PUT");
		http.setDoOutput(true);
		

		StringJoiner sj = new StringJoiner("&");
		for(Map.Entry<String,String> entry : arguments.entrySet())
		    sj.add(URLEncoder.encode(entry.getKey(), "UTF-8") + "=" 
		         + URLEncoder.encode(entry.getValue(), "UTF-8"));
		byte[] out = sj.toString().getBytes(StandardCharsets.UTF_8);
		int length = out.length;
		
		
		http.setFixedLengthStreamingMode(length);
		http.setRequestProperty("Content-Type", "application/text-plain; charset=UTF-8");
		http.connect();
		
		try(OutputStream os = http.getOutputStream()) 
		{
		    os.write(out);
	
		}
		
		
		

	}

	
		
		
	
	

}
