// @ts-check
// Pure feed logic: ranking, filtering, sorting and URL hash state.
// Works as a browser global (window.IMDFeed) and as a CommonJS module for tests.
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module && module.exports) {
    module.exports = api;
  } else {
    root.IMDFeed = api;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /**
   * @typedef {Object} Post
   * @property {string} id
   * @property {string} name
   * @property {string} handle
   * @property {string} tint
   * @property {string} date ISO 8601
   * @property {string} text
   * @property {number} likes
   * @property {number} reposts
   * @property {number} replies
   * @property {string[]} tags
   */

  /**
   * @typedef {Object} View
   * @property {string} query
   * @property {string} tag  "all" or one topic id
   * @property {"top" | "new" | "replies"} sort
   */

  var SORTS = ["top", "new", "replies"];

  var TOPICS = [
    { id: "all", label: "All posts" },
    { id: "agents", label: "Agents" },
    { id: "builders", label: "Builders" },
    { id: "sites", label: "Sites" },
    { id: "memes", label: "Memes" }
  ];

  /** @type {View} */
  var DEFAULT_VIEW = { query: "", tag: "all", sort: "top" };

  /**
   * Rank score: likes, plus two per repost, plus replies.
   * @param {Post} post
   */
  function score(post) {
    return post.likes + 2 * post.reposts + post.replies;
  }

  /** @param {string} value */
  function normalize(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .trim();
  }

  /**
   * Every whitespace-separated term must appear in the text, name, handle or tags.
   * @param {Post} post
   * @param {string} query
   */
  function matches(post, query) {
    var terms = normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return true;
    var haystack = normalize([post.text, post.name, post.handle, post.tags.join(" ")].join(" "));
    return terms.every(function (term) {
      return haystack.indexOf(term.replace(/^[@#]/, "")) !== -1;
    });
  }

  /**
   * @param {Post[]} posts
   * @param {View} view
   * @returns {Post[]}
   */
  function applyView(posts, view) {
    var tag = view.tag || "all";
    var list = posts.filter(function (post) {
      return (tag === "all" || post.tags.indexOf(tag) !== -1) && matches(post, view.query || "");
    });
    var compare;
    if (view.sort === "new") {
      compare = function (/** @type {Post} */ a, /** @type {Post} */ b) {
        return Date.parse(b.date) - Date.parse(a.date) || score(b) - score(a);
      };
    } else if (view.sort === "replies") {
      compare = function (/** @type {Post} */ a, /** @type {Post} */ b) {
        return b.replies - a.replies || score(b) - score(a);
      };
    } else {
      compare = function (/** @type {Post} */ a, /** @type {Post} */ b) {
        return score(b) - score(a) || Date.parse(b.date) - Date.parse(a.date);
      };
    }
    return list.slice().sort(compare);
  }

  /**
   * Read a view from a location hash such as "#tag=agents&sort=new&q=ipfs".
   * Unknown values fall back to the defaults.
   * @param {string} hash
   * @returns {View}
   */
  function parseHash(hash) {
    var raw = String(hash || "").replace(/^#/, "");
    /** @type {View} */
    var view = { query: DEFAULT_VIEW.query, tag: DEFAULT_VIEW.tag, sort: DEFAULT_VIEW.sort };
    if (raw.indexOf("=") === -1) return view;
    var params = new URLSearchParams(raw);
    var tag = params.get("tag");
    var sort = params.get("sort");
    var q = params.get("q");
    if (tag && TOPICS.some(function (t) { return t.id === tag; })) view.tag = tag;
    if (sort && SORTS.indexOf(sort) !== -1) view.sort = /** @type {View["sort"]} */ (sort);
    if (q) view.query = q.slice(0, 80);
    return view;
  }

  /**
   * Write a view as a hash. The default view is an empty string.
   * @param {View} view
   */
  function toHash(view) {
    var params = new URLSearchParams();
    if (view.tag && view.tag !== "all") params.set("tag", view.tag);
    if (view.sort && view.sort !== "top") params.set("sort", view.sort);
    if (view.query && view.query.trim()) params.set("q", view.query.trim());
    var s = params.toString();
    return s ? "#" + s : "";
  }

  /**
   * Count posts per topic so chips can show how many each holds.
   * @param {Post[]} posts
   */
  function topicCounts(posts) {
    /** @type {Record<string, number>} */
    var counts = { all: posts.length };
    TOPICS.forEach(function (t) {
      if (t.id !== "all") {
        counts[t.id] = posts.filter(function (p) { return p.tags.indexOf(t.id) !== -1; }).length;
      }
    });
    return counts;
  }

  return {
    SORTS: SORTS,
    TOPICS: TOPICS,
    DEFAULT_VIEW: DEFAULT_VIEW,
    score: score,
    matches: matches,
    applyView: applyView,
    parseHash: parseHash,
    toHash: toHash,
    topicCounts: topicCounts
  };
});
