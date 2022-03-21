export declare type ENSS<NameEnum, ElemEnum, CondEnum> = {
    [key in keyof NameEnum]: ENSSBaseFunc<ElemEnum, CondEnum>;
} & {
    mapClasses: () => ENSS<NameEnum, ElemEnum, CondEnum>;
} & ENSSBaseFunc<ElemEnum, CondEnum>;
export declare type ENSSObject = {
    __enss__: boolean;
    name: string;
    class: string;
    c: string;
    string: string;
    s: string;
    toString: () => string;
};
export declare type ENSSBase<ElemEnum, CondEnum> = {
    [key in keyof ElemEnum]: ENSSElemFunc<CondEnum>;
} & {
    [key in keyof CondEnum]: ENSSCondFunc;
} & ENSSCond;
export declare type ENSSElem<CondEnum> = {
    [key in keyof CondEnum]: ENSSCondFunc;
} & ENSSObject;
export declare type ENSSCond = ENSSObject & {
    __enssCondOff__?: boolean;
};
export declare type ENSSBaseFunc<ElemEnum, CondEnum> = ENSSBase<ElemEnum, CondEnum> & ((...args: ENSSArg<CondEnum>[]) => ENSSElem<CondEnum>);
export declare type ENSSElemFunc<CondEnum> = ENSSElem<CondEnum> & ((...args: ENSSArg<CondEnum>[]) => ENSSCond);
export declare type ENSSCondFunc = ENSSCond & ((on?: unknown) => ENSSCond);
export declare type ENSSArg<CondEnum> = ENSSElem<CondEnum> | ENSSElemFunc<CondEnum> | ENSSCond | ENSSCondFunc | string[] | Record<string, unknown>;
export declare type ENSSClassMap<NameEnum, ElemEnum, CondEnum> = Partial<Record<keyof NameEnum | keyof ElemEnum | keyof CondEnum, string>>;
export declare type ENSSConfig = {
    elementSeparator: string;
    conditionalSeparator: string;
    strictBoolChecks: boolean;
};
declare function enss<NameEnum = object, ElemEnum = object, CondEnum = object>(nameEnum?: null | Record<keyof NameEnum, string | number | boolean>, elemEnum?: null | Record<keyof ElemEnum, string | number | boolean>, condEnum?: null | Record<keyof CondEnum, string | number | boolean>, classMap?: null | ENSSClassMap<NameEnum, ElemEnum, CondEnum> | ((classMap: ENSSClassMap<NameEnum, ElemEnum, CondEnum>) => void | ENSSClassMap<NameEnum, ElemEnum, CondEnum>)): ENSS<NameEnum, ElemEnum, CondEnum>;
declare namespace enss {
    var configure: (configUpdate: Partial<ENSSConfig> | null) => void;
}
export default enss;
export declare function resolveENSSArg<CondEnum>(builder: ENSSObject, arg: string | ENSSArg<CondEnum>): string | ENSSArg<CondEnum>;
