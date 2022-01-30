export const postReducer = (state = {}, { type, findId, newResult, userData = {}, count = null }) => {

    const { posts } = state

    const upsertSubComments = (commentList, id, nR, find) => {
        return commentList.map(c => {
            if (c._id === id) {
                return { ...c, [find]:  nR }
            } else if (c?.answers?.length) {
                return {
                    ...c,
                    answers: upsertSubComments(c.answers, id, nR, find)
                }
            } else {
                return { ...c }
            }
        })
    }

    const types = {

        'ADD-POSTS': () => ({
            ...state,
            posts: Array.isArray(newResult)
                ? [...posts, ...newResult]
                : { ...posts, ...newResult },
            count
        }),

        'ADD-PROFILE-DATA': () => ({
            ...state,
            posts: !!posts ? [...posts, ...newResult] : [...newResult],
            userData,
            count
        }),

        'REMOVE-POSTS': () => ({
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
            ...state,
            posts: Array.isArray(posts)
                ? posts.map(p => p._id === findId ? p = { ...p, comments: [...newResult] } : p)
                : { ...state.posts, comments: [...newResult] }
        }),

        'UPDATE-SUBCOMMENT': () => ({
            ...state, posts: { ...state.posts, comments: upsertSubComments(posts.comments, findId, newResult, 'answers') }
        }),

        'EDIT-COMMENT': () => ({
            ...state, posts: { ...state.posts, comments: upsertSubComments(posts.comments, findId, newResult.text, 'text') }
        }),

        'UPSERT-LIKE-COMMENT': () => ({
            ...state, posts: {
                ...state.posts, comments: upsertSubComments(posts.comments, findId, newResult, 'likes')
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





