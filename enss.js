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
exports.resolveENSSArg = void 0;
var defaultConfig = {
    elementSeparator: "-",
    conditionalSeparator: "--",
    strictBoolChecks: true,
};
var config = __assign({}, defaultConfig);
function toStringError() {
    throw new Error("Do not coerce to string directly; use .c (.class) or .s (.string)");
}
function enss(nameEnum, elemEnum, condEnum, classMap) {
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
                    var __enssCondOff__;
                    if (!arguments.length ||
                        on === true || // only recognize boolean values
                        (!config.strictBoolChecks && on) // unless strictBoolChecks=false
                    ) {
                        __enssCondOff__ = false;
                        str = classPrefix + condName + afterClass;
                        cls = priorClass + str;
                    }
                    else {
                        __enssCondOff__ = true;
                        str = "";
                        cls = classPrelude !== null && classPrelude !== void 0 ? classPrelude : "";
                    }
                    return __assign(__assign({ __enss__: true }, (__enssCondOff__ ? { __enssCondOff__: true } : {})), { name: condName, class: cls, c: cls, string: str, s: str, toString: toStringError });
                }
                builder.__enss__ = true;
                builder.string = builder.s = classPrefix + condName + afterClass;
                builder.class = builder.c = priorClass + builder.string;
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
        var space;
        var afterClass = elemClass && elemClass !== elemName ? elemClass : "";
        var classPrefix = baseName ? baseName + elemSep() : "";
        function builder() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var str = afterClass;
            if (args.length) {
                var composed = composeClass(builder, config, mappings, classPrefix + elemName + condSep(), args);
                space = str.length && composed.length ? " " : "";
                str += space + composed;
            }
            var cls = classPrefix + elemName;
            space = cls.length && str.length && str[0] !== " " ? " " : "";
            cls += space + str;
            return {
                __enss__: true,
                name: elemName,
                class: cls,
                c: cls,
                string: str,
                s: str,
                toString: toStringError,
            };
        }
        builder.__enss__ = true;
        builder.string = builder.s = afterClass;
        var prefix = classPrefix + elemName;
        space = prefix.length && builder.string.length ? " " : "";
        builder.class = builder.c = prefix + space + builder.string;
        builder.toString = toStringError;
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
    var classPrefix = baseName ? baseName + condSep() : "";
    // Create top-level ENSS object (en):
    function mainClsBuilder() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var str = baseAfterClass;
        if (args.length) {
            var composed = composeClass(mainClsBuilder, config, mappings, classPrefix, args);
            var space = str.length && composed.length ? " " : "";
            str += space + composed;
        }
        var cls = basePriorClass + (baseName && str.length ? " " : "") + str;
        return {
            __enss__: true,
            name: baseName,
            class: cls,
            c: cls,
            string: str,
            s: str,
            toString: toStringError,
        };
    }
    mainClsBuilder.__enss__ = true;
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
    Object.assign(mainClsBuilder, makeCondClassBuilders(mainClsBuilder.c, baseName ? baseName + condSep() : ""));
    return mainClsBuilder;
}
exports.default = enss;
// resolveENSSArg maps basic cond expressions (eg. en.myCond) to their corresponding
// namespaced cond expressions (eg. en.myElem.myCond) when composing conditionals:
// en.myElem(en.myCondA, en.myCondB)
// This obviates the need to supply fully-namespaced conditionals in this case, eg.
// en.myElem(en.myElem.myCondA, en.myElem.myCondB)
function resolveENSSArg(builder, arg) {
    var _a = arg, __enss__ = _a.__enss__, __enssCondOff__ = _a.__enssCondOff__, name = _a.name;
    if (__enss__) {
        var cond = builder[name];
        if (cond) {
            return __enssCondOff__ ? cond(false).string : cond.string;
        }
        else {
            return arg.string;
        }
    }
    return arg;
}
exports.resolveENSSArg = resolveENSSArg;
function composeClass(builder, config, mappings, prefix, values) {
    var _a;
    var res = "";
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        // filter out null, undefined, false, 0, "":
        if (val) {
            if (typeof val === "string" || val instanceof String) {
                // this is a String:
                throw new Error("Do not pass strings directly; enclose in object or array");
            }
            else if ((_a = val) === null || _a === void 0 ? void 0 : _a.__enss__) {
                var str = resolveENSSArg(builder, val);
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
                        throw new Error("ENSS Error: Invalid input ".concat(JSON.stringify(val), "."));
                    }
                }
                for (var _b = 0, entries_1 = entries; _b < entries_1.length; _b++) {
                    var _c = entries_1[_b], name_1 = _c[0], on = _c[1];
                    if (on === true || // only recognize boolean values
                        (!config.strictBoolChecks && on) // unless strictBoolChecks=false
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
            throw new Error("ENSS Error: Invalid name enum provided; should have at most 1 field.");
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
enss.configure = function (configUpdate) {
    Object.assign(config, configUpdate === null ? defaultConfig : configUpdate);
};
