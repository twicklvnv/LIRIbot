
//require the key info from the keys.js file
var keys = require("./keys.js");

//requiring the necessary npm packages needed to run the liri.js file
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

//first argument is the action for LIRI to take, second is for the song or movie to search
var action = process.argv[2];
var value = process.argv[3];

//switch case to determine what LIRI should search for or do for each action
switch (action) {
	case "my-tweets":
		getTweets();
		break;

	case "spotify-this-song":
		getSpotify(value);
		break;

	case "movie-this":
		getMovie(value);
		break;

	case "do-what-it-says":
		doWhat(value);
		break;
}

//function to retrieve tweets
function getTweets() {
		//accessing twitter keys
		var client = new Twitter(keys.twitterKeys);
		
		//retrieving tweets 
		var params = {screen_name: 'twicklvnv'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		  	//loop through tweets and display wanted info for each tweet
		  	for (var i = 0; i<tweets.length; i++) {
		  		console.log(tweets[i].created_at);
		  		console.log(tweets[i].text);
		  		console.log(" ");  
		  }
		}
		  else {
		  	console.log(error);
		  }
		
	});
}


//function to retrieve spotify data
function getSpotify(value) {
		//retrieving needed spotify keys
		var spotify = new Spotify(keys.spotifyKeys);
		//searching spotify for the requested song
		spotify.search({ type: 'track', query: value }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		    //console.log(data);
		  }
		  if (value === null) {
		  	value === "the sign";
		  };
		 //pulling artist name out of the artist object
		var artistNames = function(artist) {
			return artist.name;
		}
		var songResults = (data.tracks.items);
		//loop through results and display the wanted info for song 
		for (var j = 0; j<songResults.length; j++) {
			console.log("Artist: " + songResults[j].artists.map(artistNames));
			console.log("Song Name: " + songResults[j].name);
			console.log("Preview: " + songResults[j].preview_url);
			console.log("Album: " + songResults[j].album.name);
			console.log(" ");
		}
		});
	};


//function to search omdb for a movie and return info on that movie

function getMovie(value) {
	request('http://www.omdbapi.com/?t=' + value + '&apikey=trilogy', function (error, response, body) {
		if (value === null) {
			value === "Mr. Nobody";
		}
		var jsonData = JSON.parse(body);
		//Console log and display the wanted info for the movie
		  console.log("Title: " + jsonData.Title);
		  console.log("Year: " + jsonData.Year);
		  console.log("IMDB Rating: " + jsonData.imdbRating);
		  console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
		  console.log("Country: " + jsonData.Country);
		  console.log("Language: " + jsonData.Language);
		  console.log("Plot: " + jsonData.Plot);
		  console.log("Actors: " + jsonData.Actors);

});
}

//function to run the liri do what it says command
function doWhat() {
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			console.log(err);
		}
		var dataArray = data.split(",");
		var action = dataArray[0];
		var value = dataArray[1];
		//console.log(dataArray);
		doWhat(action, value);
		if (action === "spotify-this-song") {
			getSpotify(value);
		}
		else if (action === "my-tweets") {
			getTweets();
		}
		else if (action === "movie-this") {
			getMovie(value);
		}
})
	}
	

		