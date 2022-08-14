import nss, { NSS, NSSArg } from "../src/nss";

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

describe("NSS", () => {
  describe.each([
    ["enum-based", NameEnum, ElemEnum, CondEnum],
    ["object-based", NameObj, ElemObj, CondObj],
  ])("class composition :: %s", (_, Name, Elem, Cond) => {
    let n: NSS<typeof Name, typeof Elem, typeof Cond>;

    beforeAll(() => {
      n = nss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);
    });

    test("name", () => {
      expect(n.name).toBe("Ship");
    });

    test("base class", () => {
      // Test class resolver (short version):
      expect(n.c).toBe("Ship");
      expect(n().c).toBe("Ship");
      expect(n(["enterprise"]).c).toBe("Ship Ship--enterprise");
      expect(n({ enterprise: true }).c).toBe("Ship Ship--enterprise");
      expect(
        () => n("enterprise" as unknown as NSSArg<typeof Cond>).c
      ).toThrow();
      // We don't allow passing bare strings because that would make it too easy
      // to inadvertantly pass something like n.damaged.s resulting in bad class.
      // This is tough to detect automatically if we allow any string to be passed.

      // Test class resolver (verbose version):
      expect(n.class).toBe("Ship");
      expect(n().class).toBe("Ship");
      expect(n(["enterprise"]).class).toBe("Ship Ship--enterprise");
      expect(n({ enterprise: true }).class).toBe("Ship Ship--enterprise");
      expect(
        () => n("enterprise" as unknown as NSSArg<typeof Cond>).class
      ).toThrow();

      // Test string resolver (short version):
      expect(n.s).toBe("");
      expect(n().s).toBe("");
      expect(n(["enterprise"]).s).toBe("Ship--enterprise");
      expect(n({ enterprise: true }).s).toBe("Ship--enterprise");
      expect(
        () => n("enterprise" as unknown as NSSArg<typeof Cond>).s
      ).toThrow();

      // Test string resolver (verbose version):
      expect(n.string).toBe("");
      expect(n().string).toBe("");
      expect(n(["enterprise"]).string).toBe("Ship--enterprise");
      expect(n({ enterprise: true }).string).toBe("Ship--enterprise");
      expect(
        () => n("enterprise" as unknown as NSSArg<typeof Cond>).string
      ).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n}`).toThrow();
      expect(() => `${n()}`).toThrow();
      expect(() => `${n(["enterprise"])}`).toThrow();
      expect(() => `${n({ enterprise: true })}`).toThrow();

      // Allow optional explicit specification of base name:
      expect(n.Ship.c).toBe("Ship");
      expect(n.Ship().c).toBe("Ship");
      expect(n.Ship(["enterprise"]).c).toBe("Ship Ship--enterprise");
      expect(n.Ship({ enterprise: true }).c).toBe("Ship Ship--enterprise");
      expect(
        () => n.Ship("enterprise" as unknown as NSSArg<typeof Cond>).c
      ).toThrow();
      //
      expect(n.Ship.s).toBe("");
      expect(n.Ship().s).toBe("");
      expect(n.Ship(["enterprise"]).s).toBe("Ship--enterprise");
      expect(n.Ship({ enterprise: true }).s).toBe("Ship--enterprise");
      expect(
        () => n.Ship("enterprise" as unknown as NSSArg<typeof Cond>).s
      ).toThrow();
      //
      expect(() => `${n.Ship}`).toThrow();
      expect(() => `${n.Ship()}`).toThrow();
      expect(() => `${n.Ship(["enterprise"])}`).toThrow();
      expect(() => `${n.Ship({ enterprise: true })}`).toThrow();
    });

    test("element classes", () => {
      // Test class resolver (short version):
      expect(n.engine.c).toBe("Ship-engine");
      expect(n.engine().c).toBe("Ship-engine");
      expect(n.engine(["nacelle"]).c).toBe("Ship-engine Ship-engine--nacelle");
      expect(n.engine({ nacelle: true }).c).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(
        () => n.engine("nacelle" as unknown as NSSArg<typeof Cond>).c
      ).toThrow();

      // Test class resolver (verbose version):
      expect(n.engine.class).toBe("Ship-engine");
      expect(n.engine().class).toBe("Ship-engine");
      expect(n.engine(["nacelle"]).class).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(n.engine({ nacelle: true }).class).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(
        () => n.engine("nacelle" as unknown as NSSArg<typeof Cond>).class
      ).toThrow();

      // Test string resolver (short version):
      expect(n.engine.s).toBe("");
      expect(n.engine().s).toBe("");
      expect(n.engine(["nacelle"]).s).toBe("Ship-engine--nacelle");
      expect(n.engine({ nacelle: true }).s).toBe("Ship-engine--nacelle");
      expect(
        () => n.engine("nacelle" as unknown as NSSArg<typeof Cond>).s
      ).toThrow();

      // Test string resolver (verbose version):
      expect(n.engine.string).toBe("");
      expect(n.engine().string).toBe("");
      expect(n.engine(["nacelle"]).string).toBe("Ship-engine--nacelle");
      expect(n.engine({ nacelle: true }).string).toBe("Ship-engine--nacelle");
      expect(
        () => n.engine("nacelle" as unknown as NSSArg<typeof Cond>).string
      ).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.engine}`).toThrow();
      expect(() => `${n.engine()}`).toThrow();
      expect(() => `${n.engine(["nacelle"])}`).toThrow();
      expect(() => `${n.engine({ nacelle: true })}`).toThrow();

      expect(n.part.c).toBe("Ship-part");
      expect(n.part().c).toBe("Ship-part");
      expect(n.part(["warpDrive"]).c).toBe("Ship-part Ship-part--warpDrive");
      expect(n.part({ warpDrive: true }).c).toBe(
        "Ship-part Ship-part--warpDrive"
      );
      expect(
        () => n.part("warpDrive" as unknown as NSSArg<typeof Cond>).c
      ).toThrow();

      expect(n.part.s).toBe("");
      expect(n.part().s).toBe("");
      expect(n.part(["warpDrive"]).s).toBe("Ship-part--warpDrive");
      expect(n.part({ warpDrive: true }).s).toBe("Ship-part--warpDrive");
      expect(
        () => n.part("warpDrive" as unknown as NSSArg<typeof Cond>).c
      ).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.part}`).toThrow();
      expect(() => `${n.part()}`).toThrow();
      expect(() => `${n.part(["warpDrive"])}`).toThrow();
      expect(() => `${n.part({ warpDrive: true })}`).toThrow();

      expect(n.Ship.engine.c).toBe("Ship-engine");
      expect(n.Ship.engine().c).toBe("Ship-engine");
      expect(n.Ship.engine(["nacelle"]).c).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(n.Ship.engine({ nacelle: true }).c).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(
        () => n.Ship.engine("nacelle" as unknown as NSSArg<typeof Cond>).c
      ).toThrow();

      expect(n.Ship.engine.s).toBe("");
      expect(n.Ship.engine().s).toBe("");
      expect(n.Ship.engine(["nacelle"]).s).toBe("Ship-engine--nacelle");
      expect(n.Ship.engine({ nacelle: true }).s).toBe("Ship-engine--nacelle");
      expect(
        () => n.Ship.engine("nacelle" as unknown as NSSArg<typeof Cond>).s
      ).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.engine}`).toThrow();
      expect(() => `${n.Ship.engine()}`).toThrow();
      expect(() => `${n.Ship.engine(["nacelle"])}`).toThrow();
      expect(() => `${n.Ship.engine({ nacelle: true })}`).toThrow();

      expect(n.Ship.part.c).toBe("Ship-part");
      expect(n.Ship.part().c).toBe("Ship-part");
      expect(n.Ship.part(["warpDrive"]).c).toBe(
        "Ship-part Ship-part--warpDrive"
      );
      expect(n.Ship.part({ warpDrive: true }).c).toBe(
        "Ship-part Ship-part--warpDrive"
      );
      expect(
        () => n.Ship.part("warpDrive" as unknown as NSSArg<typeof Cond>).c
      ).toThrow();

      expect(n.Ship.part.s).toBe("");
      expect(n.Ship.part().s).toBe("");
      expect(n.Ship.part(["warpDrive"]).s).toBe("Ship-part--warpDrive");
      expect(n.Ship.part({ warpDrive: true }).s).toBe("Ship-part--warpDrive");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.part}`).toThrow();
      expect(() => `${n.Ship.part()}`).toThrow();
      expect(() => `${n.Ship.part(["warpDrive"])}`).toThrow();
      expect(() => `${n.Ship.part({ warpDrive: true })}`).toThrow();
    });

    test("conditional classes", () => {
      // Test class resolver (short version):
      expect(n.warp.c /*---------------*/).toBe("Ship Ship--warp");
      expect(n.warp().c /*-------------*/).toBe("Ship Ship--warp");

      // Test class resolver (verbose version):
      expect(n.warp.class /*-----------*/).toBe("Ship Ship--warp");
      expect(n.warp().class /*---------*/).toBe("Ship Ship--warp");

      // Test string resolver (short version):
      expect(n.warp.s /*---------------*/).toBe("Ship--warp");
      expect(n.warp().s /*-------------*/).toBe("Ship--warp");

      // Test string resolver (verbose version):
      expect(n.warp.string /*----------*/).toBe("Ship--warp");
      expect(n.warp().string /*--------*/).toBe("Ship--warp");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.warp}`).toThrow();
      expect(() => `${n.warp()}`).toThrow();

      expect(n.warp(true).c /*---------*/).toBe("Ship Ship--warp");
      expect(n.warp(false).c /*--------*/).toBe("Ship");
      expect(n.warp(0).c /*------------*/).toBe("Ship");
      expect(n.warp(1).c /*------------*/).toBe("Ship Ship--warp");
      expect(n.warp(null).c /*---------*/).toBe("Ship");
      expect(n.warp(undefined).c /*----*/).toBe("Ship");
      expect(n.warp("klingon").c /*----*/).toBe("Ship Ship--warp");
      expect(n.warp("").c /*-----------*/).toBe("Ship");

      expect(n.warp(true).s /*---------*/).toBe("Ship--warp");
      expect(n.warp(false).s /*--------*/).toBe("");
      expect(n.warp(0).s /*------------*/).toBe("");
      expect(n.warp(1).s /*------------*/).toBe("Ship--warp");
      expect(n.warp(null).s /*---------*/).toBe("");
      expect(n.warp(undefined).s /*----*/).toBe("");
      expect(n.warp("klingon").s /*----*/).toBe("Ship--warp");
      expect(n.warp("").s /*-----------*/).toBe("");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.warp(true)}`).toThrow();
      expect(() => `${n.warp(false)}`).toThrow();
      expect(() => `${n.warp(0)}`).toThrow();
      expect(() => `${n.warp(1)}`).toThrow();
      expect(() => `${n.warp(null)}`).toThrow();
      expect(() => `${n.warp(undefined)}`).toThrow();
      expect(() => `${n.warp("klingon")}`).toThrow();
      expect(() => `${n.warp("")}`).toThrow();

      expect(n.adrift.c /*-------------*/).toBe("Ship Ship--adrift");
      expect(n.adrift().c /*-----------*/).toBe("Ship Ship--adrift");

      expect(n.adrift.s /*-------------*/).toBe("Ship--adrift");
      expect(n.adrift().s /*-----------*/).toBe("Ship--adrift");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.adrift}`).toThrow();
      expect(() => `${n.adrift()}`).toThrow();

      expect(n.adrift(true).c /*-------*/).toBe("Ship Ship--adrift");
      expect(n.adrift(false).c /*------*/).toBe("Ship");
      expect(n.adrift(0).c /*----------*/).toBe("Ship");
      expect(n.adrift(1).c /*----------*/).toBe("Ship Ship--adrift");
      expect(n.adrift(null).c /*-------*/).toBe("Ship");
      expect(n.adrift(undefined).c /*--*/).toBe("Ship");
      expect(n.adrift("damaged").c /*--*/).toBe("Ship Ship--adrift");
      expect(n.adrift("").c /*---------*/).toBe("Ship");

      expect(n.adrift(true).s /*-------*/).toBe("Ship--adrift");
      expect(n.adrift(false).s /*------*/).toBe("");
      expect(n.adrift(0).s /*----------*/).toBe("");
      expect(n.adrift(1).s /*----------*/).toBe("Ship--adrift");
      expect(n.adrift(null).s /*-------*/).toBe("");
      expect(n.adrift(undefined).s /*--*/).toBe("");
      expect(n.adrift("damaged").s /*--*/).toBe("Ship--adrift");
      expect(n.adrift("").s /*---------*/).toBe("");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.adrift(true)}`).toThrow();
      expect(() => `${n.adrift(false)}`).toThrow();
      expect(() => `${n.adrift(0)}`).toThrow();
      expect(() => `${n.adrift(1)}`).toThrow();
      expect(() => `${n.adrift("")}`).toThrow();
      expect(() => `${n.adrift("damaged")}`).toThrow();
      expect(() => `${n.adrift(null)}`).toThrow();
      expect(() => `${n.adrift(undefined)}`).toThrow();

      expect(n.Ship.warp.c /*----------*/).toBe("Ship Ship--warp");
      expect(n.Ship.warp().c /*--------*/).toBe("Ship Ship--warp");

      expect(n.Ship.warp.s /*----------*/).toBe("Ship--warp");
      expect(n.Ship.warp().s /*--------*/).toBe("Ship--warp");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.warp}`).toThrow();
      expect(() => `${n.Ship.warp()}`).toThrow();

      expect(n.Ship.warp(true).c /*----*/).toBe("Ship Ship--warp");
      expect(n.Ship.warp(false).c /*---*/).toBe("Ship");

      expect(n.Ship.warp(true).s /*----*/).toBe("Ship--warp");
      expect(n.Ship.warp(false).s /*---*/).toBe("");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.warp(true)}`).toThrow();
      expect(() => `${n.Ship.warp(false)}`).toThrow();

      expect(n.Ship.adrift.c /*--------*/).toBe("Ship Ship--adrift");
      expect(n.Ship.adrift().c /*------*/).toBe("Ship Ship--adrift");

      expect(n.Ship.adrift.s /*--------*/).toBe("Ship--adrift");
      expect(n.Ship.adrift().s /*------*/).toBe("Ship--adrift");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.adrift /*----*/}`).toThrow();
      expect(() => `${n.Ship.adrift() /*--*/}`).toThrow();

      expect(n.Ship.adrift(true).c /*--*/).toBe("Ship Ship--adrift");
      expect(n.Ship.adrift(false).c /*-*/).toBe("Ship");

      expect(n.Ship.adrift(true).s /*--*/).toBe("Ship--adrift");
      expect(n.Ship.adrift(false).s /*-*/).toBe("");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.adrift(true)}`).toThrow();
      expect(() => `${n.Ship.adrift(false)}`).toThrow();
    });

    test("element conditional classes", () => {
      // Test class resolver (short version):
      expect(n.part.warp.c /*------------*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp().c /*----------*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(true).c /*------*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(false).c /*-----*/).toBe("Ship-part");
      expect(n.part.warp(0).c /*---------*/).toBe("Ship-part");
      expect(n.part.warp(1).c /*---------*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(null).c /*------*/).toBe("Ship-part");
      expect(n.part.warp(undefined).c /*-*/).toBe("Ship-part");
      expect(n.part.warp("klingon").c /*-*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp("").c /*--------*/).toBe("Ship-part");

      // Test class resolver (verbose version):
      expect(n.part.warp.class /*--------*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp().class /*------*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(true).class /*--*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(false).class /*-*/).toBe("Ship-part");
      expect(n.part.warp(0).class /*-----*/).toBe("Ship-part");
      expect(n.part.warp(1).class /*-----*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(null).class /*--*/).toBe("Ship-part");
      expect(n.part.warp(undefined).class).toBe("Ship-part");
      expect(n.part.warp("klingon").class).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp("").class /*----*/).toBe("Ship-part");

      // Test string resolver (short version):
      expect(n.part.warp.s /*------------*/).toBe("Ship-part--warp");
      expect(n.part.warp().s /*----------*/).toBe("Ship-part--warp");
      expect(n.part.warp(true).s /*------*/).toBe("Ship-part--warp");
      expect(n.part.warp(false).s /*-----*/).toBe("");
      expect(n.part.warp(0).s /*---------*/).toBe("");
      expect(n.part.warp(1).s /*---------*/).toBe("Ship-part--warp");
      expect(n.part.warp(null).s /*------*/).toBe("");
      expect(n.part.warp(undefined).s /*-*/).toBe("");
      expect(n.part.warp("klingon").s /*-*/).toBe("Ship-part--warp");
      expect(n.part.warp("").s /*--------*/).toBe("");

      // Test string resolver (verbose version):
      expect(n.part.warp.string /*--------*/).toBe("Ship-part--warp");
      expect(n.part.warp().string /*------*/).toBe("Ship-part--warp");
      expect(n.part.warp(true).string /*--*/).toBe("Ship-part--warp");
      expect(n.part.warp(false).string /*-*/).toBe("");
      expect(n.part.warp(0).string /*-----*/).toBe("");
      expect(n.part.warp(1).string /*-----*/).toBe("Ship-part--warp");
      expect(n.part.warp(null).string /*--*/).toBe("");
      expect(n.part.warp(undefined).string).toBe("");
      expect(n.part.warp("klingon").string).toBe("Ship-part--warp");
      expect(n.part.warp("").string /*----*/).toBe("");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.part.warp}`).toThrow();
      expect(() => `${n.part.warp()}`).toThrow();
      expect(() => `${n.part.warp(true)}`).toThrow();
      expect(() => `${n.part.warp(false)}`).toThrow();
      expect(() => `${n.part.warp(0)}`).toThrow();
      expect(() => `${n.part.warp(1)}`).toThrow();
      expect(() => `${n.part.warp(null)}`).toThrow();
      expect(() => `${n.part.warp(undefined)}`).toThrow();
      expect(() => `${n.part.warp("klingon")}`).toThrow();
      expect(() => `${n.part.warp("")}`).toThrow();

      expect(n.part.adrift.c /*----------*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(n.part.adrift().c /*--------*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(n.part.adrift(true).c /*----*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(n.part.adrift(false).c /*---*/).toBe("Ship-part");
      expect(n.part.adrift(0).c /*-------*/).toBe("Ship-part");
      expect(n.part.adrift(1).c /*-------*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(n.part.adrift(null).c /*----*/).toBe("Ship-part");
      expect(n.part.adrift(undefined).c).toBe("Ship-part");
      expect(n.part.adrift("klingon").c).toBe("Ship-part Ship-part--adrift");
      expect(n.part.adrift("").c /*------*/).toBe("Ship-part");

      expect(n.part.adrift.s /*----------*/).toBe("Ship-part--adrift");
      expect(n.part.adrift().s /*--------*/).toBe("Ship-part--adrift");
      expect(n.part.adrift(true).s /*----*/).toBe("Ship-part--adrift");
      expect(n.part.adrift(false).s /*---*/).toBe("");
      expect(n.part.adrift(0).s /*-------*/).toBe("");
      expect(n.part.adrift(1).s /*-------*/).toBe("Ship-part--adrift");
      expect(n.part.adrift(null).s /*----*/).toBe("");
      expect(n.part.adrift(undefined).s).toBe("");
      expect(n.part.adrift("klingon").s).toBe("Ship-part--adrift");
      expect(n.part.adrift("").s /*------*/).toBe("");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.part.adrift}`).toThrow();
      expect(() => `${n.part.adrift()}`).toThrow();
      expect(() => `${n.part.adrift(true)}`).toThrow();
      expect(() => `${n.part.adrift(false)}`).toThrow();
      expect(() => `${n.part.adrift(0)}`).toThrow();
      expect(() => `${n.part.adrift(1)}`).toThrow();
      expect(() => `${n.part.adrift(null)}`).toThrow();
      expect(() => `${n.part.adrift(undefined)}`).toThrow();
      expect(() => `${n.part.adrift("klingon")}`).toThrow();
      expect(() => `${n.part.adrift("")}`).toThrow();

      expect(n.Ship.part.warp.c /*-------*/).toBe("Ship-part Ship-part--warp");
      expect(n.Ship.part.warp().c /*-----*/).toBe("Ship-part Ship-part--warp");
      expect(n.Ship.part.warp(true).c /*-*/).toBe("Ship-part Ship-part--warp");
      expect(n.Ship.part.warp(false).c).toBe("Ship-part");

      expect(n.Ship.part.warp.s /*-------*/).toBe("Ship-part--warp");
      expect(n.Ship.part.warp().s /*-----*/).toBe("Ship-part--warp");
      expect(n.Ship.part.warp(true).s /*-*/).toBe("Ship-part--warp");
      expect(n.Ship.part.warp(false).s).toBe("");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.part.warp}`).toThrow();
      expect(() => `${n.Ship.part.warp()}`).toThrow();
      expect(() => `${n.Ship.part.warp(true)}`).toThrow();
      expect(() => `${n.Ship.part.warp(false)}`).toThrow();

      expect(n.Ship.part.adrift.c /*-----*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(n.Ship.part.adrift().c /*---*/).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(n.Ship.part.adrift(true).c).toBe("Ship-part Ship-part--adrift");
      expect(n.Ship.part.adrift(false).c).toBe("Ship-part");

      expect(n.Ship.part.adrift.s /*-----*/).toBe("Ship-part--adrift");
      expect(n.Ship.part.adrift().s /*---*/).toBe("Ship-part--adrift");
      expect(n.Ship.part.adrift(true).s).toBe("Ship-part--adrift");
      expect(n.Ship.part.adrift(false).s).toBe("");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.part.adrift}`).toThrow();
      expect(() => `${n.Ship.part.adrift()}`).toThrow();
      expect(() => `${n.Ship.part.adrift(true)}`).toThrow();
      expect(() => `${n.Ship.part.adrift(false)}`).toThrow();
    });

    test("conditional class composition :: base class", () => {
      expect(n(n.warp, n.adrift).c).toBe("Ship Ship--warp Ship--adrift");
      expect(n(n.warp, n.adrift).s).toBe("Ship--warp Ship--adrift");

      // Equivalent to above:
      expect(n(n.warp(), n.adrift()).c).toBe("Ship Ship--warp Ship--adrift");
      expect(n(n.warp(), n.adrift()).s).toBe("Ship--warp Ship--adrift");

      // Invalid due to string being passed directly:
      expect(
        () =>
          n(
            n.warp().c as unknown as NSSArg<typeof Cond>,
            n.adrift().c as unknown as NSSArg<typeof Cond>
          ).c
      ).toThrow();
      expect(
        () =>
          n(
            n.warp().s as unknown as NSSArg<typeof Cond>,
            n.adrift().s as unknown as NSSArg<typeof Cond>
          ).s
      ).toThrow();
      expect(
        () =>
          n(
            n.warp().c as unknown as NSSArg<typeof Cond>,
            n.adrift().s as unknown as NSSArg<typeof Cond>
          ).c
      ).toThrow();
      expect(
        () =>
          n(
            n.warp().s as unknown as NSSArg<typeof Cond>,
            n.adrift().c as unknown as NSSArg<typeof Cond>
          ).s
      ).toThrow();

      expect(n(n.warp(true), n.adrift(true)).c).toBe(
        "Ship Ship--warp Ship--adrift"
      );
      expect(n(n.warp(true), n.adrift(false)).c).toBe("Ship Ship--warp");
      expect(n(n.warp(false), n.adrift(false)).c).toBe("Ship");
      expect(n(n.warp(0), n.adrift("at space")).c).toBe("Ship Ship--adrift");

      expect(n(n.warp(true), n.adrift(true)).s).toBe("Ship--warp Ship--adrift");
      expect(n(n.warp(true), n.adrift(false)).s).toBe("Ship--warp");
      expect(n(n.warp(false), n.adrift(false)).s).toBe("");
      expect(n(n.warp(0), n.adrift("at space")).s).toBe("Ship--adrift");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n(n.warp(true), n.adrift(true))}`).toThrow();
      expect(() => `${n(n.warp(true), n.adrift(false))}`).toThrow();
      expect(() => `${n(n.warp(false), n.adrift(false))}`).toThrow();
      expect(() => `${n(n.warp(0), n.adrift("at space"))}`).toThrow();

      // Equivalent to above (object composition):
      expect(n({ warp: true, adrift: true }).c).toBe(
        "Ship Ship--warp Ship--adrift"
      );
      expect(n({ warp: true, adrift: false }).c).toBe("Ship Ship--warp");
      expect(n({ warp: false, adrift: false }).c).toBe("Ship");
      expect(n({ warp: 0, adrift: "at space" }).c).toBe("Ship Ship--adrift");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Equivalent to above (object composition):
      expect(n({ warp: true, adrift: true }).s).toBe("Ship--warp Ship--adrift");
      expect(n({ warp: true, adrift: false }).s).toBe("Ship--warp");
      expect(n({ warp: false, adrift: false }).s).toBe("");
      expect(n({ warp: 0, adrift: "at space" }).s).toBe("Ship--adrift");
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n({ warp: true, adrift: true })}`).toThrow();
      expect(() => `${n({ warp: true, adrift: false })}`).toThrow();
      expect(() => `${n({ warp: false, adrift: false })}`).toThrow();
      expect(() => `${n({ warp: 0, adrift: "at space" })}`).toThrow();
    });

    test("conditional class composition :: element class", () => {
      expect(n.part(n.warp, n.adrift).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(n.part(n.warp, n.adrift).s).toBe(
        "Ship-part--warp Ship-part--adrift"
      );

      // Equivalent to above:
      expect(n.part(n.warp(), n.adrift()).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(n.part(n.warp(), n.adrift()).s).toBe(
        "Ship-part--warp Ship-part--adrift"
      );

      // Invalid due to string being passed directly:
      expect(
        () =>
          n.part(
            n.warp().c as unknown as NSSArg<typeof Cond>,
            n.adrift().c as unknown as NSSArg<typeof Cond>
          ).c
      ).toThrow();
      expect(
        () =>
          n.part(
            n.warp().s as unknown as NSSArg<typeof Cond>,
            n.adrift().s as unknown as NSSArg<typeof Cond>
          ).s
      ).toThrow();
      expect(
        () =>
          n.part(
            n.warp().c as unknown as NSSArg<typeof Cond>,
            n.adrift().s as unknown as NSSArg<typeof Cond>
          ).c
      ).toThrow();
      expect(
        () =>
          n.part(
            n.warp().s as unknown as NSSArg<typeof Cond>,
            n.adrift().c as unknown as NSSArg<typeof Cond>
          ).s
      ).toThrow();

      expect(n.part(n.warp(true), n.adrift(true)).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(n.part(n.warp(true), n.adrift(false)).c).toBe(
        "Ship-part Ship-part--warp"
      );
      expect(n.part(n.warp(false), n.adrift(false)).c).toBe("Ship-part");
      expect(n.part(n.warp(0), n.adrift("at space")).c).toBe(
        "Ship-part Ship-part--adrift"
      );
      // all non-bool values ignored unless config.strictBoolChecks=false

      expect(n.part(n.warp(true), n.adrift(true)).s).toBe(
        "Ship-part--warp Ship-part--adrift"
      );
      expect(n.part(n.warp(true), n.adrift(false)).s).toBe("Ship-part--warp");
      expect(n.part(n.warp(false), n.adrift(false)).s).toBe("");
      expect(n.part(n.warp(0), n.adrift("at space")).s).toBe(
        "Ship-part--adrift"
      );
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.part(n.warp(true), n.adrift(true))}`).toThrow();
      expect(() => `${n.part(n.warp(true), n.adrift(false))}`).toThrow();
      expect(() => `${n.part(n.warp(false), n.adrift(false))}`).toThrow();
      expect(() => `${n.part(n.warp(0), n.adrift("at space"))}`).toThrow();

      // Equivalent to above (object composition):
      expect(n.part({ warp: true, adrift: true }).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(n.part({ warp: true, adrift: false }).c).toBe(
        "Ship-part Ship-part--warp"
      );
      expect(n.part({ warp: false, adrift: false }).c).toBe("Ship-part");
      expect(n.part({ warp: 0, adrift: "at space" }).c).toBe(
        "Ship-part Ship-part--adrift"
      );
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Equivalent to above (object composition):
      expect(n.part({ warp: true, adrift: true }).s).toBe(
        "Ship-part--warp Ship-part--adrift"
      );
      expect(n.part({ warp: true, adrift: false }).s).toBe("Ship-part--warp");
      expect(n.part({ warp: false, adrift: false }).s).toBe("");
      expect(n.part({ warp: 0, adrift: "at space" }).s).toBe(
        "Ship-part--adrift"
      );
      // all non-bool values ignored unless config.strictBoolChecks=false

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.part({ warp: true, adrift: true })}`).toThrow();
      expect(() => `${n.part({ warp: true, adrift: false })}`).toThrow();
      expect(() => `${n.part({ warp: false, adrift: false })}`).toThrow();
      expect(() => `${n.part({ warp: 0, adrift: "at space" })}`).toThrow();
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
        const n = nss<typeof NameMapped, typeof ElemMapped, typeof CondMapped>(
          NameMapped,
          ElemMapped,
          CondMapped
        );
        expect(n.c).toBe("Ship abc");
        expect(n().c).toBe("Ship abc");

        expect(n.engine.c).toBe("Ship-engine def");
        expect(n.engine().c).toBe("Ship-engine def");

        expect(n.part.c).toBe("Ship-part ghi");
        expect(n.part().c).toBe("Ship-part ghi");

        expect(n.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp(true).c /*-------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp(false).c /*------*/).toBe("Ship abc");

        expect(n.part.warp.c /*--------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp().c /*------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp(true).c /*--*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp(false).c /*-*/).toBe("Ship-part ghi");

        expect(n.Ship.c).toBe("Ship abc");
        expect(n.Ship().c).toBe("Ship abc");

        expect(n.Ship.engine.c).toBe("Ship-engine def");
        expect(n.Ship.engine().c).toBe("Ship-engine def");

        expect(n.Ship.part.c).toBe("Ship-part ghi");
        expect(n.Ship.part().c).toBe("Ship-part ghi");

        expect(n.Ship.warp.c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp().c /*------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp(true).c /*--*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp(false).c /*-*/).toBe("Ship abc");

        expect(n.Ship.part.warp.c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(n.Ship.part.warp().c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(n.Ship.part.warp(true).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.Ship.part.warp(false).c).toBe("Ship-part ghi");
      });

      test("enum values with class composition", () => {
        const n = nss<typeof NameMapped, typeof ElemMapped, typeof CondMapped>(
          NameMapped,
          ElemMapped,
          CondMapped
        );

        expect(n(n.warp, n.adrift).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n(n.warp(), n.adrift()).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );

        expect(n(n.warp(true), n.adrift(true)).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n(n.warp(true), n.adrift(false)).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(n(n.warp(false), n.adrift(false)).c).toBe("Ship abc");
        expect(n(n.warp(0), n.adrift("at space")).c).toBe(
          "Ship abc Ship--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n({ warp: true, adrift: true }).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n({ warp: true, adrift: false }).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(n({ warp: false, adrift: false }).c).toBe("Ship abc");
        expect(n({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship abc Ship--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n.part(n.warp, n.adrift).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part(n.warp(), n.adrift()).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );

        expect(n.part(n.warp(true), n.adrift(true)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part(n.warp(true), n.adrift(false)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part(n.warp(false), n.adrift(false)).c).toBe("Ship-part ghi");
        expect(n.part(n.warp(0), n.adrift("at space")).c).toBe(
          "Ship-part ghi Ship-part--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n.part({ warp: true, adrift: true }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part({ warp: true, adrift: false }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part({ warp: false, adrift: false }).c).toBe("Ship-part ghi");
        expect(n.part({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship-part ghi Ship-part--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false
      });

      test("map object", () => {
        const n = nss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond, {
          Ship: "abc",
          engine: "def",
          part: "ghi",
          warp: "jkl",
          // adrift omitted -- custom classes should be optional
        });

        expect(n.c).toBe("Ship abc");
        expect(n().c).toBe("Ship abc");

        expect(n.engine.c).toBe("Ship-engine def");
        expect(n.engine().c).toBe("Ship-engine def");

        expect(n.part.c).toBe("Ship-part ghi");
        expect(n.part().c).toBe("Ship-part ghi");

        expect(n.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp(true).c /*-------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp(false).c /*------*/).toBe("Ship abc");

        expect(n.part.warp.c /*--------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp().c /*------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp(true).c /*--*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp(false).c /*-*/).toBe("Ship-part ghi");

        expect(n.Ship.c).toBe("Ship abc");
        expect(n.Ship().c).toBe("Ship abc");

        expect(n.Ship.engine.c).toBe("Ship-engine def");
        expect(n.Ship.engine().c).toBe("Ship-engine def");

        expect(n.Ship.part.c).toBe("Ship-part ghi");
        expect(n.Ship.part().c).toBe("Ship-part ghi");

        expect(n.Ship.warp.c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp().c /*------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp(true).c /*--*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp(false).c /*-*/).toBe("Ship abc");

        expect(n.Ship.part.warp.c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(n.Ship.part.warp().c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(n.Ship.part.warp(true).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.Ship.part.warp(false).c).toBe("Ship-part ghi");
      });

      test("map object with class composition", () => {
        const n = nss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond, {
          Ship: "abc",
          engine: "def",
          part: "ghi",
          warp: "jkl",
          adrift: "mno",
        });

        expect(n(n.warp, n.adrift).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n(n.warp(), n.adrift()).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );

        expect(n(n.warp(true), n.adrift(true)).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n(n.warp(true), n.adrift(false)).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(n(n.warp(false), n.adrift(false)).c).toBe("Ship abc");
        expect(n(n.warp(0), n.adrift("at space")).c).toBe(
          "Ship abc Ship--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n({ warp: true, adrift: true }).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n({ warp: true, adrift: false }).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(n({ warp: false, adrift: false }).c).toBe("Ship abc");
        expect(n({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship abc Ship--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n.part(n.warp, n.adrift).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part(n.warp(), n.adrift()).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );

        expect(n.part(n.warp(true), n.adrift(true)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part(n.warp(true), n.adrift(false)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part(n.warp(false), n.adrift(false)).c).toBe("Ship-part ghi");
        expect(n.part(n.warp(0), n.adrift("at space")).c).toBe(
          "Ship-part ghi Ship-part--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n.part({ warp: true, adrift: true }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part({ warp: true, adrift: false }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part({ warp: false, adrift: false }).c).toBe("Ship-part ghi");
        expect(n.part({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship-part ghi Ship-part--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false
      });

      test("generator function", () => {
        const n = nss<typeof Name, typeof Elem, typeof Cond>(
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

        expect(n.c).toBe("Ship abc");
        expect(n().c).toBe("Ship abc");

        expect(n.engine.c).toBe("Ship-engine def");
        expect(n.engine().c).toBe("Ship-engine def");

        expect(n.part.c).toBe("Ship-part ghi");
        expect(n.part().c).toBe("Ship-part ghi");

        expect(n.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp(true).c /*-------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp(false).c /*------*/).toBe("Ship abc");

        expect(n.part.warp.c /*--------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp().c /*------*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp(true).c /*--*/).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp(false).c /*-*/).toBe("Ship-part ghi");

        expect(n.Ship.c).toBe("Ship abc");
        expect(n.Ship().c).toBe("Ship abc");

        expect(n.Ship.engine.c).toBe("Ship-engine def");
        expect(n.Ship.engine().c).toBe("Ship-engine def");

        expect(n.Ship.part.c).toBe("Ship-part ghi");
        expect(n.Ship.part().c).toBe("Ship-part ghi");

        expect(n.Ship.warp.c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp().c /*------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp(true).c /*--*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp(false).c /*-*/).toBe("Ship abc");

        expect(n.Ship.part.warp.c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(n.Ship.part.warp().c).toBe("Ship-part ghi Ship-part--warp jkl");
        expect(n.Ship.part.warp(true).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.Ship.part.warp(false).c).toBe("Ship-part ghi");
      });

      test("generator function with class composition", () => {
        const n = nss<typeof Name, typeof Elem, typeof Cond>(
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

        expect(n(n.warp, n.adrift).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n(n.warp(), n.adrift()).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );

        expect(n(n.warp(true), n.adrift(true)).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n(n.warp(true), n.adrift(false)).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(n(n.warp(false), n.adrift(false)).c).toBe("Ship abc");
        expect(n(n.warp(0), n.adrift("at space")).c).toBe(
          "Ship abc Ship--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n({ warp: true, adrift: true }).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n({ warp: true, adrift: false }).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(n({ warp: false, adrift: false }).c).toBe("Ship abc");
        expect(n({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship abc Ship--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n.part(n.warp, n.adrift).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part(n.warp(), n.adrift()).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );

        expect(n.part(n.warp(true), n.adrift(true)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part(n.warp(true), n.adrift(false)).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part(n.warp(false), n.adrift(false)).c).toBe("Ship-part ghi");
        expect(n.part(n.warp(0), n.adrift("at space")).c).toBe(
          "Ship-part ghi Ship-part--adrift mno"
        );
        // all non-bool values ignored unless config.strictBoolChecks=false

        expect(n.part({ warp: true, adrift: true }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part({ warp: true, adrift: false }).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part({ warp: false, adrift: false }).c).toBe("Ship-part ghi");
        expect(n.part({ warp: 0, adrift: "at space" }).c).toBe(
          "Ship-part ghi Ship-part--adrift mno"
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
        const n = nss<object, typeof ElemMapped, typeof CondMapped>(
          {},
          ElemMapped,
          CondMapped
        );

        expect((n as unknown as { Ship: unknown }).Ship).toBeUndefined();

        expect(n.c).toBe("");
        expect(n.engine.c).toBe("engine def");
        expect(n.part.c).toBe("part ghi");
        expect(n.warp.c /*-------------*/).toBe("warp jkl");
        expect(n.warp().c /*-----------*/).toBe("warp jkl");
        expect(n.warp(true).c /*-------*/).toBe("warp jkl");
        expect(n.warp(false).c /*------*/).toBe("");
        expect(n.part.warp.c /*--------*/).toBe("part ghi part--warp jkl");
        expect(n.part.warp().c /*------*/).toBe("part ghi part--warp jkl");
        expect(n.part.warp(true).c /*--*/).toBe("part ghi part--warp jkl");
        expect(n.part.warp(false).c /*-*/).toBe("part ghi");

        expect(n.s).toBe("");
        expect(n.engine.s).toBe("def");
        expect(n.part.s).toBe("ghi");
        expect(n.warp.s /*-------------*/).toBe("warp jkl");
        expect(n.warp().s /*-----------*/).toBe("warp jkl");
        expect(n.warp(true).s /*-------*/).toBe("warp jkl");
        expect(n.warp(false).s /*------*/).toBe("");
        expect(n.part.warp.s /*--------*/).toBe("part--warp jkl");
        expect(n.part.warp().s /*------*/).toBe("part--warp jkl");
        expect(n.part.warp(true).s /*--*/).toBe("part--warp jkl");
        expect(n.part.warp(false).s /*-*/).toBe("");
      });

      test("omit elements", () => {
        const n = nss<typeof NameMapped, object, typeof CondMapped>(
          NameMapped,
          null,
          CondMapped
        );

        expect(n.c).toBe("Ship abc");
        expect(n.Ship.c).toBe("Ship abc");
        expect(n.warp.c /*---------------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp().c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.adrift(true).c /*-------*/).toBe("Ship abc Ship--adrift mno");
        expect(n.adrift(false).c /*------*/).toBe("Ship abc");
        expect(n.Ship.warp.c /*----------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp().c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.adrift(true).c /*--*/).toBe("Ship abc Ship--adrift mno");
        expect(n.Ship.adrift(false).c /*-*/).toBe("Ship abc");

        expect(n.s).toBe("abc");
        expect(n.Ship.s).toBe("abc");
        expect(n.warp.s /*---------------*/).toBe("Ship--warp jkl");
        expect(n.warp().s /*-------------*/).toBe("Ship--warp jkl");
        expect(n.adrift(true).s /*-------*/).toBe("Ship--adrift mno");
        expect(n.adrift(false).s /*------*/).toBe("");
        expect(n.Ship.warp.s /*----------*/).toBe("Ship--warp jkl");
        expect(n.Ship.warp().s /*--------*/).toBe("Ship--warp jkl");
        expect(n.Ship.adrift(true).s /*--*/).toBe("Ship--adrift mno");
        expect(n.Ship.adrift(false).s /*-*/).toBe("");
      });

      test("omit elements + class mappings via map object", () => {
        const n = nss<typeof Name, object, typeof Cond>(Name, null, Cond, {
          Ship: "abc",
          warp: "jkl",
          // adrift omitted -- custom classes should be optional
        });

        expect(n.c).toBe("Ship abc");
        expect(n.Ship.c).toBe("Ship abc");
        expect(n.warp.c /*---------------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.warp().c /*-------------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.adrift(true).c /*-------*/).toBe("Ship abc Ship--adrift");
        expect(n.adrift(false).c /*------*/).toBe("Ship abc");
        expect(n.Ship.warp.c /*----------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.warp().c /*--------*/).toBe("Ship abc Ship--warp jkl");
        expect(n.Ship.adrift(true).c /*--*/).toBe("Ship abc Ship--adrift");
        expect(n.Ship.adrift(false).c /*-*/).toBe("Ship abc");

        expect(n.s).toBe("abc");
        expect(n.Ship.s).toBe("abc");
        expect(n.warp.s /*---------------*/).toBe("Ship--warp jkl");
        expect(n.warp().s /*-------------*/).toBe("Ship--warp jkl");
        expect(n.adrift(true).s /*-------*/).toBe("Ship--adrift");
        expect(n.adrift(false).s /*------*/).toBe("");
        expect(n.Ship.warp.s /*----------*/).toBe("Ship--warp jkl");
        expect(n.Ship.warp().s /*--------*/).toBe("Ship--warp jkl");
        expect(n.Ship.adrift(true).s /*--*/).toBe("Ship--adrift");
        expect(n.Ship.adrift(false).s /*-*/).toBe("");
      });

      test("omit conditionals", () => {
        const n = nss<typeof NameMapped, typeof ElemMapped>(
          NameMapped,
          ElemMapped
        );

        expect(n.c).toBe("Ship abc");
        expect(n.engine.c).toBe("Ship-engine def");
        expect(n.part.c).toBe("Ship-part ghi");
        expect(n.Ship.c).toBe("Ship abc");
        expect(n.Ship.engine.c).toBe("Ship-engine def");
        expect(n.Ship.part.c).toBe("Ship-part ghi");

        expect(n.s).toBe("abc");
        expect(n.engine.s).toBe("def");
        expect(n.part.s).toBe("ghi");
        expect(n.Ship.s).toBe("abc");
        expect(n.Ship.engine.s).toBe("def");
        expect(n.Ship.part.s).toBe("ghi");
      });

      test("omit conditionals + class mappings via map object", () => {
        const n = nss<typeof Name, typeof Elem>(Name, Elem, null, {
          Ship: "abc",
          engine: "def",
          part: "ghi",
        });

        expect(n.c).toBe("Ship abc");
        expect(n.engine.c).toBe("Ship-engine def");
        expect(n.part.c).toBe("Ship-part ghi");
        expect(n.Ship.c).toBe("Ship abc");
        expect(n.Ship.engine.c).toBe("Ship-engine def");
        expect(n.Ship.part.c).toBe("Ship-part ghi");

        expect(n.s).toBe("abc");
        expect(n.engine.s).toBe("def");
        expect(n.part.s).toBe("ghi");
        expect(n.Ship.s).toBe("abc");
        expect(n.Ship.engine.s).toBe("def");
        expect(n.Ship.part.s).toBe("ghi");
      });
    }
  );

  describe("configuration", () => {
    beforeEach(() => {
      nss.configure({
        elementSeparator: "__",
        conditionalSeparator: ":::",
      });
    });

    afterEach(() => {
      nss.configure(null);
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

      const n = nss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);

      expect(n.c).toBe("Ship abc");
      expect(n().c).toBe("Ship abc");

      expect(n.engine.c).toBe("Ship__engine def");
      expect(n.engine().c).toBe("Ship__engine def");

      expect(n.part.c).toBe("Ship__part ghi");
      expect(n.part().c).toBe("Ship__part ghi");

      expect(n.warp.c /*-------------*/).toBe("Ship abc Ship:::warp jkl");
      expect(n.warp().c /*-----------*/).toBe("Ship abc Ship:::warp jkl");
      expect(n.warp(true).c /*-------*/).toBe("Ship abc Ship:::warp jkl");
      expect(n.warp(false).c /*------*/).toBe("Ship abc");

      expect(n.part.warp.c /*------*/).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(n.part.warp().c /*------*/).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(n.part.warp(true).c /*--*/).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(n.part.warp(false).c /*-*/).toBe("Ship__part ghi");

      expect(n.Ship.c).toBe("Ship abc");
      expect(n.Ship().c).toBe("Ship abc");

      expect(n.Ship.engine.c).toBe("Ship__engine def");
      expect(n.Ship.engine().c).toBe("Ship__engine def");

      expect(n.Ship.part.c).toBe("Ship__part ghi");
      expect(n.Ship.part().c).toBe("Ship__part ghi");

      expect(n.Ship.warp.c /*-------------*/).toBe("Ship abc Ship:::warp jkl");
      expect(n.Ship.warp().c /*-----------*/).toBe("Ship abc Ship:::warp jkl");
      expect(n.Ship.warp(true).c /*-------*/).toBe("Ship abc Ship:::warp jkl");
      expect(n.Ship.warp(false).c /*------*/).toBe("Ship abc");

      expect(n.Ship.part.warp.c).toBe("Ship__part ghi Ship__part:::warp jkl");
      expect(n.Ship.part.warp().c).toBe("Ship__part ghi Ship__part:::warp jkl");
      expect(n.Ship.part.warp(true).c).toBe(
        "Ship__part ghi Ship__part:::warp jkl"
      );
      expect(n.Ship.part.warp(false).c).toBe("Ship__part ghi");
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

      nss.configure(null); // reset must occur BEFORE nss init

      const n = nss<typeof Name, typeof Elem, typeof Cond>(Name, Elem, Cond);

      expect(n.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
      expect(n.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
      expect(n.warp("proton torpedo").c).toBe("Ship abc Ship--warp jkl");
      expect(n.warp(0).c /*----------*/).toBe("Ship abc");
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
