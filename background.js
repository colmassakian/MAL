var urlRegexKiss = /^https?:\/\/(?:[^./?#]+\.)?kissanime\.nz/;
var urlRegexMal = /^https?:\/\/(?:[^./?#]+\.)?myanimelist\.net/;

function openPageMal(searchTerm) {
  var query = `
  query ($search: String, $type: MediaType) {
    Page {
      media (search: $search, type: $type) {
        idMal
        title {
          romaji
        }
      }
    }
  }
  `;

  var variables = {
      search: searchTerm,
      type: "ANIME"
  };

  var url = 'https://graphql.anilist.co',
      options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: query,
              variables: variables
          })
      };

  fetch(url, options)
  .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          var currData = data["data"]["Page"]["media"][0]
          var res = currData["idMal"];
          var title = currData["title"]["romaji"].replace(/ /g, '_');
          var newURL = "http://myanimelist.net/anime/" + res.toString() + "/" + title;
          chrome.tabs.create({ url: newURL });
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

function openPageKiss(animeURL) {
  chrome.tabs.create({ url: animeURL });
}

chrome.browserAction.onClicked.addListener(function(tab){
  if (urlRegexKiss.test(tab.url)) // If the current tab is KissAnime, open the MAL page
  {
    // ...if it matches, send a message specifying a callback too
    chrome.tabs.sendMessage(tab.id, {text: 'report_back_kiss'}, openPageMal);
  }
  else if (urlRegexMal.test(tab.url)) // If the current tab is MAL, open the KissAnime search
  {
    // ...if it matches, send a message specifying a callback too
    chrome.tabs.sendMessage(tab.id, {text: 'report_back_mal'}, openPageKiss);
  }
});