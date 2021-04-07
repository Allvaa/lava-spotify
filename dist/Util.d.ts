export default class Util {
    static try<T>(fn: () => T): T | undefined;
    static tryPromise<T>(fn: () => Promise<T>): Promise<T | undefined>;
    static structuredClone<T>(obj: T): T;
    static mergeDefault<T extends Record<string, unknown>>(def: T, prov: T): T;
}
