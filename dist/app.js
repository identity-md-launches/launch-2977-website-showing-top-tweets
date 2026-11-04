// @ts-check
// DOM wiring for the ranked feed. Logic lives in feed.js, data in posts.js.
(function () {
  "use strict";

  /** @type {any} */
  var w = window;
  var Feed = w.IMDFeed;
  /** @type {import("./feed.js").Post[]} */
  var posts = w.IMD_POSTS || [];

  var SVG_NS = "http://www.w3.org/2000/svg";

  /** @param {string} id */
  function byId(id) {
    var el = document.getElementById(id);
    if (!el) throw new Error("Missing #" + id);
    return el;
  }

  var searchInput = /** @type {HTMLInputElement} */ (byId("search"));
  var sortSelect = /** @type {HTMLSelectElement} */ (byId("sort"));
  var chipGroup = byId("chips");
  var feedList = byId("feed");
  var countEl = byId("result-count");
  var emptyEl = byId("empty");
  var resetBtn = byId("reset");
  var toast = byId("toast");

  var view = Feed.parseHash(location.hash);

  var numberFormat = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
  var dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

  var counts = Feed.topicCounts(posts);

  // Topic chips
  Feed.TOPICS.forEach(function (/** @type {{id: string, label: string}} */ topic) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.dataset.tag = topic.id;
    btn.textContent = topic.label + " " + counts[topic.id];
    btn.addEventListener("click", function () {
      view.tag = topic.id;
      update(true);
    });
    chipGroup.appendChild(btn);
  });

  /**
   * @param {string} tag
   * @param {Record<string, string>} [attrs]
   * @param {string} [text]
   */
  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
    if (text != null) node.textContent = text;
    return node;
  }

  /** @param {string} tint */
  function avatar(tint) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "avatar");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("viewBox", "0 0 64 64");
    svg.style.setProperty("--tint", tint);
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#frog");
    svg.appendChild(use);
    return svg;
  }

  /**
   * @param {string} label
   * @param {number} value
   */
  function stat(label, value) {
    var wrap = el("div");
    wrap.appendChild(el("dt", undefined, label));
    var dd = el("dd", { title: value.toLocaleString("en") + " " + label }, numberFormat.format(value));
    wrap.appendChild(dd);
    return wrap;
  }

  /**
   * @param {import("./feed.js").Post} post
   * @param {number} index
   */
  function renderPost(post, index) {
    var li = el("li", { class: "post", id: "post-" + post.id });
    var side = el("div", { class: "post-side" });
    side.appendChild(avatar(post.tint));
    var rank = el("span", { class: "rank" });
    rank.appendChild(el("span", { class: "visually-hidden" }, "Rank "));
    rank.appendChild(document.createTextNode("#" + (index + 1)));
    side.appendChild(rank);
    li.appendChild(side);

    var body = el("article", { class: "post-body", "aria-labelledby": "name-" + post.id });
    var head = el("p", { class: "post-head" });
    head.appendChild(el("span", { class: "post-name", id: "name-" + post.id }, post.name));
    head.appendChild(el("span", { class: "post-meta" }, post.handle));
    var time = el("time", { class: "post-meta", datetime: post.date }, dateFormat.format(new Date(post.date)));
    head.appendChild(time);
    body.appendChild(head);

    body.appendChild(el("p", { class: "post-text" }, post.text));

    var tags = el("ul", { class: "post-tags", "aria-label": "Topics" });
    post.tags.forEach(function (t) {
      tags.appendChild(el("li", undefined, "#" + t));
    });
    body.appendChild(tags);

    var foot = el("div", { class: "post-foot" });
    var stats = el("dl", { class: "stats" });
    stats.appendChild(stat("likes", post.likes));
    stats.appendChild(stat("reposts", post.reposts));
    stats.appendChild(stat("replies", post.replies));
    foot.appendChild(stats);

    var copyBtn = el("button", { type: "button", class: "button button-quiet", "data-copy": post.id }, "Copy post");
    copyBtn.setAttribute("aria-label", "Copy post by " + post.handle);
    foot.appendChild(copyBtn);
    body.appendChild(foot);

    li.appendChild(body);
    return li;
  }

  /** @param {boolean} pushUrl */
  function update(pushUrl) {
    var list = Feed.applyView(posts, view);

    feedList.replaceChildren.apply(feedList, list.map(renderPost));

    var chips = chipGroup.querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) {
      var chip = /** @type {HTMLElement} */ (chips[i]);
      chip.setAttribute("aria-pressed", String(chip.dataset.tag === view.tag));
    }
    if (searchInput.value !== view.query) searchInput.value = view.query;
    sortSelect.value = view.sort;

    var topic = Feed.TOPICS.filter(function (/** @type {{id: string}} */ t) { return t.id === view.tag; })[0];
    var scope = view.tag === "all" ? "" : " in " + topic.label;
    var noun = list.length === 1 ? " post" : " posts";
    countEl.textContent = list.length + noun + scope + (view.query.trim() ? ' matching "' + view.query.trim() + '"' : "");

    emptyEl.hidden = list.length !== 0;
    feedList.hidden = list.length === 0;

    if (pushUrl) {
      var hash = Feed.toHash(view);
      history.replaceState(null, "", hash || location.pathname + location.search);
    }
  }

  searchInput.addEventListener("input", function () {
    view.query = searchInput.value;
    update(true);
  });

  sortSelect.addEventListener("change", function () {
    view.sort = /** @type {"top" | "new" | "replies"} */ (sortSelect.value);
    update(true);
  });

  resetBtn.addEventListener("click", function () {
    view = { query: "", tag: "all", sort: view.sort };
    update(true);
    searchInput.focus();
  });

  // Only state hashes ("#tag=..."), not in-page anchors like #about, change the view.
  window.addEventListener("hashchange", function () {
    if (location.hash.indexOf("=") !== -1) {
      view = Feed.parseHash(location.hash);
      update(false);
    }
  });

  var toastTimer = 0;
  /** @param {string} message */
  function showToast(message) {
    toast.classList.add("is-visible");
    toast.textContent = message;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  /** @param {string} text */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(area);
      if (ok) resolve(undefined);
      else reject(new Error("copy failed"));
    });
  }

  feedList.addEventListener("click", function (event) {
    var target = /** @type {HTMLElement} */ (event.target);
    var btn = target.closest("[data-copy]");
    if (!btn) return;
    var id = btn.getAttribute("data-copy");
    var post = posts.filter(function (p) { return p.id === id; })[0];
    if (!post) return;
    copyText(post.text + "\n" + post.name + " " + post.handle).then(
      function () {
        showToast("Copied the post by " + post.handle);
      },
      function () {
        showToast("Could not copy. Select the post text and copy it by hand.");
      }
    );
  });

  update(false);
})();
