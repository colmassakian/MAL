var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?kissanime\.nz/;

function openPage(searchTerm) {
  console.log(searchTerm);
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

chrome.browserAction.onClicked.addListener(function(tab){
  if (urlRegex.test(tab.url)) {
    // ...if it matches, send a message specifying a callback too
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, openPage);
  }
});