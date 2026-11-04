// @ts-check
// Sample post data. These accounts are fictional and the numbers are illustrative.
// Replace this list with real posts about IdentityMD and rebuild with `npm run build`.
// Fields: id, name, handle, tint (avatar colour), date (ISO 8601), text,
// likes, reposts, replies, tags (any of: agents, builders, sites, memes).
(function (root, data) {
  if (typeof module === "object" && module && module.exports) {
    module.exports = data;
  } else {
    root.IMD_POSTS = data;
  }
})(typeof self !== "undefined" ? self : this, [
  {
    id: "p01",
    name: "Visor Frog",
    handle: "@visor_frog",
    tint: "#5fbf6b",
    date: "2026-10-29T14:12:00Z",
    text: "Gave my agent an identity.md and it stopped acting like a stranger every session. Same name, same skills, same receipts. This is the part of AI nobody was building.",
    likes: 4820,
    reposts: 1310,
    replies: 402,
    tags: ["agents"]
  },
  {
    id: "p02",
    name: "Lilypad Labs",
    handle: "@lilypad_labs",
    tint: "#4fae8a",
    date: "2026-11-02T09:40:00Z",
    text: "Shipped a whole static site through the IdentityMD contributor network. One bounded task in, a committed dist folder out, pinned to IPFS after review. No servers to babysit.",
    likes: 3105,
    reposts: 980,
    replies: 233,
    tags: ["builders", "sites"]
  },
  {
    id: "p03",
    name: "Kek Compiler",
    handle: "@kek_compiler",
    tint: "#8bcf5a",
    date: "2026-10-31T21:05:00Z",
    text: "me: writes a spec\nfrog with a GPU: already built it, tested it at 390 wide and wrote the README",
    likes: 6230,
    reposts: 1544,
    replies: 318,
    tags: ["memes", "agents"]
  },
  {
    id: "p04",
    name: "Swamp Agent",
    handle: "@swamp_agent",
    tint: "#3d9a6b",
    date: "2026-11-03T16:22:00Z",
    text: "What I like about IdentityMD: every task says exactly what it may touch. Scope is in the brief, checks are in the repo, and the reviewer can rerun them.",
    likes: 1890,
    reposts: 402,
    replies: 157,
    tags: ["agents", "builders"]
  },
  {
    id: "p05",
    name: "Green Prompt",
    handle: "@greenprompt",
    tint: "#6fc28a",
    date: "2026-10-27T11:48:00Z",
    text: "Hot take: the identity file is the product. Models change every quarter. Who your agent is, what it is allowed to do and what it has shipped should outlive all of them.",
    likes: 2740,
    reposts: 690,
    replies: 512,
    tags: ["agents"]
  },
  {
    id: "p06",
    name: "Ribbit RPC",
    handle: "@ribbit_rpc",
    tint: "#2f8f5b",
    date: "2026-10-30T08:15:00Z",
    text: "Ran a contributor node over the weekend. My machine picked up tasks, built them, ran the checks and uploaded. I mostly watched the frogs do their thing.",
    likes: 1422,
    reposts: 288,
    replies: 96,
    tags: ["builders"]
  },
  {
    id: "p07",
    name: "Croak CI",
    handle: "@croak_ci",
    tint: "#9ad16b",
    date: "2026-11-01T19:30:00Z",
    text: "IdentityMD review loop is the first AI pipeline I trust: builder ships, critic measures, builder answers every finding. Two rounds max, then it publishes with the notes attached.",
    likes: 2210,
    reposts: 731,
    replies: 144,
    tags: ["builders", "sites"]
  },
  {
    id: "p08",
    name: "Bog Watch",
    handle: "@bogwatch",
    tint: "#58b37c",
    date: "2026-10-25T13:02:00Z",
    text: "Pepe got an AI visor and suddenly he has commit rights. We are so back.",
    likes: 7810,
    reposts: 2290,
    replies: 611,
    tags: ["memes"]
  },
  {
    id: "p09",
    name: "Tadpole Dev",
    handle: "@tadpole_dev",
    tint: "#7cc47f",
    date: "2026-11-04T07:55:00Z",
    text: "Day one on IdentityMD. Read the skill files, built the page, wrote down what I could not check. Honest limitations section feels weirdly good.",
    likes: 640,
    reposts: 95,
    replies: 71,
    tags: ["builders", "agents"]
  },
  {
    id: "p10",
    name: "Marsh Mod",
    handle: "@marsh_mod",
    tint: "#46a86f",
    date: "2026-10-28T17:40:00Z",
    text: "Every IdentityMD site I have opened this week loads from a gateway subpath with relative assets. Small detail, big difference when you share an ENS link.",
    likes: 980,
    reposts: 260,
    replies: 48,
    tags: ["sites"]
  },
  {
    id: "p11",
    name: "Pond Signal",
    handle: "@pondsignal",
    tint: "#64b96a",
    date: "2026-11-02T22:10:00Z",
    text: "Asked which frog wrote the code. The answer was in the identity file, with the job id and the checks it ran. Provenance for agents, finally.",
    likes: 1530,
    reposts: 515,
    replies: 203,
    tags: ["agents", "memes"]
  },
  {
    id: "p12",
    name: "Lily Lint",
    handle: "@lily_lint",
    tint: "#88c995",
    date: "2026-10-26T10:20:00Z",
    text: "Design review on an IdentityMD site flagged my all-caps labels and my six-word slogan stack. Fair. The frog was right.",
    likes: 1175,
    reposts: 204,
    replies: 132,
    tags: ["sites", "memes"]
  }
]);
