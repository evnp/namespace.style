export type ENSS<NameEnum, ElemEnum, CondEnum> = {
  [key in keyof NameEnum]: ENSSFunc<ElemEnum, CondEnum>;
} & {
  mapClasses: () => ENSS<NameEnum, ElemEnum, CondEnum>;
} & ENSSFunc<ElemEnum, CondEnum>;

export type ENSSFunc<ElemEnum, CondEnum> = {
  [key in keyof ElemEnum]: ENSSElementFunc<CondEnum>;
} & ENSSElementFunc<CondEnum>;

export type ENSSElementFunc<CondEnum> = {
  [key in keyof CondEnum]: ENSSConditionalFunc;
} & ((...classes: ENSSArg[]) => string) & { s: string };

export type ENSSConditionalFunc = ((on?: unknown) => string) & {
  s: string;
};

export type ENSSArg =
  | null
  | undefined
  | boolean
  | string
  | Record<string, unknown>;

export type ENSSClassRecord<NameEnum, ElemEnum, CondEnum> = Partial<
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
  nameEnum?: null | Record<keyof NameEnum, string | number>,
  elementEnum?: null | Record<keyof ElemEnum, string | number>,
  conditionalEnum?: null | Record<keyof CondEnum, string | number>,
  classMappings?:
    | null
    | ENSSClassRecord<NameEnum, ElemEnum, CondEnum>
    | ((
        classMappings: ENSSClassRecord<NameEnum, ElemEnum, CondEnum>
      ) => void | ENSSClassRecord<NameEnum, ElemEnum, CondEnum>)
): ENSS<NameEnum, ElemEnum, CondEnum> {
  const elemSep = () => config.elementSeparator;
  const condSep = () => config.conditionalSeparator;

  nameEnum = omitEnumReverseMappings(nameEnum);
  elementEnum = omitEnumReverseMappings(elementEnum);
  conditionalEnum = omitEnumReverseMappings(conditionalEnum);

  if (typeof classMappings === "function") {
    const classMappingsRet = {};
    classMappings = classMappings(classMappingsRet) ?? classMappingsRet;
  }

  const [baseName, baseCls] = extractNameEnumData<NameEnum, ElemEnum, CondEnum>(
    nameEnum,
    classMappings
  );

  if (classMappings && typeof classMappings === "object") {
    const mappings = new Map<string, string>(Object.entries(classMappings));
    elementEnum = Object.fromEntries(
      Object.entries(elementEnum ?? {}).map(
        ([elemName, elemCls]: [string, unknown]) => {
          const mappedCls = mappings.get(elemName);
          if (mappedCls) {
            if (!elemCls || elemCls === elemName) {
              return [elemName, mappedCls];
            } else {
              return [elemName, elemCls + " " + mappedCls];
            }
          }
          return [elemName, elemCls];
        }
      )
    ) as typeof elementEnum;

    conditionalEnum = Object.fromEntries(
      Object.entries(conditionalEnum ?? {}).map(
        ([condName, condCls]: [string, unknown]) => {
          const mappedCls = mappings.get(condName);
          if (mappedCls) {
            if (!condCls || condCls === condName) {
              return [condName, mappedCls];
            } else {
              return [condName, condCls + " " + mappedCls];
            }
          }
          return [condName, condCls];
        }
      )
    ) as typeof conditionalEnum;
  }

  function unprefix(classes: ENSSArg[]) {
    return classes.map((cls: ENSSArg) => {
      if (baseName && typeof cls === "string") {
        const scls = cls as unknown as string;
        const baseCondClsPrefix = baseName + " " + baseName + condSep();
        if (scls.startsWith?.(baseCondClsPrefix)) {
          return scls?.slice(baseCondClsPrefix.length);
        } else if (cls === baseName) {
          return null;
        }
      }
      return cls;
    });
  }

  function makeCondClassBuilders(
    baseClass: string | null,
    condClassPrefix: string,
    appendClass: string | null
  ) {
    return Object.fromEntries(
      Object.entries(conditionalEnum ?? {}).map(([condName, condCls]) => {
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
    Object.entries(elementEnum ?? {}).map(([elemName, elemCls]) => {
      const elemBaseCls = (baseName ? baseName + elemSep() : "") + elemName;

      function builder(...classes: ENSSArg[]) {
        let res = elemBaseCls;
        if (classes.length) {
          const normalized = normalizeClass(
            config,
            res + condSep(),
            ...unprefix(classes)
          );
          if (normalized.length) {
            res += " " + normalized;
          }
        }
        if (elemCls && elemCls !== elemName) {
          res += " " + elemCls;
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
    if (classes.length) {
      const normalized = normalizeClass(
        config,
        res + condSep(),
        ...unprefix(classes)
      );
      if (normalized.length) {
        res += " " + normalized;
      }
    }
    if (baseCls) {
      res += " " + baseCls;
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
  prefix: string,
  ...values: ENSSArg[]
): string {
  let res = "";
  for (const val of values) {
    // filter out null, undefined, false, 0, "":
    if (val) {
      if (typeof val === "string" || val instanceof String) {
        res += prefix + val + " ";
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
            res += prefix + name + " ";
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
  return res.trim();
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
  nameEnum?: null | Record<string, string | number | null>,
  classMappings?: null | ENSSClassRecord<NameEnum, ElemEnum, CondEnum>
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

  if (baseName && classMappings && typeof classMappings === "object") {
    const mappedBaseCls =
      Object.prototype.hasOwnProperty.call(classMappings, baseName) &&
      classMappings[baseName as keyof NameEnum];
    if (mappedBaseCls) {
      baseCls = (baseCls ? baseCls + " " : "") + mappedBaseCls;
    }
  }

  return [baseName, baseCls];
}

enss.configure = function (configUpdate: null | Partial<ENSSConfig>) {
  Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
};
