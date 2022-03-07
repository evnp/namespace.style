export type ENSS<NameEnum, ElemEnum, CondEnum> = {
  [key in keyof NameEnum]: ENSSBaseFunc<ElemEnum, CondEnum>;
} & {
  mapClasses: () => ENSS<NameEnum, ElemEnum, CondEnum>;
} & ENSSBaseFunc<ElemEnum, CondEnum>;

export type ENSSResolvers = {
  c: string;
  class: string;
  s: string;
  string: string;
};

export type ENSSBase<ElemEnum, CondEnum> = ENSSElem<ElemEnum, CondEnum> &
  ENSSCond<CondEnum>;

export type ENSSElem<ElemEnum, CondEnum> = {
  [key in keyof ElemEnum]: ENSSElemFunc<ElemEnum, CondEnum>;
} & ENSSResolvers;

export type ENSSCond<CondEnum> = {
  [key in keyof CondEnum]: ENSSCondFunc<CondEnum>;
} & ENSSResolvers;

export type ENSSBaseFunc<ElemEnum, CondEnum> = ENSSBase<ElemEnum, CondEnum> &
  ((...args: ENSSArg<ElemEnum, CondEnum>[]) => ENSSElem<CondEnum, ElemEnum>);

export type ENSSElemFunc<ElemEnum, CondEnum> = ENSSCond<CondEnum> &
  ((...args: ENSSArg<ElemEnum, CondEnum>[]) => ENSSCond<CondEnum>);

export type ENSSCondFunc<CondEnum> = ENSSCond<CondEnum> &
  ((on?: unknown) => ENSSCond<CondEnum>);

export type ENSSArg<ElemEnum, CondEnum> =
  | ENSSElem<ElemEnum, CondEnum>
  | ENSSElemFunc<ElemEnum, CondEnum>
  | ENSSCond<CondEnum>
  | ENSSCondFunc<CondEnum>
  | string[]
  | Record<string, unknown>;

export type ENSSClassMap<NameEnum, ElemEnum, CondEnum> = Partial<
  Record<keyof NameEnum | keyof ElemEnum | keyof CondEnum, string>
>;

export type ENSSConfig = {
  elementSeparator: string;
  conditionalSeparator: string;
  strictBoolChecks: boolean;
};

const defaultConfig: ENSSConfig = {
  elementSeparator: "-",
  conditionalSeparator: "--",
  strictBoolChecks: true,
};

const config = { ...defaultConfig };

export default function enss<
  NameEnum = object,
  ElemEnum = object,
  CondEnum = object
>(
  nameEnum?: null | Record<keyof NameEnum, string | number | boolean>,
  elemEnum?: null | Record<keyof ElemEnum, string | number | boolean>,
  condEnum?: null | Record<keyof CondEnum, string | number | boolean>,
  classMap?:
    | null
    | ENSSClassMap<NameEnum, ElemEnum, CondEnum>
    | ((
        classMap: ENSSClassMap<NameEnum, ElemEnum, CondEnum>
      ) => void | ENSSClassMap<NameEnum, ElemEnum, CondEnum>)
): ENSS<NameEnum, ElemEnum, CondEnum> {
  const elemSep = () => config.elementSeparator;
  const condSep = () => config.conditionalSeparator;

  nameEnum = omitEnumReverseMappings(nameEnum);
  elemEnum = omitEnumReverseMappings(elemEnum);
  condEnum = omitEnumReverseMappings(condEnum);

  if (typeof classMap === "function") {
    const classMapRet = {};
    classMap = classMap(classMapRet) ?? classMapRet;
  }

  const [baseName, baseCls] = extractNameEnumData<NameEnum, ElemEnum, CondEnum>(
    nameEnum,
    classMap
  );

  // Cross-pollinate class mappings between enums and auxilliary mapping object:
  const mapEntries = Object.entries(classMap ?? []);
  const mappings = new Map(mapEntries);
  if (baseName) {
    mappings.set(baseName, baseCls ?? null);
  }
  elemEnum = Object.fromEntries(
    Object.entries(elemEnum ?? {}).map(
      ([elemName, elemCls]: [string, unknown]) => {
        const mappedCls = mappings.get(elemName);
        if (mappedCls) {
          if (!elemCls || elemCls === elemName) {
            return [elemName, mappedCls];
          } else {
            return [elemName, elemCls + " " + mappedCls];
          }
        } else if (typeof elemCls === "string" && elemCls.length) {
          mappings.set(elemName, elemCls);
        } else {
          mappings.set(elemName, null);
        }
        return [elemName, elemCls];
      }
    )
  ) as typeof elemEnum;
  condEnum = Object.fromEntries(
    Object.entries(condEnum ?? {}).map(
      ([condName, condCls]: [string, unknown]) => {
        const mappedCls = mappings.get(condName);
        if (mappedCls) {
          if (!condCls || condCls === condName) {
            return [condName, mappedCls];
          } else {
            return [condName, condCls + " " + mappedCls];
          }
        } else if (typeof condCls === "string" && condCls.length) {
          mappings.set(condName, condCls);
        } else {
          mappings.set(condName, null);
        }
        return [condName, condCls];
      }
    )
  ) as typeof condEnum;

  function unprefix(classes: ENSSArg[]): ENSSArg[] {
    return classes.map((cls: ENSSArg) => {
      if (baseName && typeof cls === "string") {
        const scls = cls as unknown as string;
        const condClsPrefix = baseName + " " + baseName + condSep();
        if (scls.startsWith?.(condClsPrefix)) {
          return scls?.slice(condClsPrefix.length);
        } else if (cls === baseName || cls === baseName + " " + baseCls) {
          return null;
        }
      }
      return cls;
    });
  }

  const clsKeys = Array.from(mappings.keys());
  function unmap(classes: ENSSArg[]): ENSSArg[] {
    return classes.map((cls: ENSSArg) => {
      if (typeof cls === "string") {
        let keys = "";
        let key;
        let truncated = cls;
        while ((key = clsKeys.find((k) => truncated.startsWith(k)))) {
          keys += key + " ";
          truncated = cls.slice(keys.length);
        }
        return keys.trim();
      }
      return cls;
    });
  }

  // TODO implement benchmarking and consider switching to regex impl:
  // NOTE some amount of regex special-char escaping of classes will be necessary
  // const clsRgx = new RegExp(
  //   "((^| )(" + Array.from(mappings.keys()).join("|") + "))+"
  // );
  // function unmap(classes: ENSSArg[]): ENSSArg[] {
  //   return classes.map(
  //     (cls: ENSSArg) => (cls as string)?.match?.(clsRgx)?.[1] ?? cls
  //   );
  // }

  function makeCondClassBuilders(
    baseClass: string | null,
    condClassPrefix: string,
    appendClass: string | null
  ) {
    return Object.fromEntries(
      Object.entries(condEnum ?? {}).map(([condName, condCls]) => {
        const condBaseCls = condClassPrefix + condName;

        function builder(on?: unknown) {
          // note: standard function rather than arrow-function needed here
          //       so that arguments.length can be correctly inspected;
          //       allows distinction between myCls() and myCls(undefined) calls
          let res = "";
          if (
            !arguments.length ||
            on === true || // only recognize boolean values
            (!config.strictBoolChecks && on) // unless strictBoolChecks=false
          ) {
            res = (baseClass ? baseClass + " " : "") + condBaseCls;
            if (appendClass) {
              res += " " + appendClass;
            }
            if (condCls && condCls !== condName) {
              res += " " + condCls;
            }
          } else {
            res = baseClass ?? "";
            if (appendClass) {
              res += " " + appendClass;
            }
          }
          return res;
        }

        builder.s = (baseClass ? baseClass + " " : "") + condBaseCls;

        if (appendClass) {
          builder.s += " " + appendClass;
        }
        if (condCls && condCls !== condName) {
          builder.s += " " + condCls;
        }

        return [condName, builder];
      })
    );
  }

  const elemClsBuilders = Object.fromEntries(
    Object.entries(elemEnum ?? {}).map(([elemName, elemCls]) => {
      const elemBaseCls = (baseName ? baseName + elemSep() : "") + elemName;

      function builder(...classes: ENSSArg[]) {
        let res = elemBaseCls;
        let normalized = "";
        let mapped = "";
        if (classes.length) {
          [normalized, mapped] = normalizeClass(
            config,
            mappings,
            res + condSep(),
            ...unmap(unprefix(classes))
          );
          if (normalized.length) {
            res += " " + normalized;
          }
        }
        if (elemCls && elemCls !== elemName) {
          res += " " + elemCls;
        }
        if (mapped.length) {
          res += " " + mapped;
        }
        return res;
      }

      builder.s = elemBaseCls;

      if (elemCls && elemCls !== elemName) {
        builder.s += " " + elemCls;
      }

      Object.assign(
        builder,
        makeCondClassBuilders(
          elemBaseCls,
          elemBaseCls + condSep(),
          elemCls && elemCls !== elemName ? (elemCls as string) : null
        )
      );

      return [elemName, builder];
    })
  );

  // Create top-level ENSS object (en):
  function mainClsBuilder(...classes: ENSSArg[]) {
    let res = baseName ?? "";
    let normalized = "";
    let mapped = "";
    if (classes.length) {
      [normalized, mapped] = normalizeClass(
        config,
        mappings,
        res + condSep(),
        ...unmap(unprefix(classes))
      );
      if (normalized.length) {
        res += " " + normalized;
      }
    }
    if (baseCls) {
      res += " " + baseCls;
    }
    if (mapped.length) {
      res += " " + mapped;
    }
    return res;
  }

  // Set en.s:
  mainClsBuilder.s = (baseName ?? "") + (baseCls ? " " + baseCls : "");

  // Set en.name:
  Object.defineProperty(mainClsBuilder, "name", {
    value: baseName,
    writable: false,
  });

  // Set en.<baseName>:
  // eg. en.Ship.s
  if (baseName) {
    Object.defineProperty(mainClsBuilder, baseName, {
      value: mainClsBuilder,
      writable: false,
    });
  }

  // Set en.elemA, en.elemB, etc:
  // eg. en.engine.s
  Object.assign(mainClsBuilder, elemClsBuilders);

  // Set en.condA, en.condB, etc:
  // eg. en.part.s
  Object.assign(
    mainClsBuilder,
    makeCondClassBuilders(
      baseName,
      baseName ? baseName + condSep() : "",
      baseCls
    )
  );

  return mainClsBuilder as unknown as ENSS<NameEnum, ElemEnum, CondEnum>;
}

export function normalizeClass(
  config: Partial<ENSSConfig>,
  mappings: null | Map<string, string>,
  prefix: string,
  ...values: ENSSArg[]
): [string, string] {
  let res = "";
  const mappedClasses: string[] = [];
  for (const val of values) {
    // filter out null, undefined, false, 0, "":
    if (val) {
      if (typeof val === "string" || val instanceof String) {
        res += prefix + val.trim() + " ";
        const mappedCls = mappings?.get(val as string);
        if (
          mappedCls?.length &&
          (typeof mappedCls === "string" ||
            (mappedCls as unknown) instanceof String)
        ) {
          mappedClasses.push(mappedCls.trim());
        }
      } else if (Array.isArray(val)) {
        throw new Error(
          "ENSS Error: Spread arrays instead of passing directly," +
            " eg. cc.mycls(...myarr) instead of cc.mycls(myarr)"
        );
      } else {
        let entries;
        try {
          entries = Object.entries(val);
        } catch (e) {
          entries = null;
        }
        if (!entries?.length) {
          throw new Error(`ENSS Error: Invalid input ${JSON.stringify(val)}.`);
        }
        for (const [name, on] of entries) {
          if (
            on === true || // only recognize boolean values
            (!config.strictBoolChecks && on) // unless strictBoolChecks=false
          ) {
            res += prefix + name.trim() + " ";
            const mappedCls = mappings?.get(name as string);
            if (
              mappedCls?.length &&
              (typeof mappedCls === "string" ||
                (mappedCls as unknown) instanceof String)
            ) {
              mappedClasses.push(mappedCls.trim());
            }
          }
          // Ignore classes associated with all other `on` values, even those
          // that are "truthy". This allows easily passing props objects into
          // enss where boolean props are meant to be used as classes, but
          // all other props should be ignored.
          // If "truthiness" checks are desired, input must simply be cast to
          // bool first, eg. en({ myclass: !!myprop })
        }
      }
    }
  }
  return [res.trim(), mappedClasses.reverse().join(" ")];
  // reverse mappedClasses before joining so that they may be "unmapped" easily
  // if nessary during class composition later, by comparing "out-to-in", eg.
  // "elA elB baseMapCls elBMapCls elAMapCls" -> compare elA === elAMapCls ?
  // "elA elB baseMapCls elBMapCls"           -> compare elB === elBMapCls ?
  // "elA elB baseMapCls"                     -> class is fully "unmapped"
}

export function omitEnumReverseMappings<T>(enumObj: T): T {
  return !enumObj
    ? enumObj
    : (Object.fromEntries(
        Object.entries(enumObj)
          .filter(([key]) => !Number.isInteger(Number(key)))
          .map(([key, val]) => [
            key,
            Number.isInteger(Number(val)) ? null : val,
          ])
      ) as T);
}

export function extractNameEnumData<NameEnum, ElemEnum, CondEnum>(
  nameEnum?: null | Record<string, string | number | boolean | null>,
  classMap?: null | ENSSClassMap<NameEnum, ElemEnum, CondEnum>
): [string | null, string | null] {
  let baseName: string | null = null;
  let baseCls: string | null = null;

  if (nameEnum && typeof nameEnum === "object") {
    const entries = Object.entries(nameEnum);
    if (entries.length > 1) {
      throw new Error(
        "ENSS Error: Invalid name enum provided; should have at most 1 field."
      );
    } else if (entries.length === 1) {
      [[baseName, baseCls]] = entries as [[string, string]];
      // handle numeric enum where keys map to arbitrary integers:
      if (typeof baseCls !== "string") {
        baseCls === null;
      }
      // handle string enum where keys map to equivalent value:
      if (baseName === baseCls) {
        baseCls === null;
      }
    }
  }

  if (baseName && classMap && typeof classMap === "object") {
    const mappedBaseCls =
      Object.prototype.hasOwnProperty.call(classMap, baseName) &&
      classMap[baseName as keyof NameEnum];
    if (mappedBaseCls) {
      baseCls = (baseCls ? baseCls + " " : "") + mappedBaseCls;
    }
  }

  return [baseName, baseCls];
}

enss.configure = function (configUpdate: null | Partial<ENSSConfig>) {
  Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
};
