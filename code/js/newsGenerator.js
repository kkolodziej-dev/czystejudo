document.addEventListener('DOMContentLoaded', async () => {

const NEWS_PATH = "https://kkolodziej-dev.github.io/imcspoland/entities/news/news.json";
let NEWS_DISPLAY = 3;

let newsContainer = document.getElementById("newsContent");

setNewsArray();

async function setNewsArray() {

    let lJson = await fetch(NEWS_PATH)
    .then(response => response.json());

    NEWS_DISPLAY = lJson.display;
    if (NEWS_DISPLAY > lJson.news.size) console.error("News display number is greater that the actual news number");

    for (let i = 0; i < NEWS_DISPLAY; i++) {
        let lDiv = document.createElement("div");
        lDiv.className = "singleNews";

        let lH3 = document.createElement("h3");
        lH3.innerText = lJson.news[i].title;
        lH3.className = 'customHeader';
        lDiv.appendChild(lH3);

        let lP = document.createElement("p");
        lP.className = "news0margin";
        lP.innerText = lJson.news[i].content;
        lDiv.appendChild(lP);

        let lSpan = document.createElement("span");
        lSpan.className = "newsDate";
        lSpan.innerText = lJson.news[i].date;
        lDiv.appendChild(lSpan);

        newsContainer.appendChild(lDiv);
    }

}
})