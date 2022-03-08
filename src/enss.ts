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

function toStringError() {
  throw new Error(
    "Do not coerce to string directly; use .c (.class) or .s (.string)"
  );
}

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

  const [baseName, baseClass] = extractNameEnumData<
    NameEnum,
    ElemEnum,
    CondEnum
  >(nameEnum, classMap);

  function crossPollinate([name, cls]: [string, unknown]): [string, unknown] {
    const mappedCls = mappings.get(name);
    if (mappedCls) {
      if (!cls || cls === name) {
        return [name, mappedCls];
      } else {
        return [name, cls + " " + mappedCls];
      }
    } else if (typeof cls === "string" && cls.length) {
      mappings.set(name, cls);
    } else {
      mappings.set(name, null);
    }
    return [name, cls];
  }

  // Cross-pollinate class mappings between enums and auxilliary mapping object:
  const mapEntries = Object.entries(classMap ?? []);
  const mappings = new Map(mapEntries);
  if (baseName) {
    mappings.set(baseName, baseClass ?? null);
  }
  elemEnum = Object.fromEntries(
    Object.entries(elemEnum ?? {}).map(crossPollinate)
  ) as typeof elemEnum;
  condEnum = Object.fromEntries(
    Object.entries(condEnum ?? {}).map(crossPollinate)
  ) as typeof condEnum;

  function makeCondClassBuilders(
    classPrelude: string | null,
    classPrefix: string
  ) {
    function makeBuilders(chainCls: string, chainStr: string) {
      return Object.fromEntries(
        Object.entries(condEnum ?? {}).map(([condName, condClass]) => {
          const priorClass = classPrelude ? classPrelude + " " : "";
          const afterClass =
            condClass && condClass !== condName ? " " + condClass : "";

          function builder(on?: unknown) {
            // note: standard function rather than arrow-function needed here
            //       so that arguments.length can be correctly inspected;
            //       allows distinction between myCls() and myCls(undefined) calls
            let str;
            let cls;
            if (
              !arguments.length ||
              on === true || // only recognize boolean values
              (!config.strictBoolChecks && on) // unless strictBoolChecks=false
            ) {
              str = classPrefix + condName + afterClass;
              cls = priorClass + str;
            } else {
              str = "";
              cls = classPrelude ?? "";
            }
            if (chainStr.length) {
              chainStr = chainStr + (str.length ? " " + str : "");
            }
            if (chainCls.length) {
              chainCls = chainCls + (str.length ? " " + str : "");
            }
            return {
              class: chainCls.length ? chainCls : cls,
              c: chainCls.length ? chainCls : cls,
              string: chainStr.length ? chainStr : str,
              s: chainStr.length ? chainStr : str,
              toString: toStringError,
              ...makeBuilders(cls, str),
            };
          }

          builder.string = builder.s = classPrefix + condName + afterClass;
          builder.class = builder.c = priorClass + builder.string;
          builder.toString = toStringError;

          return [condName, builder];
        })
      );
    }
    return makeBuilders("", "");
  }

  const elemClsBuilders = Object.fromEntries(
    Object.entries(elemEnum ?? {}).map(([elemName, elemClass]) => {
      const afterClass =
        elemClass && elemClass !== elemName ? " " + elemClass : "";
      const classPrefix = baseName ? baseName + elemSep() : "";

      function builder(...args: ENSSArg<ElemEnum, CondEnum>[]) {
        let str = "";
        if (args.length) {
          str += composeClass<ElemEnum, CondEnum>(
            config,
            mappings,
            classPrefix + elemName + condSep(),
            args
          );
        }
        const cls =
          classPrefix + elemName + afterClass + (str.length ? " " + str : "");
        return {
          class: cls,
          c: cls,
          string: str,
          s: str,
          toString: toStringError,
        };
      }

      builder.string = builder.s = "";
      builder.class = builder.c =
        classPrefix + elemName + afterClass + builder.string;
      builder.toString = toStringError;

      Object.assign(
        builder,
        makeCondClassBuilders(builder.c, classPrefix + elemName + condSep())
      );

      return [elemName, builder];
    })
  );

  const basePriorClass = baseName ?? "";
  const baseAfterClass = baseClass ?? "";
  const classPrefix = baseName ? baseName + condSep() : "";

  // Create top-level ENSS object (en):
  function mainClsBuilder(...args: ENSSArg<ElemEnum, CondEnum>[]) {
    let str = baseAfterClass;
    if (args.length) {
      str +=
        (str.length ? " " : "") +
        composeClass<ElemEnum, CondEnum>(config, mappings, classPrefix, args);
    }
    const cls = basePriorClass + (baseName && str.length ? " " : "") + str;
    return {
      class: cls,
      c: cls,
      string: str,
      s: str,
      toString: toStringError,
    };
  }

  mainClsBuilder.class = mainClsBuilder.c =
    basePriorClass + (baseName && baseClass ? " " : "") + baseAfterClass;
  mainClsBuilder.string = mainClsBuilder.s = baseAfterClass;
  mainClsBuilder.toString = toStringError;

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
      mainClsBuilder.c,
      baseName ? baseName + condSep() : ""
    )
  );

  return mainClsBuilder as unknown as ENSS<NameEnum, ElemEnum, CondEnum>;
}

export function composeClass<ElemEnum, CondEnum>(
  config: Partial<ENSSConfig>,
  mappings: null | Map<string, string>,
  prefix: string,
  values: ENSSArg<ElemEnum, CondEnum>[]
): string {
  let res = "";
  for (const val of values) {
    // filter out null, undefined, false, 0, "":
    if (val) {
      if (typeof val === "string" || val instanceof String) {
        // this is a String:
        throw new Error(
          "Do not pass strings directly; enclose in object or array"
        );
      } else if (
        Object.prototype.hasOwnProperty.call(val, "class") &&
        Object.prototype.hasOwnProperty.call(val, "c") &&
        Object.prototype.hasOwnProperty.call(val, "string") &&
        Object.prototype.hasOwnProperty.call(val, "s")
      ) {
        // this is an ENSS expression:
        const str = (val as ENSSResolvers).string;
        res += str?.length ? " " + str : "";
      } else {
        // this is an Object or Array:
        let entries;
        if (Array.isArray(val)) {
          entries = val.map<[string, boolean]>((cls) => [cls, true]);
        } else {
          try {
            entries = Object.entries(val);
          } catch (e) {
            entries = null;
          }
          if (!entries?.length) {
            throw new Error(
              `ENSS Error: Invalid input ${JSON.stringify(val)}.`
            );
          }
        }
        for (const [name, on] of entries) {
          if (
            on === true || // only recognize boolean values
            (!config.strictBoolChecks && on) // unless strictBoolChecks=false
          ) {
            res += " " + prefix + name.trim();
            const mappedCls = mappings?.get(name as string);
            if (
              mappedCls?.length &&
              (typeof mappedCls === "string" ||
                (mappedCls as unknown) instanceof String)
            ) {
              res += " " + mappedCls.trim();
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
  return res.slice(1); // trim off leading space
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
  let baseClass: string | null = null;

  if (nameEnum && typeof nameEnum === "object") {
    const entries = Object.entries(nameEnum);
    if (entries.length > 1) {
      throw new Error(
        "ENSS Error: Invalid name enum provided; should have at most 1 field."
      );
    } else if (entries.length === 1) {
      [[baseName, baseClass]] = entries as [[string, string]];
      // handle numeric enum where keys map to arbitrary integers:
      if (typeof baseClass !== "string") {
        baseClass === null;
      }
      // handle string enum where keys map to equivalent value:
      if (baseName === baseClass) {
        baseClass === null;
      }
    }
  }

  if (baseName && classMap && typeof classMap === "object") {
    const mappedBaseCls =
      Object.prototype.hasOwnProperty.call(classMap, baseName) &&
      classMap[baseName as keyof NameEnum];
    if (mappedBaseCls) {
      baseClass = (baseClass ? baseClass + " " : "") + mappedBaseCls;
    }
  }

  return [baseName, baseClass];
}

enss.configure = function (configUpdate: null | Partial<ENSSConfig>) {
  Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
};
