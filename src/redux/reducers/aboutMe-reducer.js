
export const aboutMeReducer = (state = {}, { type, data }) => {
    const types = {
        'ABOUTME-DATA-ADD': () => ({ ...state, ...data }),

        'CHANGE-ABOUTME-AVATAR': () =>  ({ ...state, avatar: { ...data } }),

        'UPDATE-MY-FOLLOWING': () => ({ ...state, following: [...data] }),

        'UPSERT-COLLECTION': () => ({...state, collection:data }),
        
        'CLEAR-ABOUTME': () => ({})
    }
    if (type in types) {
        return types[type]()
    }
    return state
}
