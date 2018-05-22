
var Twitter = require('twitter');
var shibe = require('./shibe.js');
require('dotenv').config();

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var lastID = null;

function getRealTrumpTweets(callback){
	var params = {
		screen_name: 'realDonaldTrump',
		exclude_replies: true,
		tweet_mode: 'extended'
	};
	if(lastID != null){
		params.since_id = lastID;
	}
	client.get('/statuses/user_timeline', params, function(error, tweets, response){
		if(error){
			console.log("Attempting to get real trump twets encountered error:");
			console.log(error);
		}
		if(tweets.length > 0){
			lastID = tweets[0].id;
				for(tweet of tweets){
				console.log(tweet);
				//strip URLs, not useful for dogefying
				tweet.full_text = tweet.full_text.replace(/http[^\s]*/g, '');
				callback(tweet);
				return;
			}
		}
	})
}

function convertToDoge(tweet){
	var shibeVersion = shibe.createShibeFromText(tweet.full_text.replace('&amp;','&'));
	console.log(tweet.full_text);
	console.log("->");
	console.log(shibeVersion);
	console.log("------");
	var params = {
		status: shibeVersion,
		in_reply_to_status_id: tweet.id_str,
		auto_populate_reply_metadata: true
	};
	console.log(params);
	client.post('/statuses/update', params, function (error, tweet, response){
			if(error){
				console.log("Tweet post attempt error:");
				console.log(error);
			}else{
				console.log("It worked!");
				console.log(response);
			}
	})
}

//setInterval(function(){
	getRealTrumpTweets(convertToDoge);
//}, 6000);