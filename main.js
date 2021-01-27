
function main() {
  var URL = 'https://feed.refcountpodcast.com/feed.rss';

  getRss(URL, function (err, xmlDoc) {
    var el = document.getElementById('page-content__episodes');
    if (err) {
      el.innerHTML = "Something went wrong. We're unable to create the episode list. Please try refreshing your browser.";
      return;
    }

    renderEpisodes(el, xmlDoc);
  });
}

function getRss(url, callback) {
  var httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState !== XMLHttpRequest.DONE) {
      return;
    }

    if (httpRequest.status === 200) {
      callback(null, httpRequest.responseXML);
    } else {
      callback(new Error("Failed to get RSS file"));
    }
  }

  httpRequest.open('GET', url);
  httpRequest.send();
}


function renderEpisodes(el, xmlDoc) {
  var epElements = xmlDoc.getElementsByTagName('item');
  var html = '';
  for (var i = epElements.length - 1; i >= 0; i--) {
    html += episodeHTML(epElements[i]);
  }
  el.innerHTML = html;
}


function episodeHTML(epElement) {
  var html = '<section class="episode">';
  var parts = ['title', 'pubDate', 'description', 'link'];
  for (var i = 0; i < parts.length; i++) {
    var content = epElement.getElementsByTagName(parts[i])[0].textContent;
    html += partHTML(parts[i], content);
  }
  html += '</section>';
  return html;
}


function partHTML(part, content) {
  if (part === 'link') {
    content = '<a target="_new" href="' + content + '">Listen &#x1f50a;</a>';
  }
  if (part === 'pubDate') {
    content = content.substr(0, 16);
  }
  return '<div class="episode__' + part + '">' + content + '</div>';
}

main();