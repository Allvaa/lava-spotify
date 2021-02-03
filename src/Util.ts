import { deserialize, serialize } from "v8";
export default class Util {
    public static try<T>(fn: () => T): T | undefined {
        try {
            return fn();
        } catch {
            return undefined;
        }
    }

    public static async tryPromise<T>(fn: () => Promise<T>): Promise<T | undefined> {
        try {
            return await fn();
        } catch {
            return undefined;
        }
    }

    public static structuredClone<T>(obj: T): T {
        return deserialize(serialize(obj)) as T;
    }
}
