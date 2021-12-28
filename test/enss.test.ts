import enss, { ENSS } from "../src/enss";

enum Name {
  Ship,
}
enum Elements {
  engine,
  part,
}
enum Conditionals {
  warp,
  adrift,
}

describe("ENSS", () => {
  let en: ENSS<typeof Name, typeof Elements, typeof Conditionals>;

  beforeAll(() => {
    en = enss<typeof Name, typeof Elements, typeof Conditionals>(
      Name,
      Elements,
      Conditionals
    );
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
    expect(en.warp.s /*------------*/).toBe("Ship Ship--warp");
    expect(en.warp() /*------------*/).toBe("Ship Ship--warp");
    expect(en.warp(true) /*--------*/).toBe("Ship Ship--warp");
    expect(en.warp(false) /*-------*/).toBe("Ship");
    expect(en.warp(0) /*-----------*/).toBe("Ship");
    expect(en.warp(1) /*-----------*/).toBe("Ship Ship--warp");
    expect(en.warp("") /*----------*/).toBe("Ship");
    expect(en.warp("klingon") /*---*/).toBe("Ship Ship--warp");
    expect(en.warp(null) /*--------*/).toBe("Ship");
    expect(en.warp(undefined) /*---*/).toBe("Ship");

    expect(en.adrift.s /*----------*/).toBe("Ship Ship--adrift");
    expect(en.adrift() /*----------*/).toBe("Ship Ship--adrift");
    expect(en.adrift(true) /*------*/).toBe("Ship Ship--adrift");
    expect(en.adrift(false) /*-----*/).toBe("Ship");
    expect(en.adrift(0) /*---------*/).toBe("Ship");
    expect(en.adrift(1) /*---------*/).toBe("Ship Ship--adrift");
    expect(en.adrift("") /*--------*/).toBe("Ship");
    expect(en.adrift("damaged") /*-*/).toBe("Ship Ship--adrift");
    expect(en.adrift(null) /*------*/).toBe("Ship");
    expect(en.adrift(undefined) /*-*/).toBe("Ship");

    expect(en.Ship.warp.s /*------------*/).toBe("Ship Ship--warp");
    expect(en.Ship.warp() /*------------*/).toBe("Ship Ship--warp");
    expect(en.Ship.warp(true) /*--------*/).toBe("Ship Ship--warp");
    expect(en.Ship.warp(false) /*-------*/).toBe("Ship");

    expect(en.Ship.adrift.s /*----------*/).toBe("Ship Ship--adrift");
    expect(en.Ship.adrift() /*----------*/).toBe("Ship Ship--adrift");
    expect(en.Ship.adrift(true) /*------*/).toBe("Ship Ship--adrift");
    expect(en.Ship.adrift(false) /*-----*/).toBe("Ship");
  });

  test("element conditional classes", () => {
    expect(en.part.warp.s /*------------*/).toBe("Ship-part Ship-part--warp");
    expect(en.part.warp() /*------------*/).toBe("Ship-part Ship-part--warp");
    expect(en.part.warp(true) /*--------*/).toBe("Ship-part Ship-part--warp");
    expect(en.part.warp(false) /*-------*/).toBe("Ship-part");
    expect(en.part.warp(0) /*-----------*/).toBe("Ship-part");
    expect(en.part.warp(1) /*-----------*/).toBe("Ship-part Ship-part--warp");
    expect(en.part.warp("") /*----------*/).toBe("Ship-part");
    expect(en.part.warp("klingon") /*---*/).toBe("Ship-part Ship-part--warp");
    expect(en.part.warp(null) /*--------*/).toBe("Ship-part");
    expect(en.part.warp(undefined) /*---*/).toBe("Ship-part");

    expect(en.part.adrift.s /*----------*/).toBe("Ship-part Ship-part--adrift");
    expect(en.part.adrift() /*----------*/).toBe("Ship-part Ship-part--adrift");
    expect(en.part.adrift(true) /*------*/).toBe("Ship-part Ship-part--adrift");
    expect(en.part.adrift(false) /*-----*/).toBe("Ship-part");
    expect(en.part.adrift(0) /*---------*/).toBe("Ship-part");
    expect(en.part.adrift(1) /*---------*/).toBe("Ship-part Ship-part--adrift");
    expect(en.part.adrift("") /*--------*/).toBe("Ship-part");
    expect(en.part.adrift("klingon") /*-*/).toBe("Ship-part Ship-part--adrift");
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

  test("custom class mappings via enum values", () => {
    enum Name {
      Ship = "abc",
    }
    enum Elements {
      engine = "def",
      part = "ghi",
    }
    enum Conditionals {
      warp = "jkl",
      adrift = "", // custom classes should be optional
    }
    const en = enss<typeof Name, typeof Elements, typeof Conditionals>(
      Name,
      Elements,
      Conditionals
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

    expect(en.Ship.warp.s /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp() /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(true) /*-------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(false) /*------*/).toBe("Ship abc");

    expect(en.Ship.part.warp.s).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp()).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(true)).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(false)).toBe("Ship-part ghi");
  });

  test("custom class mappings via map object", () => {
    const en = enss<typeof Name, typeof Elements, typeof Conditionals>(
      Name,
      Elements,
      Conditionals,
      {
        Ship: "abc",
        engine: "def",
        part: "ghi",
        warp: "jkl",
        // adrift omitted -- custom classes should be optional
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

    expect(en.Ship.warp.s /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp() /*-----------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(true) /*-------*/).toBe("Ship Ship--warp abc jkl");
    expect(en.Ship.warp(false) /*------*/).toBe("Ship abc");

    expect(en.Ship.part.warp.s).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp()).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(true)).toBe("Ship-part Ship-part--warp ghi jkl");
    expect(en.Ship.part.warp(false)).toBe("Ship-part ghi");
  });

  test("omitted base name", () => {
    enum Name {}
    enum Elements {
      engine = "def",
      part = "ghi",
    }
    enum Conditionals {
      warp = "jkl",
      adrift = "", // custom classes should be optional
    }
    const en = enss<typeof Name, typeof Elements, typeof Conditionals>(
      Name,
      Elements,
      Conditionals
    );

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
});
