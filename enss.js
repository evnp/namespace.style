const config = {
    elementSeparator: "-",
    conditionalSeparator: "--",
    stringAccessorName: "s",
};
export default function enss(nameEnum, elementEnum, conditionalEnum, classMappings) {
    const elemSep = config.elementSeparator;
    const condSep = config.conditionalSeparator;
    nameEnum = omitEnumReverseMappings(nameEnum);
    elementEnum = omitEnumReverseMappings(elementEnum);
    conditionalEnum = omitEnumReverseMappings(conditionalEnum);
    // Extract base name (required) and base class (optional):
    let baseName = null;
    let baseCls = null;
    if (nameEnum && typeof nameEnum === "object") {
        const entries = Object.entries(nameEnum);
        if (entries.length > 1) {
            throw new Error("ENSS Error: Invalid base name provided; enum should have at most 1 field.");
        }
        else if (entries.length === 1) {
            [[baseName, baseCls]] = entries;
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
    if (classMappings && typeof classMappings === "object") {
        const mappings = new Map(Object.entries(classMappings));
        if (baseName) {
            const mappedBaseCls = mappings.get(baseName);
            if (mappedBaseCls) {
                baseCls = (baseCls ? baseCls + " " : "") + mappedBaseCls;
            }
        }
        elementEnum = Object.fromEntries(Object.entries(elementEnum ?? {}).map(([elemName, elemCls]) => {
            const mappedCls = mappings.get(elemName);
            if (mappedCls) {
                if (!elemCls || elemCls === elemName) {
                    return [elemName, mappedCls];
                }
                else {
                    return [elemName, elemCls + " " + mappedCls];
                }
            }
            return [elemName, elemCls];
        }));
        conditionalEnum = Object.fromEntries(Object.entries(conditionalEnum ?? {}).map(([condName, condCls]) => {
            const mappedCls = mappings.get(condName);
            if (mappedCls) {
                if (!condCls || condCls === condName) {
                    return [condName, mappedCls];
                }
                else {
                    return [condName, condCls + " " + mappedCls];
                }
            }
            return [condName, condCls];
        }));
    }
    function unprefix(classes) {
        return classes.map((cls) => {
            if (baseName && typeof cls === "string") {
                const scls = cls;
                const baseCondClsPrefix = baseName + " " + baseName + condSep;
                if (scls.startsWith?.(baseCondClsPrefix)) {
                    return scls?.slice(baseCondClsPrefix.length);
                }
                else if (cls === baseName) {
                    return null;
                }
            }
            return cls;
        });
    }
    function makeCondClassBuilders(baseClass, condClassPrefix, appendClass) {
        return Object.fromEntries(Object.entries(conditionalEnum ?? {}).map(([condName, condCls]) => {
            const condBaseCls = condClassPrefix + condName;
            function builder(on) {
                // note: standard function rather than arrow-function needed here
                //       so that arguments.length can be correctly inspected;
                //       allows distinction between myCls() and myCls(undefined) calls
                let res = "";
                if (on || !arguments.length) {
                    res = (baseClass ? baseClass + " " : "") + condBaseCls;
                    if (appendClass) {
                        res += " " + appendClass;
                    }
                    if (condCls && condCls !== condName) {
                        res += " " + condCls;
                    }
                }
                else {
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
        }));
    }
    const elemClsBuilders = Object.fromEntries(Object.entries(elementEnum ?? {}).map(([elemName, elemCls]) => {
        const elemBaseCls = (baseName ? baseName + elemSep : "") + elemName;
        function builder(...classes) {
            let res = elemBaseCls;
            if (classes.length) {
                const normalized = normalizeClass(res + condSep, ...unprefix(classes));
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
        Object.assign(builder, makeCondClassBuilders(elemBaseCls, elemBaseCls + condSep, elemCls && elemCls !== elemName ? elemCls : null));
        return [elemName, builder];
    }));
    // Create top-level ENSS object (en):
    function mainClsBuilder(...classes) {
        let res = baseName ?? "";
        if (classes.length) {
            const normalized = normalizeClass(res + condSep, ...unprefix(classes));
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
    Object.assign(mainClsBuilder, makeCondClassBuilders(baseName, baseName ? baseName + condSep : "", baseCls));
    return mainClsBuilder;
}
// Loosely based on Vue 3's normalizeClass util:
// github.com/vuejs/vue-next/blob/master/packages/shared/src/normalizeProp.ts
//
function normalizeClass(prefix, ...values) {
    let res = "";
    for (const val of values) {
        // filter out null, undefined, false, 0, "":
        if (val) {
            if (typeof val === "string" || val instanceof String) {
                res += prefix + val + " ";
            }
            else if (Array.isArray(val)) {
                throw new Error("ENSS Error: Spread arrays instead of passing directly" +
                    "\neg. cc.mycls(...myarr) instead of cc.mycls(myarr)");
            }
            else {
                let entries;
                try {
                    entries = Object.entries(val);
                }
                catch (e) {
                    entries = null;
                }
                if (!entries?.length) {
                    throw new Error(`ENSS Error: Invalid input ${JSON.stringify(val)}.`);
                }
                for (const [name, on] of entries) {
                    if (on) {
                        res += prefix + name + " ";
                    }
                }
            }
        }
    }
    return res.trim();
}
function omitEnumReverseMappings(enumObj) {
    return !enumObj
        ? enumObj
        : Object.fromEntries(Object.entries(enumObj)
            .filter(([key]) => !Number.isInteger(Number(key)))
            .map(([key, val]) => [
            key,
            Number.isInteger(Number(val)) ? null : val,
        ]));
}
enss.configure = function (configUpdate) {
    Object.assign(config, configUpdate);
};
