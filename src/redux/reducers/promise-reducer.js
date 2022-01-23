
export function promiseReducer(state = {}, { type, status, payload, error, name }) {
    if (type === 'PROMISE') {
        return {
            ...state,
            [name]: { status, payload, error }
        }
    } else if (type === 'CLEAR-PROMISE') {
        return {
            ...state,
            [name]: {}
        }
    }
    return state;
}