import React from 'react'

export const profileReducer = (state = {}, { type, userData, userPosts, newResult }) => {
    const types = {
        'PROFILE-PAGE-DATA': () => {
            return {
                ...state, userData, userPosts
            }
        },
        'UPDATE-FOLLOWING': () => {
            return {
                ...state,
                userData: { ...state.userData, followers: [...newResult] }
            }
        }
    }
    if (type in types) {
        return types[type]()
    }
    return state
}
