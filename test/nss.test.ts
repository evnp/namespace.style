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

function check(n: any, cls: string) {
  expect(n.c).toBe(cls);
  expect(n.cls).toBe(cls);
  if (nss.isBase(n)) {
    expect(nss.isBase(n.parent)).toBe(true);
    expect(n.value).toBe(cls.split(" ")[0]);
    expect(n.name).toBe(n.name ? cls.split(" ")[0] : null);
  } else if (nss.isElem(n)) {
    expect(nss.isBase(n.parent)).toBe(true);
    expect(n.value).toBe(cls.split(" ")[0]);
    expect(n.name).toBe(
      cls
        .split(" ")[0]
        .split(/[^a-zA-Z0-9]+/)
        .slice(-1)[0]
    );
  } else if (nss.isCond(n)) {
    expect(nss.isBase(n.parent) || nss.isElem(n.parent)).toBe(true);
    if (nss.isElem(n.parent)) {
      expect(nss.isBase(n.parent.parent)).toBe(true);
    }
    if (!n.off) {
      if (n.mapped) {
        expect(n.mapped).toBe(cls.split(" ").slice(-1)[0]);
        expect(n.value).toBe(cls.split(" ").slice(-2)[0]);
        expect(n.name).toBe(
          cls
            .split(" ")
            .slice(-2)[0]
            .split(/[^a-zA-Z0-9]+/)
            .slice(-1)[0]
        );
      } else {
        expect(n.value).toBe(cls.split(" ").slice(-1)[0]);
        expect(n.name).toBe(
          cls
            .split(" ")
            .slice(-1)[0]
            .split(/[^a-zA-Z0-9]+/)
            .slice(-1)[0]
        );
      }
    }
  } else {
    throw new Error("check n arg must be an NSS Base, Elem, or Cond object");
  }
  // Should throw -- NSS expressions should never be cast directly to string:
  expect(() => n.toString()).toThrow();
  expect(() => `${n}`).toThrow();
}

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
      check(n, "Ship");
      check(n(), "Ship");
      check(n(["enterprise"]), "Ship Ship--enterprise");
      check(n({ enterprise: true }), "Ship Ship--enterprise");
      expect(() => n("enterprise" as unknown as string[]).c).toThrow();
      expect(() => n("enterprise" as unknown as string[]).cls).toThrow();
      // We don't allow passing bare strings because that would make it too easy
      // to inadvertantly pass something like n.damaged.s resulting in bad class.
      // This is tough to detect automatically if we allow any string to be passed.

      // Allow optional explicit specification of base name:
      check(n.Ship, "Ship");
      check(n.Ship(), "Ship");
      check(n.Ship(["enterprise"]), "Ship Ship--enterprise");
      check(n.Ship({ enterprise: true }), "Ship Ship--enterprise");
      expect(() => n.Ship("enterprise" as unknown as string[]).c).toThrow();
    });

    test("element classes", () => {
      // Test cls resolver (short version):
      check(n.engine, "Ship-engine");
      check(n.engine(), "Ship-engine");
      check(n.engine(["nacelle"]), "Ship-engine Ship-engine--nacelle");
      check(n.engine({ nacelle: true }), "Ship-engine Ship-engine--nacelle");
      expect(() => n.engine("nacelle" as unknown as string[]).c).toThrow();
      expect(() => n.engine("nacelle" as unknown as string[]).cls).toThrow();

      check(n.part, "Ship-part");
      check(n.part(), "Ship-part");
      check(n.part(["warpDrive"]), "Ship-part Ship-part--warpDrive");
      check(n.part({ warpDrive: true }), "Ship-part Ship-part--warpDrive");
      expect(() => n.part("warpDrive" as unknown as string[]).c).toThrow();

      check(n.Ship.engine, "Ship-engine");
      check(n.Ship.engine(), "Ship-engine");
      check(n.Ship.engine(["nacelle"]), "Ship-engine Ship-engine--nacelle");
      check(
        n.Ship.engine({ nacelle: true }),
        "Ship-engine Ship-engine--nacelle"
      );
      expect(() => n.Ship.engine("nacelle" as unknown as string[]).c).toThrow();

      check(n.Ship.part, "Ship-part");
      check(n.Ship.part(), "Ship-part");
      check(n.Ship.part(["warpDrive"]), "Ship-part Ship-part--warpDrive");
      check(n.Ship.part({ warpDrive: true }), "Ship-part Ship-part--warpDrive");
      expect(() => n.Ship.part("warpDrive" as unknown as string[]).c).toThrow();
    });

    test("conditional classes", () => {
      // Test cls resolver (short version):
      check(n.warp, "Ship Ship--warp");
      check(n.warp(), "Ship Ship--warp");

      check(n.warp(true), "Ship Ship--warp");
      check(n.warp(false), "Ship");
      check(n.warp(0), "Ship");
      check(n.warp(1), "Ship Ship--warp");
      check(n.warp(null), "Ship");
      check(n.warp(undefined), "Ship");
      check(n.warp("klingon"), "Ship Ship--warp");
      check(n.warp(""), "Ship");

      check(n.adrift, "Ship Ship--adrift");
      check(n.adrift(), "Ship Ship--adrift");

      check(n.adrift(true), "Ship Ship--adrift");
      check(n.adrift(false), "Ship");
      check(n.adrift(0), "Ship");
      check(n.adrift(1), "Ship Ship--adrift");
      check(n.adrift(null), "Ship");
      check(n.adrift(undefined), "Ship");
      check(n.adrift("damaged"), "Ship Ship--adrift");
      check(n.adrift(""), "Ship");

      check(n.Ship.warp, "Ship Ship--warp");
      check(n.Ship.warp(), "Ship Ship--warp");

      check(n.Ship.warp(true), "Ship Ship--warp");
      check(n.Ship.warp(false), "Ship");

      check(n.Ship.adrift, "Ship Ship--adrift");
      check(n.Ship.adrift(), "Ship Ship--adrift");

      check(n.Ship.adrift(true), "Ship Ship--adrift");
      check(n.Ship.adrift(false), "Ship");
    });

    test("element conditional classes", () => {
      // Test cls resolver (short version):
      check(n.part.warp, "Ship-part Ship-part--warp");
      check(n.part.warp(), "Ship-part Ship-part--warp");
      check(n.part.warp(true), "Ship-part Ship-part--warp");
      check(n.part.warp(false), "Ship-part");
      check(n.part.warp(0), "Ship-part");
      check(n.part.warp(1), "Ship-part Ship-part--warp");
      check(n.part.warp(null), "Ship-part");
      check(n.part.warp(undefined), "Ship-part");
      check(n.part.warp("klingon"), "Ship-part Ship-part--warp");
      check(n.part.warp(""), "Ship-part");

      check(n.part.adrift, "Ship-part Ship-part--adrift");
      check(n.part.adrift(), "Ship-part Ship-part--adrift");
      check(n.part.adrift(true), "Ship-part Ship-part--adrift");
      check(n.part.adrift(false), "Ship-part");
      check(n.part.adrift(0), "Ship-part");
      check(n.part.adrift(1), "Ship-part Ship-part--adrift");
      check(n.part.adrift(null), "Ship-part");
      check(n.part.adrift(undefined), "Ship-part");
      check(n.part.adrift("klingon"), "Ship-part Ship-part--adrift");
      check(n.part.adrift(""), "Ship-part");

      check(n.Ship.part.warp, "Ship-part Ship-part--warp");
      check(n.Ship.part.warp(), "Ship-part Ship-part--warp");
      check(n.Ship.part.warp(true), "Ship-part Ship-part--warp");
      check(n.Ship.part.warp(false), "Ship-part");

      check(n.Ship.part.adrift, "Ship-part Ship-part--adrift");
      check(n.Ship.part.adrift(), "Ship-part Ship-part--adrift");
      check(n.Ship.part.adrift(true), "Ship-part Ship-part--adrift");
      check(n.Ship.part.adrift(false), "Ship-part");
    });

    test("conditional class composition :: base class", () => {
      check(n(n.warp, n.adrift), "Ship Ship--warp Ship--adrift");

      // Equivalent to above:
      check(n(n.warp(), n.adrift()), "Ship Ship--warp Ship--adrift");

      // Invalid due to string being passed directly:
      expect(
        () =>
          n(
            n.warp().c as unknown as string[],
            n.adrift().c as unknown as string[]
          ).c
      ).toThrow();

      check(n(n.warp(true), n.adrift(true)), "Ship Ship--warp Ship--adrift");
      check(n(n.warp(true), n.adrift(false)), "Ship Ship--warp");
      check(n(n.warp(false), n.adrift(false)), "Ship");
      check(n(n.warp(0), n.adrift("at space")), "Ship Ship--adrift");

      // Equivalent to above (object composition):
      check(n({ warp: true, adrift: true }), "Ship Ship--warp Ship--adrift");
      check(n({ warp: true, adrift: false }), "Ship Ship--warp");
      check(n({ warp: false, adrift: false }), "Ship");
      check(n({ warp: 0, adrift: "at space" }), "Ship Ship--adrift");
    });

    test("conditional class composition :: element class", () => {
      check(
        n.part(n.warp, n.adrift),
        "Ship-part Ship-part--warp Ship-part--adrift"
      );

      // Equivalent to above:
      check(
        n.part(n.warp(), n.adrift()),
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

      check(
        n.part(n.warp(true), n.adrift(true)),
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      check(n.part(n.warp(true), n.adrift(false)), "Ship-part Ship-part--warp");
      check(n.part(n.warp(false), n.adrift(false)), "Ship-part");
      check(
        n.part(n.warp(0), n.adrift("at space")),
        "Ship-part Ship-part--adrift"
      );

      // Equivalent to above (object composition):
      check(
        n.part({ warp: true, adrift: true }),
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      check(n.part({ warp: true, adrift: false }), "Ship-part Ship-part--warp");
      check(n.part({ warp: false, adrift: false }), "Ship-part");
      check(
        n.part({ warp: 0, adrift: "at space" }),
        "Ship-part Ship-part--adrift"
      );
    });

    test("chained conditionals :: base class", () => {
      check(n.warp().adrift(), "Ship Ship--warp Ship--adrift");

      // Equivalent to above (but shouldn't generally be used):
      check(n.warp().adrift, "Ship Ship--warp Ship--adrift");

      check(n.warp(true).adrift(true), "Ship Ship--warp Ship--adrift");
      check(n.warp(true).adrift(false), "Ship Ship--warp");
      check(n.warp(false).adrift(false), "Ship");
      check(n.warp(0).adrift("at space"), "Ship Ship--adrift");

      // Triple chain: false cond does not negate true cond
      // TODO Consider fixing this in the future
      check(
        n.warp(true).adrift(true).warp(false),
        "Ship Ship--warp Ship--adrift"
      );
      // Triple chain: duplicate cond results in duplicate class
      // TODO Consider fixing this in the future
      check(
        n.warp(true).adrift(true).warp(true),
        "Ship Ship--warp Ship--adrift Ship--warp"
      );

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
      check(
        n.part.warp().adrift(),
        "Ship-part Ship-part--warp Ship-part--adrift"
      );

      // Equivalent to above (but shouldn't generally be used):
      check(
        n.part.warp().adrift,
        "Ship-part Ship-part--warp Ship-part--adrift"
      );

      check(
        n.part.warp(true).adrift(true),
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      check(n.part.warp(true).adrift(false), "Ship-part Ship-part--warp");
      check(n.part.warp(false).adrift(false), "Ship-part");
      check(n.part.warp(0).adrift("at space"), "Ship-part Ship-part--adrift");

      // Triple chain: false cond does not negate true cond
      // TODO Consider fixing this in the future
      check(
        n.part.warp(true).adrift(true).warp(false),
        "Ship-part Ship-part--warp Ship-part--adrift"
      );
      // Triple chain: duplicate cond results in duplicate class
      // TODO Consider fixing this in the future
      check(
        n.part.warp(true).adrift(true).warp(true),
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
        check(n, "Ship abc");
        check(n(), "Ship abc");

        check(n.engine, "Ship-engine def");
        check(n.engine(), "Ship-engine def");

        check(n.part, "Ship-part ghi");
        check(n.part(), "Ship-part ghi");

        check(n.warp, "Ship abc Ship--warp jkl");
        check(n.warp(), "Ship abc Ship--warp jkl");
        check(n.warp(true), "Ship abc Ship--warp jkl");
        check(n.warp(false), "Ship abc");

        check(n.part.warp, "Ship-part ghi Ship-part--warp jkl");
        check(n.part.warp(), "Ship-part ghi Ship-part--warp jkl");
        check(n.part.warp(true), "Ship-part ghi Ship-part--warp jkl");
        check(n.part.warp(false), "Ship-part ghi");

        check(n.Ship, "Ship abc");
        check(n.Ship(), "Ship abc");

        check(n.Ship.engine, "Ship-engine def");
        check(n.Ship.engine(), "Ship-engine def");

        check(n.Ship.part, "Ship-part ghi");
        check(n.Ship.part(), "Ship-part ghi");

        check(n.Ship.warp, "Ship abc Ship--warp jkl");
        check(n.Ship.warp(), "Ship abc Ship--warp jkl");
        check(n.Ship.warp(true), "Ship abc Ship--warp jkl");
        check(n.Ship.warp(false), "Ship abc");

        check(n.Ship.part.warp, "Ship-part ghi Ship-part--warp jkl");
        check(n.Ship.part.warp(), "Ship-part ghi Ship-part--warp jkl");
        check(n.Ship.part.warp(true), "Ship-part ghi Ship-part--warp jkl");
        check(n.Ship.part.warp(false), "Ship-part ghi");
      }

      function verifyCompositionalForms(n: any) {
        check(n(n.warp, n.adrift), "Ship abc Ship--warp jkl Ship--adrift mno");
        check(
          n(n.warp(), n.adrift()),
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );

        check(
          n(n.warp(true), n.adrift(true)),
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        check(n(n.warp(true), n.adrift(false)), "Ship abc Ship--warp jkl");
        check(n(n.warp(false), n.adrift(false)), "Ship abc");
        check(n(n.warp(0), n.adrift("at space")), "Ship abc Ship--adrift mno");

        check(
          n({ warp: true, adrift: true }),
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        check(n({ warp: true, adrift: false }), "Ship abc Ship--warp jkl");
        check(n({ warp: false, adrift: false }), "Ship abc");
        check(n({ warp: 0, adrift: "at space" }), "Ship abc Ship--adrift mno");

        check(
          n.part(n.warp, n.adrift),
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        check(
          n.part(n.warp(), n.adrift()),
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );

        check(
          n.part(n.warp(true), n.adrift(true)),
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        check(
          n.part(n.warp(true), n.adrift(false)),
          "Ship-part ghi Ship-part--warp jkl"
        );
        check(n.part(n.warp(false), n.adrift(false)), "Ship-part ghi");
        check(
          n.part(n.warp(0), n.adrift("at space")),
          "Ship-part ghi Ship-part--adrift mno"
        );

        check(
          n.part({ warp: true, adrift: true }),
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        check(
          n.part({ warp: true, adrift: false }),
          "Ship-part ghi Ship-part--warp jkl"
        );
        check(n.part({ warp: false, adrift: false }), "Ship-part ghi");
        check(
          n.part({ warp: 0, adrift: "at space" }),
          "Ship-part ghi Ship-part--adrift mno"
        );
      }

      function verifyChainedForms(n: any) {
        check(n.warp().adrift(), "Ship abc Ship--warp jkl Ship--adrift mno");
        // Equivalent to above (but shouldn't generally be used):
        check(n.warp().adrift, "Ship abc Ship--warp jkl Ship--adrift mno");
        check(
          n.warp(true).adrift(true),
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        check(n.warp(true).adrift(false), "Ship abc Ship--warp jkl");
        check(n.warp(false).adrift(false), "Ship abc");
        check(n.warp(0).adrift("at space"), "Ship abc Ship--adrift mno");

        check(
          n.part.warp().adrift(),
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        // Equivalent to above (but shouldn't generally be used):
        check(
          n.part.warp().adrift,
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        check(
          n.part.warp(true).adrift(true),
          "Ship-part ghi Ship-part--warp jkl Ship-part--adrift mno"
        );
        check(
          n.part.warp(true).adrift(false),
          "Ship-part ghi Ship-part--warp jkl"
        );
        check(n.part.warp(false).adrift(false), "Ship-part ghi");
        check(
          n.part.warp(0).adrift("at space"),
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
      check(n.props(), "Ship");
      check(n.props(["warp"]), "Ship Ship--warp");
      check(n.props({ warp: true }), "Ship Ship--warp");
      fuzz((val) => check(n.props({ warp: val }), "Ship"));
      expect(() => n.props("warp" as unknown as string[]).c).toThrow();

      // Allow optional explicit specification of base name:
      check(n.Ship.props(), "Ship");
      check(n.Ship.props(["warp"]), "Ship Ship--warp");
      check(n.Ship.props({ warp: true }), "Ship Ship--warp");
      fuzz((val) => check(n.Ship.props({ warp: val }), "Ship"));
      expect(() => n.Ship.props("warp" as unknown as string[]).c).toThrow();
    });

    test("element classes", () => {
      // Test cls resolver (short version):
      check(n.engine.props(), "Ship-engine");
      check(n.engine.props(["warp"]), "Ship-engine Ship-engine--warp");
      check(n.engine.props({ warp: true }), "Ship-engine Ship-engine--warp");
      fuzz((val) => check(n.engine.props({ warp: val }), "Ship-engine"));
      expect(() => n.engine("warp" as unknown as string[]).c).toThrow();
      expect(() => n.engine.props("warp" as unknown as string[]).cls).toThrow();

      check(n.part.props(), "Ship-part");
      check(n.part.props(["adrift"]), "Ship-part Ship-part--adrift");
      check(n.part.props({ adrift: true }), "Ship-part Ship-part--adrift");
      fuzz((val) => check(n.part.props({ adrift: val }), "Ship-part"));
      expect(() => n.part.props("adrift" as unknown as string[]).c).toThrow();

      check(n.Ship.engine.props(), "Ship-engine");
      check(n.Ship.engine.props(["warp"]), "Ship-engine Ship-engine--warp");
      check(
        n.Ship.engine.props({ warp: true }),
        "Ship-engine Ship-engine--warp"
      );
      fuzz((val) => check(n.Ship.engine.props({ warp: val }), "Ship-engine"));
      expect(
        () => n.Ship.engine.props("warp" as unknown as string[]).c
      ).toThrow();

      check(n.Ship.part.props(), "Ship-part");
      check(n.Ship.part.props(["adrift"]), "Ship-part Ship-part--adrift");
      check(n.Ship.part.props({ adrift: true }), "Ship-part Ship-part--adrift");
      fuzz((val) =>
        expect(n.Ship.part.props({ adrift: val }).c).toBe("Ship-part")
      );
      expect(
        () => n.Ship.part.props("adrift" as unknown as string[]).c
      ).toThrow();
    });

    test("case-insensitive (default)", () => {
      check(n.props(["Warp"]), "Ship Ship--warp");
      check(n.props({ Warp: true }), "Ship Ship--warp");
    });

    test("case-sensitive", () => {
      nss.configure({ caseSensitiveProps: true });
      check(n.props(["Warp"]), "Ship");
      check(n.props({ Warp: true }), "Ship");
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

        check(n, "");
        check(n.engine, "engine def");
        check(n.part, "part ghi");
        check(n.warp, "warp jkl");
        check(n.warp(), "warp jkl");
        check(n.warp(true), "warp jkl");
        check(n.warp(false), "");
        check(n.part.warp, "part ghi part--warp jkl");
        check(n.part.warp(), "part ghi part--warp jkl");
        check(n.part.warp(true), "part ghi part--warp jkl");
        check(n.part.warp(false), "part ghi");

        check(n.warp(true).adrift(), "warp jkl adrift mno");
        check(n.warp(true).adrift(false), "warp jkl");
        check(n.adrift().warp("9").adrift(0), "adrift mno warp jkl");
        check(
          n.part.warp(true).adrift(),
          "part ghi part--warp jkl part--adrift mno"
        );
        check(n.part.warp(true).adrift(false), "part ghi part--warp jkl");
        check(
          n.part.adrift().warp("9").adrift(0),
          "part ghi part--adrift mno part--warp jkl"
        );
      });

      test("omit elements", () => {
        const n = nss<typeof BaseMapped, object, typeof CondMapped>(
          BaseMapped,
          null,
          CondMapped
        );

        check(n, "Ship abc");
        check(n.Ship, "Ship abc");
        check(n.warp, "Ship abc Ship--warp jkl");
        check(n.warp(), "Ship abc Ship--warp jkl");
        check(n.adrift(true), "Ship abc Ship--adrift mno");
        check(n.adrift(false), "Ship abc");
        check(n.Ship.warp, "Ship abc Ship--warp jkl");
        check(n.Ship.warp(), "Ship abc Ship--warp jkl");
        check(n.Ship.adrift(true), "Ship abc Ship--adrift mno");
        check(n.Ship.adrift(false), "Ship abc");

        check(
          n.warp(true).adrift(),
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        check(n.warp(true).adrift(false), "Ship abc Ship--warp jkl");
        check(
          n.adrift().warp("9").adrift(0),
          "Ship abc Ship--adrift mno Ship--warp jkl"
        );
        check(
          n.Ship.warp(true).adrift(),
          "Ship abc Ship--warp jkl Ship--adrift mno"
        );
        check(n.Ship.warp(true).adrift(false), "Ship abc Ship--warp jkl");
        check(
          n.Ship.adrift().warp("9").adrift(0),
          "Ship abc Ship--adrift mno Ship--warp jkl"
        );
      });

      test("omit elements + class mappings via map object", () => {
        const n = nss<typeof Base, object, typeof Cond>(Base, null, Cond, {
          Ship: "abc",
          warp: "jkl",
          // adrift omitted -- custom classes should be optional
        });

        check(n, "Ship abc");
        check(n.Ship, "Ship abc");
        check(n.warp, "Ship abc Ship--warp jkl");
        check(n.warp(), "Ship abc Ship--warp jkl");
        check(n.adrift(true), "Ship abc Ship--adrift");
        check(n.adrift(false), "Ship abc");
        check(n.Ship.warp, "Ship abc Ship--warp jkl");
        check(n.Ship.warp(), "Ship abc Ship--warp jkl");
        check(n.Ship.adrift(true), "Ship abc Ship--adrift");
        check(n.Ship.adrift(false), "Ship abc");

        check(n.warp(true).adrift(), "Ship abc Ship--warp jkl Ship--adrift");
        check(n.warp(true).adrift(false), "Ship abc Ship--warp jkl");
        check(
          n.adrift().warp("9").adrift(0),
          "Ship abc Ship--adrift Ship--warp jkl"
        );
        check(
          n.Ship.warp(true).adrift(),
          "Ship abc Ship--warp jkl Ship--adrift"
        );
        check(n.Ship.warp(true).adrift(false), "Ship abc Ship--warp jkl");
        check(
          n.Ship.adrift().warp("9").adrift(0),
          "Ship abc Ship--adrift Ship--warp jkl"
        );
      });

      test("omit conditionals", () => {
        const n = nss<typeof BaseMapped, typeof ElemMapped>(
          BaseMapped,
          ElemMapped
        );

        check(n, "Ship abc");
        check(n.engine, "Ship-engine def");
        check(n.part, "Ship-part ghi");
        check(n.Ship, "Ship abc");
        check(n.Ship.engine, "Ship-engine def");
        check(n.Ship.part, "Ship-part ghi");
      });

      test("omit conditionals + class mappings via map object", () => {
        const n = nss<typeof Base, typeof Elem>(Base, Elem, null, {
          Ship: "abc",
          engine: "def",
          part: "ghi",
        });

        check(n, "Ship abc");
        check(n.engine, "Ship-engine def");
        check(n.part, "Ship-part ghi");
        check(n.Ship, "Ship abc");
        check(n.Ship.engine, "Ship-engine def");
        check(n.Ship.part, "Ship-part ghi");
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

      check(n, "Ship abc");
      check(n(), "Ship abc");

      check(n.engine, "Ship_engine def");
      check(n.engine(), "Ship_engine def");

      check(n.part, "Ship_part ghi");
      check(n.part(), "Ship_part ghi");

      check(n.warp, "Ship abc Ship__warp jkl");
      check(n.warp(), "Ship abc Ship__warp jkl");
      check(n.warp(true), "Ship abc Ship__warp jkl");
      check(n.warp(false), "Ship abc");

      check(n.part.warp, "Ship_part ghi Ship_part__warp jkl");
      check(n.part.warp(), "Ship_part ghi Ship_part__warp jkl");
      check(n.part.warp(true), "Ship_part ghi Ship_part__warp jkl");
      check(n.part.warp(false), "Ship_part ghi");

      check(n.Ship, "Ship abc");
      check(n.Ship(), "Ship abc");

      check(n.Ship.engine, "Ship_engine def");
      check(n.Ship.engine(), "Ship_engine def");

      check(n.Ship.part, "Ship_part ghi");
      check(n.Ship.part(), "Ship_part ghi");

      check(n.Ship.warp, "Ship abc Ship__warp jkl");
      check(n.Ship.warp(), "Ship abc Ship__warp jkl");
      check(n.Ship.warp(true), "Ship abc Ship__warp jkl");
      check(n.Ship.warp(false), "Ship abc");

      check(n.Ship.part.warp, "Ship_part ghi Ship_part__warp jkl");
      check(n.Ship.part.warp(), "Ship_part ghi Ship_part__warp jkl");
      check(n.Ship.part.warp(true), "Ship_part ghi Ship_part__warp jkl");
      check(n.Ship.part.warp(false), "Ship_part ghi");

      nss.configure({
        separator: "..",
      });

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      check(n, "Ship abc");
      check(n(), "Ship abc");

      check(n.engine, "Ship..engine def");
      check(n.engine(), "Ship..engine def");

      check(n.part, "Ship..part ghi");
      check(n.part(), "Ship..part ghi");

      check(n.warp, "Ship abc Ship....warp jkl");
      check(n.warp(), "Ship abc Ship....warp jkl");
      check(n.warp(true), "Ship abc Ship....warp jkl");
      check(n.warp(false), "Ship abc");

      check(n.part.warp, "Ship..part ghi Ship..part....warp jkl");
      check(n.part.warp(), "Ship..part ghi Ship..part....warp jkl");
      check(n.part.warp(true), "Ship..part ghi Ship..part....warp jkl");
      check(n.part.warp(false), "Ship..part ghi");

      check(n.Ship, "Ship abc");
      check(n.Ship(), "Ship abc");

      check(n.Ship.engine, "Ship..engine def");
      check(n.Ship.engine(), "Ship..engine def");

      check(n.Ship.part, "Ship..part ghi");
      check(n.Ship.part(), "Ship..part ghi");

      check(n.Ship.warp, "Ship abc Ship....warp jkl");
      check(n.Ship.warp(), "Ship abc Ship....warp jkl");
      check(n.Ship.warp(true), "Ship abc Ship....warp jkl");
      check(n.Ship.warp(false), "Ship abc");

      check(n.Ship.part.warp, "Ship..part ghi Ship..part....warp jkl");
      check(n.Ship.part.warp(), "Ship..part ghi Ship..part....warp jkl");
      check(n.Ship.part.warp(true), "Ship..part ghi Ship..part....warp jkl");
      check(n.Ship.part.warp(false), "Ship..part ghi");

      nss.configure({
        elementSeparator: "__",
        conditionalSeparator: ":::",
      });

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      check(n, "Ship abc");
      check(n(), "Ship abc");

      check(n.engine, "Ship__engine def");
      check(n.engine(), "Ship__engine def");

      check(n.part, "Ship__part ghi");
      check(n.part(), "Ship__part ghi");

      check(n.warp, "Ship abc Ship:::warp jkl");
      check(n.warp(), "Ship abc Ship:::warp jkl");
      check(n.warp(true), "Ship abc Ship:::warp jkl");
      check(n.warp(false), "Ship abc");

      check(n.part.warp, "Ship__part ghi Ship__part:::warp jkl");
      check(n.part.warp(), "Ship__part ghi Ship__part:::warp jkl");
      check(n.part.warp(true), "Ship__part ghi Ship__part:::warp jkl");
      check(n.part.warp(false), "Ship__part ghi");

      check(n.Ship, "Ship abc");
      check(n.Ship(), "Ship abc");

      check(n.Ship.engine, "Ship__engine def");
      check(n.Ship.engine(), "Ship__engine def");

      check(n.Ship.part, "Ship__part ghi");
      check(n.Ship.part(), "Ship__part ghi");

      check(n.Ship.warp, "Ship abc Ship:::warp jkl");
      check(n.Ship.warp(), "Ship abc Ship:::warp jkl");
      check(n.Ship.warp(true), "Ship abc Ship:::warp jkl");
      check(n.Ship.warp(false), "Ship abc");

      check(n.Ship.part.warp, "Ship__part ghi Ship__part:::warp jkl");
      check(n.Ship.part.warp(), "Ship__part ghi Ship__part:::warp jkl");
      check(n.Ship.part.warp(true), "Ship__part ghi Ship__part:::warp jkl");
      check(n.Ship.part.warp(false), "Ship__part ghi");

      check(
        n.Ship.part.warp().adrift,
        "Ship__part ghi Ship__part:::warp jkl Ship__part:::adrift mno"
      );
      check(
        n.Ship.part.warp(0).adrift("at space"),
        "Ship__part ghi Ship__part:::adrift mno"
      );
      check(n.Ship.part.warp(false).adrift(false), "Ship__part ghi");
    });

    test("reset", () => {
      nss.configure({
        separator: "_",
      });

      let n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      check(n.warp, "Ship abc Ship__warp jkl");
      check(n.warp(), "Ship abc Ship__warp jkl");
      check(n.part.warp(), "Ship_part ghi Ship_part__warp jkl");
      check(n.part.warp(true), "Ship_part ghi Ship_part__warp jkl");
      check(n.Ship.part.warp, "Ship_part ghi Ship_part__warp jkl");
      check(n.Ship.part.warp(false), "Ship_part ghi");

      nss.configure(null);

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      check(n.warp, "Ship abc Ship--warp jkl");
      check(n.warp(), "Ship abc Ship--warp jkl");
      check(n.part.warp(), "Ship-part ghi Ship-part--warp jkl");
      check(n.part.warp(true), "Ship-part ghi Ship-part--warp jkl");
      check(n.Ship.part.warp, "Ship-part ghi Ship-part--warp jkl");
      check(n.Ship.part.warp(false), "Ship-part ghi");

      nss.configure({
        elementSeparator: "__",
        conditionalSeparator: ":::",
      });

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      check(n.warp, "Ship abc Ship:::warp jkl");
      check(n.warp(), "Ship abc Ship:::warp jkl");
      check(n.part.warp(), "Ship__part ghi Ship__part:::warp jkl");
      check(n.part.warp(true), "Ship__part ghi Ship__part:::warp jkl");
      check(n.Ship.part.warp, "Ship__part ghi Ship__part:::warp jkl");
      check(n.Ship.part.warp(false), "Ship__part ghi");

      nss.configure(null);

      n = nss<typeof Base, typeof Elem, typeof Cond>(Base, Elem, Cond);

      check(n.warp, "Ship abc Ship--warp jkl");
      check(n.warp(), "Ship abc Ship--warp jkl");
      check(n.part.warp(), "Ship-part ghi Ship-part--warp jkl");
      check(n.part.warp(true), "Ship-part ghi Ship-part--warp jkl");
      check(n.Ship.part.warp, "Ship-part ghi Ship-part--warp jkl");
      check(n.Ship.part.warp(false), "Ship-part ghi");
    });
  });
});
