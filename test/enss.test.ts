import enss, { ENSS } from "../src/enss";

enum Name {
  Ship,
}
enum Elem {
  engine,
  part,
}
enum Cond {
  warp,
  adrift,
}

describe("ENSS", () => {
  let en: ENSS<typeof Name, typeof Elem, typeof Cond>;

  beforeAll(() => {
    en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);
  });

  test("name", () => {
    expect(en.name).toBe("Ship");
  });

  test("base class", () => {
    expect(en.s).toBe("Ship");
    expect(en()).toBe("Ship");

    // allow optional explicit specification of base name:
    expect(en.Ship.s).toBe("Ship");
    expect(en.Ship()).toBe("Ship");
  });

  test("element classes", () => {
    expect(en.engine.s).toBe("Ship-engine");
    expect(en.engine()).toBe("Ship-engine");

    expect(en.part.s).toBe("Ship-part");
    expect(en.part()).toBe("Ship-part");

    expect(en.Ship.engine.s).toBe("Ship-engine");
    expect(en.Ship.engine()).toBe("Ship-engine");

    expect(en.Ship.part.s).toBe("Ship-part");
    expect(en.Ship.part()).toBe("Ship-part");
  });

  test("conditional classes", () => {
    expect(en.warp.s /*-------------*/).toBe("Ship Ship--warp");
    expect(en.warp() /*-------------*/).toBe("Ship Ship--warp");
    expect(en.warp(true) /*---------*/).toBe("Ship Ship--warp");
    expect(en.warp(false) /*--------*/).toBe("Ship");
    expect(en.warp(0) /*------------*/).toBe("Ship");
    expect(en.warp(1) /*------------*/).toBe("Ship");
    expect(en.warp("") /*-----------*/).toBe("Ship");
    expect(en.warp("klingon") /*----*/).toBe("Ship");
    expect(en.warp(null) /*---------*/).toBe("Ship");
    expect(en.warp(undefined) /*----*/).toBe("Ship");

    expect(en.adrift.s /*-----------*/).toBe("Ship Ship--adrift");
    expect(en.adrift() /*-----------*/).toBe("Ship Ship--adrift");
    expect(en.adrift(true) /*-------*/).toBe("Ship Ship--adrift");
    expect(en.adrift(false) /*------*/).toBe("Ship");
    expect(en.adrift(0) /*----------*/).toBe("Ship");
    expect(en.adrift(1) /*----------*/).toBe("Ship");
    expect(en.adrift("") /*---------*/).toBe("Ship");
    expect(en.adrift("damaged") /*--*/).toBe("Ship");
    expect(en.adrift(null) /*-------*/).toBe("Ship");
    expect(en.adrift(undefined) /*--*/).toBe("Ship");

    expect(en.Ship.warp.s /*--------*/).toBe("Ship Ship--warp");
    expect(en.Ship.warp() /*--------*/).toBe("Ship Ship--warp");
    expect(en.Ship.warp(true) /*----*/).toBe("Ship Ship--warp");
    expect(en.Ship.warp(false) /*---*/).toBe("Ship");

    expect(en.Ship.adrift.s /*------*/).toBe("Ship Ship--adrift");
    expect(en.Ship.adrift() /*------*/).toBe("Ship Ship--adrift");
    expect(en.Ship.adrift(true) /*--*/).toBe("Ship Ship--adrift");
    expect(en.Ship.adrift(false) /*-*/).toBe("Ship");
  });

  test("element conditional classes", () => {
    expect(en.part.warp.s /*------------*/).toBe("Ship-part Ship-part--warp");
    expect(en.part.warp() /*------------*/).toBe("Ship-part Ship-part--warp");
    expect(en.part.warp(true) /*--------*/).toBe("Ship-part Ship-part--warp");
    expect(en.part.warp(false) /*-------*/).toBe("Ship-part");
    expect(en.part.warp(0) /*-----------*/).toBe("Ship-part");
    expect(en.part.warp(1) /*-----------*/).toBe("Ship-part");
    expect(en.part.warp("") /*----------*/).toBe("Ship-part");
    expect(en.part.warp("klingon") /*---*/).toBe("Ship-part");
    expect(en.part.warp(null) /*--------*/).toBe("Ship-part");
    expect(en.part.warp(undefined) /*---*/).toBe("Ship-part");

    expect(en.part.adrift.s /*----------*/).toBe("Ship-part Ship-part--adrift");
    expect(en.part.adrift() /*----------*/).toBe("Ship-part Ship-part--adrift");
    expect(en.part.adrift(true) /*------*/).toBe("Ship-part Ship-part--adrift");
    expect(en.part.adrift(false) /*-----*/).toBe("Ship-part");
    expect(en.part.adrift(0) /*---------*/).toBe("Ship-part");
    expect(en.part.adrift(1) /*---------*/).toBe("Ship-part");
    expect(en.part.adrift("") /*--------*/).toBe("Ship-part");
    expect(en.part.adrift("klingon") /*-*/).toBe("Ship-part");
    expect(en.part.adrift(null) /*------*/).toBe("Ship-part");
    expect(en.part.adrift(undefined) /*-*/).toBe("Ship-part");

    expect(en.Ship.part.warp.s /*-------*/).toBe("Ship-part Ship-part--warp");
    expect(en.Ship.part.warp() /*-------*/).toBe("Ship-part Ship-part--warp");
    expect(en.Ship.part.warp(true) /*---*/).toBe("Ship-part Ship-part--warp");
    expect(en.Ship.part.warp(false) /*--*/).toBe("Ship-part");

    expect(en.Ship.part.adrift.s /*-----*/).toBe("Ship-part Ship-part--adrift");
    expect(en.Ship.part.adrift() /*-----*/).toBe("Ship-part Ship-part--adrift");
    expect(en.Ship.part.adrift(true) /*-*/).toBe("Ship-part Ship-part--adrift");
    expect(en.Ship.part.adrift(false)).toBe("Ship-part");
  });

  test("conditional class composition", () => {
    expect(en(en.warp.s, en.adrift.s)).toBe("Ship Ship--warp Ship--adrift");
    expect(en(en.warp(), en.adrift())).toBe("Ship Ship--warp Ship--adrift");

    expect(en(en.warp(true), en.adrift(true))).toBe(
      "Ship Ship--warp Ship--adrift"
    );
    expect(en(en.warp(true), en.adrift(false))).toBe("Ship Ship--warp");
    expect(en(en.warp(false), en.adrift(false))).toBe("Ship");
    expect(en(en.warp(0), en.adrift("at space"))).toBe("Ship");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en({ warp: true, adrift: true })).toBe(
      "Ship Ship--warp Ship--adrift"
    );
    expect(en({ warp: true, adrift: false })).toBe("Ship Ship--warp");
    expect(en({ warp: false, adrift: false })).toBe("Ship");
    expect(en({ warp: 0, adrift: "at space" })).toBe("Ship");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en.part(en.warp.s, en.adrift.s)).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift"
    );
    expect(en.part(en.warp(), en.adrift())).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift"
    );

    expect(en.part(en.warp(true), en.adrift(true))).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift"
    );
    expect(en.part(en.warp(true), en.adrift(false))).toBe(
      "Ship-part Ship-part--warp"
    );
    expect(en.part(en.warp(false), en.adrift(false))).toBe("Ship-part");
    expect(en.part(en.warp(0), en.adrift("at space"))).toBe("Ship-part");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en.part({ warp: true, adrift: true })).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift"
    );
    expect(en.part({ warp: true, adrift: false })).toBe(
      "Ship-part Ship-part--warp"
    );
    expect(en.part({ warp: false, adrift: false })).toBe("Ship-part");
    expect(en.part({ warp: 0, adrift: "at space" })).toBe("Ship-part");
    // all non-bool values ignored unless config.strictBoolChecks=false
  });

  test("custom class mappings via enum values", () => {
    enum Name {
      Ship = "abc",
    }
    enum Elem {
      engine = "def",
      part = "ghi",
    }
    enum Cond {
      warp = "jkl",
      adrift = "", // custom classes should be optional
    }
    const en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);

    expect(en.s).toBe("Ship abc");
    expect(en()).toBe("Ship abc");

    expect(en.engine.s).toBe("Ship-engine def");
    expect(en.engine()).toBe("Ship-engine def");

    expect(en.part.s).toBe("Ship-part ghi");
    expect(en.part()).toBe("Ship-part ghi");

    expect(en.warp.s /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp() /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp(true) /*-------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp(false) /*------*/).toBe("Ship abc");

    expect(en.part.warp.s /*------*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp() /*------*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp(true) /*--*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp(false) /*-*/).toBe("Ship-part ghi");

    expect(en.Ship.s).toBe("Ship abc");
    expect(en.Ship()).toBe("Ship abc");

    expect(en.Ship.engine.s).toBe("Ship-engine def");
    expect(en.Ship.engine()).toBe("Ship-engine def");

    expect(en.Ship.part.s).toBe("Ship-part ghi");
    expect(en.Ship.part()).toBe("Ship-part ghi");

    expect(en.Ship.warp.s /*------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp() /*------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(true) /*--*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(false) /*-*/).toBe("Ship abc");

    expect(en.Ship.part.warp.s).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp()).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(true)).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(false)).toBe("Ship-part ghi");
  });

  test("custom class mappings via enum values with class composition", () => {
    enum Name {
      Ship = "abc",
    }
    enum Elem {
      engine = "def",
      part = "ghi",
    }
    enum Cond {
      warp = "jkl",
      adrift = "mno",
    }
    const en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);

    expect(en(en.warp.s, en.adrift.s)).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en(en.warp(), en.adrift())).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );

    expect(en(en.warp(true), en.adrift(true))).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en(en.warp(true), en.adrift(false))).toBe("Ship Ship--warp abc jkl");
    expect(en(en.warp(false), en.adrift(false))).toBe("Ship abc");
    expect(en(en.warp(0), en.adrift("at space"))).toBe("Ship abc");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en({ warp: true, adrift: true })).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en({ warp: true, adrift: false })).toBe("Ship Ship--warp abc jkl");
    expect(en({ warp: false, adrift: false })).toBe("Ship abc");
    expect(en({ warp: 0, adrift: "at space" })).toBe("Ship abc");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en.part(en.warp.s, en.adrift.s)).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part(en.warp(), en.adrift())).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );

    expect(en.part(en.warp(true), en.adrift(true))).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part(en.warp(true), en.adrift(false))).toBe(
      "Ship-part Ship-part--warp ghi jkl"
    );
    expect(en.part(en.warp(false), en.adrift(false))).toBe("Ship-part ghi");
    expect(en.part(en.warp(0), en.adrift("at space"))).toBe("Ship-part ghi");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en.part({ warp: true, adrift: true })).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part({ warp: true, adrift: false })).toBe(
      "Ship-part Ship-part--warp ghi jkl"
    );
    expect(en.part({ warp: false, adrift: false })).toBe("Ship-part ghi");
    expect(en.part({ warp: 0, adrift: "at space" })).toBe("Ship-part ghi");
    // all non-bool values ignored unless config.strictBoolChecks=false
  });

  test("custom class mappings via map object", () => {
    const en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond, {
      Ship: "abc",
      engine: "def",
      part: "ghi",
      warp: "jkl",
      // adrift omitted -- custom classes should be optional
    });

    expect(en.s).toBe("Ship abc");
    expect(en()).toBe("Ship abc");

    expect(en.engine.s).toBe("Ship-engine def");
    expect(en.engine()).toBe("Ship-engine def");

    expect(en.part.s).toBe("Ship-part ghi");
    expect(en.part()).toBe("Ship-part ghi");

    expect(en.warp.s /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp() /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp(true) /*-------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp(false) /*------*/).toBe("Ship abc");

    expect(en.part.warp.s /*------*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp() /*------*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp(true) /*--*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp(false) /*-*/).toBe("Ship-part ghi");

    expect(en.Ship.s).toBe("Ship abc");
    expect(en.Ship()).toBe("Ship abc");

    expect(en.Ship.engine.s).toBe("Ship-engine def");
    expect(en.Ship.engine()).toBe("Ship-engine def");

    expect(en.Ship.part.s).toBe("Ship-part ghi");
    expect(en.Ship.part()).toBe("Ship-part ghi");

    expect(en.Ship.warp.s /*------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp() /*------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(true) /*--*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(false) /*-*/).toBe("Ship abc");

    expect(en.Ship.part.warp.s).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp()).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(true)).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(false)).toBe("Ship-part ghi");
  });

  test("custom class mappings via map object with class composition", () => {
    const en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond, {
      Ship: "abc",
      engine: "def",
      part: "ghi",
      warp: "jkl",
      adrift: "mno",
    });

    expect(en(en.warp.s, en.adrift.s)).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en(en.warp(), en.adrift())).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );

    expect(en(en.warp(true), en.adrift(true))).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en(en.warp(true), en.adrift(false))).toBe("Ship Ship--warp abc jkl");
    expect(en(en.warp(false), en.adrift(false))).toBe("Ship abc");
    expect(en(en.warp(0), en.adrift("at space"))).toBe("Ship abc");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en({ warp: true, adrift: true })).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en({ warp: true, adrift: false })).toBe("Ship Ship--warp abc jkl");
    expect(en({ warp: false, adrift: false })).toBe("Ship abc");
    expect(en({ warp: 0, adrift: "at space" })).toBe("Ship abc");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en.part(en.warp.s, en.adrift.s)).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part(en.warp(), en.adrift())).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );

    expect(en.part(en.warp(true), en.adrift(true))).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part(en.warp(true), en.adrift(false))).toBe(
      "Ship-part Ship-part--warp ghi jkl"
    );
    expect(en.part(en.warp(false), en.adrift(false))).toBe("Ship-part ghi");
    expect(en.part(en.warp(0), en.adrift("at space"))).toBe("Ship-part ghi");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en.part({ warp: true, adrift: true })).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part({ warp: true, adrift: false })).toBe(
      "Ship-part Ship-part--warp ghi jkl"
    );
    expect(en.part({ warp: false, adrift: false })).toBe("Ship-part ghi");
    expect(en.part({ warp: 0, adrift: "at space" })).toBe("Ship-part ghi");
    // all non-bool values ignored unless config.strictBoolChecks=false
  });

  test("custom class mappings via generator function", () => {
    const en = enss<typeof Name, typeof Elem, typeof Cond>(
      Name,
      Elem,
      Cond,
      () => {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        return {
          Ship: alphabet.slice(0, 3),
          engine: alphabet.slice(3, 6),
          part: alphabet.slice(6, 9),
          warp: alphabet.slice(9, 12),
          // adrift omitted -- custom classes should be optional
        };
      }
    );

    expect(en.s).toBe("Ship abc");
    expect(en()).toBe("Ship abc");

    expect(en.engine.s).toBe("Ship-engine def");
    expect(en.engine()).toBe("Ship-engine def");

    expect(en.part.s).toBe("Ship-part ghi");
    expect(en.part()).toBe("Ship-part ghi");

    expect(en.warp.s /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp() /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp(true) /*-------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp(false) /*------*/).toBe("Ship abc");

    expect(en.part.warp.s /*------*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp() /*------*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp(true) /*--*/).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.part.warp(false) /*-*/).toBe("Ship-part ghi");

    expect(en.Ship.s).toBe("Ship abc");
    expect(en.Ship()).toBe("Ship abc");

    expect(en.Ship.engine.s).toBe("Ship-engine def");
    expect(en.Ship.engine()).toBe("Ship-engine def");

    expect(en.Ship.part.s).toBe("Ship-part ghi");
    expect(en.Ship.part()).toBe("Ship-part ghi");

    expect(en.Ship.warp.s /*------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp() /*------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(true) /*--*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(false) /*-*/).toBe("Ship abc");

    expect(en.Ship.part.warp.s).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp()).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(true)).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(false)).toBe("Ship-part ghi");
  });

  test("custom class mappings via generator function with class composition", () => {
    const en = enss<typeof Name, typeof Elem, typeof Cond>(
      Name,
      Elem,
      Cond,
      () => {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        return {
          Ship: alphabet.slice(0, 3),
          engine: alphabet.slice(3, 6),
          part: alphabet.slice(6, 9),
          warp: alphabet.slice(9, 12),
          adrift: alphabet.slice(12, 15),
        };
      }
    );

    expect(en(en.warp.s, en.adrift.s)).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en(en.warp(), en.adrift())).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );

    expect(en(en.warp(true), en.adrift(true))).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en(en.warp(true), en.adrift(false))).toBe("Ship Ship--warp abc jkl");
    expect(en(en.warp(false), en.adrift(false))).toBe("Ship abc");
    expect(en(en.warp(0), en.adrift("at space"))).toBe("Ship abc");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en({ warp: true, adrift: true })).toBe(
      "Ship Ship--warp Ship--adrift abc mno jkl"
    );
    expect(en({ warp: true, adrift: false })).toBe("Ship Ship--warp abc jkl");
    expect(en({ warp: false, adrift: false })).toBe("Ship abc");
    expect(en({ warp: 0, adrift: "at space" })).toBe("Ship abc");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en.part(en.warp.s, en.adrift.s)).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part(en.warp(), en.adrift())).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );

    expect(en.part(en.warp(true), en.adrift(true))).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part(en.warp(true), en.adrift(false))).toBe(
      "Ship-part Ship-part--warp ghi jkl"
    );
    expect(en.part(en.warp(false), en.adrift(false))).toBe("Ship-part ghi");
    expect(en.part(en.warp(0), en.adrift("at space"))).toBe("Ship-part ghi");
    // all non-bool values ignored unless config.strictBoolChecks=false

    expect(en.part({ warp: true, adrift: true })).toBe(
      "Ship-part Ship-part--warp Ship-part--adrift ghi mno jkl"
    );
    expect(en.part({ warp: true, adrift: false })).toBe(
      "Ship-part Ship-part--warp ghi jkl"
    );
    expect(en.part({ warp: false, adrift: false })).toBe("Ship-part ghi");
    expect(en.part({ warp: 0, adrift: "at space" })).toBe("Ship-part ghi");
    // all non-bool values ignored unless config.strictBoolChecks=false
  });

  test("omit base name", () => {
    enum Name {}
    enum Elem {
      engine = "def",
      part = "ghi",
    }
    enum Cond {
      warp = "jkl",
      adrift = "", // custom classes should be optional
    }
    const en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);

    expect((en as unknown as { Ship: unknown }).Ship).toBeUndefined();

    expect(en.s).toBe("");
    expect(en()).toBe("");

    expect(en.engine.s).toBe("engine def");
    expect(en.engine()).toBe("engine def");

    expect(en.part.s).toBe("part ghi");
    expect(en.part()).toBe("part ghi");

    expect(en.warp.s /*-----------*/).toBe("warp jkl");
    expect(en.warp() /*-----------*/).toBe("warp jkl");
    expect(en.warp(true) /*-------*/).toBe("warp jkl");
    expect(en.warp(false) /*------*/).toBe("");

    expect(en.part.warp.s /*------*/).toBe("part part--warp ghi jkl");
    expect(en.part.warp() /*------*/).toBe("part part--warp ghi jkl");
    expect(en.part.warp(true) /*--*/).toBe("part part--warp ghi jkl");
    expect(en.part.warp(false) /*-*/).toBe("part ghi");
  });

  test("omit elements", () => {
    enum Name {
      Ship = "abc",
    }
    enum Cond {
      warp = "jkl",
      adrift = "", // custom classes should be optional
    }
    const en = enss<typeof Name, object, typeof Cond>(Name, null, Cond);

    expect(en.s).toBe("Ship abc");
    expect(en()).toBe("Ship abc");

    expect(en.Ship.s).toBe("Ship abc");
    expect(en.Ship()).toBe("Ship abc");

    expect(en.warp.s /*-------------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp() /*-------------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.adrift(true) /*-------*/).toBe("Ship Ship--adrift abc");
    expect(en.adrift(false) /*------*/).toBe("Ship abc");

    expect(en.Ship.warp.s /*--------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp() /*--------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.adrift(true) /*--*/).toBe("Ship Ship--adrift abc");
    expect(en.Ship.adrift(false) /*-*/).toBe("Ship abc");
  });

  test("omit elements + class mappings via map object", () => {
    enum Name {
      Ship,
    }
    enum Cond {
      warp,
      adrift,
    }
    const en = enss<typeof Name, object, typeof Cond>(Name, null, Cond, {
      Ship: "abc",
      warp: "jkl",
      // adrift omitted -- custom classes should be optional
    });

    expect(en.s).toBe("Ship abc");
    expect(en()).toBe("Ship abc");

    expect(en.Ship.s).toBe("Ship abc");
    expect(en.Ship()).toBe("Ship abc");

    expect(en.warp.s /*-------------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.warp() /*-------------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.adrift(true) /*-------*/).toBe("Ship Ship--adrift abc");
    expect(en.adrift(false) /*------*/).toBe("Ship abc");

    expect(en.Ship.warp.s /*--------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp() /*--------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.adrift(true) /*--*/).toBe("Ship Ship--adrift abc");
    expect(en.Ship.adrift(false) /*-*/).toBe("Ship abc");
  });

  test("omit conditionals", () => {
    enum Name {
      Ship = "abc",
    }
    enum Elem {
      engine = "def",
      part = "ghi",
    }
    const en = enss<typeof Name, typeof Elem>(Name, Elem);

    expect(en.s).toBe("Ship abc");
    expect(en()).toBe("Ship abc");

    expect(en.engine.s).toBe("Ship-engine def");
    expect(en.engine()).toBe("Ship-engine def");

    expect(en.part.s).toBe("Ship-part ghi");
    expect(en.part()).toBe("Ship-part ghi");

    expect(en.Ship.s).toBe("Ship abc");
    expect(en.Ship()).toBe("Ship abc");

    expect(en.Ship.engine.s).toBe("Ship-engine def");
    expect(en.Ship.engine()).toBe("Ship-engine def");

    expect(en.Ship.part.s).toBe("Ship-part ghi");
    expect(en.Ship.part()).toBe("Ship-part ghi");
  });

  test("omit conditionals + class mappings via map object", () => {
    enum Name {
      Ship,
    }
    enum Elem {
      engine,
      part,
    }
    const en = enss<typeof Name, typeof Elem>(Name, Elem, null, {
      Ship: "abc",
      engine: "def",
      part: "ghi",
    });

    expect(en.s).toBe("Ship abc");
    expect(en()).toBe("Ship abc");

    expect(en.engine.s).toBe("Ship-engine def");
    expect(en.engine()).toBe("Ship-engine def");

    expect(en.part.s).toBe("Ship-part ghi");
    expect(en.part()).toBe("Ship-part ghi");

    expect(en.Ship.s).toBe("Ship abc");
    expect(en.Ship()).toBe("Ship abc");

    expect(en.Ship.engine.s).toBe("Ship-engine def");
    expect(en.Ship.engine()).toBe("Ship-engine def");

    expect(en.Ship.part.s).toBe("Ship-part ghi");
    expect(en.Ship.part()).toBe("Ship-part ghi");
  });

  describe("configuration", () => {
    beforeEach(() => {
      enss.configure({
        elementSeparator: "__",
        conditionalSeparator: ":::",
        strictBoolChecks: false,
      });
    });

    afterEach(() => {
      enss.configure(null);
    });

    test("separators", () => {
      enum Name {
        Ship = "abc",
      }
      enum Elem {
        engine = "def",
        part = "ghi",
      }
      enum Cond {
        warp = "jkl",
        adrift = "", // custom classes should be optional
      }

      const en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);

      expect(en.s).toBe("Ship abc");
      expect(en()).toBe("Ship abc");

      expect(en.engine.s).toBe("Ship__engine def");
      expect(en.engine()).toBe("Ship__engine def");

      expect(en.part.s).toBe("Ship__part ghi");
      expect(en.part()).toBe("Ship__part ghi");

      expect(en.warp.s /*-----------*/).toBe("Ship Ship:::warp abc jkl");
      expect(en.warp() /*-----------*/).toBe("Ship Ship:::warp abc jkl");
      expect(en.warp(true) /*-------*/).toBe("Ship Ship:::warp abc jkl");
      expect(en.warp(false) /*------*/).toBe("Ship abc");

      expect(en.part.warp.s /*------*/).toBe(
        "Ship__part Ship__part:::warp ghi jkl"
      );
      expect(en.part.warp() /*------*/).toBe(
        "Ship__part Ship__part:::warp ghi jkl"
      );
      expect(en.part.warp(true) /*--*/).toBe(
        "Ship__part Ship__part:::warp ghi jkl"
      );
      expect(en.part.warp(false) /*-*/).toBe("Ship__part ghi");

      expect(en.Ship.s).toBe("Ship abc");
      expect(en.Ship()).toBe("Ship abc");

      expect(en.Ship.engine.s).toBe("Ship__engine def");
      expect(en.Ship.engine()).toBe("Ship__engine def");

      expect(en.Ship.part.s).toBe("Ship__part ghi");
      expect(en.Ship.part()).toBe("Ship__part ghi");

      expect(en.Ship.warp.s /*-----------*/).toBe("Ship Ship:::warp abc jkl");
      expect(en.Ship.warp() /*-----------*/).toBe("Ship Ship:::warp abc jkl");
      expect(en.Ship.warp(true) /*-------*/).toBe("Ship Ship:::warp abc jkl");
      expect(en.Ship.warp(false) /*------*/).toBe("Ship abc");

      expect(en.Ship.part.warp.s).toBe("Ship__part Ship__part:::warp ghi jkl");
      expect(en.Ship.part.warp()).toBe("Ship__part Ship__part:::warp ghi jkl");
      expect(en.Ship.part.warp(true)).toBe(
        "Ship__part Ship__part:::warp ghi jkl"
      );
      expect(en.Ship.part.warp(false)).toBe("Ship__part ghi");
    });

    test("strict bool checks", () => {
      enum Name {
        Ship = "abc",
      }
      enum Elem {
        engine = "def",
        part = "ghi",
      }
      enum Cond {
        warp = "jkl",
      }

      const en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);

      expect(en.warp.s /*-----------*/).toBe("Ship Ship:::warp abc jkl");
      expect(en.warp() /*-----------*/).toBe("Ship Ship:::warp abc jkl");
      expect(en.warp("proton torpedo")).toBe("Ship Ship:::warp abc jkl");
      expect(en.warp(0) /*----------*/).toBe("Ship abc");
    });

    test("reset", () => {
      enum Name {
        Ship = "abc",
      }
      enum Elem {
        engine = "def",
        part = "ghi",
      }
      enum Cond {
        warp = "jkl",
      }

      enss.configure(null); // reset must occur BEFORE enss init

      const en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);

      expect(en.warp.s /*-----------*/).toBe("Ship Ship--warp abc jkl");
      expect(en.warp() /*-----------*/).toBe("Ship Ship--warp abc jkl");
      expect(en.warp("proton torpedo")).toBe("Ship abc");
      expect(en.warp(0) /*----------*/).toBe("Ship abc");
    });
  });
});
