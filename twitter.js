var Twitter = {
	lastTweetId: null,
	entries: []
};

Twitter.init = function() {
	Twitter.getTweets();
}

Twitter.getTweets = function() {
	chrome.extension.sendRequest({'action' : 'getTweets'}, Twitter.catchTweets);
}

Twitter.catchTweets = function(data) {
	if (data !== null) {
	    for (var i = data.results.length -1; i > -1; --i) {
			var tweet = data.results[i];
			if (Twitter.lastTweetId !== tweet.id_str) {
				Twitter.entries.push({'username': tweet.from_user,
									  'text': tweet.text});
			}
			Twitter.lastTweetId = tweet.id_str;
		}	
	}
	
	setTimeout(Twitter.getTweets, 5000);
}