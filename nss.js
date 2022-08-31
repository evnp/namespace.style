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
exports.resolveNSSArg = exports.isCondNSSObject = void 0;
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
    throw new Error("Don't coerce to string directly; use .c (alias: .cls)");
}
function isNSSObject(n) {
    var _a;
    return ((_a = n) === null || _a === void 0 ? void 0 : _a.toString) === toStringError;
}
function isBaseNSSObject(n) {
    var _a;
    return isNSSObject(n) && n === ((_a = n) === null || _a === void 0 ? void 0 : _a.parent);
}
function isElemNSSObject(n) {
    var parent = n.parent;
    return isBaseNSSObject(parent) && !isCondNSSObject(n);
}
function isCondNSSObject(n) {
    var off = n.off;
    return isNSSObject(n) && typeof off === "boolean";
}
exports.isCondNSSObject = isCondNSSObject;
function nss(name, elem, cond, classMap) {
    var _a;
    var elementSeparator = configElementSeparator();
    var conditionalSeparator = configConditionalSeparator();
    name = omitEnumReverseMappings(name);
    elem = omitEnumReverseMappings(elem);
    cond = omitEnumReverseMappings(cond);
    if (typeof classMap === "function") {
        var classMapRet = {};
        classMap = (_a = classMap(classMapRet)) !== null && _a !== void 0 ? _a : classMapRet;
    }
    var _b = extractBaseData(name, classMap), baseName = _b[0], baseMappedClass = _b[1];
    // Cross-pollinate class mappings between enums and auxilliary mapping object:
    var mapEntries = Object.entries(classMap !== null && classMap !== void 0 ? classMap : []);
    var mappings = new Map(mapEntries);
    var mappingsLowercase = new Map(mapEntries.map(function (_a) {
        var k = _a[0];
        return [k.toLowerCase(), k];
    }));
    if (baseName) {
        mappings.set(baseName, baseMappedClass !== null && baseMappedClass !== void 0 ? baseMappedClass : null);
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
    elem = Object.fromEntries(Object.entries(elem !== null && elem !== void 0 ? elem : {}).map(crossPollinate));
    cond = Object.fromEntries(Object.entries(cond !== null && cond !== void 0 ? cond : {}).map(crossPollinate));
    function buildCondObjects(priorClasses, classPrefix, parent) {
        return Object.fromEntries(Object.entries(cond !== null && cond !== void 0 ? cond : {}).map(function (_a) {
            var condName = _a[0], condClass = _a[1];
            var priorClasses_ = (priorClasses === null || priorClasses === void 0 ? void 0 : priorClasses.length) ? priorClasses + " " : "";
            var _b = getMapped(condName, condClass), mapped = _b[0], _mapped = _b[1];
            function nssCondObject(on) {
                // note: standard function rather than arrow-function needed here
                //       so that arguments.length can be correctly inspected;
                //       allows distinction between myCls() and myCls(undefined) calls
                var cls;
                var off;
                if (!arguments.length || on) {
                    off = false;
                    cls = priorClasses_ + classPrefix + condName + _mapped;
                }
                else {
                    off = true;
                    cls = priorClasses;
                }
                var nssObject = {
                    off: off,
                    cls: cls,
                    c: cls,
                    name: condName,
                    value: classPrefix + condName,
                    mapped: mapped,
                    toString: toStringError,
                    parent: parent,
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
        }));
    }
    var nssElemObjects = Object.fromEntries(Object.entries(elem !== null && elem !== void 0 ? elem : {}).map(function (_a) {
        var elemName = _a[0], elemMappedClass = _a[1];
        var elemClass = (baseName ? baseName + elementSeparator : "") + elemName;
        var _b = getMapped(elemName, elemMappedClass), mapped = _b[0], _mapped = _b[1];
        function nssElemObject() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return constructNSSObject({
                name: elemName,
                cls: elemClass,
                separator: conditionalSeparator,
                base: nssBaseObject,
                builder: nssElemObject,
                mapped: mapped,
                mappings: mappings,
                mappingsLowercase: mappingsLowercase,
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
        nssElemObject.props = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return constructNSSObject({
                name: elemName,
                cls: elemClass,
                separator: conditionalSeparator,
                base: nssBaseObject,
                builder: nssElemObject,
                mapped: mapped,
                mappings: mappings,
                mappingsLowercase: mappingsLowercase,
                values: args,
                caseSensitive: config.caseSensitiveProps,
                strictBoolChecks: true,
                acceptArbitraryStrings: false,
            });
        };
        Object.assign(nssElemObject, buildCondObjects(nssElemObject.c, elemClass + conditionalSeparator, nssElemObject));
        // Set n.elem.name:
        Object.defineProperty(nssElemObject, "name", {
            value: elemName,
            writable: false,
        });
        return [elemName, nssElemObject];
    }));
    var baseNameStr = baseName !== null && baseName !== void 0 ? baseName : "";
    var _c = getMapped(baseName, baseMappedClass), mapped = _c[0], _mapped = _c[1];
    // Create top-level NSS object (en):
    function nssBaseObject() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return constructNSSObject({
            name: baseNameStr,
            cls: baseNameStr,
            separator: conditionalSeparator,
            base: nssBaseObject,
            builder: nssBaseObject,
            mapped: mapped,
            mappings: mappings,
            mappingsLowercase: mappingsLowercase,
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
    nssBaseObject.props = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return constructNSSObject({
            name: baseNameStr,
            cls: baseNameStr,
            separator: conditionalSeparator,
            base: nssBaseObject,
            builder: nssBaseObject,
            mapped: mapped,
            mappings: mappings,
            mappingsLowercase: mappingsLowercase,
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
    Object.assign(nssBaseObject, buildCondObjects(nssBaseObject.c, baseName ? baseName + conditionalSeparator : "", nssBaseObject));
    return nssBaseObject;
}
exports.default = nss;
// resolveNSSArg maps basic cond expressions (eg. n.myCond) to their corresponding
// namespaced cond expressions (eg. n.myElem.myCond) when composing conditionals:
// n.myElem(n.myCondA, n.myCondB)
// This obviates the need to supply fully-namespaced conditionals in this case, eg.
// n.myElem(n.myElem.myCondA, n.myElem.myCondB)
function resolveNSSArg(builder, arg) {
    var _a;
    if (isNSSObject(arg)) {
        var cond = builder[arg.name];
        var nssObj = cond;
        if (!cond) {
            nssObj = arg;
        }
        else if (arg.off) {
            return "";
        }
        var cls = nssObj.cls, mapped = nssObj.mapped;
        return cls.slice(cls.lastIndexOf(" ", cls.length - ((_a = mapped === null || mapped === void 0 ? void 0 : mapped.length) !== null && _a !== void 0 ? _a : 0) - 2) + 1);
    }
    else {
        return null;
    }
}
exports.resolveNSSArg = resolveNSSArg;
function constructNSSObject(_a) {
    var name = _a.name, cls = _a.cls, separator = _a.separator, base = _a.base, builder = _a.builder, mapped = _a.mapped, mappings = _a.mappings, mappingsLowercase = _a.mappingsLowercase, values = _a.values, caseSensitive = _a.caseSensitive, strictBoolChecks = _a.strictBoolChecks, acceptArbitraryStrings = _a.acceptArbitraryStrings;
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
    var space;
    var str = mapped !== null && mapped !== void 0 ? mapped : "";
    if (values.length) {
        var composed = composeClass({
            builder: builder,
            mappings: mappings,
            mappingsLowercase: mappingsLowercase,
            prefix: cls + (cls.length ? separator : ""),
            values: values,
            caseSensitive: caseSensitive,
            strictBoolChecks: strictBoolChecks,
            acceptArbitraryStrings: acceptArbitraryStrings,
        });
        space = str.length && composed.length ? " " : "";
        str += space + composed;
    }
    space = cls.length && str.length && str[0] !== " " ? " " : "";
    var nssObject = {
        __nss__: true,
        name: name,
        cls: cls + space + str,
        c: cls + space + str,
        value: cls,
        mapped: mapped,
        toString: toStringError,
        parent: base,
    };
    return nssObject;
}
function composeClass(_a) {
    var builder = _a.builder, mappings = _a.mappings, mappingsLowercase = _a.mappingsLowercase, prefix = _a.prefix, values = _a.values, caseSensitive = _a.caseSensitive, strictBoolChecks = _a.strictBoolChecks, acceptArbitraryStrings = _a.acceptArbitraryStrings;
    var res = "";
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var val = values_1[_i];
        if (typeof val === "string" || val instanceof String) {
            // this is a String:
            throw new Error("Do not pass strings directly; enclose in object or array");
        }
        else if (val) {
            // filter out null, undefined, false, 0, ""
            var str = resolveNSSArg(builder, val);
            if (str !== null) {
                // if val was an NSS object:
                res += (str === null || str === void 0 ? void 0 : str.length) ? " " + str : "";
            }
            else {
                // if val was an Object or Array:
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
                for (var _b = 0, entries_1 = entries; _b < entries_1.length; _b++) {
                    var _c = entries_1[_b], name_1 = _c[0], on = _c[1];
                    if (on === true || // only recognize boolean values
                        (!strictBoolChecks && on) // unless strictBoolChecks=false
                    ) {
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
function extractBaseData(name, classMap) {
    var _a;
    var baseName = null;
    var baseClass = null;
    if (name && typeof name === "object") {
        var entries = Object.entries(name);
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
function getMapped(name, mappedClass) {
    var mappedClassStr = (mappedClass !== null && mappedClass !== void 0 ? mappedClass : "");
    var hasMappedClass = mappedClassStr.length && mappedClassStr !== name;
    var mapped = hasMappedClass ? mappedClassStr : null;
    var _mapped = hasMappedClass ? " " + mappedClassStr : "";
    return [mapped, _mapped];
}
nss.config = config;
nss.configure = configure;
nss.isInstance = isNSSObject;
nss.isBase = isBaseNSSObject;
nss.isElem = isElemNSSObject;
nss.isCond = isCondNSSObject;
