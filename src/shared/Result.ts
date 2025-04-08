export type Result<S, F> = { type: "success"; value: S } | { type: "failure"; value: F };

export function succeed<S>(success: S): Result<S, never> {
    return {type: "success", value: success};
}

export function fail<F>(failure: F): Result<never, F> {
    return {type: "failure", value: failure};
}

export function mapSuccess<S, F, SS>(result: Result<S, F>, successMapper: (success: S) => SS): Result<SS, F> {
    switch (result.type) {
        case "success":
            return succeed(successMapper(result.value));
        case "failure":
            return fail(result.value);
    }
}

export function mapFailure<S, F, FF>(result: Result<S, F>, failureMapper: (failure: F) => FF): Result<S, FF> {
    switch (result.type) {
        case "success":
            return succeed(result.value);
        case "failure":
            return fail(failureMapper(result.value));
    }
}

export function map<S, F, SS, FF>(
    result: Result<S, F>,
    successMapper: (success: S) => SS,
    failureMapper: (failure: F) => FF
): Result<SS, FF> {
    switch (result.type) {
        case "success":
            return succeed(successMapper(result.value));
        case "failure":
            return fail(failureMapper(result.value));
    }
}