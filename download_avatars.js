var request = require('request');
var token = require("./secrets.js");
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callbacks) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    body = JSON.parse(body);

    // body.forEach(function(element){
    //   console.log(element.avatar_url);
    // });
    // console.log(typeof body)
    callbacks(err, body);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath));
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