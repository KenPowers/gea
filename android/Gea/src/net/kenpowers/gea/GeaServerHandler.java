package net.kenpowers.gea;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

public class GeaServerHandler {
	private static final String LOG_TAG = "Gea Server Handler";
	
	private GeaServerHandler() {}
	
	public static final String LOCALHOST_BASE_URL = "http://10.0.2.2:3000";
	public static final String NET_BASE_URL = "http://gea.kenpowers.net";
	public static final String BASE_RATE_QUERY = "/rate?";
	public static final String RATE_UP_ARGUMENT = "like";
	public static final String RATE_DOWN_ARGUMENT = "dislike";
	
	public static enum RequestMethod { GET, POST; }
	
	public static void sendRequest(String urlString, RequestMethod method) {
		connect(urlString, method);
	}
	
	public static JSONArray getJSONForRequest(String urlString, RequestMethod method) {
		JSONArray json = null;
		HttpURLConnection connection = connect(urlString, method);
		if (connection == null)
			return null;
		try {
			int statusCode = connection.getResponseCode();
			if (connection.getResponseCode() == 200) {
	    		BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	            StringBuilder sb = new StringBuilder();
	            String line;
	            while ((line = br.readLine()) != null) {
	                sb.append(line+"\n");
	            }
	            br.close();
	            Log.d(LOG_TAG, sb.toString());
	            json = new JSONArray(sb.toString());
	    	} else {
	    		Log.e(LOG_TAG, "Error connecting to Gea server: " + statusCode);
	    	}
		} catch (MalformedURLException e) {
			Log.e(LOG_TAG, e.toString());
		} catch(IOException e) {
			Log.e(LOG_TAG, e.toString());
		} catch(JSONException e) {
			Log.e(LOG_TAG, e.toString());
		}
		return json;
	}
	
	private static HttpURLConnection connect(String urlString, RequestMethod method) {
		HttpURLConnection connection = null;
		try {
			URL url = new URL(urlString);
			Log.d(MainActivity_.LOG_TAG, url.toString());
			connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod(method.toString());
			connection.setRequestProperty("Content-length", "0");
			connection.connect();
		} catch (MalformedURLException e) {
			Log.e(LOG_TAG, e.toString());
		} catch(IOException e) {
			Log.e(LOG_TAG, e.toString());
		}
		return connection;
	}
	
	public static String getURLStringForParams(String baseURL, BasicNameValuePair[] parameters) {
		String queryString = baseURL;
		for (int i=0; i<parameters.length; i++) {
			queryString += parameters[i].getName() + "=" + parameters[i].getValue();
			if (i<parameters.length-1)
				queryString += "&";
		}
		return queryString;
	}
	
	
}
