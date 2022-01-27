export function promiseReducer(state = {}, { type, status, payload, error, name }) {
    if (type === 'PROMISE') {
        return {
            ...state,
            [name]: { status, payload: (status === 'PENDING' && state[name] && state[name].payload) || payload, error }
        }
    } else if (type === 'CLEAR-PROMISE') {
        return {
            ...state,
            [name]: {}
        }
    }
    return state;
}