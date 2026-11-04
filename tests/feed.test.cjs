// Interaction logic tests: run with `npm test` (node --test).
const test = require("node:test");
const assert = require("node:assert/strict");
const Feed = require("../src/feed.js");
const posts = require("../src/posts.js");

test("sample data is well formed", () => {
  const ids = new Set();
  for (const p of posts) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
    ids.add(p.id);
    assert.match(p.handle, /^@\w+$/);
    assert.ok(!Number.isNaN(Date.parse(p.date)), `bad date on ${p.id}`);
    for (const tag of p.tags) {
      assert.ok(Feed.TOPICS.some((t) => t.id === tag), `unknown tag ${tag}`);
    }
  }
});

test("top sort ranks by score, highest first", () => {
  const list = Feed.applyView(posts, { query: "", tag: "all", sort: "top" });
  assert.equal(list.length, posts.length);
  for (let i = 1; i < list.length; i++) {
    assert.ok(Feed.score(list[i - 1]) >= Feed.score(list[i]));
  }
  assert.equal(list[0].id, "p08");
});

test("new sort puts the latest post first", () => {
  const list = Feed.applyView(posts, { query: "", tag: "all", sort: "new" });
  assert.equal(list[0].id, "p09");
});

test("replies sort orders by reply count", () => {
  const list = Feed.applyView(posts, { query: "", tag: "all", sort: "replies" });
  for (let i = 1; i < list.length; i++) assert.ok(list[i - 1].replies >= list[i].replies);
});

test("topic filter keeps only tagged posts", () => {
  const list = Feed.applyView(posts, { query: "", tag: "memes", sort: "top" });
  assert.ok(list.length > 0);
  assert.ok(list.every((p) => p.tags.includes("memes")));
  assert.equal(list.length, Feed.topicCounts(posts).memes);
});

test("search matches text, handle and tags, case and accent insensitive", () => {
  assert.ok(Feed.applyView(posts, { query: "IPFS", tag: "all", sort: "top" }).some((p) => p.id === "p02"));
  assert.deepEqual(
    Feed.applyView(posts, { query: "@bogwatch", tag: "all", sort: "top" }).map((p) => p.id),
    ["p08"]
  );
  assert.ok(Feed.applyView(posts, { query: "#sites", tag: "all", sort: "top" }).length >= 3);
  assert.equal(Feed.applyView(posts, { query: "zzzz-no-match", tag: "all", sort: "top" }).length, 0);
});

test("search and topic combine", () => {
  const list = Feed.applyView(posts, { query: "identity", tag: "agents", sort: "top" });
  assert.ok(list.length > 0);
  assert.ok(list.every((p) => p.tags.includes("agents")));
});

test("applyView does not mutate the input", () => {
  const before = posts.map((p) => p.id).join();
  Feed.applyView(posts, { query: "", tag: "all", sort: "new" });
  assert.equal(posts.map((p) => p.id).join(), before);
});

test("hash state round-trips and ignores bad values", () => {
  const view = { query: "frog visor", tag: "agents", sort: "new" };
  assert.deepEqual(Feed.parseHash(Feed.toHash(view)), view);
  assert.equal(Feed.toHash(Feed.DEFAULT_VIEW), "");
  assert.deepEqual(Feed.parseHash("#about"), Feed.DEFAULT_VIEW);
  assert.deepEqual(Feed.parseHash("#tag=nope&sort=worst"), Feed.DEFAULT_VIEW);
});
