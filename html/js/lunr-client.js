const LUNR_DATA = {"version":"2.3.9","fields":["t","b","k"],"fieldVectors":[],"invertedIndex":[],"pipeline":["stemmer"]};
const PREVIEW_LOOKUP = {};
const BASE_URL = 'https://tboenig.github.io/gt-guidelines/html/trans/';

// Parse search results into HTML
function parseLunrResults(results) {
  const html = [];
  for (let i = 0; i < results.length; i++) {
    const id = results[i]["ref"];
    const item = PREVIEW_LOOKUP[id];
    const title = item["t"];
    const preview = item["d"];
    const link = item["l"];
    const result =
      '<p><span class="h3"><a href="' +
      BASE_URL + 
      link +
      '">' +
      title +
      "</a></span></p>" +
      preview;
    html.push(result);
  }
  if (html.length) {
    return html.join("");
  } else {
    return "<p>Your search returned no results.</p>";
  }
}

function formatResults(results) {
  return `<article role="article">
		<div class="modal-header">
	        <h1>Search Results</h1>
	        <button type="button" class="btn-close" aria-label="Close" onclick="closeSearch(this);"></button>
	    </div>
	    <div class="modal-body">
		${parseLunrResults(results)}
		</div>
		</article>`;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showResultCount(query, total, domElementId) {
  if (total == 0) {
    return;
  }

  var s = "";
  if (total > 1) {
    s = "s";
  }
  var found = "<p>Found " + total + " result" + s;
  if (query != "" && query != null) {
    query = escapeHtml(query);
    var forQuery = ' for <span class="result-query">' + query + "</span>";
  } else {
    var forQuery = "";
  }
  var element = document.getElementById(domElementId);
  element.innerHTML = found + forQuery + "</p>";
}

function closeSearch(el) {
  const elements = document.getElementsByClassName("bs-main");
  elements[1].remove();
  elements[0].classList.remove("collapse");
  return false;
}

function search(el) {
  const query = document.getElementById("search-input").value;
  const idx = lunr.Index.load(LUNR_DATA);
  // Write results to page
  const results = idx.search(query);
  const elements = document.getElementsByClassName("bs-main");

  if (elements.length < 2) {
    const resultHtml = `<main role="main" class="container bs-main">
	    	${formatResults(results)}</main>`;

    elements[0].insertAdjacentHTML("afterend", resultHtml);
  } else {
    elements[1].innerHTML = formatResults(results);
  }

  elements[0].classList.add("collapse");
  window.scrollTo(0,0);
  return false;
}
