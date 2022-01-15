export declare type ENSS<NameEnum, ElemEnum, CondEnum> = {
    [key in keyof NameEnum]: ENSSFunc<ElemEnum, CondEnum>;
} & {
    mapClasses: () => ENSS<NameEnum, ElemEnum, CondEnum>;
} & ENSSFunc<ElemEnum, CondEnum>;
export declare type ENSSFunc<ElemEnum, CondEnum> = {
    [key in keyof ElemEnum]: ENSSElementFunc<CondEnum>;
} & ENSSElementFunc<CondEnum>;
export declare type ENSSElementFunc<CondEnum> = {
    [key in keyof CondEnum]: ENSSConditionalFunc;
} & ((...classes: ENSSArg[]) => string) & {
    s: string;
};
export declare type ENSSConditionalFunc = ((on?: unknown) => string) & {
    s: string;
};
export declare type ENSSArg = null | undefined | boolean | string | Record<string, unknown>;
export declare type ENSSClassRecord<NameEnum, ElemEnum, CondEnum> = Partial<Record<keyof NameEnum | keyof ElemEnum | keyof CondEnum, string>>;
export declare type ENSSConfig = {
    elementSeparator: string;
    conditionalSeparator: string;
    strictBoolChecks: boolean;
};
declare function enss<NameEnum = object, ElemEnum = object, CondEnum = object>(nameEnum?: null | Record<keyof NameEnum, string | number>, elementEnum?: null | Record<keyof ElemEnum, string | number>, conditionalEnum?: null | Record<keyof CondEnum, string | number>, classMappings?: null | ENSSClassRecord<NameEnum, ElemEnum, CondEnum> | ((classMappings: ENSSClassRecord<NameEnum, ElemEnum, CondEnum>) => void | ENSSClassRecord<NameEnum, ElemEnum, CondEnum>)): ENSS<NameEnum, ElemEnum, CondEnum>;
declare namespace enss {
    var configure: (configUpdate: Partial<ENSSConfig> | null) => void;
}
export default enss;
export declare function normalizeClass(config: Partial<ENSSConfig>, prefix: string, ...values: ENSSArg[]): string;
export declare function omitEnumReverseMappings<T>(enumObj: T): T;
export declare function extractNameEnumData<NameEnum, ElemEnum, CondEnum>(nameEnum?: null | Record<string, string | number | null>, classMappings?: null | ENSSClassRecord<NameEnum, ElemEnum, CondEnum>): [string | null, string | null];
