$(document).ready(function() {
	var cards = [],//list of cards for transitions
		cardIndex = 0,//using cardIndex and cards[] user can click multiple times very fast
		cardsContainer = document.getElementsByClassName("cards")[0];
	
	//Ajax call XML data
	$.ajax({
		type: "GET",
		url: "data.xml",
		dataType: 'text'
	}).done(function(data) {
		$(data).find("card").each(function() {
			//Prepends new card with current <card>
			//css:left is needed for the first transition. Without it first transition will jump to end
			cards.push($(cardsContainer).prependCard($(this).attr("title"), $(this).html()).css({left:0}));
		});
	}).fail(function(r,s) {
		console.log("Failed with XML: " + s);
	});
	
	/* Click handlers */
	$('.btn').click(function() {
		if($(this).hasClass("next")) {
			if(cardIndex < cards.length-1) {
				$(cards[cardIndex]).css({left:"-110%"});
				cardIndex++;
				$(cards[cardIndex]).scrollTop(0);//make sure content is scrolled to top
			}
		}else {
			if(cardIndex > 0) {
				cardIndex--;
				$(cards[cardIndex]).css({left:0}).scrollTop(0);
			}
		}
	});
	
	/* BONUS TOUCH DEVICES */
	var xStart = 0,//Touch start / mouse down start X
		MIN_SWIPE = 75;//minimum swipe/drag
	var onlyTouchDevices = true; //change to False for Mouse events
	
	cardsContainer.addEventListener('touchstart', dragStartHandler, false);
	if(onlyTouchDevices === false) cardsContainer.addEventListener('mousedown', dragStartHandler, false);
	
	// Touch start / Mouse down
	function dragStartHandler(event) {
		event.preventDefault();
		
		xStart = parseInt(getTouchObject(event).clientX);
		
		//add events
		cardsContainer.addEventListener('touchend', dragEndHandler, false);
		cardsContainer.addEventListener('touchcancel', dragEndHandler, false);
		if(onlyTouchDevices === false) cardsContainer.addEventListener('mouseup', dragEndHandler, false);
	};
	
	// Touch end / Mouse up
	function dragEndHandler(event) {
		event.preventDefault();
		
		//remove events
		cardsContainer.removeEventListener('touchend', dragEndHandler);
		cardsContainer.removeEventListener('touchcancel', dragEndHandler);
		if(onlyTouchDevices === false) cardsContainer.removeEventListener('mouseup', dragEndHandler);
		
		var xEnd = parseInt(getTouchObject(event).clientX);
		var dif = xEnd - xStart;//difference from start to end, it can be positive or negative
		
		//needs to be swiped/dragged less than minus MIN_SWIPE or greater than MIN_SWIPE
		if(dif < -MIN_SWIPE || dif > MIN_SWIPE) {
			dif > 0 ? $('.btn.back').click() : $('.btn.next').click();
		}
	}
	
	//Returns Touch if any, else the event
	function getTouchObject(event) {
		return (event.changedTouches ? event.changedTouches[0] : event);
	}
	/* END BONUS TOUCH DEVICES */
});

//Prepends card to cards, with this method there's no need for z-index manipulation 
$.fn.prependCard = function(title, content) {
	var card = $('<div class="card"><header>'+title+'</header>'+content+'</div>');
	this.prepend(card);
	return card;
};