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
    elementSeparator: "-",
    conditionalSeparator: "--",
};
var config = __assign({}, defaultConfig);
function toStringError() {
    throw new Error("Don't coerce to string directly; use .c or .s (aliases: .cls .str)");
}
function nss(nameEnum, elemEnum, condEnum, classMap) {
    var _a;
    var elemSep = function () { return config.elementSeparator; };
    var condSep = function () { return config.conditionalSeparator; };
    nameEnum = omitEnumReverseMappings(nameEnum);
    elemEnum = omitEnumReverseMappings(elemEnum);
    condEnum = omitEnumReverseMappings(condEnum);
    if (typeof classMap === "function") {
        var classMapRet = {};
        classMap = (_a = classMap(classMapRet)) !== null && _a !== void 0 ? _a : classMapRet;
    }
    var _b = extractNameEnumData(nameEnum, classMap), baseName = _b[0], baseClass = _b[1];
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
        }
        else {
            mappings.set(name, null);
        }
        return [name, cls];
    }
    // Cross-pollinate class mappings between enums and auxilliary mapping object:
    var mapEntries = Object.entries(classMap !== null && classMap !== void 0 ? classMap : []);
    var mappings = new Map(mapEntries);
    if (baseName) {
        mappings.set(baseName, baseClass !== null && baseClass !== void 0 ? baseClass : null);
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
                // Set en.cond.name:
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
        var classPrefix = baseName ? baseName + elemSep() : "";
        function builder() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return constructNSSObject({
                builder: builder,
                mappings: mappings,
                baseName: elemName,
                baseClass: classPrefix + elemName,
                separator: condSep(),
                afterClass: afterClass,
                values: args,
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
                baseName: elemName,
                baseClass: classPrefix + elemName,
                separator: condSep(),
                afterClass: afterClass,
                values: args,
                strictBoolChecks: true,
            });
        };
        Object.assign(builder, makeCondClassBuilders(builder.c, classPrefix + elemName + condSep()));
        // Set en.elem.name:
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
            baseName: baseName !== null && baseName !== void 0 ? baseName : "",
            baseClass: basePriorClass,
            separator: condSep(),
            afterClass: baseAfterClass,
            values: args,
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
            baseName: baseName !== null && baseName !== void 0 ? baseName : "",
            baseClass: basePriorClass,
            separator: condSep(),
            afterClass: baseAfterClass,
            values: args,
            strictBoolChecks: true,
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
    Object.assign(mainClsBuilder, makeCondClassBuilders(mainClsBuilder.c, baseName ? baseName + condSep() : ""));
    return mainClsBuilder;
}
exports.default = nss;
// resolveNSSArg maps basic cond expressions (eg. en.myCond) to their corresponding
// namespaced cond expressions (eg. en.myElem.myCond) when composing conditionals:
// en.myElem(en.myCondA, en.myCondB)
// This obviates the need to supply fully-namespaced conditionals in this case, eg.
// en.myElem(en.myElem.myCondA, en.myElem.myCondB)
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
    var builder = _a.builder, mappings = _a.mappings, baseName = _a.baseName, baseClass = _a.baseClass, separator = _a.separator, afterClass = _a.afterClass, values = _a.values, _b = _a.strictBoolChecks, strictBoolChecks = _b === void 0 ? false : _b;
    baseName = baseName !== null && baseName !== void 0 ? baseName : "";
    var space;
    var str = afterClass;
    if (values.length) {
        var composed = composeClass({
            builder: builder,
            mappings: mappings,
            prefix: baseClass + (baseName ? separator : ""),
            values: values,
            strictBoolChecks: strictBoolChecks,
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
    var builder = _a.builder, mappings = _a.mappings, prefix = _a.prefix, values = _a.values, _c = _a.strictBoolChecks, strictBoolChecks = _c === void 0 ? false : _c;
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
                for (var _d = 0, entries_1 = entries; _d < entries_1.length; _d++) {
                    var _e = entries_1[_d], name_1 = _e[0], on = _e[1];
                    if (on === true || // only recognize boolean values
                        (!strictBoolChecks && on) // unless strictBoolChecks=false
                    ) {
                        res += " " + prefix + name_1;
                        var mappedCls = mappings === null || mappings === void 0 ? void 0 : mappings.get(name_1);
                        if ((mappedCls === null || mappedCls === void 0 ? void 0 : mappedCls.length) &&
                            (typeof mappedCls === "string" ||
                                mappedCls instanceof String)) {
                            res += " " + mappedCls;
                        }
                    }
                    // Ignore classes associated with all other `on` values, even those
                    // that are "truthy". This allows easily passing props objects into
                    // nss where boolean props are meant to be used as classes, but
                    // all other props should be ignored.
                    // If "truthiness" checks are desired, input must simply be cast to
                    // bool first, eg. en({ myclass: !!myprop })
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
nss.configure = function (configUpdate) {
    Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
};
