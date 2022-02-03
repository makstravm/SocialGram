//*************** ACTIONS PROMISE ******************//

export const actionPending = name => ({ type: 'PROMISE', status: 'PENDING', name })
export const actionResolved = (name, payload) => ({ type: 'PROMISE', status: 'RESOLVED', name, payload })
export const actionRejected = (name, error) => ({ type: 'PROMISE', status: 'REJECTED', name, error })
export const actionClearPromise = (name) => ({ type: 'CLEAR-PROMISE', name })
export const actionPromise = (name, promise) => ({ type: 'PROMISE_START', name, promise })


//*************** ActionCreator Authorization ******************//


export const actionAuthLoginAC = (token, remember) => ({ type: 'AUTH-LOGIN', token, remember })
export const actionAuthLogoutAC = () => ({ type: 'AUTH-LOGOUT' })

export const actionFullLogInSagaAC = (login, password, remember) => ({ type: 'FULL_LOGIN', login, password, remember })
export const actionFullRegisterSagaAC = (login, password, remember) => ({ type: 'FULL_REGISTER', login, password, remember })


//*************** ActionCreator ABOUT ME ******************//


export const actionAboutMeAC = (data) => ({ type: 'ABOUTME-DATA-ADD', data })
export const actionClearAboutMeDataAC = () => ({ type: 'CLEAR-ABOUTME' })

export const actionAboutMeSagaAC = () => ({ type: 'ABOUT_ME' })
export const actionAboutMeUpsertSagaAC = (nick, login) => ({ type: 'ABOUT_ME_UPSERT', nick, login })


//*************** ActionCreator TAPE POSTS ******************//


export const actionAddPostsInPostsTapeAC = (newResult, count) => ({ type: 'POSTS-TAPE', newResult, count })
export const actionClearPostsTapeAC = () => ({ type: 'CLEAR-POSTS-TAPE' })
export const actionGetPostsTapeSagaAC = () => ({ type: 'GET_POSTS_TAPE' })


//*************** ActionCreator POST ONE ******************//


export const actionPostOneDataAC = (newResult) => ({ type: 'POST-ONE-DATA', newResult })

export const actionClearPostsOneAC = () => ({ type: 'CLEAR-POST-ONE' })


//*************** ActionCreator LIKE POSTS ******************//


export const actionChangeStatusLikePostTapeAC = (postId, newResult) => ({ type: 'POSTS-TAPE-LIKE', postId, newResult })

export const actionChangeLikePostTapeSagaAC = (postId, likeId) => ({ type: 'CHANGE_LIKE_POST_TAPE', postId, likeId })


export const actionChangeStatusLikePostOneAC = (postId, newResult) => ({ type: 'POST-ONE-LIKE', postId, newResult })

export const actionChangeLikePostOneSagaAC = (postId, likeId) => ({ type: 'CHANGE_LIKE_POST_ONE', postId, likeId })


//**************** ActionCreator Collection *********************//


export const actionUpsertCollectionAC = (data) => ({ type: 'UPSERT-COLLECTION', data })
export const actionHandlerUpsertCollectionSagaAC = (_id, flag) => ({ type: 'HANDLER_UPSERT_COLLECTION', _id, flag })

export const actionGetPostsMyCollectionSagaAC = () => ({ type: 'LOAD_COLLECTION' })


//**************** ActionCreator Comments **********************//


export const actionAddCommentPostInTapeAC = (postId, newResult) => ({ type: 'ADD-COMMENT-POST-TAPE', postId, newResult })

export const actionAddCommentPostInTapeSagaAC = (postId, text) => ({ type: 'ADD_COMMENT_POST_TAPE', postId, text })


export const actionAddCommentPostOneAC = (postId, newResult) => ({ type: 'POST-ONE-ADD-COMMENT', postId, newResult })

export const actionAddCommentPostOneSagaAC = (postId, text) => ({ type: 'ADD_COMMENT_POST_ONE', postId, text })


export const actionEditCommentAC = (commentId, newResult) => ({ type: 'EDIT-COMMENT', commentId, newResult })
export const actionEditCommentSagaAC = (commentId, text) => ({ type: 'EDIT_COMMENT', commentId, text })


export const actionUpdateCommentAC = (commentId, newResult) => ({ type: 'UPDATE-COMMENT', commentId, newResult })

export const actionGetSubCommentSagaAC = (commentId) => ({ type: 'GET_SUBCOMMENT', commentId })

export const actionAddSubComment = (commentId, text) => ({ type: 'ADD_SUB_COMMENT', commentId, text })


//****************  ActionCreator Like Comment  *************************//


export const actionLikeCommentAC = (commentId, newResult) => ({ type: 'LIKE-COMMENT', commentId, newResult })

export const actionChangeLikeCommentSagaAC = (commentId, likeId) => ({ type: 'CHANGE_LIKE_COMMENT', commentId, likeId })


//****************  ActionCreator FindUsers *************************//


export const actionSearchAllUsers = (value) => ({ type: 'SEARCH_USERS', value })


//****************  ActionCreator All Posts Users *************************//


export const actionGetAllPostsSagaAC = () => ({ type: 'ALL_POSTS' })


//****************  ActionCreator Profile User **************//


export const actionProfileDataAC = (data) => ({ type: 'PROFILE-DATA', data })
export const actionClearProfileDataAC = () => ({ type: 'CLEAR-PROFILE-DATA' })

export const actionProfileDataSagaAC = (id) => ({ type: 'DATA_PROFILE', id })


//****************  Action Subscribe *****************//

export const actionUpdateMyFollowingAC = (data) => ({ type: 'UPDATE-MY-FOLLOWING', data })
export const actionUpdateUserFollowersAC = (data) => ({ type: 'UPDATE-USER-FOLLOWERS', data })

export const actionChangeSubscribeSagaAC = (userId, followCheck) => ({ type: 'CHANGE_SUBSCRIBE', userId, followCheck })


//****************  Action Change Avatar *****************//

export const actionChangeMyAvatartAC = (data) => ({ type: 'CHANGE-ABOUTME-AVATAR', data })
export const actionChangeAvatarSagaAC = (file) => ({ type: 'UPDATE_AVATAR', file })


//****************  Action Change Avatar *****************//


export const actionCreatePostSagaAC = (images, title, text) => ({ type: 'CREATE_POST', images, text, title })