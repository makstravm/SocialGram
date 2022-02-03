
export const profileDataReducer = (state = {}, { type, data }) => {
    const types = {
        'PROFILE-DATA': () => ({ ...state, ...data }),

        'UPDATE-USER-FOLLOWERS': () => ({ ...state, followers: [...data] }),

        'CLEAR-PROFILE-DATA': () => ({})
    }
    if (type in types) {
        return types[type]()
    }
    return state
}
