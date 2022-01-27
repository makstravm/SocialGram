export const postsFeedReducer = (state = {}, { type, findId, newResult, userData = {}, count = null }) => {
    const { posts } = state
    const types = {

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
            const upsertSubComments = (commentList, id, nR) => {
                return commentList.map(c => {
                    if (c._id === id) {
                        return { ...c, answers: [...nR] }
                    } else if (c?.answers?.length) {
                        return {
                            ...c,
                            answers: upsertSubComments(c.answers, id, nR)
                        }
                    } else {
                        return { ...c }
                    }
                })
            }
            return ({
                ...state, posts: { ...state.posts, comments: upsertSubComments(posts.comments, findId, newResult) }
            })
        },

        'EDIT-COMMENT': () => {
            const { _id, text } = newResult
            const editComments = (commentList, id, nR) => {
                return commentList.map(c => {
                    if (c._id === id) {
                        return { ...c, text: nR }
                    } else if (c?.answers?.length) {
                        return {
                            ...c,
                            answers: editComments(c.answers, id, nR)
                        }
                    } else {
                        return { ...c }
                    }
                })
            }
            return ({
                ...state, posts: { ...state.posts, comments: editComments(posts.comments, _id, text) }
            })
        },

        'UPSERT-LIKE-COMMENT': () => {
            const upsertLikeComments = (commentList, id, nR) => {
                return commentList.map(c => {
                    if (c._id === id) {
                        return { ...c, likes: [...nR] }
                    } else if (c?.answers?.length) {
                        return {
                            ...c,
                            answers: upsertLikeComments(c.answers, id, nR)
                        }
                    } else {
                        return { ...c }
                    }
                })
            }

            return ({
                ...state, posts: {
                    ...state.posts, comments: upsertLikeComments(posts.comments, findId, newResult)
                }
            })
        },
        
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





