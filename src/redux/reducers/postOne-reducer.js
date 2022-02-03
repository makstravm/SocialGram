export const postOneReducer = (state = {}, { type, commentId, newResult, userData = {}, count = null }) => {

    const changeComments = (commentList, id, nR, find) =>
        commentList.map(c => {
            if (c._id === id) {
                return { ...c, [find]: nR }
            } else if (c?.answers?.length) {
                return {
                    ...c,
                    answers: changeComments(c.answers, id, nR, find)
                }
            } else {
                return { ...c }
            }
        })


    const types = {

        'POST-ONE-DATA': () => ({ ...newResult }),

        'CLEAR-POST-ONE': () => ({}),

        'POST-ONE-LIKE': () => ({ ...state, likes: [...newResult] }),

        'POST-ONE-ADD-COMMENT': () => ({ ...state, comments: [...newResult] }),

        'UPDATE-COMMENT': () => ({
            ...state,
            comments: changeComments(state.comments, commentId, newResult, 'answers')
        }),

        'EDIT-COMMENT': () => ({
            ...state,
            comments: changeComments(state.comments, commentId, newResult.text, 'text')
        }),

        'LIKE-COMMENT': () => ({
            ...state, comments: changeComments(state.comments, commentId, newResult, 'likes')
        }),
    }

    if (type in types) {
        return types[type]()
    }

    return state
}





