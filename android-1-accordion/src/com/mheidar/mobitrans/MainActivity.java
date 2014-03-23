package com.mheidar.mobitrans;

import java.io.IOException;
import java.io.InputStream;

import org.json.JSONArray;
import org.json.JSONException;

import com.mobihacker.views.Accordion;

import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;

public class MainActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		//Try to load and parse JSON
		JSONArray jsonArray;
		try {
			InputStream inputstream = getAssets().open("accordion.json");
			
			int size = inputstream.available();
			byte[] buffer = new byte[size];
			
			inputstream.read(buffer);
			inputstream.close();
			
			String jsonString = new String(buffer, "UTF-8");
			jsonArray = new JSONArray(jsonString);
	    }catch(IOException ex) {
	        ex.printStackTrace();
	        return;
	    }catch(JSONException e) {
			e.printStackTrace();
			return;
		}
		
		//Create and add Accordion to Main view
		Context context = getBaseContext();
		LinearLayout mainLayout = (LinearLayout)findViewById(R.id.main_layout);
		Accordion accordion = new Accordion(context, jsonArray);
		mainLayout.addView(accordion, new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));		
	}
}
