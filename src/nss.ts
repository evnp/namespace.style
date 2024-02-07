export type NSS<Base, Elem, Cond> = {
  [key in keyof Base]: NSSBaseFunc<Base, Elem, Cond>;
} & NSSBaseFunc<Base, Elem, Cond>;

export type NSSObject<Base, Elem, Cond> = {
  cls: string;
  c: string; // alias
  name: string;
  value: string;
  parent: NSSObject<Base, Elem, Cond>;
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

function isNSSObject(n: unknown) {
  return (n as { toString: unknown })?.toString === toStringError;
}

function isBaseNSSObject(n: unknown) {
  return isNSSObject(n) && n === (n as { parent: unknown })?.parent;
}

function isElemNSSObject(n: unknown) {
  const { parent } = n as { parent: unknown };
  return isBaseNSSObject(parent) && !isCondNSSObject(n);
}

export function isCondNSSObject(n: unknown) {
  const { off } = n as { parent: unknown; off: boolean };
  return isNSSObject(n) && typeof off === "boolean";
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

  const [baseName, baseMappedClass] = extractBaseData<Base, Elem, Cond>(
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
    mappings.set(baseName, baseMappedClass ?? null);
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
    priorClasses: string,
    classPrefix: string,
    parent: NSSObject<Base, Elem, Cond>
  ) {
    return Object.fromEntries(
      Object.entries(cond ?? {}).map(([condName, condClass]) => {
        const priorClasses_ = priorClasses?.length ? priorClasses + " " : "";
        const [mapped, _mapped] = getMapped(condName, condClass);

        function nssCondObject(on?: unknown) {
          // note: standard function rather than arrow-function needed here
          //       so that arguments.length can be correctly inspected;
          //       allows distinction between myCls() and myCls(undefined) calls
          let cls: string;
          let off;
          if (!arguments.length || on) {
            off = false;
            cls = priorClasses_ + classPrefix + condName + _mapped;
          } else {
            off = true;
            cls = priorClasses;
          }
          const nssObject = {
            off,
            cls,
            c: cls, // alias
            name: condName,
            value: classPrefix + condName,
            mapped,
            toString: toStringError,
            parent,
          };
          Object.assign(nssObject, buildCondObjects(cls, classPrefix, parent));
          return nssObject;
        }

        nssCondObject.off = false;
        nssCondObject.cls = priorClasses_ + classPrefix + condName + _mapped;
        nssCondObject.c = nssCondObject.cls; // alias
        nssCondObject.value = classPrefix + condName;
        nssCondObject.mapped = mapped;
        nssCondObject.toString = toStringError;
        nssCondObject.parent = parent;

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
    Object.entries(elem ?? {}).map(([elemName, elemMappedClass]) => {
      const elemClass =
        (baseName ? baseName + elementSeparator : "") + elemName;
      const [mapped, _mapped] = getMapped(elemName, elemMappedClass);

      function nssElemObject(...args: NSSArg<Base, Elem, Cond>[]) {
        return constructNSSObject<Base, Elem, Cond>({
          name: elemName,
          cls: elemClass,
          separator: conditionalSeparator,
          base: nssBaseObject,
          builder: nssElemObject,
          mapped,
          mappings,
          mappingsLowercase,
          values: args,
          caseSensitive: true,
          strictBoolChecks: false,
          acceptArbitraryStrings: true,
        });
      }

      nssElemObject.cls = elemClass + _mapped;
      nssElemObject.c = nssElemObject.cls; // alias
      nssElemObject.value = elemClass;
      nssElemObject.mapped = mapped;
      nssElemObject.toString = toStringError;
      nssElemObject.parent = nssBaseObject;
      nssElemObject.props = function (...args: NSSArg<Base, Elem, Cond>[]) {
        return constructNSSObject<Base, Elem, Cond>({
          name: elemName,
          cls: elemClass,
          separator: conditionalSeparator,
          base: nssBaseObject,
          builder: nssElemObject,
          mapped,
          mappings,
          mappingsLowercase,
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
          elemClass + conditionalSeparator,
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

  const baseNameStr = baseName ?? "";
  const [mapped, _mapped] = getMapped(baseName, baseMappedClass);

  // Create top-level NSS object (en):
  function nssBaseObject(...args: NSSArg<Base, Elem, Cond>[]) {
    return constructNSSObject<Base, Elem, Cond>({
      name: baseNameStr,
      cls: baseNameStr,
      separator: conditionalSeparator,
      base: nssBaseObject,
      builder: nssBaseObject,
      mapped,
      mappings,
      mappingsLowercase,
      values: args,
      caseSensitive: true,
      strictBoolChecks: false,
      acceptArbitraryStrings: true,
    });
  }

  nssBaseObject.cls = baseNameStr + _mapped;
  nssBaseObject.c = nssBaseObject.cls; // alias
  nssBaseObject.value = baseNameStr;
  nssBaseObject.mapped = mapped;
  nssBaseObject.toString = toStringError;
  nssBaseObject.parent = nssBaseObject;
  nssBaseObject.props = function (...args: NSSArg<Base, Elem, Cond>[]) {
    return constructNSSObject<Base, Elem, Cond>({
      name: baseNameStr,
      cls: baseNameStr,
      separator: conditionalSeparator,
      base: nssBaseObject,
      builder: nssBaseObject,
      mapped,
      mappings,
      mappingsLowercase,
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
  builder: NSSObject<Base, Elem, Cond>,
  arg: string | NSSArg<Base, Elem, Cond>
): string | null {
  if (isNSSObject(arg)) {
    const cond = (
      builder as unknown as Record<string, NSSCondFunc<Base, Elem, Cond>>
    )[(arg as { name: string }).name as string];
    let nssObj = cond as NSSObject<Base, Elem, Cond>;
    if (!cond) {
      nssObj = arg as NSSObject<Base, Elem, Cond>;
    } else if ((arg as { off: boolean }).off) {
      return "";
    }
    const { cls, mapped } = nssObj;
    return cls.slice(
      cls.lastIndexOf(" ", cls.length - (mapped?.length ?? 0) - 2) + 1
    );
  } else {
    return null;
  }
}

function constructNSSObject<Base, Elem, Cond>({
  name,
  cls,
  separator,
  base,
  builder,
  mapped,
  mappings,
  mappingsLowercase,
  values,
  caseSensitive,
  strictBoolChecks,
  acceptArbitraryStrings,
}: {
  name: string;
  cls: string;
  separator: string;
  base: NSSObject<Base, Elem, Cond>;
  builder: NSSObject<Base, Elem, Cond>;
  mapped: string | null;
  mappings: Map<string, string>;
  mappingsLowercase: Map<string, string>;
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

  let space;
  let str = mapped ?? "";

  if (values.length) {
    const composed = composeClass<Base, Elem, Cond>({
      builder,
      mappings,
      mappingsLowercase,
      prefix: cls + (cls.length ? separator : ""),
      values,
      caseSensitive,
      strictBoolChecks,
      acceptArbitraryStrings,
    });
    space = str.length && composed.length ? " " : "";
    str += space + composed;
  }

  space = cls.length && str.length && str[0] !== " " ? " " : "";

  const nssObject = {
    __nss__: true,
    name,
    cls: cls + space + str,
    c: cls + space + str, // alias
    value: cls,
    mapped,
    toString: toStringError,
    parent: base,
  };

  return nssObject;
}

function composeClass<Base, Elem, Cond>({
  builder,
  mappings,
  mappingsLowercase,
  prefix,
  values,
  caseSensitive,
  strictBoolChecks,
  acceptArbitraryStrings,
}: {
  builder: NSSObject<Base, Elem, Cond>;
  mappings: Map<string, string>;
  mappingsLowercase: Map<string, string>;
  prefix: string;
  values: NSSArg<Base, Elem, Cond>[];
  caseSensitive: boolean;
  strictBoolChecks: boolean;
  acceptArbitraryStrings: boolean;
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
      const str = resolveNSSArg(builder, val);
      if (str !== null) {
        // if val was an NSS object:
        res += str?.length ? " " + str : "";
      } else {
        // if val was an Object or Array:
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

function getMapped(
  name: string | null,
  mappedClass: unknown
): [string | null, string] {
  const mappedClassStr = (mappedClass ?? "") as string;
  const hasMappedClass = mappedClassStr.length && mappedClassStr !== name;
  const mapped = hasMappedClass ? mappedClassStr : null;
  const _mapped = hasMappedClass ? " " + mappedClassStr : "";
  return [mapped, _mapped];
}

nss.config = config;
nss.configure = configure;
nss.isInstance = isNSSObject;
nss.isBase = isBaseNSSObject;
nss.isElem = isElemNSSObject;
nss.isCond = isCondNSSObject;
