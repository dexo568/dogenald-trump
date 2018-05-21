
var Twitter = require('twitter');
var shibe = require('./shibe.js');
require('dotenv').config();

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function getRealTrumpTweets(callback){
	client.get('/statuses/user_timeline',
	{
		screen_name: 'realDonaldTrump',
		exclude_replies: true,
		tweet_mode: 'extended'

	},
	function(error, tweets, response){
		for(tweet of tweets){
			//strip URLs, not useful for dogefying
			tweet.full_text = tweet.full_text.replace(/http[^\s]*/g, '');
			callback(tweet);
		}
	})
}

function convertToDoge(tweet){
	var shibeVersion = shibe.createShibeFromText(tweet.full_text.replace('&amp;','&'));
	console.log(tweet.full_text);
	console.log("->");
	console.log(shibeVersion);
	console.log("------");
}

getRealTrumpTweets(convertToDoge);