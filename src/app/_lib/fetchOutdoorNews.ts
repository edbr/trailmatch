import Parser from "rss-parser";

const parser = new Parser();

export async function fetchOutdoorNews(limit = 5) {
  const feed = await parser.parseURL("https://www.outsideonline.com/feed/");
  return feed.items.slice(0, limit).map((item) => ({
    title: item.title,
    link: item.link,
    date: item.pubDate,
  }));
}
