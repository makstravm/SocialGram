import React from 'react'

export const postsFeedReducer = (state = {}, { type, findId, newResult, userData = {}, count = null }) => {
    const { posts } = state
    const types = {
        //=== Array.isArray(newResult)
        'ADD-POSTS-FEED': () => ({
            ...state,
            posts: Array.isArray(newResult)
                ? [...posts, ...newResult]
                : { ...posts, ...newResult },
            count
        }),
        'GET-POST': () => ({ ...state, posts: { ...newResult } }),
        'ADD-PROFILE-DATA': () => ({
            ...state,
            posts: !!posts ? [...posts, ...newResult] : [...newResult],
            userData,
            count
        }),
        'REMOVE-POSTS-FEED': () => ({
            ...state,
            posts: [],
            userData: {},
            count: 0,
            subComments: {},
        }),
        'ADD-POST-LIKE': () => ({
            ...state,
            posts: Array.isArray(posts)
                ? posts.map(p => p._id === findId ? p = { ...p, likes: [...newResult] } : p)
                : { ...state.posts, likes: [...newResult] },
        }),
        'REMOVE-POST-LIKE': () => ({
            ...state,
            posts: Array.isArray(posts)
                ? posts.map(p => p._id === findId ? p = { ...p, likes: [...newResult] } : p)
                : { ...state.posts, likes: [...newResult] },

        }),
        'ADD-COMMENT': () => ({
            ...state, posts: { ...state.posts, comments: [...newResult] }

        }),
        'UPDATE-SUBCOMMENT': () => {
            const recursiya = (commentList, id, nR) => {
                return commentList.map(c => {
                    if (c._id === id) {
                        return { ...c, answers: [...nR] }
                    } else if (c?.answers?.length) {
                        return ({
                            ...c,
                            answers: recursiya(c.answers, id, nR)
                        })
                    } else {
                        return ({ ...c })
                    }
                })
            }
            return ({
                ...state, posts: { ...state.posts, comments: recursiya(posts.comments, findId, newResult) }
            })
        },
        'ADD-LIKE-COMMENT': () => ({
            ...state,
            posts: {
                ...state.posts,
                comments: posts.comments.map(c => c._id === findId ? c = { ...c, likes: [...newResult] } : c)

            }
        }),
        'REMOVE-LIKE-COMMENT': () => ({
            ...state,
            posts: {
                ...state.posts,
                comments: posts.comments.map(c => c._id === findId ? c = { ...c, likes: [...newResult] } : c)
            }
        }),
        'UPDATE-FOLLOWERS': () => ({
            ...state,
            userData: { ...state.userData, followers: [...newResult] }
        }),


    }
    if (type in types) {
        return types[type]()
    }
    return state
}





