require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var name = process.argv[3];

var liri = {
    
    // Method to retrieve tweets
    my_tweets: function(){
        // Parameters needed to show my tweets
        var params = {screen_name: 'darkp3rf3ction'};
        // Get function
        client.get('statuses/user_timeline', params, function(objectError, tweets, response){
            if (!objectError) {
                // For loop that runs through tweets and displays them to the console in a readable format
                for (i = 0; i < tweets.length && i < 20; i++) {
                    var output = " \n--------\n" + tweets[i].text + "\n" + tweets[i].created_at + "\n-------- \n";
                    console.log(output);
                    liri.log(output);
                }
            }
        });
    },
    
    // Method to retrieve song info
    spotify_this_song: function(){
        // If name var is empty it sets to default value
        if (name == null) {
            name = "The Sign Ace of Base";
        }

        // Spotify search funtion that uses the name variable for search parameter
        spotify.search({type: 'track', query: name}, function(objectError, data){
            if (!objectError){

                // For loop, looping through first 5 songs it gives back
                for (i = 0; i < data.tracks.items.length && i < 5; i++){
                    var output = " \n--------\n" + 
                    "Artist: " + data.tracks.items[i].album.artists[0].name + "\n" + 
                    "Song Name: " + data.tracks.items[i].name + "\n" + 
                    "Preview: " + data.tracks.items[i].preview_url + 
                    "\nAlbum Name: " + data.tracks.items[i].album.name + "\n--------\n ";

                    console.log(output);
                    liri.log(output);
                }
            }
        });
    },

    // Method to retrieve movie info
    movie_this: function(){
        // If name var is empty it sets to default value
        if (name == null) {
            name = "Mr. Nobody";
        }

        // OMDb request
        request('http://www.omdbapi.com/?t=' + name + '&y=&plot=short&r=json&apikey=40e9cece', function (objectError, response, body) {
            if(!objectError && response.statusCode == 200) {
                var movie = JSON.parse(body);
                var output = 
                " \n--------"+
                "\nTitle: " + movie.Title+
                "\nRelease Year: " + movie.Year+
                "\nIMDb Rating: " + movie.Ratings[0].Value+
                "\nRotten Tomatoes: " + movie.Ratings[1].Value+
                "\nCountry: " + movie.Country+
                "\nLanguage: " + movie.Language+
                "\nPlot: " + movie.Plot+
                "\nActors: " + movie.Actors+
                "\n--------\n ";

                console.log(output);
                liri.log(output);
            }
        });
    },

    // Method to read text file
    do_what_it_says: function(){
        // Reads random.txt file and runs command inside
        fs.readFile('random.txt', 'utf8', function (objectError, data) {
            if (!objectError){
                var dataArray = data.split(', ');
                command = dataArray[0];
                name = dataArray [1];

                liri[command]();
            }
        });
    },
    
    // Method to help user
    help: function(){
        var output =
        " \n--------"+
        "\nHere are some commands that LIRI knows: \nmy_tweets \nspotify_this_song \nmovie_this \ndo_what_it_says"+
        "\nPlease put a + instead of spaces, for example node movie_this cast+away"+
        "\n--------\n ";

        console.log(output);
        liri.log(output);
    },

    // Method to log
    log: function(output) {
        fs.appendFile("log.txt", output, function(objectError){
            if (!objectError) {
            //    console.log("Data Stored");
            }
            else {
            //    console.log("nope");
            }
        });
    }
}

// Switch to find which method to run
switch(command){
    case "my_tweets":
        liri[command]();
        break;

    case "spotify_this_song":
        liri[command]();
        break;

    case "movie_this":
        liri[command]();
        break;

    case "do_what_it_says":
        liri[command]();
        break;

    case "help":
        liri[command]();
        break;

    default:
        var output =
        " \n--------"+
        "\nLIRI does not know that."+
        "\n--------";

        console.log(output);
        liri.log(output);
        liri.help();
}