
export function promiseReducer(state = {}, { type, status, payload, error, name }) {
    if (type === 'PROMISE') {
        return {
            ...state,
            [name]: { status, payload, error }
        }
    }
    return state;
}