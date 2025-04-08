export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
        ? Array<U>
        : T[P] extends object
            ? DeepPartial<T[P]>
            : T[P];
};