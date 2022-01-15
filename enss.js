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
exports.__esModule = true;
exports.extractNameEnumData = exports.omitEnumReverseMappings = exports.normalizeClass = void 0;
var defaultConfig = {
    elementSeparator: "-",
    conditionalSeparator: "--",
    strictBoolChecks: true
};
var config = __assign({}, defaultConfig);
function enss(nameEnum, elementEnum, conditionalEnum, classMappings) {
    var _a;
    var elemSep = function () { return config.elementSeparator; };
    var condSep = function () { return config.conditionalSeparator; };
    nameEnum = omitEnumReverseMappings(nameEnum);
    elementEnum = omitEnumReverseMappings(elementEnum);
    conditionalEnum = omitEnumReverseMappings(conditionalEnum);
    if (typeof classMappings === "function") {
        var classMappingsRet = {};
        classMappings = (_a = classMappings(classMappingsRet)) !== null && _a !== void 0 ? _a : classMappingsRet;
    }
    var _b = extractNameEnumData(nameEnum, classMappings), baseName = _b[0], baseCls = _b[1];
    if (classMappings && typeof classMappings === "object") {
        var mappings_1 = new Map(Object.entries(classMappings));
        elementEnum = Object.fromEntries(Object.entries(elementEnum !== null && elementEnum !== void 0 ? elementEnum : {}).map(function (_a) {
            var elemName = _a[0], elemCls = _a[1];
            var mappedCls = mappings_1.get(elemName);
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
        conditionalEnum = Object.fromEntries(Object.entries(conditionalEnum !== null && conditionalEnum !== void 0 ? conditionalEnum : {}).map(function (_a) {
            var condName = _a[0], condCls = _a[1];
            var mappedCls = mappings_1.get(condName);
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
        return classes.map(function (cls) {
            var _a;
            if (baseName && typeof cls === "string") {
                var scls = cls;
                var baseCondClsPrefix = baseName + " " + baseName + condSep();
                if ((_a = scls.startsWith) === null || _a === void 0 ? void 0 : _a.call(scls, baseCondClsPrefix)) {
                    return scls === null || scls === void 0 ? void 0 : scls.slice(baseCondClsPrefix.length);
                }
                else if (cls === baseName) {
                    return null;
                }
            }
            return cls;
        });
    }
    function makeCondClassBuilders(baseClass, condClassPrefix, appendClass) {
        return Object.fromEntries(Object.entries(conditionalEnum !== null && conditionalEnum !== void 0 ? conditionalEnum : {}).map(function (_a) {
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
    var elemClsBuilders = Object.fromEntries(Object.entries(elementEnum !== null && elementEnum !== void 0 ? elementEnum : {}).map(function (_a) {
        var elemName = _a[0], elemCls = _a[1];
        var elemBaseCls = (baseName ? baseName + elemSep() : "") + elemName;
        function builder() {
            var classes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classes[_i] = arguments[_i];
            }
            var res = elemBaseCls;
            if (classes.length) {
                var normalized = normalizeClass.apply(void 0, __spreadArray([config,
                    res + condSep()], unprefix(classes), false));
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
        Object.assign(builder, makeCondClassBuilders(elemBaseCls, elemBaseCls + condSep(), elemCls && elemCls !== elemName ? elemCls : null));
        return [elemName, builder];
    }));
    // Create top-level ENSS object (en):
    function mainClsBuilder() {
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        var res = baseName !== null && baseName !== void 0 ? baseName : "";
        if (classes.length) {
            var normalized = normalizeClass.apply(void 0, __spreadArray([config,
                res + condSep()], unprefix(classes), false));
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
    mainClsBuilder.s = (baseName !== null && baseName !== void 0 ? baseName : "") + (baseCls ? " " + baseCls : "");
    // Set en.name:
    Object.defineProperty(mainClsBuilder, "name", {
        value: baseName,
        writable: false
    });
    // Set en.<baseName>:
    // eg. en.Ship.s
    if (baseName) {
        Object.defineProperty(mainClsBuilder, baseName, {
            value: mainClsBuilder,
            writable: false
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
exports["default"] = enss;
function normalizeClass(config, prefix) {
    var values = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        values[_i - 2] = arguments[_i];
    }
    var res = "";
    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
        var val = values_1[_a];
        // filter out null, undefined, false, 0, "":
        if (val) {
            if (typeof val === "string" || val instanceof String) {
                res += prefix + val + " ";
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
                        res += prefix + name_1 + " ";
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
