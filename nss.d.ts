export declare type NSS<NameEnum, ElemEnum, CondEnum> = {
    [key in keyof NameEnum]: NSSBaseFunc<ElemEnum, CondEnum>;
} & {
    mapClasses: () => NSS<NameEnum, ElemEnum, CondEnum>;
} & NSSBaseFunc<ElemEnum, CondEnum>;
export declare type NSSObject = {
    __nss__: boolean;
    name: string;
    cls: string;
    c: string;
    str: string;
    s: string;
    toString: () => string;
};
export declare type NSSBase<ElemEnum, CondEnum> = {
    [key in keyof ElemEnum]: NSSElemFunc<CondEnum>;
} & {
    [key in keyof CondEnum]: NSSCondFunc;
} & {
    props: (...args: NSSArg<CondEnum>[]) => NSSElem<CondEnum>;
} & NSSCond;
export declare type NSSElem<CondEnum> = {
    [key in keyof CondEnum]: NSSCondFunc;
} & {
    props: (...args: NSSArg<CondEnum>[]) => NSSElem<CondEnum>;
} & NSSObject;
export declare type NSSCond = NSSObject & {
    __nssCondOff__?: boolean;
};
export declare type NSSBaseFunc<ElemEnum, CondEnum> = NSSBase<ElemEnum, CondEnum> & ((...args: NSSArg<CondEnum>[]) => NSSElem<CondEnum>);
export declare type NSSElemFunc<CondEnum> = NSSElem<CondEnum> & ((...args: NSSArg<CondEnum>[]) => NSSCond);
export declare type NSSCondFunc = NSSCond & ((on?: unknown) => NSSCond);
export declare type NSSArg<CondEnum> = NSSElem<CondEnum> | NSSElemFunc<CondEnum> | NSSCond | NSSCondFunc | string[] | Record<string, unknown>;
export declare type NSSClassMap<NameEnum, ElemEnum, CondEnum> = Partial<Record<keyof NameEnum | keyof ElemEnum | keyof CondEnum, string>>;
export declare type NSSConfig = {
    elementSeparator: string;
    conditionalSeparator: string;
    caseSensitiveProps: boolean;
};
declare function nss<NameEnum = object, ElemEnum = object, CondEnum = object>(nameEnum?: null | Record<keyof NameEnum, string | number | boolean>, elemEnum?: null | Record<keyof ElemEnum, string | number | boolean>, condEnum?: null | Record<keyof CondEnum, string | number | boolean>, classMap?: null | NSSClassMap<NameEnum, ElemEnum, CondEnum> | ((classMap: NSSClassMap<NameEnum, ElemEnum, CondEnum>) => void | NSSClassMap<NameEnum, ElemEnum, CondEnum>)): NSS<NameEnum, ElemEnum, CondEnum>;
declare namespace nss {
    var configure: (configUpdate: Partial<NSSConfig> | null) => void;
}
export default nss;
export declare function resolveNSSArg<CondEnum>(builder: NSSObject, arg: string | NSSArg<CondEnum>): string | NSSArg<CondEnum>;
