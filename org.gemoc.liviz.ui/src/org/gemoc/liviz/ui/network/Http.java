
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

	public static void put(String url,String content) throws IOException	
	{
		URL uri = new URL(url);
		URLConnection con = uri.openConnection();
		HttpURLConnection http = (HttpURLConnection)con;
		http.setRequestMethod("PUT");
		http.setDoOutput(true);
		
		byte[] out =  content.getBytes(StandardCharsets.UTF_8);
		int length = out.length;
		
		
		http.setFixedLengthStreamingMode(length);
		http.setRequestProperty("Content-Type", "text/plain; charset=UTF-8");
		http.connect();
		
		try(OutputStream os = http.getOutputStream()) 
		{
		    os.write(out);
	
		}
		
		System.out.println("config sended");
		
		
		

	}

	
		
		
	
	

}
