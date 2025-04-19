export type Result<S> = R<S, Error, Cancellation>;

export function succeed<S>(success: S): R<S, never, never> {
    return {type: "success", value: success};
}

export function fail<F>(failure: F): R<never, F, never> {
    return {type: "failure", value: failure};
}

export function cancel<C>(cancellation: C): R<never, never, C> {
    return {type: "cancellation", value: cancellation}
}

export function cancelStaleRequest(): R<never, never, Cancellation> {
    return {type: "cancellation", value: {reason: "Stale request."}}
}

export function mapSuccess<S, F, C, SS>(result: R<S, F, C>, successMapper: (success: S) => SS): R<SS, F, C> {
    switch (result.type) {
        case "success":
            return succeed(successMapper(result.value));
        case "failure":
            return fail(result.value);
        case "cancellation":
            return cancel(result.value);
    }
}

export function mapFailure<S, F, C, FF>(result: R<S, F, C>, failureMapper: (failure: F) => FF): R<S, FF, C> {
    switch (result.type) {
        case "success":
            return succeed(result.value);
        case "failure":
            return fail(failureMapper(result.value));
        case "cancellation":
            return cancel(result.value);
    }
}

export function map<S, F, C, SS, FF, CC>(
    result: R<S, F, C>,
    successMapper: (success: S) => SS,
    failureMapper: (failure: F) => FF,
    cancellationMapper: (cancellation: C) => CC
): R<SS, FF, CC> {
    switch (result.type) {
        case "success":
            return succeed(successMapper(result.value));
        case "failure":
            return fail(failureMapper(result.value));
        case "cancellation":
            return cancel(cancellationMapper(result.value));
    }
}

export type Cancellation = {
    readonly reason: string;
}

type R<S, F, C> = { type: "success"; value: S } | { type: "failure"; value: F } | {
    type: "cancellation";
    value: C
};