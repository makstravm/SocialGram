export const routeReducer = (state = {}, { type, match }) => {
    if (type === 'ROUTE')
        return match
    return state
}