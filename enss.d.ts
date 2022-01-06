export declare type ENSS<NameEnum, ElementEnum, ConditionalEnum> = {
    [key in keyof NameEnum]: ENSSFunc<ElementEnum, ConditionalEnum>;
} & ENSSFunc<ElementEnum, ConditionalEnum>;
export declare type ENSSFunc<ElementEnum, ConditionalEnum> = {
    [key in keyof ElementEnum]: ENSSElementFunc<ConditionalEnum>;
} & ENSSElementFunc<ConditionalEnum>;
export declare type ENSSElementFunc<ConditionalEnum> = {
    [key in keyof ConditionalEnum]: ENSSConditionalFunc<ConditionalEnum>;
} & ((...classes: ENSSArg<ConditionalEnum>[]) => string) & {
    s: string;
};
export declare type ENSSConditionalFunc<ConditionalKey> = ((on?: unknown) => ConditionalKey) & {
    s: string;
};
export declare type ENSSArg<T> = null | undefined | boolean | T | Record<keyof T, boolean>;
export declare type ENSSConfig = {
    elementSeparator: string;
    conditionalSeparator: string;
};
declare function enss<NameEnum = "", ElementEnum = "", ConditionalEnum = "">(nameEnum?: null | Record<keyof NameEnum, string | number>, elementEnum?: null | Record<keyof ElementEnum, string | number>, conditionalEnum?: null | Record<keyof ConditionalEnum, string | number>, classMappings?: null | Partial<Record<keyof NameEnum | keyof ElementEnum | keyof ConditionalEnum, string>>): ENSS<NameEnum, ElementEnum, ConditionalEnum>;
declare namespace enss {
    var configure: (configUpdate: Partial<ENSSConfig>) => void;
}
export default enss;
export declare function normalizeClass<T>(prefix: string, ...values: ENSSArg<T>[]): string;
export declare function omitEnumReverseMappings<T>(enumObj: T): T;
export declare function extractNameEnumData(nameEnum?: null | Record<string, string | number | null>, classMappings?: null | Record<string, string>): [string | null, string | null];
