var urlRegexKiss = /^https?:\/\/(?:[^./?#]+\.)?kissanime\.nz/;
var urlRegexMal = /^https?:\/\/(?:[^./?#]+\.)?myanimelist\.net/;

if(document.title.indexOf("MyAnimeList.net") != -1)
{
    //Creating Elements
    titleMal = document.getElementsByClassName("title-name h1_bold_none");
    if((titleMal && titleMal.length))
    {
        var titleElementMal = titleMal[0].innerHTML;
        var kissURL = getURLKiss(titleElementMal);
        document.getElementsByClassName("title-name h1_bold_none")[0].innerHTML = "<a href='" + kissURL + "' target='_blank' style='text-decoration: none;'>" + titleElementMal + "</a>";
    }
}
else if(document.title.indexOf("KissAnime") != -1)
{
    titleKiss = document.getElementsByClassName("jtitle");
    if(titleKiss && titleKiss.length > 1 && titleKiss[1].className == 'jtitle')
    {
        var titleElementKiss = titleKiss[0].innerHTML;
        var malURL = modifyTitle(titleElementKiss);
        setURLMal(malURL);
    }
}

function getURLKiss(title)
{
    var res = title.replace(/\s*\<.*?\>\s*/g, ''); // Remove <strong> tag
    res = encodeURIComponent(res);
    return "https://kissanime.nz/Search/?s=" + res.toString();
}

function modifyTitle(title) {
    // Remove any item in () except years
    title = title.replace(" (Dub)", "");
    title = title.replace(" (Sub)", "");
    title = title.replace(" (TV)", "");

    // Remove parentheses around years
    title = title.replace("(", "");
    title = title.replace(")", "");

    return title;
}

function setURLMal(searchTerm) {
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
            console.log('Looks like there was a problem. Status Code: ' + response.status);
            return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
            var currData = data["data"]["Page"]["media"][0]
            var res = currData["idMal"];
            var title = currData["title"]["romaji"].replace(/ /g, '_');
            var newURL = "http://myanimelist.net/anime/" + res.toString() + "/" + title;
            
            var titleKiss = document.getElementsByClassName("jtitle");
            var titleElementKiss = titleKiss[1].innerHTML;
            document.getElementsByClassName("jtitle")[1].innerHTML = "<a href='" + newURL + "' target='_blank' style='text-decoration: none;'>" + titleElementKiss + "</a>";
        });
      }
    )
    .catch(function(err) {
        console.log('Fetch Error :-S', err);
    });
}