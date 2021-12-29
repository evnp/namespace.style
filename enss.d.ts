export declare type ENSSArg<T> = null | undefined | boolean | T | Record<keyof T, boolean>;
export declare type ENSSFunc<ConditionalEnum> = {
    s: string;
} & Record<keyof ConditionalEnum, ENSSConditionalFunc<ConditionalEnum>> & ((...classes: ENSSArg<ConditionalEnum>[]) => string);
export declare type ENSSConditionalFunc<ConditionalKey> = {
    s: string;
} & ((on?: unknown) => ConditionalKey);
export declare type ENSS<NameEnum, ElementEnum, ConditionalEnum> = ENSSFunc<ConditionalEnum> & Record<keyof ElementEnum, ENSSFunc<ConditionalEnum>> & Record<keyof ConditionalEnum, ENSSConditionalFunc<ConditionalEnum>> & Record<keyof NameEnum, ENSSFunc<ConditionalEnum> & Record<keyof ElementEnum, ENSSFunc<ConditionalEnum>> & Record<keyof ConditionalEnum, ENSSConditionalFunc<ConditionalEnum>>>;
export interface ENSSConfig {
    elementSeparator: string;
    conditionalSeparator: string;
    stringAccessorName: string;
}
declare function enss<NameEnum = "", ElementEnum = "", ConditionalEnum = "">(nameEnum: Record<keyof NameEnum, string | number>, elementEnum?: Record<keyof ElementEnum, string | number>, conditionalEnum?: Record<keyof ConditionalEnum, string | number>, classMappings?: Partial<Record<keyof NameEnum | keyof ElementEnum | keyof ConditionalEnum, string>>): ENSS<NameEnum, ElementEnum, ConditionalEnum>;
declare namespace enss {
    var configure: (configUpdate: Partial<ENSSConfig>) => void;
}
export default enss;
