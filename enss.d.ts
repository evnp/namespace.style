export declare type ENSS<NameEnum, ElemEnum, CondEnum> = {
    [key in keyof NameEnum]: ENSSBaseFunc<ElemEnum, CondEnum>;
} & {
    mapClasses: () => ENSS<NameEnum, ElemEnum, CondEnum>;
} & ENSSBaseFunc<ElemEnum, CondEnum>;
export declare type ENSSResolvers = {
    c: string;
    class: string;
    s: string;
    string: string;
};
export declare type ENSSBase<ElemEnum, CondEnum> = ENSSElem<ElemEnum, CondEnum> & ENSSCond<CondEnum>;
export declare type ENSSElem<ElemEnum, CondEnum> = {
    [key in keyof ElemEnum]: ENSSElemFunc<ElemEnum, CondEnum>;
} & ENSSResolvers;
export declare type ENSSCond<CondEnum> = {
    [key in keyof CondEnum]: ENSSCondFunc<CondEnum>;
} & ENSSResolvers;
export declare type ENSSBaseFunc<ElemEnum, CondEnum> = ENSSBase<ElemEnum, CondEnum> & ((...args: ENSSArg<ElemEnum, CondEnum>[]) => ENSSElem<CondEnum, ElemEnum>);
export declare type ENSSElemFunc<ElemEnum, CondEnum> = ENSSCond<CondEnum> & ((...args: ENSSArg<ElemEnum, CondEnum>[]) => ENSSCond<CondEnum>);
export declare type ENSSCondFunc<CondEnum> = ENSSCond<CondEnum> & ((on?: unknown) => ENSSCond<CondEnum>);
export declare type ENSSArg<ElemEnum, CondEnum> = ENSSElem<ElemEnum, CondEnum> | ENSSElemFunc<ElemEnum, CondEnum> | ENSSCond<CondEnum> | ENSSCondFunc<CondEnum> | string[] | Record<string, unknown>;
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
export declare function composeClass<ElemEnum, CondEnum>(config: Partial<ENSSConfig>, mappings: null | Map<string, string>, prefix: string, values: ENSSArg<ElemEnum, CondEnum>[]): string;
export declare function omitEnumReverseMappings<T>(enumObj: T): T;
export declare function extractNameEnumData<NameEnum, ElemEnum, CondEnum>(nameEnum?: null | Record<string, string | number | boolean | null>, classMap?: null | ENSSClassMap<NameEnum, ElemEnum, CondEnum>): [string | null, string | null];
