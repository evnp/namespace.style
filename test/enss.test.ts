import enss, { ENSS, ENSSArg } from "../src/enss";

enum NameEnum {
  Ship,
}
enum ElemEnum {
  engine,
  part,
}
enum CondEnum {
  warp,
  adrift,
}

enum NameEnumMapped {
  Ship = "abc",
}
enum ElemEnumMapped {
  engine = "def",
  part = "ghi",
}
enum CondEnumMapped {
  warp = "jkl",
  adrift = "mno",
}

const NameObj = {
  Ship: true,
};
const ElemObj = {
  engine: true,
  part: true,
};
const CondObj = {
  warp: true,
  adrift: true,
};

const NameObjMapped = {
  Ship: "abc",
};
const ElemObjMapped = {
  engine: "def",
  part: "ghi",
};
const CondObjMapped = {
  warp: "jkl",
  adrift: "mno",
};

describe("ENSS", () => {
  describe.each([
    ["enum-based", NameEnum, ElemEnum, CondEnum],
    ["object-based", NameObj, ElemObj, CondObj],
  ])("class composition :: %s", (_, Name, Elem, Cond) => {
    let en: ENSS<typeof Name, typeof Elem, typeof Cond>;

    beforeAll(() => {
      en = enss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);
    });

    test("name", () => {
      expect(en.name).toBe("Ship");
    });

    test("base class", () => {
      // Test class resolver (short version):
      expect(en.c).toBe("Ship");
      expect(en().c).toBe("Ship");
      expect(en(["enterprise"]).c).toBe("Ship Ship--enterprise");
      expect(en({ enterprise: true }).c).toBe("Ship Ship--enterprise");
      expect(
        () => en("enterprise" as unknown as ENSSArg<typeof Cond>).c
      ).toThrow();
      // We don't allow passing bare strings because that would make it too easy
      // to inadvertantly pass something like en.damaged.s resulting in bad class.
      // This is tough to detect automatically if we allow any string to be passed.

      // Test class resolver (verbose version):
      expect(en.class).toBe("Ship");
      expect(en().class).toBe("Ship");
      expect(en(["enterprise"]).class).toBe("Ship Ship--enterprise");
      expect(en({ enterprise: true }).class).toBe("Ship Ship--enterprise");
      expect(
        () => en("enterprise" as unknown as ENSSArg<typeof Cond>).class
      ).toThrow();

      // Test string resolver (short version):
      expect(en.s).toBe("");
      expect(en().s).toBe("");
      expect(en(["enterprise"]).s).toBe("Ship--enterprise");
      expect(en({ enterprise: true }).s).toBe("Ship--enterprise");
      expect(
        () => en("enterprise" as unknown as ENSSArg<typeof Cond>).s
      ).toThrow();

      // Test string resolver (verbose version):
      expect(en.string).toBe("");
      expect(en().string).toBe("");
      expect(en(["enterprise"]).string).toBe("Ship--enterprise");
      expect(en({ enterprise: true }).string).toBe("Ship--enterprise");
      expect(
        () => en("enterprise" as unknown as ENSSArg<typeof Cond>).string
      ).toThrow();

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en}`).toThrow();
      expect(() => `${en()}`).toThrow();
      expect(() => `${en(["enterprise"])}`).toThrow();
      expect(() => `${en({ enterprise: true })}`).toThrow();

      // Allow optional explicit specification of base name:
      expect(en.Ship.c).toBe("Ship");
      expect(en.Ship().c).toBe("Ship");
      expect(en.Ship(["enterprise"]).c).toBe("Ship Ship--enterprise");
      expect(en.Ship({ enterprise: true }).c).toBe("Ship Ship--enterprise");
      expect(
        () => en.Ship("enterprise" as unknown as ENSSArg<typeof Cond>).c
      ).toThrow();
      //
      expect(en.Ship.s).toBe("");
      expect(en.Ship().s).toBe("");
      expect(en.Ship(["enterprise"]).s).toBe("Ship--enterprise");
      expect(en.Ship({ enterprise: true }).s).toBe("Ship--enterprise");
      expect(
        () => en.Ship("enterprise" as unknown as ENSSArg<typeof Cond>).s
      ).toThrow();
      //
      expect(() => `${en.Ship}`).toThrow();
      expect(() => `${en.Ship()}`).toThrow();
      expect(() => `${en.Ship(["enterprise"])}`).toThrow();
      expect(() => `${en.Ship({ enterprise: true })}`).toThrow();
    });

    test("element classes", () => {
      // Test class resolver (short version):
      expect(en.engine.c).toBe("Ship-engine");
      expect(en.engine().c).toBe("Ship-engine");
      expect(en.engine(["nacelle"]).c).toBe("Ship-engine Ship-engine--nacelle");
      expect(en.engine({ nacelle: true }).c).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(
        () => en.engine("nacelle" as unknown as ENSSArg<typeof Cond>).c
      ).toThrow();

      // Test class resolver (verbose version):
      expect(en.engine.class).toBe("Ship-engine");
      expect(en.engine().class).toBe("Ship-engine");
      expect(en.engine(["nacelle"]).class).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(en.engine({ nacelle: true }).class).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(
        () => en.engine("nacelle" as unknown as ENSSArg<typeof Cond>).class
      ).toThrow();

      // Test string resolver (short version):
      expect(en.engine.s).toBe("");
      expect(en.engine().s).toBe("");
      expect(en.engine(["nacelle"]).s).toBe("Ship-engine--nacelle");
      expect(en.engine({ nacelle: true }).s).toBe("Ship-engine--nacelle");
      expect(
        () => en.engine("nacelle" as unknown as ENSSArg<typeof Cond>).s
      ).toThrow();

      // Test string resolver (verbose version):
      expect(en.engine.string).toBe("");
      expect(en.engine().string).toBe("");
      expect(en.engine(["nacelle"]).string).toBe("Ship-engine--nacelle");
      expect(en.engine({ nacelle: true }).string).toBe("Ship-engine--nacelle");
      expect(
        () => en.engine("nacelle" as unknown as ENSSArg<typeof Cond>).string
      ).toThrow();

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.engine}`).toThrow();
      expect(() => `${en.engine()}`).toThrow();
      expect(() => `${en.engine(["nacelle"])}`).toThrow();
      expect(() => `${en.engine({ nacelle: true })}`).toThrow();

      expect(en.part.c).toBe("Ship-part");
      expect(en.part().c).toBe("Ship-part");
      expect(en.part(["warpDrive"]).c).toBe("Ship-part Ship-part--warpDrive");
      expect(en.part({ warpDrive: true }).c).toBe(
        "Ship-part Ship-part--warpDrive"
      );
      expect(
        () => en.part("warpDrive" as unknown as ENSSArg<typeof Cond>).c
      ).toThrow();

      expect(en.part.s).toBe("");
      expect(en.part().s).toBe("");
      expect(en.part(["warpDrive"]).s).toBe("Ship-part--warpDrive");
      expect(en.part({ warpDrive: true }).s).toBe("Ship-part--warpDrive");
      expect(
        () => en.part("warpDrive" as unknown as ENSSArg<typeof Cond>).c
      ).toThrow();

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.part}`).toThrow();
      expect(() => `${en.part()}`).toThrow();
      expect(() => `${en.part(["warpDrive"])}`).toThrow();
      expect(() => `${en.part({ warpDrive: true })}`).toThrow();

      expect(en.Ship.engine.c).toBe("Ship-engine");
      expect(en.Ship.engine().c).toBe("Ship-engine");
      expect(en.Ship.engine(["nacelle"]).c).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(en.Ship.engine({ nacelle: true }).c).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(
        () => en.Ship.engine("nacelle" as unknown as ENSSArg<typeof Cond>).c
      ).toThrow();

      expect(en.Ship.engine.s).toBe("");
      expect(en.Ship.engine().s).toBe("");
      expect(en.Ship.engine(["nacelle"]).s).toBe("Ship-engine--nacelle");
      expect(en.Ship.engine({ nacelle: true }).s).toBe("Ship-engine--nacelle");
      expect(
        () => en.Ship.engine("nacelle" as unknown as ENSSArg<typeof Cond>).s
      ).toThrow();

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.Ship.engine}`).toThrow();
      expect(() => `${en.Ship.engine()}`).toThrow();
      expect(() => `${en.Ship.engine(["nacelle"])}`).toThrow();
      expect(() => `${en.Ship.engine({ nacelle: true })}`).toThrow();

      expect(en.Ship.part.c).toBe("Ship-part");
      expect(en.Ship.part().c).toBe("Ship-part");
      expect(en.Ship.part(["warpDrive"]).c).toBe(
        "Ship-part Ship-part--warpDrive"
      );
      expect(en.Ship.part({ warpDrive: true }).c).toBe(
        "Ship-part Ship-part--warpDrive"
      );
      expect(
        () => en.Ship.part("warpDrive" as unknown as ENSSArg<typeof Cond>).c
      ).toThrow();

      expect(en.Ship.part.s).toBe("");
      expect(en.Ship.part().s).toBe("");
      expect(en.Ship.part(["warpDrive"]).s).toBe("Ship-part--warpDrive");
      expect(en.Ship.part({ warpDrive: true }).s).toBe("Ship-part--warpDrive");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.Ship.part}`).toThrow();
      expect(() => `${en.Ship.part()}`).toThrow();
      expect(() => `${en.Ship.part(["warpDrive"])}`).toThrow();
      expect(() => `${en.Ship.part({ warpDrive: true })}`).toThrow();
    });

    test("conditional classes", () => {
      // Test class resolver (short version):
      expect(en.warp.c /*---------------*/).toBe("Ship Ship--warp");
      expect(en.warp().c /*-------------*/).toBe("Ship Ship--warp");

      // Test class resolver (verbose version):
      expect(en.warp.class /*-----------*/).toBe("Ship Ship--warp");
      expect(en.warp().class /*---------*/).toBe("Ship Ship--warp");

      // Test string resolver (short version):
      expect(en.warp.s /*---------------*/).toBe("Ship--warp");
      expect(en.warp().s /*-------------*/).toBe("Ship--warp");

      // Test string resolver (verbose version):
      expect(en.warp.string /*----------*/).toBe("Ship--warp");
      expect(en.warp().string /*--------*/).toBe("Ship--warp");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.warp}`).toThrow();
      expect(() => `${en.warp()}`).toThrow();

      expect(en.warp(true).c /*---------*/).toBe("Ship Ship--warp");
      expect(en.warp(false).c /*--------*/).toBe("Ship");
      expect(en.warp(0).c /*------------*/).toBe("Ship");
      expect(en.warp(1).c /*------------*/).toBe("Ship");
      expect(en.warp(null).c /*---------*/).toBe("Ship");
      expect(en.warp(undefined).c /*----*/).toBe("Ship");
      expect(en.warp("klingon").c /*----*/).toBe("Ship");
      expect(en.warp("").c /*-----------*/).toBe("Ship");

      expect(en.warp(true).s /*---------*/).toBe("Ship--warp");
      expect(en.warp(false).s /*--------*/).toBe("");
      expect(en.warp(0).s /*------------*/).toBe("");
      expect(en.warp(1).s /*------------*/).toBe("");
      expect(en.warp(null).s /*---------*/).toBe("");
      expect(en.warp(undefined).s /*----*/).toBe("");
      expect(en.warp("klingon").s /*----*/).toBe("");
      expect(en.warp("").s /*-----------*/).toBe("");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.warp(true)}`).toThrow();
      expect(() => `${en.warp(false)}`).toThrow();
      expect(() => `${en.warp(0)}`).toThrow();
      expect(() => `${en.warp(1)}`).toThrow();
      expect(() => `${en.warp(null)}`).toThrow();
      expect(() => `${en.warp(undefined)}`).toThrow();
      expect(() => `${en.warp("klingon")}`).toThrow();
      expect(() => `${en.warp("")}`).toThrow();

      expect(en.adrift.c /*-------------*/).toBe("Ship Ship--adrift");
      expect(en.adrift().c /*-----------*/).toBe("Ship Ship--adrift");

      expect(en.adrift.s /*-------------*/).toBe("Ship--adrift");
      expect(en.adrift().s /*-----------*/).toBe("Ship--adrift");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.adrift}`).toThrow();
      expect(() => `${en.adrift()}`).toThrow();

      expect(en.adrift(true).c /*-------*/).toBe("Ship Ship--adrift");
      expect(en.adrift(false).c /*------*/).toBe("Ship");
      expect(en.adrift(0).c /*----------*/).toBe("Ship");
      expect(en.adrift(1).c /*----------*/).toBe("Ship");
      expect(en.adrift(null).c /*-------*/).toBe("Ship");
      expect(en.adrift(undefined).c /*--*/).toBe("Ship");
      expect(en.adrift("damaged").c /*--*/).toBe("Ship");
      expect(en.adrift("").c /*---------*/).toBe("Ship");

      expect(en.adrift(true).s /*-------*/).toBe("Ship--adrift");
      expect(en.adrift(false).s /*------*/).toBe("");
      expect(en.adrift(0).s /*----------*/).toBe("");
      expect(en.adrift(1).s /*----------*/).toBe("");
      expect(en.adrift(null).s /*-------*/).toBe("");
      expect(en.adrift(undefined).s /*--*/).toBe("");
      expect(en.adrift("damaged").s /*--*/).toBe("");
      expect(en.adrift("").s /*---------*/).toBe("");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.adrift(true)}`).toThrow();
      expect(() => `${en.adrift(false)}`).toThrow();
      expect(() => `${en.adrift(0)}`).toThrow();
      expect(() => `${en.adrift(1)}`).toThrow();
      expect(() => `${en.adrift("")}`).toThrow();
      expect(() => `${en.adrift("damaged")}`).toThrow();
      expect(() => `${en.adrift(null)}`).toThrow();
      expect(() => `${en.adrift(undefined)}`).toThrow();

      expect(en.Ship.warp.c /*----------*/).toBe("Ship Ship--warp");
      expect(en.Ship.warp().c /*--------*/).toBe("Ship Ship--warp");

      expect(en.Ship.warp.s /*----------*/).toBe("Ship--warp");
      expect(en.Ship.warp().s /*--------*/).toBe("Ship--warp");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.Ship.warp}`).toThrow();
      expect(() => `${en.Ship.warp()}`).toThrow();

      expect(en.Ship.warp(true).c /*----*/).toBe("Ship Ship--warp");
      expect(en.Ship.warp(false).c /*---*/).toBe("Ship");

      expect(en.Ship.warp(true).s /*----*/).toBe("Ship--warp");
      expect(en.Ship.warp(false).s /*---*/).toBe("");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.Ship.warp(true)}`).toThrow();
      expect(() => `${en.Ship.warp(false)}`).toThrow();

      expect(en.Ship.adrift.c /*--------*/).toBe("Ship Ship--adrift");
      expect(en.Ship.adrift().c /*------*/).toBe("Ship Ship--adrift");

      expect(en.Ship.adrift.s /*--------*/).toBe("Ship--adrift");
      expect(en.Ship.adrift().s /*------*/).toBe("Ship--adrift");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.Ship.adrift /*----*/}`).toThrow();
      expect(() => `${en.Ship.adrift() /*--*/}`).toThrow();

      expect(en.Ship.adrift(true).c /*--*/).toBe("Ship Ship--adrift");
      expect(en.Ship.adrift(false).c /*-*/).toBe("Ship");

      expect(en.Ship.adrift(true).s /*--*/).toBe("Ship--adrift");
      expect(en.Ship.adrift(false).s /*-*/).toBe("");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.Ship.adrift(true)}`).toThrow();
      expect(() => `${en.Ship.adrift(false)}`).toThrow();
    });

    test("element conditional classes", () => {
      // Test class resolver (short version):
      expect(en.part.warp.c /*------------*/).toBe("Ship-part Ship-part--warp");
      expect(en.part.warp().c /*----------*/).toBe("Ship-part Ship-part--warp");
      expect(en.part.warp(true).c /*------*/).toBe("Ship-part Ship-part--warp");
      expect(en.part.warp(false).c /*-----*/).toBe("Ship-part");
      expect(en.part.warp(0).c /*---------*/).toBe("Ship-part");
      expect(en.part.warp(1).c /*---------*/).toBe("Ship-part");
      expect(en.part.warp(null).c /*------*/).toBe("Ship-part");
      expect(en.part.warp(undefined).c /*-*/).toBe("Ship-part");
      expect(en.part.warp("klingon").c /*-*/).toBe("Ship-part");
      expect(en.part.warp("").c /*--------*/).toBe("Ship-part");

      // Test class resolver (verbose version):
      expect(en.part.warp.class /*--------*/).toBe("Ship-part Ship-part--warp");
      expect(en.part.warp().class /*------*/).toBe("Ship-part Ship-part--warp");
      expect(en.part.warp(true).class /*--*/).toBe("Ship-part Ship-part--warp");
      expect(en.part.warp(false).class /*-*/).toBe("Ship-part");
      expect(en.part.warp(0).class /*-----*/).toBe("Ship-part");
      expect(en.part.warp(1).class /*-----*/).toBe("Ship-part");
      expect(en.part.warp(null).class /*--*/).toBe("Ship-part");
      expect(en.part.warp(undefined).class).toBe("Ship-part");
      expect(en.part.warp("klingon").class).toBe("Ship-part");
      expect(en.part.warp("").class /*----*/).toBe("Ship-part");

      // Test string resolver (short version):
      expect(en.part.warp.s /*------------*/).toBe("Ship-part--warp");
      expect(en.part.warp().s /*----------*/).toBe("Ship-part--warp");
      expect(en.part.warp(true).s /*------*/).toBe("Ship-part--warp");
      expect(en.part.warp(false).s /*-----*/).toBe("");
      expect(en.part.warp(0).s /*---------*/).toBe("");
      expect(en.part.warp(1).s /*---------*/).toBe("");
      expect(en.part.warp(null).s /*------*/).toBe("");
      expect(en.part.warp(undefined).s /*-*/).toBe("");
      expect(en.part.warp("klingon").s /*-*/).toBe("");
      expect(en.part.warp("").s /*--------*/).toBe("");

      // Test string resolver (verbose version):
      expect(en.part.warp.string /*--------*/).toBe("Ship-part--warp");
      expect(en.part.warp().string /*------*/).toBe("Ship-part--warp");
      expect(en.part.warp(true).string /*--*/).toBe("Ship-part--warp");
      expect(en.part.warp(false).string /*-*/).toBe("");
      expect(en.part.warp(0).string /*-----*/).toBe("");
      expect(en.part.warp(1).string /*-----*/).toBe("");
      expect(en.part.warp(null).string /*--*/).toBe("");
      expect(en.part.warp(undefined).string).toBe("");
      expect(en.part.warp("klingon").string).toBe("");
      expect(en.part.warp("").string /*----*/).toBe("");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.part.warp}`).toThrow();
      expect(() => `${en.part.warp()}`).toThrow();
      expect(() => `${en.part.warp(true)}`).toThrow();
      expect(() => `${en.part.warp(false)}`).toThrow();
      expect(() => `${en.part.warp(0)}`).toThrow();
      expect(() => `${en.part.warp(1)}`).toThrow();
      expect(() => `${en.part.warp(null)}`).toThrow();
      expect(() => `${en.part.warp(undefined)}`).toThrow();
      expect(() => `${en.part.warp("klingon")}`).toThrow();
      expect(() => `${en.part.warp("")}`).toThrow();

      expect(en.part.adrift.c /*----------*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(en.part.adrift().c /*--------*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(en.part.adrift(true).c /*----*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(en.part.adrift(false).c /*---*/).toBe("Ship-part");
      expect(en.part.adrift(0).c /*-------*/).toBe("Ship-part");
      expect(en.part.adrift(1).c /*-------*/).toBe("Ship-part");
      expect(en.part.adrift(null).c /*----*/).toBe("Ship-part");
      expect(en.part.adrift(undefined).c).toBe("Ship-part");
      expect(en.part.adrift("klingon").c).toBe("Ship-part");
      expect(en.part.adrift("").c /*------*/).toBe("Ship-part");

      expect(en.part.adrift.s /*----------*/).toBe("Ship-part--adrift");
      expect(en.part.adrift().s /*--------*/).toBe("Ship-part--adrift");
      expect(en.part.adrift(true).s /*----*/).toBe("Ship-part--adrift");
      expect(en.part.adrift(false).s /*---*/).toBe("");
      expect(en.part.adrift(0).s /*-------*/).toBe("");
      expect(en.part.adrift(1).s /*-------*/).toBe("");
      expect(en.part.adrift(null).s /*----*/).toBe("");
      expect(en.part.adrift(undefined).s).toBe("");
      expect(en.part.adrift("klingon").s).toBe("");
      expect(en.part.adrift("").s /*------*/).toBe("");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.part.adrift}`).toThrow();
      expect(() => `${en.part.adrift()}`).toThrow();
      expect(() => `${en.part.adrift(true)}`).toThrow();
      expect(() => `${en.part.adrift(false)}`).toThrow();
      expect(() => `${en.part.adrift(0)}`).toThrow();
      expect(() => `${en.part.adrift(1)}`).toThrow();
      expect(() => `${en.part.adrift(null)}`).toThrow();
      expect(() => `${en.part.adrift(undefined)}`).toThrow();
      expect(() => `${en.part.adrift("klingon")}`).toThrow();
      expect(() => `${en.part.adrift("")}`).toThrow();

      expect(en.Ship.part.warp.c /*-------*/).toBe("Ship-part Ship-part--warp");
      expect(en.Ship.part.warp().c /*-----*/).toBe("Ship-part Ship-part--warp");
      expect(en.Ship.part.warp(true).c /*-*/).toBe("Ship-part Ship-part--warp");
      expect(en.Ship.part.warp(false).c).toBe("Ship-part");

      expect(en.Ship.part.warp.s /*-------*/).toBe("Ship-part--warp");
      expect(en.Ship.part.warp().s /*-----*/).toBe("Ship-part--warp");
      expect(en.Ship.part.warp(true).s /*-*/).toBe("Ship-part--warp");
      expect(en.Ship.part.warp(false).s).toBe("");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.Ship.part.warp}`).toThrow();
      expect(() => `${en.Ship.part.warp()}`).toThrow();
      expect(() => `${en.Ship.part.warp(true)}`).toThrow();
      expect(() => `${en.Ship.part.warp(false)}`).toThrow();

      expect(en.Ship.part.adrift.c /*-----*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(en.Ship.part.adrift().c /*---*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(en.Ship.part.adrift(true).c).toBe("Ship-part Ship-part--adrift");
      expect(en.Ship.part.adrift(false).c).toBe("Ship-part");

      expect(en.Ship.part.adrift.s /*-----*/).toBe("Ship-part--adrift");
      expect(en.Ship.part.adrift().s /*---*/).toBe("Ship-part--adrift");
      expect(en.Ship.part.adrift(true).s).toBe("Ship-part--adrift");
      expect(en.Ship.part.adrift(false).s).toBe("");

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.Ship.part.adrift}`).toThrow();
      expect(() => `${en.Ship.part.adrift()}`).toThrow();
      expect(() => `${en.Ship.part.adrift(true)}`).toThrow();
      expect(() => `${en.Ship.part.adrift(false)}`).toThrow();
    });

    test("conditional class composition :: base class", () => {
      expect(en(en.warp, en.adrift).c).toBe("Ship Ship--warp Ship--adrift");
      expect(en(en.warp, en.adrift).s).toBe("Ship--warp Ship--adrift");

      // Equivalent to above:
      expect(en(en.warp(), en.adrift()).c).toBe("Ship Ship--warp Ship--adrift");
      expect(en(en.warp(), en.adrift()).s).toBe("Ship--warp Ship--adrift");

      // Invalid due to string being passed directly:
      expect(
        () =>
          en(
            en.warp().c as unknown as ENSSArg<typeof Cond>,
            en.adrift().c as unknown as ENSSArg<typeof Cond>
          ).c
      ).toThrow();
      expect(
        () =>
          en(
            en.warp().s as unknown as ENSSArg<typeof Cond>,
            en.adrift().s as unknown as ENSSArg<typeof Cond>
          ).s
      ).toThrow();
      expect(
        () =>
          en(
            en.warp().c as unknown as ENSSArg<typeof Cond>,
            en.adrift().s as unknown as ENSSArg<typeof Cond>
          ).c
      ).toThrow();
      expect(
        () =>
          en(
            en.warp().s as unknown as ENSSArg<typeof Cond>,
            en.adrift().c as unknown as ENSSArg<typeof Cond>
          ).s
      ).toThrow();

      expect(en(en.warp(true), en.adrift(true)).c).toBe(
        "Ship Ship--warp Ship--adrift"
      );
      expect(en(en.warp(true), en.adrift(false)).c).toBe("Ship Ship--warp");
      expect(en(en.warp(false), en.adrift(false)).c).toBe("Ship");
      expect(en(en.warp(0), en.adrift("at space")).c).toBe("Ship");
      // all non-bool values ignored unless config.strictBoolChecks=false

      expect(en(en.warp(true), en.adrift(true)).s).toBe(
        "Ship--warp Ship--adrift"
      );
      expect(en(en.warp(true), en.adrift(false)).s).toBe("Ship--warp");
      expect(en(en.warp(false), en.adrift(false)).s).toBe("");
      expect(en(en.warp(0), en.adrift("at space")).s).toBe("");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en(en.warp(true), en.adrift(true))}`).toThrow();
      expect(() => `${en(en.warp(true), en.adrift(false))}`).toThrow();
      expect(() => `${en(en.warp(false), en.adrift(false))}`).toThrow();
      expect(() => `${en(en.warp(0), en.adrift("at space"))}`).toThrow();

      // Equivalent to above (object composition):
      expect(en({ warp: true, adrift: true }).c).toBe(
        "Ship Ship--warp Ship--adrift"
      );
      expect(en({ warp: true, adrift: false }).c).toBe("Ship Ship--warp");
      expect(en({ warp: false, adrift: false }).c).toBe("Ship");
      expect(en({ warp: 0, adrift: "at space" }).c).toBe("Ship");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Equivalent to above (object composition):
      expect(en({ warp: true, adrift: true }).s).toBe(
        "Ship--warp Ship--adrift"
      );
      expect(en({ warp: true, adrift: false }).s).toBe("Ship--warp");
      expect(en({ warp: false, adrift: false }).s).toBe("");
      expect(en({ warp: 0, adrift: "at space" }).s).toBe("");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en({ warp: true, adrift: true })}`).toThrow();
      expect(() => `${en({ warp: true, adrift: false })}`).toThrow();
      expect(() => `${en({ warp: false, adrift: false })}`).toThrow();
      expect(() => `${en({ warp: 0, adrift: "at space" })}`).toThrow();
    });

    test("conditional class composition :: element class", () => {
      expect(en.part(en.warp, en.adrift).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(en.part(en.warp, en.adrift).s).toBe(
        "Ship-part--warp Ship-part--adrift"
      );

      // Equivalent to above:
      expect(en.part(en.warp(), en.adrift()).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(en.part(en.warp(), en.adrift()).s).toBe(
        "Ship-part--warp Ship-part--adrift"
      );

      // Invalid due to string being passed directly:
      expect(
        () =>
          en.part(
            en.warp().c as unknown as ENSSArg<typeof Cond>,
            en.adrift().c as unknown as ENSSArg<typeof Cond>
          ).c
      ).toThrow();
      expect(
        () =>
          en.part(
            en.warp().s as unknown as ENSSArg<typeof Cond>,
            en.adrift().s as unknown as ENSSArg<typeof Cond>
          ).s
      ).toThrow();
      expect(
        () =>
          en.part(
            en.warp().c as unknown as ENSSArg<typeof Cond>,
            en.adrift().s as unknown as ENSSArg<typeof Cond>
          ).c
      ).toThrow();
      expect(
        () =>
          en.part(
            en.warp().s as unknown as ENSSArg<typeof Cond>,
            en.adrift().c as unknown as ENSSArg<typeof Cond>
          ).s
      ).toThrow();

      expect(en.part(en.warp(true), en.adrift(true)).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(en.part(en.warp(true), en.adrift(false)).c).toBe(
        "Ship-part Ship-part--warp"
      );
      expect(en.part(en.warp(false), en.adrift(false)).c).toBe("Ship-part");
      expect(en.part(en.warp(0), en.adrift("at space")).c).toBe("Ship-part");
      // all non-bool values ignored unless config.strictBoolChecks=false

      expect(en.part(en.warp(true), en.adrift(true)).s).toBe(
        "Ship-part--warp Ship-part--adrift"
      );
      expect(en.part(en.warp(true), en.adrift(false)).s).toBe(
        "Ship-part--warp"
      );
      expect(en.part(en.warp(false), en.adrift(false)).s).toBe("");
      expect(en.part(en.warp(0), en.adrift("at space")).s).toBe("");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.part(en.warp(true), en.adrift(true))}`).toThrow();
      expect(() => `${en.part(en.warp(true), en.adrift(false))}`).toThrow();
      expect(() => `${en.part(en.warp(false), en.adrift(false))}`).toThrow();
      expect(() => `${en.part(en.warp(0), en.adrift("at space"))}`).toThrow();

      // Equivalent to above (object composition):
      expect(en.part({ warp: true, adrift: true }).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(en.part({ warp: true, adrift: false }).c).toBe(
        "Ship-part Ship-part--warp"
      );
      expect(en.part({ warp: false, adrift: false }).c).toBe("Ship-part");
      expect(en.part({ warp: 0, adrift: "at space" }).c).toBe("Ship-part");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Equivalent to above (object composition):
      expect(en.part({ warp: true, adrift: true }).s).toBe(
        "Ship-part--warp Ship-part--adrift"
      );
      expect(en.part({ warp: true, adrift: false }).s).toBe("Ship-part--warp");
      expect(en.part({ warp: false, adrift: false }).s).toBe("");
      expect(en.part({ warp: 0, adrift: "at space" }).s).toBe("");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Should throw: ENSS expressions should never be cast directly to string.
      expect(() => `${en.part({ warp: true, adrift: true })}`).toThrow();
      expect(() => `${en.part({ warp: true, adrift: false })}`).toThrow();
      expect(() => `${en.part({ warp: false, adrift: false })}`).toThrow();
      expect(() => `${en.part({ warp: 0, adrift: "at space" })}`).toThrow();
    });
  });

  describe.each([
    [
      "enum-based",
      NameEnum,
      ElemEnum,
      CondEnum,
      NameEnumMapped,
      ElemEnumMapped,
      CondEnumMapped,
    ],
    [
      "object-based",
      NameObj,
      ElemObj,
      CondObj,
      NameObjMapped,
      ElemObjMapped,
      CondObjMapped,
    ],
  ])(
    "class mapping :: %s",
    (_, Name, Elem, Cond, NameMapped, ElemMapped, CondMapped) => {
      test("enum values", () => {
        const en = enss<
          typeof NameMapped,
          typeof ElemMapped,
          typeof CondMapped
        >(NameMapped, ElemMapped, CondMapped);
        expect(en.c).toBe("Ship abc");
        expect(en().c).toBe("Ship abc");

        expect(en.engine.c).toBe("Ship-engine def");
        expect(en.engine().c).toBe("Ship-engine def");

        expect(en.part.c).toBe("Ship-part ghi");
        expect(en.part().c).toBe("Ship-part ghi");

        expect(en.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp(true).c /*-------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp(false).c /*------*/).toBe("Ship abc");

        expect(en.part.warp.c /*--------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp().c /*------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp(true).c /*--*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp(false).c /*-*/).toBe("Ship-part ghi");

        expect(en.Ship.c).toBe("Ship abc");
        expect(en.Ship().c).toBe("Ship abc");

        expect(en.Ship.engine.c).toBe("Ship-engine def");
        expect(en.Ship.engine().c).toBe("Ship-engine def");

        expect(en.Ship.part.c).toBe("Ship-part ghi");
        expect(en.Ship.part().c).toBe("Ship-part ghi");

        expect(en.Ship.warp.c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp().c /*------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp(true).c /*--*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp(false).c /*-*/).toBe("Ship abc");

        expect(en.Ship.part.warp.c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(en.Ship.part.warp().c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(en.Ship.part.warp(true).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.Ship.part.warp(false).c).toBe("Ship-part ghi");
      });

      test("enum values with class composition", () => {
        const en = enss<
          typeof NameMapped,
          typeof ElemMapped,
          typeof CondMapped
        >(NameMapped, ElemMapped, CondMapped);

        expect(en(en.warp, en.adrift).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en(en.warp(), en.adrift()).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );

        expect(en(en.warp(true), en.adrift(true)).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en(en.warp(true), en.adrift(false)).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(en(en.warp(false), en.adrift(false)).c).toBe("Ship abc");
        expect(en(en.warp(0), en.adrift("at space")).c).toBe("Ship abc");
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en({ warp: true, adrift: true }).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en({ warp: true, adrift: false }).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(en({ warp: false, adrift: false }).c).toBe("Ship abc");
        expect(en({ warp: 0, adrift: "at space" }).c).toBe("Ship abc");
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en.part(en.warp, en.adrift).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part(en.warp(), en.adrift()).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );

        expect(en.part(en.warp(true), en.adrift(true)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part(en.warp(true), en.adrift(false)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part(en.warp(false), en.adrift(false)).c).toBe(
          "Ship-part ghi"
        );
        expect(en.part(en.warp(0), en.adrift("at space")).c).toBe(
          "Ship-part ghi"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en.part({ warp: true, adrift: true }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part({ warp: true, adrift: false }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part({ warp: false, adrift: false }).c).toBe("Ship-part ghi");
        expect(en.part({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship-part ghi"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false
      });

      test("map object", () => {
        const en = enss<typeof Name, typeof Elem, typeof Cond>(
          Name,
          Elem,
          Cond,
          {
            Ship: "abc",
            engine: "def",
            part: "ghi",
            warp: "jkl",
            // adrift omitted -- custom classes should be optional
          }
        );

        expect(en.c).toBe("Ship abc");
        expect(en().c).toBe("Ship abc");

        expect(en.engine.c).toBe("Ship-engine def");
        expect(en.engine().c).toBe("Ship-engine def");

        expect(en.part.c).toBe("Ship-part ghi");
        expect(en.part().c).toBe("Ship-part ghi");

        expect(en.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp(true).c /*-------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp(false).c /*------*/).toBe("Ship abc");

        expect(en.part.warp.c /*--------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp().c /*------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp(true).c /*--*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp(false).c /*-*/).toBe("Ship-part ghi");

        expect(en.Ship.c).toBe("Ship abc");
        expect(en.Ship().c).toBe("Ship abc");

        expect(en.Ship.engine.c).toBe("Ship-engine def");
        expect(en.Ship.engine().c).toBe("Ship-engine def");

        expect(en.Ship.part.c).toBe("Ship-part ghi");
        expect(en.Ship.part().c).toBe("Ship-part ghi");

        expect(en.Ship.warp.c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp().c /*------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp(true).c /*--*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp(false).c /*-*/).toBe("Ship abc");

        expect(en.Ship.part.warp.c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(en.Ship.part.warp().c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(en.Ship.part.warp(true).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.Ship.part.warp(false).c).toBe("Ship-part ghi");
      });

      test("map object with class composition", () => {
        const en = enss<typeof Name, typeof Elem, typeof Cond>(
          Name,
          Elem,
          Cond,
          {
            Ship: "abc",
            engine: "def",
            part: "ghi",
            warp: "jkl",
            adrift: "mno",
          }
        );

        expect(en(en.warp, en.adrift).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en(en.warp(), en.adrift()).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );

        expect(en(en.warp(true), en.adrift(true)).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en(en.warp(true), en.adrift(false)).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(en(en.warp(false), en.adrift(false)).c).toBe("Ship abc");
        expect(en(en.warp(0), en.adrift("at space")).c).toBe("Ship abc");
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en({ warp: true, adrift: true }).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en({ warp: true, adrift: false }).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(en({ warp: false, adrift: false }).c).toBe("Ship abc");
        expect(en({ warp: 0, adrift: "at space" }).c).toBe("Ship abc");
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en.part(en.warp, en.adrift).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part(en.warp(), en.adrift()).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );

        expect(en.part(en.warp(true), en.adrift(true)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part(en.warp(true), en.adrift(false)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part(en.warp(false), en.adrift(false)).c).toBe(
          "Ship-part ghi"
        );
        expect(en.part(en.warp(0), en.adrift("at space")).c).toBe(
          "Ship-part ghi"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en.part({ warp: true, adrift: true }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part({ warp: true, adrift: false }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part({ warp: false, adrift: false }).c).toBe("Ship-part ghi");
        expect(en.part({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship-part ghi"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false
      });

      test("generator function", () => {
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

        expect(en.c).toBe("Ship abc");
        expect(en().c).toBe("Ship abc");

        expect(en.engine.c).toBe("Ship-engine def");
        expect(en.engine().c).toBe("Ship-engine def");

        expect(en.part.c).toBe("Ship-part ghi");
        expect(en.part().c).toBe("Ship-part ghi");

        expect(en.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp(true).c /*-------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp(false).c /*------*/).toBe("Ship abc");

        expect(en.part.warp.c /*--------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp().c /*------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp(true).c /*--*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part.warp(false).c /*-*/).toBe("Ship-part ghi");

        expect(en.Ship.c).toBe("Ship abc");
        expect(en.Ship().c).toBe("Ship abc");

        expect(en.Ship.engine.c).toBe("Ship-engine def");
        expect(en.Ship.engine().c).toBe("Ship-engine def");

        expect(en.Ship.part.c).toBe("Ship-part ghi");
        expect(en.Ship.part().c).toBe("Ship-part ghi");

        expect(en.Ship.warp.c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp().c /*------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp(true).c /*--*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp(false).c /*-*/).toBe("Ship abc");

        expect(en.Ship.part.warp.c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(en.Ship.part.warp().c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(en.Ship.part.warp(true).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.Ship.part.warp(false).c).toBe("Ship-part ghi");
      });

      test("generator function with class composition", () => {
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

        expect(en(en.warp, en.adrift).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en(en.warp(), en.adrift()).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );

        expect(en(en.warp(true), en.adrift(true)).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en(en.warp(true), en.adrift(false)).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(en(en.warp(false), en.adrift(false)).c).toBe("Ship abc");
        expect(en(en.warp(0), en.adrift("at space")).c).toBe("Ship abc");
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en({ warp: true, adrift: true }).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(en({ warp: true, adrift: false }).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(en({ warp: false, adrift: false }).c).toBe("Ship abc");
        expect(en({ warp: 0, adrift: "at space" }).c).toBe("Ship abc");
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en.part(en.warp, en.adrift).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part(en.warp(), en.adrift()).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );

        expect(en.part(en.warp(true), en.adrift(true)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part(en.warp(true), en.adrift(false)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part(en.warp(false), en.adrift(false)).c).toBe(
          "Ship-part ghi"
        );
        expect(en.part(en.warp(0), en.adrift("at space")).c).toBe(
          "Ship-part ghi"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(en.part({ warp: true, adrift: true }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(en.part({ warp: true, adrift: false }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(en.part({ warp: false, adrift: false }).c).toBe("Ship-part ghi");
        expect(en.part({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship-part ghi"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false
      });
    }
  );

  describe.each([
    [
      "enum-based",
      NameEnum,
      ElemEnum,
      CondEnum,
      NameEnumMapped,
      ElemEnumMapped,
      CondEnumMapped,
    ],
    [
      "object-based",
      NameObj,
      ElemObj,
      CondObj,
      NameObjMapped,
      ElemObjMapped,
      CondObjMapped,
    ],
  ])(
    "omission :: %s",
    (_, Name, Elem, Cond, NameMapped, ElemMapped, CondMapped) => {
      test("omit base name", () => {
        const en = enss<object, typeof ElemMapped, typeof CondMapped>(
          {},
          ElemMapped,
          CondMapped
        );

        expect((en as unknown as { Ship: unknown }).Ship).toBeUndefined();

        expect(en.c).toBe("");
        expect(en.engine.c).toBe("engine def");
        expect(en.part.c).toBe("part ghi");
        expect(en.warp.c /*-------------*/).toBe("warp jkl");
        expect(en.warp().c /*-----------*/).toBe("warp jkl");
        expect(en.warp(true).c /*-------*/).toBe("warp jkl");
        expect(en.warp(false).c /*------*/).toBe("");
        expect(en.part.warp.c /*--------*/).toBe("part ghi part--warp jkl");
        expect(en.part.warp().c /*------*/).toBe("part ghi part--warp jkl");
        expect(en.part.warp(true).c /*--*/).toBe("part ghi part--warp jkl");
        expect(en.part.warp(false).c /*-*/).toBe("part ghi");

        expect(en.s).toBe("");
        expect(en.engine.s).toBe("def");
        expect(en.part.s).toBe("ghi");
        expect(en.warp.s /*-------------*/).toBe("warp jkl");
        expect(en.warp().s /*-----------*/).toBe("warp jkl");
        expect(en.warp(true).s /*-------*/).toBe("warp jkl");
        expect(en.warp(false).s /*------*/).toBe("");
        expect(en.part.warp.s /*--------*/).toBe("part--warp jkl");
        expect(en.part.warp().s /*------*/).toBe("part--warp jkl");
        expect(en.part.warp(true).s /*--*/).toBe("part--warp jkl");
        expect(en.part.warp(false).s /*-*/).toBe("");
      });

      test("omit elements", () => {
        const en = enss<typeof NameMapped, object, typeof CondMapped>(
          NameMapped,
          null,
          CondMapped
        );

        expect(en.c).toBe("Ship abc");
        expect(en.Ship.c).toBe("Ship abc");
        expect(en.warp.c /*---------------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp().c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.adrift(true).c /*-------*/).toBe("Ship abc Ship--adrift mno");
        expect(en.adrift(false).c /*------*/).toBe("Ship abc");
        expect(en.Ship.warp.c /*----------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp().c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.adrift(true).c /*--*/).toBe("Ship abc Ship--adrift mno");
        expect(en.Ship.adrift(false).c /*-*/).toBe("Ship abc");

        expect(en.s).toBe("abc");
        expect(en.Ship.s).toBe("abc");
        expect(en.warp.s /*---------------*/).toBe("Ship--warp jkl");
        expect(en.warp().s /*-------------*/).toBe("Ship--warp jkl");
        expect(en.adrift(true).s /*-------*/).toBe("Ship--adrift mno");
        expect(en.adrift(false).s /*------*/).toBe("");
        expect(en.Ship.warp.s /*----------*/).toBe("Ship--warp jkl");
        expect(en.Ship.warp().s /*--------*/).toBe("Ship--warp jkl");
        expect(en.Ship.adrift(true).s /*--*/).toBe("Ship--adrift mno");
        expect(en.Ship.adrift(false).s /*-*/).toBe("");
      });

      test("omit elements + class mappings via map object", () => {
        const en = enss<typeof Name, object, typeof Cond>(Name, null, Cond, {
          Ship: "abc",
          warp: "jkl",
          // adrift omitted -- custom classes should be optional
        });

        expect(en.c).toBe("Ship abc");
        expect(en.Ship.c).toBe("Ship abc");
        expect(en.warp.c /*---------------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.warp().c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.adrift(true).c /*-------*/).toBe("Ship abc Ship--adrift");
        expect(en.adrift(false).c /*------*/).toBe("Ship abc");
        expect(en.Ship.warp.c /*----------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.warp().c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(en.Ship.adrift(true).c /*--*/).toBe("Ship abc Ship--adrift");
        expect(en.Ship.adrift(false).c /*-*/).toBe("Ship abc");

        expect(en.s).toBe("abc");
        expect(en.Ship.s).toBe("abc");
        expect(en.warp.s /*---------------*/).toBe("Ship--warp jkl");
        expect(en.warp().s /*-------------*/).toBe("Ship--warp jkl");
        expect(en.adrift(true).s /*-------*/).toBe("Ship--adrift");
        expect(en.adrift(false).s /*------*/).toBe("");
        expect(en.Ship.warp.s /*----------*/).toBe("Ship--warp jkl");
        expect(en.Ship.warp().s /*--------*/).toBe("Ship--warp jkl");
        expect(en.Ship.adrift(true).s /*--*/).toBe("Ship--adrift");
        expect(en.Ship.adrift(false).s /*-*/).toBe("");
      });

      test("omit conditionals", () => {
        const en = enss<typeof NameMapped, typeof ElemMapped>(
          NameMapped,
          ElemMapped
        );

        expect(en.c).toBe("Ship abc");
        expect(en.engine.c).toBe("Ship-engine def");
        expect(en.part.c).toBe("Ship-part ghi");
        expect(en.Ship.c).toBe("Ship abc");
        expect(en.Ship.engine.c).toBe("Ship-engine def");
        expect(en.Ship.part.c).toBe("Ship-part ghi");

        expect(en.s).toBe("abc");
        expect(en.engine.s).toBe("def");
        expect(en.part.s).toBe("ghi");
        expect(en.Ship.s).toBe("abc");
        expect(en.Ship.engine.s).toBe("def");
        expect(en.Ship.part.s).toBe("ghi");
      });

      test("omit conditionals + class mappings via map object", () => {
        const en = enss<typeof Name, typeof Elem>(Name, Elem, null, {
          Ship: "abc",
          engine: "def",
          part: "ghi",
        });

        expect(en.c).toBe("Ship abc");
        expect(en.engine.c).toBe("Ship-engine def");
        expect(en.part.c).toBe("Ship-part ghi");
        expect(en.Ship.c).toBe("Ship abc");
        expect(en.Ship.engine.c).toBe("Ship-engine def");
        expect(en.Ship.part.c).toBe("Ship-part ghi");

        expect(en.s).toBe("abc");
        expect(en.engine.s).toBe("def");
        expect(en.part.s).toBe("ghi");
        expect(en.Ship.s).toBe("abc");
        expect(en.Ship.engine.s).toBe("def");
        expect(en.Ship.part.s).toBe("ghi");
      });
    }
  );

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

      expect(en.c).toBe("Ship abc");
      expect(en().c).toBe("Ship abc");

      expect(en.engine.c).toBe("Ship__engine def");
      expect(en.engine().c).toBe("Ship__engine def");

      expect(en.part.c).toBe("Ship__part ghi");
      expect(en.part().c).toBe("Ship__part ghi");

      expect(en.warp.c /*-------------*/).toBe("Ship abc Ship:::warp jkl");
      expect(en.warp().c /*-----------*/).toBe("Ship abc Ship:::warp jkl");
      expect(en.warp(true).c /*-------*/).toBe("Ship abc Ship:::warp jkl");
      expect(en.warp(false).c /*------*/).toBe("Ship abc");

      expect(en.part.warp.c /*------*/).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(en.part.warp().c /*------*/).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(en.part.warp(true).c /*--*/).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(en.part.warp(false).c /*-*/).toBe("Ship__part ghi");

      expect(en.Ship.c).toBe("Ship abc");
      expect(en.Ship().c).toBe("Ship abc");

      expect(en.Ship.engine.c).toBe("Ship__engine def");
      expect(en.Ship.engine().c).toBe("Ship__engine def");

      expect(en.Ship.part.c).toBe("Ship__part ghi");
      expect(en.Ship.part().c).toBe("Ship__part ghi");

      expect(en.Ship.warp.c /*-------------*/).toBe("Ship abc Ship:::warp jkl");
      expect(en.Ship.warp().c /*-----------*/).toBe("Ship abc Ship:::warp jkl");
      expect(en.Ship.warp(true).c /*-------*/).toBe("Ship abc Ship:::warp jkl");
      expect(en.Ship.warp(false).c /*------*/).toBe("Ship abc");

      expect(en.Ship.part.warp.c).toBe("Ship__part ghi Ship__part:::warp jkl");
      expect(en.Ship.part.warp().c).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(en.Ship.part.warp(true).c).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(en.Ship.part.warp(false).c).toBe("Ship__part ghi");
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

      expect(en.warp.c /*-------------*/).toBe("Ship abc Ship:::warp jkl");
      expect(en.warp().c /*-----------*/).toBe("Ship abc Ship:::warp jkl");
      expect(en.warp("proton torpedo").c).toBe("Ship abc Ship:::warp jkl");
      expect(en.warp(0).c /*----------*/).toBe("Ship abc");
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

      expect(en.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
      expect(en.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
      expect(en.warp("proton torpedo").c).toBe("Ship abc");
      expect(en.warp(0).c /*----------*/).toBe("Ship abc");
    });
  });

  describe("benchmark", () => {
    beforeEach(() => {
      // TODO
    });
    test("TODO", () => {
      // TODO
    });
  });
});
