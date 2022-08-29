/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// Some test cases require type errors to be ignored;
// these will employ @ts-ignore on a line-by-line basis
// and require typescript-eslint's aggressive restriction
// of these notations to be ignored ("ban-ts-comment").

import nss, { NSS } from "../src/nss";

enum BaseEnum {
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

enum BaseEnumMapped {
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

const BaseObj = {
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

const BaseObjMapped = {
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
    ["enum-based", BaseEnum, ElemEnum, CondEnum],
    ["object-based", BaseObj, ElemObj, CondObj],
  ])("class composition :: %s", (_, Base, Elem, Cond) => {
    let n: NSS<typeof Base, typeof Elem, typeof Cond>;

    beforeAll(() => {
      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);
    });

    test("name", () => {
      expect(n.name).toBe("Ship");
    });

    test("base class", () => {
      // Test cls resolver (short version):
      expect(n.c).toBe("Ship");
      expect(n().c).toBe("Ship");
      expect(n(["enterprise"]).c).toBe("Ship Ship--enterprise");
      expect(n({ enterprise: true }).c).toBe("Ship Ship--enterprise");
      expect(() => n("enterprise" as unknown as string[]).c).toThrow();
      // We don't allow passing bare strings because that would make it too easy
      // to inadvertantly pass something like n.damaged.s resulting in bad class.
      // This is tough to detect automatically if we allow any string to be passed.

      // Test cls resolver (verbose version):
      expect(n.cls).toBe("Ship");
      expect(n().cls).toBe("Ship");
      expect(n(["enterprise"]).cls).toBe("Ship Ship--enterprise");
      expect(n({ enterprise: true }).cls).toBe("Ship Ship--enterprise");
      expect(() => n("enterprise" as unknown as string[]).cls).toThrow();

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
      expect(() => n.Ship("enterprise" as unknown as string[]).c).toThrow();
      //
      expect(() => `${n.Ship}`).toThrow();
      expect(() => `${n.Ship()}`).toThrow();
      expect(() => `${n.Ship(["enterprise"])}`).toThrow();
      expect(() => `${n.Ship({ enterprise: true })}`).toThrow();
    });

    test("element classes", () => {
      // Test cls resolver (short version):
      expect(n.engine.c).toBe("Ship-engine");
      expect(n.engine().c).toBe("Ship-engine");
      expect(n.engine(["nacelle"]).c).toBe("Ship-engine Ship-engine--nacelle");
      expect(n.engine({ nacelle: true }).c).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(() => n.engine("nacelle" as unknown as string[]).c).toThrow();

      // Test cls resolver (verbose version):
      expect(n.engine.cls).toBe("Ship-engine");
      expect(n.engine().cls).toBe("Ship-engine");
      expect(n.engine(["nacelle"]).cls).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(n.engine({ nacelle: true }).cls).toBe(
        "Ship-engine Ship-engine--nacelle"
      );
      expect(() => n.engine("nacelle" as unknown as string[]).cls).toThrow();

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
      expect(() => n.part("warpDrive" as unknown as string[]).c).toThrow();

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
      expect(() => n.Ship.engine("nacelle" as unknown as string[]).c).toThrow();

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
      expect(() => n.Ship.part("warpDrive" as unknown as string[]).c).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.part}`).toThrow();
      expect(() => `${n.Ship.part()}`).toThrow();
      expect(() => `${n.Ship.part(["warpDrive"])}`).toThrow();
      expect(() => `${n.Ship.part({ warpDrive: true })}`).toThrow();
    });

    test("conditional classes", () => {
      // Test cls resolver (short version):
      expect(n.warp.c /*---------------*/).toBe("Ship Ship--warp");
      expect(n.warp().c /*-------------*/).toBe("Ship Ship--warp");

      // Test cls resolver (verbose version):
      expect(n.warp.cls /*-----------*/).toBe("Ship Ship--warp");
      expect(n.warp().cls /*---------*/).toBe("Ship Ship--warp");

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

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.warp}`).toThrow();
      expect(() => `${n.Ship.warp()}`).toThrow();

      expect(n.Ship.warp(true).c /*----*/).toBe("Ship Ship--warp");
      expect(n.Ship.warp(false).c /*---*/).toBe("Ship");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.warp(true)}`).toThrow();
      expect(() => `${n.Ship.warp(false)}`).toThrow();

      expect(n.Ship.adrift.c /*--------*/).toBe("Ship Ship--adrift");
      expect(n.Ship.adrift().c /*------*/).toBe("Ship Ship--adrift");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.adrift /*----*/}`).toThrow();
      expect(() => `${n.Ship.adrift() /*--*/}`).toThrow();

      expect(n.Ship.adrift(true).c /*--*/).toBe("Ship Ship--adrift");
      expect(n.Ship.adrift(false).c /*-*/).toBe("Ship");

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.adrift(true)}`).toThrow();
      expect(() => `${n.Ship.adrift(false)}`).toThrow();
    });

    test("element conditional classes", () => {
      // Test cls resolver (short version):
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

      // Test cls resolver (verbose version):
      expect(n.part.warp.cls /*--------*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp().cls /*------*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(true).cls /*--*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(false).cls /*-*/).toBe("Ship-part");
      expect(n.part.warp(0).cls /*-----*/).toBe("Ship-part");
      expect(n.part.warp(1).cls /*-----*/).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp(null).cls /*--*/).toBe("Ship-part");
      expect(n.part.warp(undefined).cls).toBe("Ship-part");
      expect(n.part.warp("klingon").cls).toBe("Ship-part Ship-part--warp");
      expect(n.part.warp("").cls /*----*/).toBe("Ship-part");

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

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.part.adrift}`).toThrow();
      expect(() => `${n.Ship.part.adrift()}`).toThrow();
      expect(() => `${n.Ship.part.adrift(true)}`).toThrow();
      expect(() => `${n.Ship.part.adrift(false)}`).toThrow();
    });

    test("conditional class composition :: base class", () => {
      expect(n(n.warp, n.adrift).c).toBe("Ship Ship--warp Ship--adrift");

      // Equivalent to above:
      expect(n(n.warp(), n.adrift()).c).toBe("Ship Ship--warp Ship--adrift");

      // Invalid due to string being passed directly:
      expect(
        () =>
          n(
            n.warp().c as unknown as string[],
            n.adrift().c as unknown as string[]
          ).c
      ).toThrow();

      expect(n(n.warp(true), n.adrift(true)).c).toBe(
        "Ship Ship--warp Ship--adrift"
      );
      expect(n(n.warp(true), n.adrift(false)).c).toBe("Ship Ship--warp");
      expect(n(n.warp(false), n.adrift(false)).c).toBe("Ship");
      expect(n(n.warp(0), n.adrift("at space")).c).toBe("Ship Ship--adrift");

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

      // Equivalent to above:
      expect(n.part(n.warp(), n.adrift()).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );

      // Invalid due to string being passed directly:
      expect(
        () =>
          n.part(
            n.warp().c as unknown as string[],
            n.adrift().c as unknown as string[]
          ).c
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

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.part({ warp: true, adrift: true })}`).toThrow();
      expect(() => `${n.part({ warp: true, adrift: false })}`).toThrow();
      expect(() => `${n.part({ warp: false, adrift: false })}`).toThrow();
      expect(() => `${n.part({ warp: 0, adrift: "at space" })}`).toThrow();
    });

    test("chained conditionals :: base class", () => {
      expect(n.warp().adrift().c).toBe("Ship Ship--warp Ship--adrift");

      // Equivalent to above (but shouldn't generally be used):
      expect(n.warp().adrift.c).toBe("Ship Ship--warp Ship--adrift");

      expect(n.warp(true).adrift(true).c).toBe("Ship Ship--warp Ship--adrift");
      expect(n.warp(true).adrift(false).c).toBe("Ship Ship--warp");
      expect(n.warp(false).adrift(false).c).toBe("Ship");
      expect(n.warp(0).adrift("at space").c).toBe("Ship Ship--adrift");

      // Triple chain: false cond does not negate true cond
      // TODO Consider fixing this in the future
      expect(n.warp(true).adrift(true).warp(false).c).toBe(
        "Ship Ship--warp Ship--adrift"
      );
      // Triple chain: duplicate cond results in duplicate class
      // TODO Consider fixing this in the future
      expect(n.warp(true).adrift(true).warp(true).c).toBe(
        "Ship Ship--warp Ship--adrift Ship--warp"
      );

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.warp(true).adrift(true)}`).toThrow();
      expect(() => `${n.warp(true).adrift(false)}`).toThrow();
      expect(() => `${n.warp(false).adrift(false)}`).toThrow();
      expect(() => `${n.warp(0).adrift("at space")}`).toThrow();
      // Should throw: Chaining should only be available off top-level n object, not n():
      // TODO Consider fixing this in the future
      // @ts-ignore
      expect(() => n().warp(true).adrift(true)).toThrow();
      // @ts-ignore
      expect(() => n().warp(true).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n().warp(false).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n().warp(0).adrift("at space")).toThrow();
      // Should throw: Chaining should only be available off top-level n object:
      // TODO Consider fixing this in the future
      // @ts-ignore
      expect(() => n({ warp: true }).warp(true).adrift(true)).toThrow();
      // @ts-ignore
      expect(() => n({ warp: true }).warp(true).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n({ warp: true }).warp(false).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n({ warp: true }).warp(0).adrift("at space")).toThrow();
      // Should throw: Chaining should only be available off top-level n object:
      // TODO Consider fixing this in the future
      // @ts-ignore
      expect(() => n.props({ warp: true }).warp(true).adrift(true)).toThrow();
      // @ts-ignore
      expect(() => n.props({ warp: true }).warp(true).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n.props({ warp: true }).warp(false).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n.props({ warp: true }).warp(0).adrift("space")).toThrow();
    });

    test("chained conditionals :: element class", () => {
      expect(n.part.warp().adrift().c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );

      // Equivalent to above (but shouldn't generally be used):
      expect(n.part.warp().adrift.c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );

      expect(n.part.warp(true).adrift(true).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      expect(n.part.warp(true).adrift(false).c).toBe(
        "Ship-part Ship-part--warp"
      );
      expect(n.part.warp(false).adrift(false).c).toBe("Ship-part");
      expect(n.part.warp(0).adrift("at space").c).toBe(
        "Ship-part Ship-part--adrift"
      );

      // Triple chain: false cond does not negate true cond
      // TODO Consider fixing this in the future
      expect(n.part.warp(true).adrift(true).warp(false).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      // Triple chain: duplicate cond results in duplicate class
      // TODO Consider fixing this in the future
      expect(n.part.warp(true).adrift(true).warp(true).c).toBe(
        "Ship-part Ship-part--warp Ship-part--adrift Ship-part--warp"
      );

      // Should throw: NSS expressions should never be cast directly to string.
      // @ts-ignore
      expect(() => `${n.part.warp(true).adrift(true)}`).toThrow();
      // @ts-ignore
      expect(() => `${n.part.warp(true).adrift(false)}`).toThrow();
      // @ts-ignore
      expect(() => `${n.part.warp(false).adrift(false)}`).toThrow();
      // @ts-ignore
      expect(() => `${n.part.warp(0).adrift("at space")}`).toThrow();
      // Should throw: Chaining should only be available off top-level n object, not n():
      // TODO Consider fixing this in the future
      // @ts-ignore
      expect(() => n.part().warp(true).adrift(true)).toThrow();
      // @ts-ignore
      expect(() => n.part().warp(true).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n.part().warp(false).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n.part().warp(0).adrift("at space")).toThrow();
      // Should throw: Chaining should only be available off top-level n object:
      // TODO Consider fixing this in the future
      // @ts-ignore
      expect(() => n.part({ warp: true }).warp(true).adrift(true)).toThrow();
      // @ts-ignore
      expect(() => n.part({ warp: true }).warp(true).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n.part({ warp: true }).warp(false).adrift(false)).toThrow();
      // @ts-ignore
      expect(() => n.part({ warp: true }).warp(0).adrift("at space")).toThrow();
      // Should throw: Chaining should only be available off top-level n object:
      // TODO Consider fixing this in the future
      expect(() =>
        // @ts-ignore
        n.part.props({ warp: true }).warp(true).adrift(true)
      ).toThrow();
      expect(() =>
        // @ts-ignore
        n.part.props({ warp: true }).warp(true).adrift(false)
      ).toThrow();
      expect(() =>
        // @ts-ignore
        n.part.props({ warp: true }).warp(false).adrift(false)
      ).toThrow();
      expect(() =>
        // @ts-ignore
        n.part.props({ warp: true }).warp(0).adrift("space")
      ).toThrow();
    });
  });

  describe.each([
    [
      "enum-based",
      BaseEnum,
      ElemEnum,
      CondEnum,
      BaseEnumMapped,
      ElemEnumMapped,
      CondEnumMapped,
    ],
    [
      "object-based",
      BaseObj,
      ElemObj,
      CondObj,
      BaseObjMapped,
      ElemObjMapped,
      CondObjMapped,
    ],
  ])(
    "class mapping :: %s",
    (_, Base, Elem, Cond, BaseMapped, ElemMapped, CondMapped) => {
      function verifyBasicForms(n: any) {
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
      }

      function verifyCompositionalForms(n: any) {
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
      }

      function verifyChainedForms(n: any) {
        expect(n.warp().adrift().c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        // Equivalent to above (but shouldn't generally be used):
        expect(n.warp().adrift.c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n.warp(true).adrift(true).c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n.warp(true).adrift(false).c).toBe("Ship abc Ship--warp jkl");
        expect(n.warp(false).adrift(false).c).toBe("Ship abc");
        expect(n.warp(0).adrift("at space").c).toBe(
          "Ship abc Ship--adrift mno"
        );

        expect(n.part.warp().adrift().c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        // Equivalent to above (but shouldn't generally be used):
        expect(n.part.warp().adrift.c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part.warp(true).adrift(true).c).toBe(
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        expect(n.part.warp(true).adrift(false).c).toBe(
          "Ship-part ghi Ship-part--warp jkl"
        );
        expect(n.part.warp(false).adrift(false).c).toBe("Ship-part ghi");
        expect(n.part.warp(0).adrift("at space").c).toBe(
          "Ship-part ghi Ship-part--adrift mno"
        );
      }

      test("enum values", () => {
        verifyBasicForms(
          nss<typeof BaseMapped, typeof ElemMapped, typeof CondMapped>(
            BaseMapped,
            ElemMapped,
            CondMapped
          )
        );
      });

      test("enum values :: class composition", () => {
        verifyCompositionalForms(
          nss<typeof BaseMapped, typeof ElemMapped, typeof CondMapped>(
            BaseMapped,
            ElemMapped,
            CondMapped
          )
        );
      });

      test("enum values :: chained conditionals", () => {
        verifyChainedForms(
          nss<typeof BaseMapped, typeof ElemMapped, typeof CondMapped>(
            BaseMapped,
            ElemMapped,
            CondMapped
          )
        );
      });

      test("map object", () => {
        verifyBasicForms(
          nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond, {
            Ship: "abc",
            engine: "def",
            part: "ghi",
            warp: "jkl",
            // adrift omitted -- custom classes should be optional
          })
        );
      });

      test("map object :: class composition", () => {
        verifyCompositionalForms(
          nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond, {
            Ship: "abc",
            engine: "def",
            part: "ghi",
            warp: "jkl",
            adrift: "mno",
          })
        );
      });

      test("map object :: chained conditionals", () => {
        verifyChainedForms(
          nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond, {
            Ship: "abc",
            engine: "def",
            part: "ghi",
            warp: "jkl",
            adrift: "mno",
          })
        );
      });

      test("generator function", () => {
        verifyBasicForms(
          nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond, () => {
            const alphabet = "abcdefghijklmnopqrstuvwxyz";
            return {
              Ship: alphabet.slice(0, 3),
              engine: alphabet.slice(3, 6),
              part: alphabet.slice(6, 9),
              warp: alphabet.slice(9, 12),
              // adrift omitted -- custom classes should be optional
            };
          })
        );
      });

      test("generator function :: class composition", () => {
        verifyCompositionalForms(
          nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond, () => {
            const alphabet = "abcdefghijklmnopqrstuvwxyz";
            return {
              Ship: alphabet.slice(0, 3),
              engine: alphabet.slice(3, 6),
              part: alphabet.slice(6, 9),
              warp: alphabet.slice(9, 12),
              adrift: alphabet.slice(12, 15),
            };
          })
        );
      });

      test("generator function :: chained conditionals", () => {
        verifyChainedForms(
          nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond, () => {
            const alphabet = "abcdefghijklmnopqrstuvwxyz";
            return {
              Ship: alphabet.slice(0, 3),
              engine: alphabet.slice(3, 6),
              part: alphabet.slice(6, 9),
              warp: alphabet.slice(9, 12),
              adrift: alphabet.slice(12, 15),
            };
          })
        );
      });
    }
  );

  describe.each([
    ["enum-based", BaseEnum, ElemEnum, CondEnum],
    ["object-based", BaseObj, ElemObj, CondObj],
  ])("props :: %s", (_, Base, Elem, Cond) => {
    let n: NSS<typeof Base, typeof Elem, typeof Cond>;

    const fuzz = (assertion: (arg: unknown) => void) =>
      [
        false,
        0,
        1,
        -1,
        2,
        Infinity,
        NaN,
        "test",
        "",
        null,
        undefined,
        [],
        {},
        () => {
          /* pass */
        },
        new Date(),
      ].forEach((val) => assertion(val));

    beforeAll(() => {
      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);
    });

    test("base class", () => {
      // Test cls resolver (short version):
      expect(n.props().c).toBe("Ship");
      expect(n.props(["warp"]).c).toBe("Ship Ship--warp");
      expect(n.props({ warp: true }).c).toBe("Ship Ship--warp");
      fuzz((val) => expect(n.props({ warp: val }).c).toBe("Ship"));
      expect(() => n.props("warp" as unknown as string[]).c).toThrow();

      // Test cls resolver (verbose version):
      expect(n.props().cls).toBe("Ship");
      expect(n.props(["warp"]).cls).toBe("Ship Ship--warp");
      expect(n.props({ warp: true }).cls).toBe("Ship Ship--warp");
      fuzz((val) => expect(n.props({ warp: val }).cls).toBe("Ship"));
      expect(() => n.props("warp" as unknown as string[]).cls).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.props()}`).toThrow();
      expect(() => `${n.props(["warp"])}`).toThrow();
      expect(() => `${n.props({ warp: true })}`).toThrow();
      fuzz((val) => expect(() => `${n.props({ warp: val })}`).toThrow());

      // Allow optional explicit specification of base name:
      expect(n.Ship.props().c).toBe("Ship");
      expect(n.Ship.props(["warp"]).c).toBe("Ship Ship--warp");
      expect(n.Ship.props({ warp: true }).c).toBe("Ship Ship--warp");
      fuzz((val) => expect(n.Ship.props({ warp: val }).c).toBe("Ship"));
      expect(() => n.Ship.props("warp" as unknown as string[]).c).toThrow();
      //
      expect(() => `${n.Ship.props()}`).toThrow();
      expect(() => `${n.Ship.props(["warp"])}`).toThrow();
      expect(() => `${n.Ship.props({ warp: true })}`).toThrow();
      fuzz((val) => expect(() => `${n.Ship.props({ warp: val })}`).toThrow());
    });

    test("element classes", () => {
      // Test cls resolver (short version):
      expect(n.engine.props().c).toBe("Ship-engine");
      expect(n.engine.props(["warp"]).c).toBe("Ship-engine Ship-engine--warp");
      expect(n.engine.props({ warp: true }).c).toBe(
        "Ship-engine Ship-engine--warp"
      );
      fuzz((val) =>
        expect(n.engine.props({ warp: val }).c).toBe("Ship-engine")
      );
      expect(() => n.engine("warp" as unknown as string[]).c).toThrow();

      // Test cls resolver (verbose version):
      expect(n.engine.props().cls).toBe("Ship-engine");
      expect(n.engine.props(["warp"]).cls).toBe(
        "Ship-engine Ship-engine--warp"
      );
      expect(n.engine.props({ warp: true }).cls).toBe(
        "Ship-engine Ship-engine--warp"
      );
      fuzz((val) =>
        expect(n.engine.props({ warp: val }).cls).toBe("Ship-engine")
      );
      expect(() => n.engine.props("warp" as unknown as string[]).cls).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.engine.props()}`).toThrow();
      expect(() => `${n.engine.props(["warp"])}`).toThrow();
      expect(() => `${n.engine.props({ warp: true })}`).toThrow();
      fuzz((val) => expect(() => `${n.engine.props({ warp: val })}`).toThrow());

      expect(n.part.props().c).toBe("Ship-part");
      expect(n.part.props(["adrift"]).c).toBe("Ship-part Ship-part--adrift");
      expect(n.part.props({ adrift: true }).c).toBe(
        "Ship-part Ship-part--adrift"
      );
      fuzz((val) => expect(n.part.props({ adrift: val }).c).toBe("Ship-part"));
      expect(() => n.part.props("adrift" as unknown as string[]).c).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.part.props()}`).toThrow();
      expect(() => `${n.part.props(["adrift"])}`).toThrow();
      expect(() => `${n.part.props({ adrift: true })}`).toThrow();
      fuzz((val) => expect(() => `${n.part.props({ adrift: val })}`).toThrow());

      expect(n.Ship.engine.props().c).toBe("Ship-engine");
      expect(n.Ship.engine.props(["warp"]).c).toBe(
        "Ship-engine Ship-engine--warp"
      );
      expect(n.Ship.engine.props({ warp: true }).c).toBe(
        "Ship-engine Ship-engine--warp"
      );
      fuzz((val) =>
        expect(n.Ship.engine.props({ warp: val }).c).toBe("Ship-engine")
      );
      expect(
        () => n.Ship.engine.props("warp" as unknown as string[]).c
      ).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.engine.props()}`).toThrow();
      expect(() => `${n.Ship.engine.props(["warp"])}`).toThrow();
      expect(() => `${n.Ship.engine.props({ warp: true })}`).toThrow();
      fuzz((val) =>
        expect(() => `${n.Ship.engine.props({ warp: val })}`).toThrow()
      );

      expect(n.Ship.part.props().c).toBe("Ship-part");
      expect(n.Ship.part.props(["adrift"]).c).toBe(
        "Ship-part Ship-part--adrift"
      );
      expect(n.Ship.part.props({ adrift: true }).c).toBe(
        "Ship-part Ship-part--adrift"
      );
      fuzz((val) =>
        expect(n.Ship.part.props({ adrift: val }).c).toBe("Ship-part")
      );
      expect(
        () => n.Ship.part.props("adrift" as unknown as string[]).c
      ).toThrow();

      // Should throw: NSS expressions should never be cast directly to string.
      expect(() => `${n.Ship.part}`).toThrow();
      expect(() => `${n.Ship.part.props()}`).toThrow();
      expect(() => `${n.Ship.part.props(["adrift"])}`).toThrow();
      expect(() => `${n.Ship.part.props({ adrift: true })}`).toThrow();
      fuzz((val) =>
        expect(() => `${n.Ship.part.props({ adrift: val })}`).toThrow()
      );
    });

    test("case-insensitive (default)", () => {
      expect(n.props(["Warp"]).c).toBe("Ship Ship--warp");
      expect(n.props({ Warp: true }).c).toBe("Ship Ship--warp");
    });

    test("case-sensitive", () => {
      nss.configure({ caseSensitiveProps: true });
      expect(n.props(["Warp"]).c).toBe("Ship");
      expect(n.props({ Warp: true }).c).toBe("Ship");
      nss.configure({ caseSensitiveProps: false });
    });
  });

  describe.each([
    [
      "enum-based",
      BaseEnum,
      ElemEnum,
      CondEnum,
      BaseEnumMapped,
      ElemEnumMapped,
      CondEnumMapped,
    ],
    [
      "object-based",
      BaseObj,
      ElemObj,
      CondObj,
      BaseObjMapped,
      ElemObjMapped,
      CondObjMapped,
    ],
  ])(
    "omission :: %s",
    (_, Base, Elem, Cond, BaseMapped, ElemMapped, CondMapped) => {
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

        expect(n.warp(true).adrift().c).toBe("warp jkl adrift mno");
        expect(n.warp(true).adrift(false).c).toBe("warp jkl");
        expect(n.adrift().warp("9").adrift(0).c).toBe("adrift mno warp jkl");
        expect(n.part.warp(true).adrift().c).toBe(
          "part ghi part--warp jkl part--adrift mno"
        );
        expect(n.part.warp(true).adrift(false).c).toBe(
          "part ghi part--warp jkl"
        );
        expect(n.part.adrift().warp("9").adrift(0).c).toBe(
          "part ghi part--adrift mno part--warp jkl"
        );
      });

      test("omit elements", () => {
        const n = nss<typeof BaseMapped, object, typeof CondMapped>(
          BaseMapped,
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

        expect(n.warp(true).adrift().c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n.warp(true).adrift(false).c).toBe("Ship abc Ship--warp jkl");
        expect(n.adrift().warp("9").adrift(0).c).toBe(
          "Ship abc Ship--adrift mno Ship--warp jkl"
        );
        expect(n.Ship.warp(true).adrift().c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        expect(n.Ship.warp(true).adrift(false).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(n.Ship.adrift().warp("9").adrift(0).c).toBe(
          "Ship abc Ship--adrift mno Ship--warp jkl"
        );
      });

      test("omit elements + class mappings via map object", () => {
        const n = nss<typeof Base, object, typeof Cond>(Base, null, Cond, {
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

        expect(n.warp(true).adrift().c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift"
        );
        expect(n.warp(true).adrift(false).c).toBe("Ship abc Ship--warp jkl");
        expect(n.adrift().warp("9").adrift(0).c).toBe(
          "Ship abc Ship--adrift Ship--warp jkl"
        );
        expect(n.Ship.warp(true).adrift().c).toBe(
          "Ship abc Ship--warp jkl Ship--adrift"
        );
        expect(n.Ship.warp(true).adrift(false).c).toBe(
          "Ship abc Ship--warp jkl"
        );
        expect(n.Ship.adrift().warp("9").adrift(0).c).toBe(
          "Ship abc Ship--adrift Ship--warp jkl"
        );
      });

      test("omit conditionals", () => {
        const n = nss<typeof BaseMapped, typeof ElemMapped>(
          BaseMapped,
          ElemMapped
        );

        expect(n.c).toBe("Ship abc");
        expect(n.engine.c).toBe("Ship-engine def");
        expect(n.part.c).toBe("Ship-part ghi");
        expect(n.Ship.c).toBe("Ship abc");
        expect(n.Ship.engine.c).toBe("Ship-engine def");
        expect(n.Ship.part.c).toBe("Ship-part ghi");
      });

      test("omit conditionals + class mappings via map object", () => {
        const n = nss<typeof Base, typeof Elem>(Base, Elem, null, {
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
      });
    }
  );

  describe.each([
    ["enum-based", BaseEnumMapped, ElemEnumMapped, CondEnumMapped],
    ["object-based", BaseObjMapped, ElemObjMapped, CondObjMapped],
  ])("configuration :: %s", (_, Base, Elem, Cond) => {
    afterEach(() => {
      nss.configure(null);
    });

    test("separators", () => {
      nss.configure({
        separator: "_",
      });

      let n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      expect(n.c).toBe("Ship abc");
      expect(n().c).toBe("Ship abc");

      expect(n.engine.c).toBe("Ship_engine def");
      expect(n.engine().c).toBe("Ship_engine def");

      expect(n.part.c).toBe("Ship_part ghi");
      expect(n.part().c).toBe("Ship_part ghi");

      expect(n.warp.c /*-------------*/).toBe("Ship abc Ship__warp jkl");
      expect(n.warp().c /*-----------*/).toBe("Ship abc Ship__warp jkl");
      expect(n.warp(true).c /*-------*/).toBe("Ship abc Ship__warp jkl");
      expect(n.warp(false).c /*------*/).toBe("Ship abc");

      expect(n.part.warp.c /*------*/).toBe(
        "Ship_part ghi Ship_part__warp jkl"
      );
      expect(n.part.warp().c /*------*/).toBe(
        "Ship_part ghi Ship_part__warp jkl"
      );
      expect(n.part.warp(true).c /*--*/).toBe(
        "Ship_part ghi Ship_part__warp jkl"
      );
      expect(n.part.warp(false).c /*-*/).toBe("Ship_part ghi");

      expect(n.Ship.c).toBe("Ship abc");
      expect(n.Ship().c).toBe("Ship abc");

      expect(n.Ship.engine.c).toBe("Ship_engine def");
      expect(n.Ship.engine().c).toBe("Ship_engine def");

      expect(n.Ship.part.c).toBe("Ship_part ghi");
      expect(n.Ship.part().c).toBe("Ship_part ghi");

      expect(n.Ship.warp.c /*-------------*/).toBe("Ship abc Ship__warp jkl");
      expect(n.Ship.warp().c /*-----------*/).toBe("Ship abc Ship__warp jkl");
      expect(n.Ship.warp(true).c /*-------*/).toBe("Ship abc Ship__warp jkl");
      expect(n.Ship.warp(false).c /*------*/).toBe("Ship abc");

      expect(n.Ship.part.warp.c).toBe("Ship_part ghi Ship_part__warp jkl");
      expect(n.Ship.part.warp().c).toBe("Ship_part ghi Ship_part__warp jkl");
      expect(n.Ship.part.warp(true).c).toBe(
        "Ship_part ghi Ship_part__warp jkl"
      );
      expect(n.Ship.part.warp(false).c).toBe("Ship_part ghi");

      nss.configure({
        separator: "..",
      });

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      expect(n.c).toBe("Ship abc");
      expect(n().c).toBe("Ship abc");

      expect(n.engine.c).toBe("Ship..engine def");
      expect(n.engine().c).toBe("Ship..engine def");

      expect(n.part.c).toBe("Ship..part ghi");
      expect(n.part().c).toBe("Ship..part ghi");

      expect(n.warp.c /*-------------*/).toBe("Ship abc Ship....warp jkl");
      expect(n.warp().c /*-----------*/).toBe("Ship abc Ship....warp jkl");
      expect(n.warp(true).c /*-------*/).toBe("Ship abc Ship....warp jkl");
      expect(n.warp(false).c /*------*/).toBe("Ship abc");

      expect(n.part.warp.c /*------*/).toBe(
        "Ship..part ghi Ship..part....warp jkl"
      );
      expect(n.part.warp().c /*------*/).toBe(
        "Ship..part ghi Ship..part....warp jkl"
      );
      expect(n.part.warp(true).c /*--*/).toBe(
        "Ship..part ghi Ship..part....warp jkl"
      );
      expect(n.part.warp(false).c /*-*/).toBe("Ship..part ghi");

      expect(n.Ship.c).toBe("Ship abc");
      expect(n.Ship().c).toBe("Ship abc");

      expect(n.Ship.engine.c).toBe("Ship..engine def");
      expect(n.Ship.engine().c).toBe("Ship..engine def");

      expect(n.Ship.part.c).toBe("Ship..part ghi");
      expect(n.Ship.part().c).toBe("Ship..part ghi");

      expect(n.Ship.warp.c /*-------------*/).toBe("Ship abc Ship....warp jkl");
      expect(n.Ship.warp().c /*-----------*/).toBe("Ship abc Ship....warp jkl");
      expect(n.Ship.warp(true).c /*-------*/).toBe("Ship abc Ship....warp jkl");
      expect(n.Ship.warp(false).c /*------*/).toBe("Ship abc");

      expect(n.Ship.part.warp.c).toBe("Ship..part ghi Ship..part....warp jkl");
      expect(n.Ship.part.warp().c).toBe(
        "Ship..part ghi Ship..part....warp jkl"
      );
      expect(n.Ship.part.warp(true).c).toBe(
        "Ship..part ghi Ship..part....warp jkl"
      );
      expect(n.Ship.part.warp(false).c).toBe("Ship..part ghi");

      nss.configure({
        elementSeparator: "__",
        conditionalSeparator: ":::",
      });

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

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

      expect(n.Ship.part.warp().adrift.c).toBe(
        "Ship__part ghi Ship__part:::warp jkl Ship__part:::adrift mno"
      );
      expect(n.Ship.part.warp(0).adrift("at space").c).toBe(
        "Ship__part ghi Ship__part:::adrift mno"
      );
      expect(n.Ship.part.warp(false).adrift(false).c).toBe("Ship__part ghi");
    });

    test("reset", () => {
      nss.configure({
        separator: "_",
      });

      let n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      expect(n.warp.c /*-------------*/).toBe("Ship abc Ship__warp jkl");
      expect(n.warp().c /*-----------*/).toBe("Ship abc Ship__warp jkl");
      expect(n.part.warp().c).toBe("Ship_part ghi Ship_part__warp jkl");
      expect(n.part.warp(true).c).toBe("Ship_part ghi Ship_part__warp jkl");
      expect(n.Ship.part.warp.c).toBe("Ship_part ghi Ship_part__warp jkl");
      expect(n.Ship.part.warp(false).c).toBe("Ship_part ghi");

      nss.configure(null);

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      expect(n.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
      expect(n.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
      expect(n.part.warp().c).toBe("Ship-part ghi Ship-part--warp jkl");
      expect(n.part.warp(true).c).toBe("Ship-part ghi Ship-part--warp jkl");
      expect(n.Ship.part.warp.c).toBe("Ship-part ghi Ship-part--warp jkl");
      expect(n.Ship.part.warp(false).c).toBe("Ship-part ghi");

      nss.configure({
        elementSeparator: "__",
        conditionalSeparator: ":::",
      });

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      expect(n.warp.c /*-------------*/).toBe("Ship abc Ship:::warp jkl");
      expect(n.warp().c /*-----------*/).toBe("Ship abc Ship:::warp jkl");
      expect(n.part.warp().c).toBe("Ship__part ghi Ship__part:::warp jkl");
      expect(n.part.warp(true).c).toBe("Ship__part ghi Ship__part:::warp jkl");
      expect(n.Ship.part.warp.c).toBe("Ship__part ghi Ship__part:::warp jkl");
      expect(n.Ship.part.warp(false).c).toBe("Ship__part ghi");

      nss.configure(null);

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      expect(n.warp.c /*-------------*/).toBe("Ship abc Ship--warp jkl");
      expect(n.warp().c /*-----------*/).toBe("Ship abc Ship--warp jkl");
      expect(n.part.warp().c).toBe("Ship-part ghi Ship-part--warp jkl");
      expect(n.part.warp(true).c).toBe("Ship-part ghi Ship-part--warp jkl");
      expect(n.Ship.part.warp.c).toBe("Ship-part ghi Ship-part--warp jkl");
      expect(n.Ship.part.warp(false).c).toBe("Ship-part ghi");
    });
  });
});
