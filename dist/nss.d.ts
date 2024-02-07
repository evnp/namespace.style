export type NSS<Base, Elem, Cond> = {
    [key in keyof Base]: NSSBaseFunc<Base, Elem, Cond>;
} & NSSBaseFunc<Base, Elem, Cond>;
export type NSSObject<Base, Elem, Cond> = {
    cls: string;
    c: string;
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
export type NSSBaseFunc<Base, Elem, Cond> = NSSBase<Base, Elem, Cond> & ((...args: NSSArg<Base, Elem, Cond>[]) => NSSObject<Base, Elem, Cond>);
export type NSSElemFunc<Base, Elem, Cond> = NSSElem<Base, Elem, Cond> & ((...args: NSSArg<Base, Elem, Cond>[]) => NSSObject<Base, Elem, Cond>);
export type NSSCondFunc<Base, Elem, Cond> = NSSCond<Base, Elem, Cond> & ((on?: unknown) => NSSCond<Base, Elem, Cond> & NSSElem<Base, Elem, Cond>);
export type NSSArg<Base, Elem, Cond> = NSSElem<Base, Elem, Cond> | NSSElemFunc<Base, Elem, Cond> | NSSCond<Base, Elem, Cond> | NSSCondFunc<Base, Elem, Cond> | string[] | Record<string, unknown>;
export type NSSClassMap<Base, Elem, Cond> = Partial<Record<keyof Base | keyof Elem | keyof Cond, string>>;
export type NSSConfig = {
    separator: string;
    elementSeparator: string;
    conditionalSeparator: string;
    caseSensitiveProps: boolean;
};
declare function isNSSObject(n: unknown): boolean;
declare function isBaseNSSObject(n: unknown): boolean;
declare function isElemNSSObject(n: unknown): boolean;
declare function isCondNSSObject(n: unknown): boolean;
declare function getBaseNSSObjectName(n: unknown): string;
declare function nss<Base = object, Elem = object, Cond = object>(name?: null | Record<keyof Base, string | number | boolean>, elem?: null | Record<keyof Elem, string | number | boolean>, cond?: null | Record<keyof Cond, string | number | boolean>, classMap?: null | NSSClassMap<Base, Elem, Cond> | ((classMap: NSSClassMap<Base, Elem, Cond>) => void | NSSClassMap<Base, Elem, Cond>)): NSS<Base, Elem, Cond>;
declare namespace nss {
    var config: {
        separator: string;
        elementSeparator: string;
        conditionalSeparator: string;
        caseSensitiveProps: boolean;
    };
    var configure: (configUpdate: Partial<NSSConfig> | null) => void;
    var isInstance: typeof isNSSObject;
    var isBase: typeof isBaseNSSObject;
    var isElem: typeof isElemNSSObject;
    var isCond: typeof isCondNSSObject;
    var getName: typeof getBaseNSSObjectName;
}
export default nss;
export declare function resolveNSSArg<Base, Elem, Cond>(builder: NSSObject<Base, Elem, Cond>, arg: string | NSSArg<Base, Elem, Cond>): string | null;
