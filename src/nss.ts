export type NSS<Base, Elem, Cond> = {
  [key in keyof Base]: NSSBaseFunc<Base, Elem, Cond>;
} & {
  mapClasses: () => NSS<Base, Elem, Cond>;
} & NSSBaseFunc<Base, Elem, Cond>;

export type NSSObject<Base, Elem, Cond> = {
  cls: string;
  c: string; // alias
  name: string;
  value: string;
  base: NSSObject<Base, Elem, Cond>;
  elem: NSSObject<Base, Elem, Cond> | null;
  //cond: (key?: Cond) => NSSCond<Base, Elem, Cond>; // TODO
  mapped: string | null;
  toString: () => string;
};

export type NSSBase<Base, Elem, Cond> = {
  [key in keyof Elem]: NSSElemFunc<Base, Elem, Cond>;
} & {
  [key in keyof Cond]: NSSCondFunc<Base, Elem, Cond>;
} & {
  props: (...args: NSSArg<Base, Elem, Cond>[]) => NSSObject<Base, Elem, Cond>;
} & NSSCond<Base, Elem, Cond>;

export type NSSElem<Base, Elem, Cond> = {
  [key in keyof Cond]: NSSCondFunc<Base, Elem, Cond>;
} & {
  props: (...args: NSSArg<Base, Elem, Cond>[]) => NSSObject<Base, Elem, Cond>;
} & NSSObject<Base, Elem, Cond>;

export type NSSCond<Base, Elem, Cond> = NSSObject<Base, Elem, Cond> & {
  off: boolean;
};

export type NSSBaseFunc<Base, Elem, Cond> = NSSBase<Base, Elem, Cond> &
  ((...args: NSSArg<Base, Elem, Cond>[]) => NSSObject<Base, Elem, Cond>);

export type NSSElemFunc<Base, Elem, Cond> = NSSElem<Base, Elem, Cond> &
  ((...args: NSSArg<Base, Elem, Cond>[]) => NSSObject<Base, Elem, Cond>);

export type NSSCondFunc<Base, Elem, Cond> = NSSCond<Base, Elem, Cond> &
  ((on?: unknown) => NSSCond<Base, Elem, Cond> & NSSElem<Base, Elem, Cond>);

export type NSSArg<Base, Elem, Cond> =
  | NSSElem<Base, Elem, Cond>
  | NSSElemFunc<Base, Elem, Cond>
  | NSSCond<Base, Elem, Cond>
  | NSSCondFunc<Base, Elem, Cond>
  | string[]
  | Record<string, unknown>;

export type NSSClassMap<Base, Elem, Cond> = Partial<
  Record<keyof Base | keyof Elem | keyof Cond, string>
>;

export type NSSConfig = {
  separator: string;
  elementSeparator: string;
  conditionalSeparator: string;
  caseSensitiveProps: boolean;
};

const defaultConfig: NSSConfig = {
  separator: "",
  elementSeparator: "",
  conditionalSeparator: "",
  caseSensitiveProps: false,
};

const config = { ...defaultConfig };

function configure(configUpdate: null | Partial<NSSConfig>) {
  Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
}

function configElementSeparator(): string {
  if (config.elementSeparator?.length) {
    return config.elementSeparator;
  } else if (config.separator?.length) {
    return config.separator;
  } else {
    return "-";
  }
}

function configConditionalSeparator(): string {
  if (config.conditionalSeparator?.length) {
    return config.conditionalSeparator;
  } else if (config.separator?.length) {
    return config.separator + config.separator;
  } else {
    return "--";
  }
}

function toStringError(): string {
  throw new Error("Don't coerce to string directly; use .c (alias: .cls)");
}

export default function nss<Base = object, Elem = object, Cond = object>(
  name?: null | Record<keyof Base, string | number | boolean>,
  elem?: null | Record<keyof Elem, string | number | boolean>,
  cond?: null | Record<keyof Cond, string | number | boolean>,
  classMap?:
    | null
    | NSSClassMap<Base, Elem, Cond>
    | ((
        classMap: NSSClassMap<Base, Elem, Cond>
      ) => void | NSSClassMap<Base, Elem, Cond>)
): NSS<Base, Elem, Cond> {
  const elementSeparator = configElementSeparator();
  const conditionalSeparator = configConditionalSeparator();

  name = omitEnumReverseMappings(name);
  elem = omitEnumReverseMappings(elem);
  cond = omitEnumReverseMappings(cond);

  if (typeof classMap === "function") {
    const classMapRet = {};
    classMap = classMap(classMapRet) ?? classMapRet;
  }

  const [baseName, baseClass] = extractBaseData<Base, Elem, Cond>(
    name,
    classMap
  );

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
  elem = Object.fromEntries(
    Object.entries(elem ?? {}).map(crossPollinate)
  ) as typeof elem;
  cond = Object.fromEntries(
    Object.entries(cond ?? {}).map(crossPollinate)
  ) as typeof cond;

  function buildCondObjects(
    classPrelude: string,
    classPrefix: string,
    nssBaseObject: NSSObject<Base, Elem, Cond>,
    nssElemObject: NSSObject<Base, Elem, Cond> | null = null
  ) {
    return Object.fromEntries(
      Object.entries(cond ?? {}).map(([condName, condClass]) => {
        const classPrelude_ = classPrelude?.length ? classPrelude + " " : "";
        const afterClass =
          condClass && condClass !== condName ? " " + condClass : "";

        function nssCondObject(on?: unknown) {
          // note: standard function rather than arrow-function needed here
          //       so that arguments.length can be correctly inspected;
          //       allows distinction between myCls() and myCls(undefined) calls
          let cls: string;
          let off;
          if (!arguments.length || on) {
            off = false;
            cls = classPrelude_ + classPrefix + condName + afterClass;
          } else {
            off = true;
            cls = classPrelude;
          }
          const nssObject = {
            off,
            cls,
            c: cls, // alias
            name: condName,
            value: classPrefix + condName,
            mapped: afterClass.length ? afterClass : null,
            toString: toStringError,
            base: nssBaseObject,
            elem: nssElemObject,
          };
          Object.assign(
            nssObject,
            buildCondObjects(cls, classPrefix, nssBaseObject, nssElemObject)
          );
          return nssObject;
        }

        nssCondObject.off = false;
        nssCondObject.cls = classPrelude_ + classPrefix + condName + afterClass;
        nssCondObject.c = nssCondObject.cls; // alias
        nssCondObject.value = classPrefix + condName;
        nssCondObject.mapped = afterClass.length ? afterClass : null;
        nssCondObject.toString = toStringError;
        nssCondObject.base = nssBaseObject;
        nssCondObject.elem = nssElemObject;

        // Set n.cond.name:
        Object.defineProperty(nssCondObject, "name", {
          value: condName,
          writable: false,
        });

        return [condName, nssCondObject];
      })
    );
  }

  const nssElemObjects = Object.fromEntries(
    Object.entries(elem ?? {}).map(([elemName, elemClass]) => {
      const afterClass =
        elemClass && elemClass !== elemName ? (elemClass as string) : "";
      const classPrefix = baseName ? baseName + elementSeparator : "";

      function nssElemObject(...args: NSSArg<Base, Elem, Cond>[]) {
        return constructNSSObject({
          base: nssBaseObject as unknown as NSSBaseFunc<Base, Elem, Cond>,
          elem: nssElemObject as unknown as NSSElemFunc<Base, Elem, Cond>,
          parent: nssElemObject as unknown as NSSObject<Base, Elem, Cond>,
          mappings,
          mappingsLowercase,
          baseName: elemName,
          baseClass: classPrefix + elemName,
          separator: conditionalSeparator,
          afterClass,
          values: args,
          caseSensitive: true,
          strictBoolChecks: false,
          acceptArbitraryStrings: true,
        });
      }

      const prefix = classPrefix + elemName;
      const space = prefix.length && afterClass.length ? " " : "";
      nssElemObject.cls = prefix + space + afterClass;
      nssElemObject.c = nssElemObject.cls; // alias
      nssElemObject.value = nssElemObject.cls;
      nssElemObject.mapped = afterClass.length ? afterClass : null;
      nssElemObject.toString = toStringError;
      nssElemObject.props = function (...args: NSSArg<Base, Elem, Cond>[]) {
        return constructNSSObject({
          base: nssBaseObject as unknown as NSSBaseFunc<Base, Elem, Cond>,
          elem: nssElemObject as unknown as NSSElemFunc<Base, Elem, Cond>,
          parent: nssElemObject as unknown as NSSObject<Base, Elem, Cond>,
          mappings,
          mappingsLowercase,
          baseName: elemName,
          baseClass: classPrefix + elemName,
          separator: conditionalSeparator,
          afterClass,
          values: args,
          caseSensitive: config.caseSensitiveProps,
          strictBoolChecks: true,
          acceptArbitraryStrings: false,
        });
      };

      Object.assign(
        nssElemObject,
        buildCondObjects(
          nssElemObject.c,
          classPrefix + elemName + conditionalSeparator,
          nssBaseObject as unknown as NSSObject<Base, Elem, Cond>,
          nssElemObject as unknown as NSSObject<Base, Elem, Cond>
        )
      );

      // Set n.elem.name:
      Object.defineProperty(nssElemObject, "name", {
        value: elemName,
        writable: false,
      });

      return [elemName, nssElemObject];
    })
  );

  const basePriorClass = baseName ?? "";
  const baseAfterClass = baseClass ?? "";

  // Create top-level NSS object (en):
  function nssBaseObject(...args: NSSArg<Base, Elem, Cond>[]) {
    return constructNSSObject({
      base: nssBaseObject as unknown as NSSBaseFunc<Base, Elem, Cond>,
      elem: null,
      parent: nssBaseObject as unknown as NSSObject<Base, Elem, Cond>,
      mappings,
      mappingsLowercase,
      baseName: baseName ?? "",
      baseClass: basePriorClass,
      separator: conditionalSeparator,
      afterClass: baseAfterClass,
      values: args,
      caseSensitive: true,
      strictBoolChecks: false,
      acceptArbitraryStrings: true,
    });
  }

  nssBaseObject.cls =
    basePriorClass + (baseName && baseClass ? " " : "") + baseAfterClass;
  nssBaseObject.c = nssBaseObject.cls; // alias
  nssBaseObject.value = nssBaseObject.cls;
  nssBaseObject.mapped = baseAfterClass.length ? baseAfterClass : null;
  nssBaseObject.toString = toStringError;
  nssBaseObject.props = function (...args: NSSArg<Base, Elem, Cond>[]) {
    return constructNSSObject({
      base: nssBaseObject as unknown as NSSBaseFunc<Base, Elem, Cond>,
      elem: null,
      parent: nssBaseObject as unknown as NSSObject<Base, Elem, Cond>,
      mappings,
      mappingsLowercase,
      baseName: baseName ?? "",
      baseClass: basePriorClass,
      separator: conditionalSeparator,
      afterClass: baseAfterClass,
      values: args,
      caseSensitive: config.caseSensitiveProps,
      strictBoolChecks: true,
      acceptArbitraryStrings: false,
    });
  };

  // Set n.name:
  Object.defineProperty(nssBaseObject, "name", {
    value: baseName,
    writable: false,
  });

  // Set n.<baseName>:
  // eg. n.Ship.s
  if (baseName) {
    Object.defineProperty(nssBaseObject, baseName, {
      value: nssBaseObject,
      writable: false,
    });
  }

  // Set n.elemA, n.elemB, etc:
  // eg. n.engine.s
  Object.assign(nssBaseObject, nssElemObjects);

  // Set n.condA, n.condB, etc:
  // eg. n.part.s
  Object.assign(
    nssBaseObject,
    buildCondObjects(
      nssBaseObject.c,
      baseName ? baseName + conditionalSeparator : "",
      nssBaseObject as unknown as NSSObject<Base, Elem, Cond>
    )
  );

  return nssBaseObject as unknown as NSS<Base, Elem, Cond>;
}

// resolveNSSArg maps basic cond expressions (eg. n.myCond) to their corresponding
// namespaced cond expressions (eg. n.myElem.myCond) when composing conditionals:
// n.myElem(n.myCondA, n.myCondB)
// This obviates the need to supply fully-namespaced conditionals in this case, eg.
// n.myElem(n.myElem.myCondA, n.myElem.myCondB)
export function resolveNSSArg<Base, Elem, Cond>(
  base: NSSBaseFunc<Base, Elem, Cond>,
  builder: NSSObject<Base, Elem, Cond>,
  arg: string | NSSArg<Base, Elem, Cond>
): string | NSSArg<Base, Elem, Cond> {
  arg = arg as NSSObject<Base, Elem, Cond>;
  if (arg?.base === base) {
    const cond = (
      builder as unknown as Record<string, NSSCondFunc<Base, Elem, Cond>>
    )[arg.name as string];
    let nssObj = cond as NSSObject<Base, Elem, Cond>;
    if (!cond) {
      nssObj = arg as NSSObject<Base, Elem, Cond>;
    } else if (arg.off) {
      return "";
    }
    const { cls, mapped } = nssObj;
    return cls.slice(
      cls.lastIndexOf(" ", cls.length - (mapped?.length ?? 0) - 1) + 1
    );
  }
  return arg;
}

function constructNSSObject<Base, Elem, Cond>({
  parent,
  base,
  elem,
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
  base: NSSBaseFunc<Base, Elem, Cond>;
  elem: NSSElemFunc<Base, Elem, Cond> | null;
  parent: NSSObject<Base, Elem, Cond>;
  mappings: Map<string, string>;
  mappingsLowercase: Map<string, string>;
  baseName: string;
  baseClass: string;
  separator: string;
  afterClass: string;
  values: NSSArg<Base, Elem, Cond>[];
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
    const composed = composeClass<Base, Elem, Cond>({
      base,
      parent,
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

  const nssObject = {
    __nss__: true,
    name: baseName,
    cls,
    c: cls, // alias
    value: baseClass,
    mapped: afterClass.length ? afterClass : null,
    toString: toStringError,
    base,
    elem,
  };

  return nssObject;
}

function composeClass<Base, Elem, Cond>({
  base,
  parent,
  mappings,
  mappingsLowercase,
  prefix,
  values,
  caseSensitive,
  strictBoolChecks,
  acceptArbitraryStrings,
}: {
  base: NSSBaseFunc<Base, Elem, Cond>;
  parent: NSSObject<Base, Elem, Cond>;
  mappings: Map<string, string>;
  mappingsLowercase: Map<string, string>;
  prefix: string;
  values: NSSArg<Base, Elem, Cond>[];
  caseSensitive: boolean;
  strictBoolChecks: boolean;
  acceptArbitraryStrings: boolean;
  //TODO// }): [string, Record<keyof Cond, string>] {
}): string {
  let res = "";
  for (const val of values) {
    if (typeof val === "string" || val instanceof String) {
      // this is a String:
      throw new Error(
        "Do not pass strings directly; enclose in object or array"
      );
    } else if (val) {
      // filter out null, undefined, false, 0, ""
      if ((val as NSSObject<Base, Elem, Cond>)?.base === base) {
        const str = resolveNSSArg(base, parent, val) as string;
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

function extractBaseData<Base, Elem, Cond>(
  name?: null | Record<string, string | number | boolean | null>,
  classMap?: null | NSSClassMap<Base, Elem, Cond>
): [string | null, string | null] {
  let baseName: string | null = null;
  let baseClass: string | null = null;

  if (name && typeof name === "object") {
    const entries = Object.entries(name);
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
      classMap[baseName as keyof Base];
    if (mappedBaseCls) {
      baseClass = (baseClass ? baseClass + " " : "") + mappedBaseCls;
    }
  }

  return [baseName, baseClass];
}

nss.config = config;
nss.configure = configure;
