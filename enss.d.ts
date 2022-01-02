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
    stringAccessorName: string;
};
declare function enss<NameEnum = "", ElementEnum = "", ConditionalEnum = "">(nameEnum: Record<keyof NameEnum, string | number>, elementEnum?: Record<keyof ElementEnum, string | number>, conditionalEnum?: Record<keyof ConditionalEnum, string | number>, classMappings?: Partial<Record<keyof NameEnum | keyof ElementEnum | keyof ConditionalEnum, string>>): ENSS<NameEnum, ElementEnum, ConditionalEnum>;
declare namespace enss {
    var configure: (configUpdate: Partial<ENSSConfig>) => void;
}
export default enss;
