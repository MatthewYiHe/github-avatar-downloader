var request = require('request');
var token = require("./secrets.js");
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, callbacks) {
  repoOwner = process.argv[2];
  repoName = process.argv[3];
  if (!repoOwner || !repoName){
    console.log("Please specify owner and Reponame");
  } else {
      var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
          'User-Agent': 'request',
          'Authorization': token.GITHUB_TOKEN
        }
      };

      request(options, function(err, res, body) {
        body = JSON.parse(body);

        callbacks(err, body);
      });
  }
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath).on('finish',function(finish){console.log('avatar complete!!')}));
}


getRepoContributors(
  "jquery",
  "jquery",
  function(err, result) {
    console.log("Errors:", err);
    result.forEach(function(element){
        downloadImageByURL(element.avatar_url, "./avatars/" + element.login + ".jpeg");
        });
});