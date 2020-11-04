var newURL;

if (document.title.indexOf("MyAnimeList.net") != -1) {
  //Creating Elements
  var titleElement = document.getElementsByClassName("title-name h1_bold_none")[0].innerHTML;
  newURL = getURL(titleElement);
  document.getElementsByClassName("title-name h1_bold_none")[0].innerHTML = "<a href='" + newURL + "' target='_blank' style='text-decoration: none;'>" + titleElement + "</a>";
}

function getURL(title)
{
  var res = title.replace(/\s*\<.*?\>\s*/g, ''); // Remove <strong> tag
  res = encodeURIComponent(res);
  return "https://kissanime.nz/Search/?s=" + res.toString();
}

/* Listen for messages */
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

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  /* If the received message has the expected format... */
  if (msg.text && (msg.text == "report_back_kiss"))
  {
      /* Call the specified callback, passing 
         the web-pages DOM content as argument */
    var title = modifyTitle(document.getElementsByClassName("jtitle")[0].innerHTML);
    sendResponse(title);
  }
  else if (msg.text && (msg.text == "report_back_mal"))
  {
    sendResponse(newURL);
  }
});