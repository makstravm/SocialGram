import React from 'react'

export const postsFeedReducer = (state = {}, { type, postId, newResult, userData = {}, count = null }) => {
    const { posts } = state
    const types = {
        'ADD-POSTS-FEED': () => {
            return {
                ...state,
                posts: !!posts ? [...posts, ...newResult] : [...newResult],
                userData: { ...userData },
                count
            }
        },
        'REMOVE-POSTS-FEED': () => {
            return {
                ...state,
                posts: [],
                userData: {}
            }
        },
        'ADD-POST-LIKE': () => {
            return {
                ...state,
                posts: posts.map(p => p._id === postId ? p = { ...p, likes: [...newResult] } : p),
            }
        },
        'REMOVE-POST-LIKE': () => {
            return {
                ...state,
                posts: posts.map(p => p._id === postId ? p = { ...p, likes: [...newResult] } : p),
            }
        },
        'ADD-COMMENT': () => {
            return {
                ...state,
                posts: posts.map(p => p._id === postId ? { ...p, comments: [...newResult] } : p)
            }
        },
        'UPDATE-FOLLOWERS': () => {
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





