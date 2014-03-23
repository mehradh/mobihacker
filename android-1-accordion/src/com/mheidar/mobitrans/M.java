package com.mheidar.mobitrans;

import android.content.Context;
import android.util.DisplayMetrics;

public final class M {
	//Animation duration
	public static final long ANIM_DURATION = 300;
	
	//Converts dp values to pixel
	public static final int dp2Px(Context context, int dp) {
		DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
	    int px = Math.round(dp * (displayMetrics.xdpi / DisplayMetrics.DENSITY_DEFAULT));       
	    return px;
	}
}