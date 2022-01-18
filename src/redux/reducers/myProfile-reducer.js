import React from 'react'

export const myProfileReducer = (state = {}, { type, data }) => {
    const types = {
        'ABOUTME-DATA-ADD': () => {
            return { ...state, ...data }
        },
        'ABOUTME-UPDATE-AVATAR': () => {
            return { ...state, avatar: { ...data } }
        },
        'UPDATE-MY-FOLLOWING': () => {
            return { ...state, following: [...data] }
        }
    }
    if (type in types) {
        return types[type]()
    }
    return state
}
