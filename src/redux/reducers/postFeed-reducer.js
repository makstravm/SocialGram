import React from 'react'

export const postsFeedReducer = (state = {}, { type, findId, newResult, userData = {}, count = null }) => {
    const { posts } = state
    const types = {
        'ADD-POSTS-FEED': () => {
            return {
                ...state,
                posts: !!posts ? [...posts, ...newResult] : [...newResult],
                count
            }
        },
        'GET-POST': () => {
            return { ...state, posts: { ...newResult } }

        },
        'ADD-PROFILE-DATA': () => {
            return {
                ...state,
                posts: !!posts ? [...posts, ...newResult] : [...newResult],
                userData,
                count
            }
        },
        'REMOVE-POSTS-FEED': () => {
            return {
                ...state,
                posts: [],
                userData: {},
                count: 0
            }
        },
        'ADD-POST-LIKE': () => {
            return {
                ...state,
                posts: Array.isArray(posts)
                    ? posts.map(p => p._id === findId ? p = { ...p, likes: [...newResult] } : p)
                    : { ...state.posts, likes: [...newResult] },
            }
        },
        'REMOVE-POST-LIKE': () => {
            return {
                ...state,
                posts: Array.isArray(posts)
                    ? posts.map(p => p._id === findId ? p = { ...p, likes: [...newResult] } : p)
                    : { ...state.posts, likes: [...newResult] },
            }
        },
        'ADD-COMMENT': () => {
            return {
                ...state,
                posts: Array.isArray(posts)
                    ? posts.map(p => p._id === findId ? { ...p, comments: [...newResult] } : p)
                    : { ...state.posts, comments: [...newResult] },
            }
        },
        'UPDATE-SUBCOMMENT': () => {
            return {
                ...state,
                posts: {
                    ...state.posts,
                    comments: posts.comments.map(c => c._id === findId ? c = { ...c, answers: [...newResult] } : c)
                }
            }

        },
        'ADD-LIKE-COMMENT': () => {
            console.log(state);
            for (const answers of state.posts.comments) {
                console.log(answers);
            }
            // const newState = [...state].posts.comments.map(c)
            // function findNode(id, currentNode) {
            //     if (id == currentNode.id) {
            //         return currentNode;
            //     } else {
            //         currentNode.children.forEach(function (currentChild) {
            //             findNode(id, currentChild);
            //         });
            //     }
            // }
            return {
                ...state,
                posts: {
                    ...state.posts,
                    comments: posts.comments.map(c => c._id === findId ? c = { ...c, likes: [...newResult] } : c)
                }
            }
        },
        'REMOVE-LIKE-COMMENT': () => {
            // console.log(state);
            return {
                ...state,
                posts: {
                    ...state.posts,
                    comments: posts.comments.map(c => c._id === findId ? c = { ...c, likes: [...newResult] } : c)
                }
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





