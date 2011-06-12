var funny_texts = [
	'Hello! My name is Clippy. I\'m here to help you, my friend',
	'Did you know that I know everything about this application?',
	'I\'m very useful. Honestly. Don\'t you believe me? Realllyyyy???',
    "<p>This is Google Docs. It's:</p><ul><li>in cloud</li><li>extremely cool</li><li>The only office tool that I live in =)</li></ul>",
	"Office... I live at office. Do you live at office too?",
	"Why don't you want to talk to me?",
	"I'm cheap... I cost 0.00 dollars... Arghhh... ",
	"I like to shout \"D'oh!\". I think I've heard it somewhere",
	"Clouds, clouds, it's so modern... A-a-a-a-h! A plain! Bams!...",
	"Ooops, I did it again... What did I do if I can actualy do nothing.",
	"Ciklum is a very nice company! I was born in its penthouse",
	"I was drawn in Inkscape and animated in GIMP. Many thanks to those gyus who developed that awesome software!",
	"I was born from Mac and Linux. Am I a freak?",
	'<a href="http://developers.org.ua">The best IT community all over the world</a>. Honestly...',
	"My mouth is Twitter",
	"Kyiv is a very nice city at night",
	"Domash is sneaky. You must have no doubt of that.",
	"Come to the dark side. We've got cookies in Ciklum office",
	"My creators code for food and... It was pizza!",
	"Developers! Developers! Developers! Developers! Developers! Developers! Developers! Developers! Developers!",
	"Only donkeys use SVN nowadays. You must use Git!",
	"640Kb forever!"
];

var hideBalloonTimer;
var showBalloonTimer;

var balloon_open = 0;
var current_frame = 0;
var animate_count = 9;
var animate_timeout = 5000;
var idle_timeout = 4000;
var balloon_timeout = 4000;

function takeMessage(ownMessages)	{
	if (Twitter.entries.length > 0) {
		var mresult = '<h3>' + Twitter.entries[0].username + '</h3><p>' + Twitter.entries[0].text + '</p>';
		Twitter.entries = Twitter.entries.slice(1);
		return mresult;
	} else if (ownMessages) {
		return '<h3>Clippy</h3><p>' + funny_texts[Math.floor(Math.random() * funny_texts.length)] + '</p>';
	} else {
		return null;
	}
}

function showBalloon(toRandomize, ownMessages)	{
	if (balloon_open == 1)	{
		hideBalloon();
		return;
	}
	if (toRandomize) {
		var message = takeMessage(ownMessages);
		if (message !== null) {
		    $('<div class="balloon"><p>' + message + '</p></div>').appendTo('body');	
		}
	} else {
	    $('<div class="balloon"><p>I am the last one you expected to see here. Well, hello anyway...</p></div>').appendTo('body');
	}
	
	$('.balloon').css({
		position: 'absolute',
		top: $('#clippy').parent().position().top - $('.balloon').height() - 80 + 'px',
		left: $('#clippy').parent().position().left - 70 + 'px',
		border: '1px solid black',
		background: '#FFFF88',
		width: '160px',
		padding: '10px',
	});
	$('.balloon').css('border-radius', '8px');
	balloon_open = 1;
	hideBalloonTimer = setTimeout(hideBalloon, balloon_timeout);
}

function hideBalloon()	{
	if (balloon_open == 1) {
		$('.balloon').remove();
		balloon_open = 0;
		clearTimeout(showBalloonTimer);
		showBalloonTimer = setTimeout('showBalloon(true, false)', 3000);
	}
}

function animateIdle()	{
	$('#clippy').attr('src', chrome.extension.getURL("idle.gif"));
	setTimeout('animateNext()', animate_timeout);
}

function animateNext()	{
	current_frame += 1;
	if (current_frame == animate_count - 1)	{
		$('#clippy').attr('src', chrome.extension.getURL("clippy" + current_frame + ".gif"));		
		setTimeout(animateNext, 5000);
		return;
	}
	if (current_frame == animate_count) current_frame = 0;
	$('#clippy').attr('src', chrome.extension.getURL("clippy" + current_frame + ".gif"));
	setTimeout(animateIdle, idle_timeout);
}

$(function(){
	var imgURL = chrome.extension.getURL("clippy0.gif");
	$('<div><img id="clippy" src=""/></div>').appendTo('body');

	$('#clippy').attr('src', imgURL).parent().css(
		{position: 'absolute',
		 bottom: '30px',
		 right: '30px',
		 width: '134px',
		 height: '150px'});
	
	$('#clippy').attr('width', '134px').attr('height', '150px');
	$('#clippy').parent().draggable({
		start: function() {
			hideBalloon();
		}
	});
	$('#clippy').click(function(eventObject){
		if (balloon_open == 0)	{
			clearTimeout(hideBalloonTimer); 
			clearTimeout(showBalloonTimer);
			showBalloon(true, true);
		} else if (balloon_open == 1)	{
			clearTimeout(showBalloonTimer);
			clearTimeout(hideBalloonTimer); 
			hideBalloon();
		}
	});
	setTimeout('showBalloon(false, false)', 3000);
	setTimeout(animateIdle, idle_timeout);
	
	Twitter.init();
});