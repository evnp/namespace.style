"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNameEnumData = exports.omitEnumReverseMappings = exports.normalizeClass = void 0;
var defaultConfig = {
    elementSeparator: "-",
    conditionalSeparator: "--",
    strictBoolChecks: true,
};
var config = __assign({}, defaultConfig);
function enss(nameEnum, elemEnum, condEnum, classMappings) {
    var _a;
    var elemSep = function () { return config.elementSeparator; };
    var condSep = function () { return config.conditionalSeparator; };
    nameEnum = omitEnumReverseMappings(nameEnum);
    elemEnum = omitEnumReverseMappings(elemEnum);
    condEnum = omitEnumReverseMappings(condEnum);
    if (typeof classMappings === "function") {
        var classMappingsRet = {};
        classMappings = (_a = classMappings(classMappingsRet)) !== null && _a !== void 0 ? _a : classMappingsRet;
    }
    var _b = extractNameEnumData(nameEnum, classMappings), baseName = _b[0], baseCls = _b[1];
    // Cross-pollinate class mappings between enums and auxilliary mapping object:
    var mapEntries = Object.entries(classMappings !== null && classMappings !== void 0 ? classMappings : []);
    var mappings = new Map(mapEntries);
    if (baseName) {
        mappings.set(baseName, baseCls !== null && baseCls !== void 0 ? baseCls : null);
    }
    elemEnum = Object.fromEntries(Object.entries(elemEnum !== null && elemEnum !== void 0 ? elemEnum : {}).map(function (_a) {
        var elemName = _a[0], elemCls = _a[1];
        var mappedCls = mappings.get(elemName);
        if (mappedCls) {
            if (!elemCls || elemCls === elemName) {
                return [elemName, mappedCls];
            }
            else {
                return [elemName, elemCls + " " + mappedCls];
            }
        }
        else if (typeof elemCls === "string" && elemCls.length) {
            mappings.set(elemName, elemCls);
        }
        else {
            mappings.set(elemName, null);
        }
        return [elemName, elemCls];
    }));
    condEnum = Object.fromEntries(Object.entries(condEnum !== null && condEnum !== void 0 ? condEnum : {}).map(function (_a) {
        var condName = _a[0], condCls = _a[1];
        var mappedCls = mappings.get(condName);
        if (mappedCls) {
            if (!condCls || condCls === condName) {
                return [condName, mappedCls];
            }
            else {
                return [condName, condCls + " " + mappedCls];
            }
        }
        else if (typeof condCls === "string" && condCls.length) {
            mappings.set(condName, condCls);
        }
        else {
            mappings.set(condName, null);
        }
        return [condName, condCls];
    }));
    function unprefix(classes) {
        return classes.map(function (cls) {
            var _a;
            if (baseName && typeof cls === "string") {
                var scls = cls;
                var condClsPrefix = baseName + " " + baseName + condSep();
                if ((_a = scls.startsWith) === null || _a === void 0 ? void 0 : _a.call(scls, condClsPrefix)) {
                    return scls === null || scls === void 0 ? void 0 : scls.slice(condClsPrefix.length);
                }
                else if (cls === baseName || cls === baseName + " " + baseCls) {
                    return null;
                }
            }
            return cls;
        });
    }
    var clsKeys = Array.from(mappings.keys());
    function unmap(classes) {
        return classes.map(function (cls) {
            if (typeof cls === "string") {
                var keys = "";
                var key = void 0;
                var truncated_1 = cls;
                while ((key = clsKeys.find(function (k) { return truncated_1.startsWith(k); }))) {
                    keys += key + " ";
                    truncated_1 = cls.slice(keys.length);
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
    function makeCondClassBuilders(baseClass, condClassPrefix, appendClass) {
        return Object.fromEntries(Object.entries(condEnum !== null && condEnum !== void 0 ? condEnum : {}).map(function (_a) {
            var condName = _a[0], condCls = _a[1];
            var condBaseCls = condClassPrefix + condName;
            function builder(on) {
                // note: standard function rather than arrow-function needed here
                //       so that arguments.length can be correctly inspected;
                //       allows distinction between myCls() and myCls(undefined) calls
                var res = "";
                if (!arguments.length ||
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
                }
                else {
                    res = baseClass !== null && baseClass !== void 0 ? baseClass : "";
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
    var elemClsBuilders = Object.fromEntries(Object.entries(elemEnum !== null && elemEnum !== void 0 ? elemEnum : {}).map(function (_a) {
        var elemName = _a[0], elemCls = _a[1];
        var elemBaseCls = (baseName ? baseName + elemSep() : "") + elemName;
        function builder() {
            var _a;
            var classes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classes[_i] = arguments[_i];
            }
            var res = elemBaseCls;
            var normalized = "";
            var mapped = "";
            if (classes.length) {
                _a = normalizeClass.apply(void 0, __spreadArray([config,
                    mappings,
                    res + condSep()], unmap(unprefix(classes)), false)), normalized = _a[0], mapped = _a[1];
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
        Object.assign(builder, makeCondClassBuilders(elemBaseCls, elemBaseCls + condSep(), elemCls && elemCls !== elemName ? elemCls : null));
        return [elemName, builder];
    }));
    // Create top-level ENSS object (en):
    function mainClsBuilder() {
        var _a;
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        var res = baseName !== null && baseName !== void 0 ? baseName : "";
        var normalized = "";
        var mapped = "";
        if (classes.length) {
            _a = normalizeClass.apply(void 0, __spreadArray([config,
                mappings,
                res + condSep()], unmap(unprefix(classes)), false)), normalized = _a[0], mapped = _a[1];
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
    mainClsBuilder.s = (baseName !== null && baseName !== void 0 ? baseName : "") + (baseCls ? " " + baseCls : "");
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
    Object.assign(mainClsBuilder, makeCondClassBuilders(baseName, baseName ? baseName + condSep() : "", baseCls));
    return mainClsBuilder;
}
exports.default = enss;
function normalizeClass(config, mappings, prefix) {
    var values = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        values[_i - 3] = arguments[_i];
    }
    var res = "";
    var mappedClasses = [];
    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
        var val = values_1[_a];
        // filter out null, undefined, false, 0, "":
        if (val) {
            if (typeof val === "string" || val instanceof String) {
                res += prefix + val.trim() + " ";
                var mappedCls = mappings === null || mappings === void 0 ? void 0 : mappings.get(val);
                if ((mappedCls === null || mappedCls === void 0 ? void 0 : mappedCls.length) &&
                    (typeof mappedCls === "string" ||
                        mappedCls instanceof String)) {
                    mappedClasses.push(mappedCls.trim());
                }
            }
            else if (Array.isArray(val)) {
                throw new Error("ENSS Error: Spread arrays instead of passing directly," +
                    " eg. cc.mycls(...myarr) instead of cc.mycls(myarr)");
            }
            else {
                var entries = void 0;
                try {
                    entries = Object.entries(val);
                }
                catch (e) {
                    entries = null;
                }
                if (!(entries === null || entries === void 0 ? void 0 : entries.length)) {
                    throw new Error("ENSS Error: Invalid input ".concat(JSON.stringify(val), "."));
                }
                for (var _b = 0, entries_1 = entries; _b < entries_1.length; _b++) {
                    var _c = entries_1[_b], name_1 = _c[0], on = _c[1];
                    if (on === true || // only recognize boolean values
                        (!config.strictBoolChecks && on) // unless strictBoolChecks=false
                    ) {
                        res += prefix + name_1.trim() + " ";
                        var mappedCls = mappings === null || mappings === void 0 ? void 0 : mappings.get(name_1);
                        if ((mappedCls === null || mappedCls === void 0 ? void 0 : mappedCls.length) &&
                            (typeof mappedCls === "string" ||
                                mappedCls instanceof String)) {
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
exports.normalizeClass = normalizeClass;
function omitEnumReverseMappings(enumObj) {
    return !enumObj
        ? enumObj
        : Object.fromEntries(Object.entries(enumObj)
            .filter(function (_a) {
            var key = _a[0];
            return !Number.isInteger(Number(key));
        })
            .map(function (_a) {
            var key = _a[0], val = _a[1];
            return [
                key,
                Number.isInteger(Number(val)) ? null : val,
            ];
        }));
}
exports.omitEnumReverseMappings = omitEnumReverseMappings;
function extractNameEnumData(nameEnum, classMappings) {
    var _a;
    var baseName = null;
    var baseCls = null;
    if (nameEnum && typeof nameEnum === "object") {
        var entries = Object.entries(nameEnum);
        if (entries.length > 1) {
            throw new Error("ENSS Error: Invalid name enum provided; should have at most 1 field.");
        }
        else if (entries.length === 1) {
            _a = entries[0], baseName = _a[0], baseCls = _a[1];
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
        var mappedBaseCls = Object.prototype.hasOwnProperty.call(classMappings, baseName) &&
            classMappings[baseName];
        if (mappedBaseCls) {
            baseCls = (baseCls ? baseCls + " " : "") + mappedBaseCls;
        }
    }
    return [baseName, baseCls];
}
exports.extractNameEnumData = extractNameEnumData;
enss.configure = function (configUpdate) {
    Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
};
