let LUNR_DATA = null;
let PREVIEW_LOOKUP = null;
const scripts = document.getElementsByTagName("script");
const scriptPath = scripts[scripts.length - 1].src;
const JSON_PATH = scriptPath.substr(0, scriptPath.lastIndexOf("/") + 1);
const BASE_URL = scriptPath.substr(
  0,
  JSON_PATH.lastIndexOf("/", JSON_PATH.lastIndexOf("/") - 1) + 1
);

function jsonFetch(json, filename) {
  return new Promise(function (resolve, reject) {
    if (json) {
      return resolve(json);
    }

    fetch(JSON_PATH + filename)
      .then((response) => {
        if (!response.ok) {
          return reject(new Error(`HTTP error, status = ${response.status}`));
        }
        return response.json();
      })
      .then((data) => {
        return resolve(data);
      });
  });
}

// Parse search results into HTML
function parseLunrResults(results) {
  const html = [];
  for (let i = 0; i < results.length; i++) {
    const id = results[i]["ref"];
    const item = PREVIEW_LOOKUP[id];
    const title = item["t"];
    const preview = item["d"];
    const link = item["l"];
    const result = `<div class="card mb-3">
      <a class="link stretched-link link-underline link-underline-opacity-0" href="${BASE_URL + link}">
          <h2 class="h3 title card-header text-body-emphasis">${title}</h5>
      </a>
      <div class="card-body">
        <div class="card-text">
          ${preview}
        </div>
      </div>
    </div>`;
    html.push(result);
  }
  if (html.length) {
    return html.join("");
  } else {
    return "<p>Ihre Suche ergab keine Ergebnisse</p>";
  }
}

function formatResults(results) {
  return `<article role="article">
    <div class="modal-header">
	        <h1>Suchergebnisse</h1>
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

function closeSearch(el) {
  const elements = document.getElementsByClassName("bs-main");
  elements[1].remove();
  elements[0].classList.remove("collapse");
  return false;
}

function search(el) {
  Promise.all([
    jsonFetch(LUNR_DATA, "search_index.json"),
    jsonFetch(PREVIEW_LOOKUP, "preview.json"),
  ])
    .then((values) => {
      LUNR_DATA = values[0];
      PREVIEW_LOOKUP = values[1];
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
      window.scrollTo(0, 0);
      return false;
    })
    .catch((e) => {
      console.log(e);
    });
  return false;
}
