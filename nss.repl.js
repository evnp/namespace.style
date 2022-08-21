const repl = require("repl").start();
const ctx = repl.context;

ctx.nss = require("./nss.js").default;

ctx.Name = {
  Ship: "abc",
};

ctx.Elem = {
  engine: "def",
  part: "ghi",
};

ctx.Cond = {
  warp: "jkl",
  adrift: "mno",
};

ctx.n = ctx.nss(ctx.Name, ctx.Elem, ctx.Cond);
