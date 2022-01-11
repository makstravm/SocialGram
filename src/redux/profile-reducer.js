import React from 'react'

export const profileReducer = (state = {}, { type, userData, userPosts }) => {
    const types = {
        'ADD-PROFILE-DATA': () => {
            return {
                ...state, userData, userPosts
            }
        },
        'UPDATE-FOLLOWING':()=>{
            return {
                ...state,
                
            }
        }
    }
    if (type in types) {
        return types[type]()
    }
    return state
}
