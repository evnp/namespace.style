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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNSSArg = void 0;
var defaultConfig = {
    separator: "",
    elementSeparator: "",
    conditionalSeparator: "",
    caseSensitiveProps: false,
};
var config = __assign({}, defaultConfig);
function configure(configUpdate) {
    Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
}
function configElementSeparator() {
    var _a, _b;
    if ((_a = config.elementSeparator) === null || _a === void 0 ? void 0 : _a.length) {
        return config.elementSeparator;
    }
    else if ((_b = config.separator) === null || _b === void 0 ? void 0 : _b.length) {
        return config.separator;
    }
    else {
        return "-";
    }
}
function configConditionalSeparator() {
    var _a, _b;
    if ((_a = config.conditionalSeparator) === null || _a === void 0 ? void 0 : _a.length) {
        return config.conditionalSeparator;
    }
    else if ((_b = config.separator) === null || _b === void 0 ? void 0 : _b.length) {
        return config.separator + config.separator;
    }
    else {
        return "--";
    }
}
function toStringError() {
    throw new Error("Don't coerce to string directly; use .c or .s (aliases: .cls .str)");
}
function nss(nameEnum, elemEnum, condEnum, classMap) {
    var _a;
    var elementSeparator = configElementSeparator();
    var conditionalSeparator = configConditionalSeparator();
    nameEnum = omitEnumReverseMappings(nameEnum);
    elemEnum = omitEnumReverseMappings(elemEnum);
    condEnum = omitEnumReverseMappings(condEnum);
    if (typeof classMap === "function") {
        var classMapRet = {};
        classMap = (_a = classMap(classMapRet)) !== null && _a !== void 0 ? _a : classMapRet;
    }
    var _b = extractNameEnumData(nameEnum, classMap), baseName = _b[0], baseClass = _b[1];
    // Cross-pollinate class mappings between enums and auxilliary mapping object:
    var mapEntries = Object.entries(classMap !== null && classMap !== void 0 ? classMap : []);
    var mappings = new Map(mapEntries);
    var mappingsLowercase = new Map(mapEntries.map(function (_a) {
        var k = _a[0];
        return [k.toLowerCase(), k];
    }));
    if (baseName) {
        mappings.set(baseName, baseClass !== null && baseClass !== void 0 ? baseClass : null);
        mappingsLowercase.set(baseName.toLowerCase(), baseName);
    }
    function crossPollinate(_a) {
        var name = _a[0], cls = _a[1];
        var mappedCls = mappings.get(name);
        if (mappedCls) {
            if (!cls || cls === name) {
                return [name, mappedCls];
            }
            else {
                return [name, cls + " " + mappedCls];
            }
        }
        else if (typeof cls === "string" && cls.length) {
            mappings.set(name, cls);
            mappingsLowercase.set(name.toLowerCase(), name);
        }
        else {
            mappings.set(name, null);
            mappingsLowercase.set(name.toLowerCase(), name);
        }
        return [name, cls];
    }
    elemEnum = Object.fromEntries(Object.entries(elemEnum !== null && elemEnum !== void 0 ? elemEnum : {}).map(crossPollinate));
    condEnum = Object.fromEntries(Object.entries(condEnum !== null && condEnum !== void 0 ? condEnum : {}).map(crossPollinate));
    function makeCondClassBuilders(classPrelude, classPrefix) {
        function makeBuilders() {
            return Object.fromEntries(Object.entries(condEnum !== null && condEnum !== void 0 ? condEnum : {}).map(function (_a) {
                var condName = _a[0], condClass = _a[1];
                var priorClass = classPrelude ? classPrelude + " " : "";
                var afterClass = condClass && condClass !== condName ? " " + condClass : "";
                function builder(on) {
                    // note: standard function rather than arrow-function needed here
                    //       so that arguments.length can be correctly inspected;
                    //       allows distinction between myCls() and myCls(undefined) calls
                    var str;
                    var cls;
                    var __nssCondOff__;
                    if (!arguments.length || on) {
                        __nssCondOff__ = false;
                        str = classPrefix + condName + afterClass;
                        cls = priorClass + str;
                    }
                    else {
                        __nssCondOff__ = true;
                        str = "";
                        cls = classPrelude !== null && classPrelude !== void 0 ? classPrelude : "";
                    }
                    return __assign(__assign({ __nss__: true }, (__nssCondOff__ ? { __nssCondOff__: true } : {})), { name: condName, cls: cls, c: cls, // alias
                        str: str, s: str, toString: toStringError });
                }
                builder.__nss__ = true;
                builder.str = builder.s = classPrefix + condName + afterClass;
                builder.cls = builder.c = priorClass + builder.str;
                builder.toString = toStringError;
                // Set n.cond.name:
                Object.defineProperty(builder, "name", {
                    value: condName,
                    writable: false,
                });
                return [condName, builder];
            }));
        }
        return makeBuilders();
    }
    var elemClsBuilders = Object.fromEntries(Object.entries(elemEnum !== null && elemEnum !== void 0 ? elemEnum : {}).map(function (_a) {
        var elemName = _a[0], elemClass = _a[1];
        var afterClass = elemClass && elemClass !== elemName ? elemClass : "";
        var classPrefix = baseName ? baseName + elementSeparator : "";
        function builder() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return constructNSSObject({
                builder: builder,
                mappings: mappings,
                mappingsLowercase: mappingsLowercase,
                baseName: elemName,
                baseClass: classPrefix + elemName,
                separator: conditionalSeparator,
                afterClass: afterClass,
                values: args,
                caseSensitive: true,
                strictBoolChecks: false,
                acceptArbitraryStrings: true,
            });
        }
        builder.__nss__ = true;
        builder.str = builder.s = afterClass;
        var prefix = classPrefix + elemName;
        var space = prefix.length && builder.str.length ? " " : "";
        builder.cls = builder.c = prefix + space + builder.str;
        builder.toString = toStringError;
        builder.props = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return constructNSSObject({
                builder: builder,
                mappings: mappings,
                mappingsLowercase: mappingsLowercase,
                baseName: elemName,
                baseClass: classPrefix + elemName,
                separator: conditionalSeparator,
                afterClass: afterClass,
                values: args,
                caseSensitive: config.caseSensitiveProps,
                strictBoolChecks: true,
                acceptArbitraryStrings: false,
            });
        };
        Object.assign(builder, makeCondClassBuilders(builder.c, classPrefix + elemName + conditionalSeparator));
        // Set n.elem.name:
        Object.defineProperty(builder, "name", {
            value: elemName,
            writable: false,
        });
        return [elemName, builder];
    }));
    var basePriorClass = baseName !== null && baseName !== void 0 ? baseName : "";
    var baseAfterClass = baseClass !== null && baseClass !== void 0 ? baseClass : "";
    // Create top-level NSS object (en):
    function mainClsBuilder() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return constructNSSObject({
            builder: mainClsBuilder,
            mappings: mappings,
            mappingsLowercase: mappingsLowercase,
            baseName: baseName !== null && baseName !== void 0 ? baseName : "",
            baseClass: basePriorClass,
            separator: conditionalSeparator,
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
    mainClsBuilder.props = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return constructNSSObject({
            builder: mainClsBuilder,
            mappings: mappings,
            mappingsLowercase: mappingsLowercase,
            baseName: baseName !== null && baseName !== void 0 ? baseName : "",
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
    Object.defineProperty(mainClsBuilder, "name", {
        value: baseName,
        writable: false,
    });
    // Set n.<baseName>:
    // eg. n.Ship.s
    if (baseName) {
        Object.defineProperty(mainClsBuilder, baseName, {
            value: mainClsBuilder,
            writable: false,
        });
    }
    // Set n.elemA, n.elemB, etc:
    // eg. n.engine.s
    Object.assign(mainClsBuilder, elemClsBuilders);
    // Set n.condA, n.condB, etc:
    // eg. n.part.s
    Object.assign(mainClsBuilder, makeCondClassBuilders(mainClsBuilder.c, baseName ? baseName + conditionalSeparator : ""));
    return mainClsBuilder;
}
exports.default = nss;
// resolveNSSArg maps basic cond expressions (eg. n.myCond) to their corresponding
// namespaced cond expressions (eg. n.myElem.myCond) when composing conditionals:
// n.myElem(n.myCondA, n.myCondB)
// This obviates the need to supply fully-namespaced conditionals in this case, eg.
// n.myElem(n.myElem.myCondA, n.myElem.myCondB)
function resolveNSSArg(builder, arg) {
    var _a = arg, __nss__ = _a.__nss__, __nssCondOff__ = _a.__nssCondOff__, name = _a.name;
    if (__nss__) {
        var cond = builder[name];
        if (cond) {
            return __nssCondOff__ ? cond(false).str : cond.str;
        }
        else {
            return arg.str;
        }
    }
    return arg;
}
exports.resolveNSSArg = resolveNSSArg;
function constructNSSObject(_a) {
    var builder = _a.builder, mappings = _a.mappings, mappingsLowercase = _a.mappingsLowercase, baseName = _a.baseName, baseClass = _a.baseClass, separator = _a.separator, afterClass = _a.afterClass, values = _a.values, caseSensitive = _a.caseSensitive, strictBoolChecks = _a.strictBoolChecks, acceptArbitraryStrings = _a.acceptArbitraryStrings;
    if (!caseSensitive && mappings.size != mappingsLowercase.size) {
        var keys_1 = Array.from(mappings.keys());
        var conflictKeys_1 = [];
        Array.from(mappings.keys()).find(function (key) {
            conflictKeys_1 = keys_1.filter(function (k) { return k.toLowerCase() === key.toLowerCase(); });
            return conflictKeys_1.length > 1;
        });
        var conflict = conflictKeys_1.length
            ? conflictKeys_1.map(function (k) { return "\"".concat(k, "\""); }).join(", ") + " "
            : "";
        throw new Error("You're using multiple class names ".concat(conflict, "that are identical ") +
            "apart from casing; this causes ambiguity when using .props(...)");
    }
    baseName = baseName !== null && baseName !== void 0 ? baseName : "";
    var space;
    var str = afterClass;
    if (values.length) {
        var composed = composeClass({
            builder: builder,
            mappings: mappings,
            mappingsLowercase: mappingsLowercase,
            prefix: baseClass + (baseName ? separator : ""),
            values: values,
            caseSensitive: caseSensitive,
            strictBoolChecks: strictBoolChecks,
            acceptArbitraryStrings: acceptArbitraryStrings,
        });
        space = str.length && composed.length ? " " : "";
        str += space + composed;
    }
    var cls = baseClass;
    space = cls.length && str.length && str[0] !== " " ? " " : "";
    cls += space + str;
    return {
        __nss__: true,
        name: baseName,
        cls: cls,
        c: cls,
        str: str,
        s: str,
        toString: toStringError,
    };
}
function composeClass(_a) {
    var _b;
    var builder = _a.builder, mappings = _a.mappings, mappingsLowercase = _a.mappingsLowercase, prefix = _a.prefix, values = _a.values, caseSensitive = _a.caseSensitive, strictBoolChecks = _a.strictBoolChecks, acceptArbitraryStrings = _a.acceptArbitraryStrings;
    var res = "";
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        // filter out null, undefined, false, 0, "":
        if (val) {
            if (typeof val === "string" || val instanceof String) {
                // this is a String:
                throw new Error("Do not pass strings directly; enclose in object or array");
            }
            else if ((_b = val) === null || _b === void 0 ? void 0 : _b.__nss__) {
                var str = resolveNSSArg(builder, val);
                res += (str === null || str === void 0 ? void 0 : str.length) ? " " + str : "";
            }
            else {
                // this is an Object or Array:
                var entries = void 0;
                if (Array.isArray(val)) {
                    entries = val.map(function (cls) { return [cls, true]; });
                }
                else {
                    try {
                        entries = Object.entries(val);
                    }
                    catch (e) {
                        entries = null;
                    }
                    if (!(entries === null || entries === void 0 ? void 0 : entries.length)) {
                        throw new Error("NSS Error: Invalid input ".concat(JSON.stringify(val), "."));
                    }
                }
                for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
                    var _d = entries_1[_c], name_1 = _d[0], on = _d[1];
                    if (on === true || // only recognize boolean values
                        (!strictBoolChecks && on) // unless strictBoolChecks=false
                    ) {
                        //console.log([name, on]);
                        if (!acceptArbitraryStrings) {
                            if (caseSensitive) {
                                if (!mappings.has(name_1)) {
                                    continue;
                                }
                            }
                            else {
                                if (!mappingsLowercase.has(name_1.toLowerCase())) {
                                    continue;
                                }
                            }
                        }
                        if (caseSensitive) {
                            res += " " + prefix + name_1;
                        }
                        else {
                            res += " " + prefix + mappingsLowercase.get(name_1.toLowerCase());
                        }
                        var mappedCls = caseSensitive
                            ? mappings.get(name_1)
                            : mappings.get(mappingsLowercase.get(name_1.toLowerCase()));
                        if ((mappedCls === null || mappedCls === void 0 ? void 0 : mappedCls.length) &&
                            (typeof mappedCls === "string" ||
                                mappedCls instanceof String)) {
                            res += " " + mappedCls;
                        }
                    }
                }
            }
        }
    }
    return res.slice(1); // trim off leading space
}
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
function extractNameEnumData(nameEnum, classMap) {
    var _a;
    var baseName = null;
    var baseClass = null;
    if (nameEnum && typeof nameEnum === "object") {
        var entries = Object.entries(nameEnum);
        if (entries.length > 1) {
            throw new Error("NSS Error: Invalid name enum provided; should have at most 1 field.");
        }
        else if (entries.length === 1) {
            _a = entries[0], baseName = _a[0], baseClass = _a[1];
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
        var mappedBaseCls = Object.prototype.hasOwnProperty.call(classMap, baseName) &&
            classMap[baseName];
        if (mappedBaseCls) {
            baseClass = (baseClass ? baseClass + " " : "") + mappedBaseCls;
        }
    }
    return [baseName, baseClass];
}
nss.config = config;
nss.configure = configure;
