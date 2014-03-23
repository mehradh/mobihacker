package com.mobihacker.views;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mheidar.mobitrans.M;
import com.mheidar.mobitrans.R;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;

public class Accordion extends LinearLayout {
	private AccordionItem selectedItem = null;	
	
	public Accordion(Context context, JSONArray items) {
		super(context);
		
		setOrientation(LinearLayout.VERTICAL);
		
		/*
		 * Accordion Item Click handler
		 */
		OnClickListener headerClickListener = new View.OnClickListener() {
			public void onClick(View v) {
				//Get clicked View's Parent of type Accordion Item
				AccordionItem item = (AccordionItem) v.getParent();
				if(item != null) {
					//Is clicked item the same as current?
					if(selectedItem != item) {
						//If there's an item, hide it
						if(selectedItem != null) {
							selectedItem.hide();
						}
						
						//Selected item, show it
						selectedItem = item;
						selectedItem.show();
					}else {
						//Hide current and set it to null for next click
						selectedItem.hide();
						selectedItem = null;
					}
				}
			}
		};
		
		//Try to initiate Accordion Items
		try {
			initiateItems(items,headerClickListener);
		} catch (JSONException e) {
			e.printStackTrace();
			return;
		}
	}
	
	/*
	 * Initiates Accordion Items
	 */
	private void initiateItems(JSONArray items, OnClickListener headerClickListener) throws JSONException {
		AccordionItem item;
		JSONObject jsonObject;
		
		Context context = getContext();
		
		//Add 2dp margin bottom of separtation between Items
		LayoutParams layoutParams = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
		layoutParams.setMargins(0,0,0,M.dp2Px(context, 4));
		
		
		for(int i = 0; i < items.length(); i++) {
			jsonObject = items.getJSONObject(i);
			
			//Create Item with JSON Title and Content
			item = new AccordionItem(context, jsonObject.getString("title"), 
												jsonObject.getString("content"));
			//Get Item's accordion_header and Set Click Handler
			View header = item.getChildAt(1);
			if(header.getId() == R.id.accordion_header) {
				header.setClickable(true);
				header.setLongClickable(true);
				header.setOnClickListener(headerClickListener);
			}
			
			//Add it to view
			addView(item, layoutParams);
		}
	}
}
