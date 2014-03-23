package com.mobihacker.views;

import com.mheidar.mobitrans.M;
import com.mheidar.mobitrans.R;

import android.animation.ValueAnimator;
import android.animation.ValueAnimator.AnimatorUpdateListener;
import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.Interpolator;
import android.view.animation.LinearInterpolator;
import android.view.animation.RotateAnimation;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;


public class AccordionItem extends RelativeLayout implements IAccordion {
	private final ImageView headerImage;
	private final TextView contentText;
	private final RotateAnimation animHeaderShow;
	private final RotateAnimation animHeaderHide;
	
	private final ValueAnimator contentAnimatorShow;
	private final ValueAnimator contentAnimatorHide;
	
	private static final Interpolator linearInterpolator = new LinearInterpolator();
	
	@SuppressWarnings("deprecation")
	@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
	public AccordionItem(Context context, String title, String content) {
		super(context);
		
		//Set background directly on this Container, 
		//so we don't need another Layout for Content animation
		Drawable textBackground = getResources().getDrawable(R.drawable.background);
		int sdk = Build.VERSION.SDK_INT;
		if(sdk < Build.VERSION_CODES.JELLY_BEAN) {
			setBackgroundDrawable(textBackground);
		} else {
			setBackground(textBackground);
		}
		
		//Frist we create the text
		contentText = createContentText(context);
		contentText.setText(content);
		contentText.setHeight(0);
		addView(contentText);
		
		//Inflate the accordion_header, could also have been a Class, implementing IAccordion
		//but I wanted to have an XML example for demonstration purposes
		View header = inflate(context, R.layout.accordion_header,this);
		
		//Find the Header Arrow image for later use in animation
		headerImage = (ImageView)header.findViewById(R.id.img_header);
		
		//Find the Header Title and set it's text
		TextView headerText = (TextView) header.findViewById(R.id.txt_header);
		headerText.setText(title);
		
		//Arrow Rotate Animations
		animHeaderShow = createRotateAnimation(0f, 90f);
		animHeaderHide = createRotateAnimation(90f, 0f);
		
		//Content Show Animation
		contentAnimatorShow = createHeightAnimator(M.ANIM_DURATION*2,new ValueAnimator.AnimatorUpdateListener() {
			        @Override
			        public void onAnimationUpdate(ValueAnimator animation) {
			        	//Set current value to 
			            float value = ((Float) (contentAnimatorShow.getAnimatedValue())).floatValue();
			            contentText.setHeight((int)value);
			        }
			    });
		
		//Content Hide Animation
		contentAnimatorHide = createHeightAnimator(M.ANIM_DURATION,new ValueAnimator.AnimatorUpdateListener() {
			        @Override
			        public void onAnimationUpdate(ValueAnimator animation) {
			            float value = ((Float) (contentAnimatorHide.getAnimatedValue())).floatValue();
			            contentText.setHeight((int)value);
			        }
				});
	}
	
	/*
	 * Open Accordion Item
	 * @see com.mobihacker.views.IAccordion#show()
	 */
	@Override
	public void show() {
		//Animation Arrow
		headerImage.setAnimation(null);
		headerImage.startAnimation(animHeaderShow);
		
		//Animation Content
		contentAnimatorHide.cancel();
		contentAnimatorShow.setFloatValues(0, (float)getContentHeight());
		contentAnimatorShow.start();
	}
	
	/*
	 * Close Accordion Item
	 * @see com.mobihacker.views.IAccordion#show()
	 */
	@Override
	public void hide() {
		//Animation Arrow
		headerImage.setAnimation(null);
		headerImage.startAnimation(animHeaderHide);
		
		//Animation Content
		contentAnimatorShow.cancel();
		contentAnimatorHide.setFloatValues((float)getContentHeight(), 0);
		contentAnimatorHide.start();
	}
	
	/*
	 * Create Content TextView
	 */
	@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
	private TextView createContentText(Context context) {
		int dp10 = M.dp2Px(getContext(), 10);
		int dp20 = dp10 * 2;
		
		//Set color for fun
		TextView textView = new TextView(context);
		textView.setTextColor(context.getResources().getColor(R.color.color_black));
		
		//Set Y position 
		textView.setY(dp20);
		
		//Set padding, on newer devices padding needs to be double for some reason
		//would need more time to look into it
		int sdk = Build.VERSION.SDK_INT;
		if(sdk < Build.VERSION_CODES.JELLY_BEAN) {
			textView.setPadding(dp10,dp10,dp10,dp10);
		} else {
			textView.setPaddingRelative(dp20,dp20,dp20,dp20);
		}
		
		//Add margins
		RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT,
																					LayoutParams.WRAP_CONTENT);
		layoutParams.alignWithParent = true;
		layoutParams.setMargins(0, dp20, 0, dp20);
		textView.setLayoutParams(layoutParams);
		return textView;
	}

	/*
	 * Create Content Animator
	 * Note: initial value is 0, it will get calculated at animation time
	 * This allows us to create public setHeaderText(String) and public setContentText(String)
	 * to change Title / Content after creation and it will adjust height.
	 */
	private ValueAnimator createHeightAnimator(long duration, AnimatorUpdateListener updateCallBack) {
		ValueAnimator animator = ValueAnimator.ofFloat(0,0);
		animator.setDuration(duration);
		animator.addUpdateListener(updateCallBack);
		return animator;
	}    

	/*
	 * Create Rotate Animation
	 */
	private RotateAnimation createRotateAnimation(float fromDegrees, float toDegrees) {
		RotateAnimation animation = new RotateAnimation(fromDegrees, toDegrees, 
														Animation.RELATIVE_TO_SELF, 0.5f, 
														Animation.RELATIVE_TO_SELF, 0.5f);
		animation.setInterpolator(linearInterpolator);
		animation.setRepeatCount(0);
		animation.setDuration(M.ANIM_DURATION);
		animation.setFillAfter(true);
		animation.setFillEnabled(true);
		return animation;
	}
	
	/*
	 * Get Content Height with 20pd added
	 */
	private int getContentHeight() {
		return (contentText.getLineCount() * contentText.getLineHeight()) + 
				contentText.getPaddingTop() + contentText.getPaddingBottom() + 
				M.dp2Px(getContext(), 20);
	}
}
