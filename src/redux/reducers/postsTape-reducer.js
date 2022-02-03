export const postsTapeReducer = (state = {}, { type, newResult, count, postId }) => {

    const { posts } = state

    const types = {

        'POSTS-TAPE': () => ({
            ...state,
            posts: [...posts || [], ...newResult],
            count: count ? count : state.count
        }),

        'CLEAR-POSTS-TAPE': () => ({
            ...state,
            posts: [],
            count: 0,
        }),

        'POSTS-TAPE-LIKE': () => ({
            ...state,
            posts: posts.map(p => p._id === postId ? p = { ...p, likes: [...newResult] } : p)
        }),

        'ADD-COMMENT-POST-TAPE': () => ({
            ...state,
            posts: posts.map(p => p._id === postId ? p = { ...p, comments: [...newResult] } : p)
        }),
    }

    if (type in types) {
        return types[type]()
    }

    return state
}





