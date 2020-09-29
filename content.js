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
  if (msg.text && (msg.text == "report_back")) {
      /* Call the specified callback, passing 
         the web-pages DOM content as argument */
    // TODO: Remove dub from title
    // var title = document.getElementsByClassName("jtitle")[0].innerHTML
    // title = title.replace(" (Dub)", "");
    var title = modifyTitle(document.getElementsByClassName("jtitle")[0].innerHTML);
    sendResponse(title);
  }
});