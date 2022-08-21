export type NSS<NameEnum, ElemEnum, CondEnum> = {
  [key in keyof NameEnum]: NSSBaseFunc<ElemEnum, CondEnum>;
} & {
  mapClasses: () => NSS<NameEnum, ElemEnum, CondEnum>;
} & NSSBaseFunc<ElemEnum, CondEnum>;

export type NSSObject = {
  __nss__: boolean;
  name: string;
  cls: string;
  c: string; // alias
  str: string;
  s: string; // alias
  toString: () => string;
};

export type NSSBase<ElemEnum, CondEnum> = {
  [key in keyof ElemEnum]: NSSElemFunc<CondEnum>;
} & {
  [key in keyof CondEnum]: NSSCondFunc;
} & {
  props: (...args: NSSArg<CondEnum>[]) => NSSElem<CondEnum>;
} & NSSCond;

export type NSSElem<CondEnum> = {
  [key in keyof CondEnum]: NSSCondFunc;
} & {
  props: (...args: NSSArg<CondEnum>[]) => NSSElem<CondEnum>;
} & NSSObject;

export type NSSCond = NSSObject & {
  __nssCondOff__?: boolean;
};

export type NSSBaseFunc<ElemEnum, CondEnum> = NSSBase<ElemEnum, CondEnum> &
  ((...args: NSSArg<CondEnum>[]) => NSSElem<CondEnum>);

export type NSSElemFunc<CondEnum> = NSSElem<CondEnum> &
  ((...args: NSSArg<CondEnum>[]) => NSSCond);

export type NSSCondFunc = NSSCond & ((on?: unknown) => NSSCond);

export type NSSArg<CondEnum> =
  | NSSElem<CondEnum>
  | NSSElemFunc<CondEnum>
  | NSSCond
  | NSSCondFunc
  | string[]
  | Record<string, unknown>;

export type NSSClassMap<NameEnum, ElemEnum, CondEnum> = Partial<
  Record<keyof NameEnum | keyof ElemEnum | keyof CondEnum, string>
>;

export type NSSConfig = {
  elementSeparator: string;
  conditionalSeparator: string;
  caseSensitiveProps: boolean;
};

const defaultConfig: NSSConfig = {
  elementSeparator: "-",
  conditionalSeparator: "--",
  caseSensitiveProps: false,
};

const config = { ...defaultConfig };

function toStringError(): string {
  throw new Error(
    "Don't coerce to string directly; use .c or .s (aliases: .cls .str)"
  );
}

export default function nss<
  NameEnum = object,
  ElemEnum = object,
  CondEnum = object
>(
  nameEnum?: null | Record<keyof NameEnum, string | number | boolean>,
  elemEnum?: null | Record<keyof ElemEnum, string | number | boolean>,
  condEnum?: null | Record<keyof CondEnum, string | number | boolean>,
  classMap?:
    | null
    | NSSClassMap<NameEnum, ElemEnum, CondEnum>
    | ((
        classMap: NSSClassMap<NameEnum, ElemEnum, CondEnum>
      ) => void | NSSClassMap<NameEnum, ElemEnum, CondEnum>)
): NSS<NameEnum, ElemEnum, CondEnum> {
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

  // Cross-pollinate class mappings between enums and auxilliary mapping object:
  const mapEntries = Object.entries(classMap ?? []);
  const mappings = new Map(mapEntries);
  const mappingsLowercase = new Map(
    mapEntries.map(([k]) => [k.toLowerCase(), k])
  );
  if (baseName) {
    mappings.set(baseName, baseClass ?? null);
    mappingsLowercase.set(baseName.toLowerCase(), baseName);
  }
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
      mappingsLowercase.set(name.toLowerCase(), name);
    } else {
      mappings.set(name, null);
      mappingsLowercase.set(name.toLowerCase(), name);
    }
    return [name, cls];
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
    function makeBuilders() {
      return Object.fromEntries(
        Object.entries(condEnum ?? {}).map(([condName, condClass]) => {
          const priorClass = classPrelude ? classPrelude + " " : "";
          const afterClass =
            condClass && condClass !== condName ? " " + condClass : "";

          function builder(on?: unknown) {
            // note: standard function rather than arrow-function needed here
            //       so that arguments.length can be correctly inspected;
            //       allows distinction between myCls() and myCls(undefined) calls
            let str: string;
            let cls: string;
            let __nssCondOff__;
            if (!arguments.length || on) {
              __nssCondOff__ = false;
              str = classPrefix + condName + afterClass;
              cls = priorClass + str;
            } else {
              __nssCondOff__ = true;
              str = "";
              cls = classPrelude ?? "";
            }
            return {
              __nss__: true,
              ...(__nssCondOff__ ? { __nssCondOff__: true } : {}),
              name: condName,
              cls,
              c: cls, // alias
              str,
              s: str, // alias
              toString: toStringError,
            };
          }

          builder.__nss__ = true;
          builder.str = builder.s = classPrefix + condName + afterClass;
          builder.cls = builder.c = priorClass + builder.str;
          builder.toString = toStringError;

          // Set en.cond.name:
          Object.defineProperty(builder, "name", {
            value: condName,
            writable: false,
          });

          return [condName, builder];
        })
      );
    }
    return makeBuilders();
  }

  const elemClsBuilders = Object.fromEntries(
    Object.entries(elemEnum ?? {}).map(([elemName, elemClass]) => {
      const afterClass =
        elemClass && elemClass !== elemName ? (elemClass as string) : "";
      const classPrefix = baseName ? baseName + elemSep() : "";

      function builder(...args: NSSArg<CondEnum>[]) {
        return constructNSSObject({
          builder,
          mappings,
          mappingsLowercase,
          baseName: elemName,
          baseClass: classPrefix + elemName,
          separator: condSep(),
          afterClass,
          values: args,
          caseSensitive: true,
          strictBoolChecks: false,
          acceptArbitraryStrings: true,
        });
      }

      builder.__nss__ = true;
      builder.str = builder.s = afterClass;
      const prefix = classPrefix + elemName;
      const space = prefix.length && builder.str.length ? " " : "";
      builder.cls = builder.c = prefix + space + builder.str;
      builder.toString = toStringError;
      builder.props = function (...args: NSSArg<CondEnum>[]) {
        return constructNSSObject({
          builder,
          mappings,
          mappingsLowercase,
          baseName: elemName,
          baseClass: classPrefix + elemName,
          separator: condSep(),
          afterClass,
          values: args,
          caseSensitive: config.caseSensitiveProps,
          strictBoolChecks: true,
          acceptArbitraryStrings: false,
        });
      };

      Object.assign(
        builder,
        makeCondClassBuilders(builder.c, classPrefix + elemName + condSep())
      );

      // Set en.elem.name:
      Object.defineProperty(builder, "name", {
        value: elemName,
        writable: false,
      });

      return [elemName, builder];
    })
  );

  const basePriorClass = baseName ?? "";
  const baseAfterClass = baseClass ?? "";

  // Create top-level NSS object (en):
  function mainClsBuilder(...args: NSSArg<CondEnum>[]) {
    return constructNSSObject({
      builder: mainClsBuilder,
      mappings,
      mappingsLowercase,
      baseName: baseName ?? "",
      baseClass: basePriorClass,
      separator: condSep(),
      afterClass: baseAfterClass,
      values: args,
      caseSensitive: true,
      strictBoolChecks: false,
      acceptArbitraryStrings: true,
    });
  }

  mainClsBuilder.__nss__ = true;
  mainClsBuilder.cls = mainClsBuilder.c =
    basePriorClass + (baseName && baseClass ? " " : "") + baseAfterClass;
  mainClsBuilder.str = mainClsBuilder.s = baseAfterClass;
  mainClsBuilder.toString = toStringError;
  mainClsBuilder.props = function (...args: NSSArg<CondEnum>[]) {
    return constructNSSObject({
      builder: mainClsBuilder,
      mappings,
      mappingsLowercase,
      baseName: baseName ?? "",
      baseClass: basePriorClass,
      separator: condSep(),
      afterClass: baseAfterClass,
      values: args,
      caseSensitive: config.caseSensitiveProps,
      strictBoolChecks: true,
      acceptArbitraryStrings: false,
    });
  };

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

  return mainClsBuilder as unknown as NSS<NameEnum, ElemEnum, CondEnum>;
}

// resolveNSSArg maps basic cond expressions (eg. en.myCond) to their corresponding
// namespaced cond expressions (eg. en.myElem.myCond) when composing conditionals:
// en.myElem(en.myCondA, en.myCondB)
// This obviates the need to supply fully-namespaced conditionals in this case, eg.
// en.myElem(en.myElem.myCondA, en.myElem.myCondB)
export function resolveNSSArg<CondEnum>(
  builder: NSSObject,
  arg: string | NSSArg<CondEnum>
): string | NSSArg<CondEnum> {
  const { __nss__, __nssCondOff__, name } = arg as NSSCond;
  if (__nss__) {
    const cond = (builder as unknown as Record<string, NSSCondFunc>)[name];
    if (cond) {
      return __nssCondOff__ ? cond(false).str : cond.str;
    } else {
      return (arg as NSSObject).str;
    }
  }
  return arg;
}

function constructNSSObject<CondEnum>({
  builder,
  mappings,
  mappingsLowercase,
  baseName,
  baseClass,
  separator,
  afterClass,
  values,
  caseSensitive,
  strictBoolChecks,
  acceptArbitraryStrings,
}: {
  builder: NSSObject;
  mappings: Map<string, string>;
  mappingsLowercase: Map<string, string>;
  baseName: string;
  baseClass: string;
  separator: string;
  afterClass: string;
  values: NSSArg<CondEnum>[];
  caseSensitive: boolean;
  strictBoolChecks: boolean;
  acceptArbitraryStrings: boolean;
}) {
  if (!caseSensitive && mappings.size != mappingsLowercase.size) {
    const keys = Array.from(mappings.keys());
    let conflictKeys: string[] = [];
    Array.from(mappings.keys()).find((key) => {
      conflictKeys = keys.filter((k) => k.toLowerCase() === key.toLowerCase());
      return conflictKeys.length > 1;
    });
    const conflict = conflictKeys.length
      ? conflictKeys.map((k) => `"${k}"`).join(", ") + " "
      : "";
    throw new Error(
      `You're using multiple class names ${conflict}that are identical ` +
        "apart from casing; this causes ambiguity when using .props(...)"
    );
  }
  baseName = baseName ?? "";
  let space;
  let str = afterClass;
  if (values.length) {
    const composed = composeClass<CondEnum>({
      builder,
      mappings,
      mappingsLowercase,
      prefix: baseClass + (baseName ? separator : ""),
      values,
      caseSensitive,
      strictBoolChecks,
      acceptArbitraryStrings,
    });
    space = str.length && composed.length ? " " : "";
    str += space + composed;
  }
  let cls = baseClass;
  space = cls.length && str.length && str[0] !== " " ? " " : "";
  cls += space + str;
  return {
    __nss__: true,
    name: baseName,
    cls,
    c: cls, // alias
    str,
    s: str, // alias
    toString: toStringError,
  };
}

function composeClass<CondEnum>({
  builder,
  mappings,
  mappingsLowercase,
  prefix,
  values,
  caseSensitive,
  strictBoolChecks,
  acceptArbitraryStrings,
}: {
  builder: NSSObject;
  mappings: Map<string, string>;
  mappingsLowercase: Map<string, string>;
  prefix: string;
  values: NSSArg<CondEnum>[];
  caseSensitive: boolean;
  strictBoolChecks: boolean;
  acceptArbitraryStrings: boolean;
}): string {
  let res = "";
  for (const val of values) {
    // filter out null, undefined, false, 0, "":
    if (val) {
      if (typeof val === "string" || val instanceof String) {
        // this is a String:
        throw new Error(
          "Do not pass strings directly; enclose in object or array"
        );
      } else if ((val as NSSObject)?.__nss__) {
        const str = resolveNSSArg(builder, val) as string;
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
            throw new Error(`NSS Error: Invalid input ${JSON.stringify(val)}.`);
          }
        }
        for (const [name, on] of entries) {
          if (
            on === true || // only recognize boolean values
            (!strictBoolChecks && on) // unless strictBoolChecks=false
          ) {
            //console.log([name, on]);
            if (!acceptArbitraryStrings) {
              if (caseSensitive) {
                if (!mappings.has(name)) {
                  continue;
                }
              } else {
                if (!mappingsLowercase.has(name.toLowerCase())) {
                  continue;
                }
              }
            }
            if (caseSensitive) {
              res += " " + prefix + name;
            } else {
              res += " " + prefix + mappingsLowercase.get(name.toLowerCase());
            }
            const mappedCls = caseSensitive
              ? mappings.get(name)
              : mappings.get(
                  mappingsLowercase.get(name.toLowerCase()) as string
                );
            if (
              mappedCls?.length &&
              (typeof mappedCls === "string" ||
                (mappedCls as unknown) instanceof String)
            ) {
              res += " " + mappedCls;
            }
          }
        }
      }
    }
  }
  return res.slice(1); // trim off leading space
}

function omitEnumReverseMappings<T>(enumObj: T): T {
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

function extractNameEnumData<NameEnum, ElemEnum, CondEnum>(
  nameEnum?: null | Record<string, string | number | boolean | null>,
  classMap?: null | NSSClassMap<NameEnum, ElemEnum, CondEnum>
): [string | null, string | null] {
  let baseName: string | null = null;
  let baseClass: string | null = null;

  if (nameEnum && typeof nameEnum === "object") {
    const entries = Object.entries(nameEnum);
    if (entries.length > 1) {
      throw new Error(
        "NSS Error: Invalid name enum provided; should have at most 1 field."
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

nss.configure = function (configUpdate: null | Partial<NSSConfig>) {
  Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
};
