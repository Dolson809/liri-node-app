require("dotenv").config();

var fs = require("fs");

var request = new (require('omdbapi'))('trilogy');

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotifyKeys);

//=========================================================================================
var doIt = process.argv[2];

var argument = "";

doSomething(doIt, argument);

function doSomething(doIt, argument) {

    argument = getThirdArgument();

    switch (doIt) {

        case "spotify-this-song":

            var songArry = argument;

            if (songArry === "") {
                lookupSpecificSong();

            } else {
                getSongInfo(songArry);
            }
            break;

        case "movie-this":

            var movieTitle = argument;


            if (movieTitle === "") {
                getMovieInfo("mr. nobody");


            } else {
                getMovieInfo(movieTitle);
            }
            break;


        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

function getThirdArgument() {

	argumentArray = process.argv;

	for (var i = 3; i < argumentArray.length; i++) {
		argument += argumentArray[i];
	}
	return argument;
}

//======================================================================================

function getSongInfo(songArry) {
    spotify.search({ type: 'track', query: songArry },


        function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var songArry = data.tracks.items[0].album.artists;

            var artistName = [];

            for (var i = 0; i < songArry.length; i++) {
                artistName.push(songArry[i].name);
            }

            var artist = artistName.join(", ");


            console.log("Artist: " + artist)
            console.log("Song: " + data.tracks.items[0].name)
            console.log("Spotify URL: " + data.tracks.items[0].preview_url)
            console.log("Album Name: " + data.tracks.items[0].album.name)

        });
};

function lookupSpecificSong() {

    spotify.lookup({ type: 'track', id: '3DYVWvPh3kGwPasp7yjahc' }, function (err, data) {
        if (err) {
            logOutput.error(err);
            return
        }

        logOutput("Artist: " + data.artists[0].name);
        logOutput("Song: " + data.name);
        logOutput("Spotify Preview URL: " + data.preview_url);
        logOutput("Album Name: " + data.album.name);
    });
}
//=====================================================================================

function getMovieInfo(movieTitle) {
    request.search({
        search: movieTitle,  // required

        

    }).then(res => {
        console.log('got response:', res);
    }).catch(console.error);

}
//=====================================================================================


function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            logOutput.error(err);
        } else {

            var randomArray = data.split(",");

            doIt = randomArray[0];

            argument = randomArray[1];

            doSomething(doIt, argument);
        }
    });
}

//=====================================================================================

