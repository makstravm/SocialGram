import { actionAddComment, actionAddCommentAC, actionAddLikePost, actionAddLikePostAC, actionAddPostsFeedAC, actionAuthLogin, actionFindComment, actionLogin, actionMyLikePost, actionPending, actionRegister, actionRejected, actionRemoveLikePost, actionRemoveLikePostAC, actionResolved, actionUserData, actionUserPost, actionAddProfileDataAC, actionSubscribe, actionUpdateFollowers, actionAboutMe } from "../actions"
import { actionMyFolowisgPosts } from "./post-reducer"

export const actionPromise = (name, promise) =>
    async dispatch => {
        dispatch(actionPending(name))
        try {
            let data = await promise
            dispatch(actionResolved(name, data))
            return data
        }
        catch (error) {
            dispatch(actionRejected(name, error))
        }
    }

export const actionFullLogin = (login, password, remember) =>
    async (dispatch) => {
        const token = await dispatch(actionLogin(login, password))
        actionAboutMe()
        if (token) {
            await dispatch(actionAuthLogin(token, remember))
        }
    }

export const actionFullRegister = (login, password, remember) =>
    async dispatch => {
        await actionRegister(login, password)
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            await dispatch(actionAuthLogin(token, remember))
        }
    }

export const actionFullRemoveLikePost = (likeId, postId) =>
    async dispatch => {
        await actionRemoveLikePost(likeId)
        const { likes } = await dispatch(actionMyLikePost(postId))
        console.log(likes);
        if (likes) {
            await dispatch(actionRemoveLikePostAC(postId, likes))
        }
    }

export const actionFullAddLikePost = (postId) =>
    async dispatch => {
        await actionAddLikePost(postId)
        const { likes } = await dispatch(actionMyLikePost(postId))
        if (likes) {
            await dispatch(actionAddLikePostAC(postId, likes))
        }
    }

export const actionAddPostsFeed = (skip) =>
    async dispatch => {
        let posts = await dispatch(actionMyFolowisgPosts(skip))
        if (posts) {
            await dispatch(actionAddPostsFeedAC(posts))
        }
    }

export const actionFullAddComment = (postId, text) =>
    async dispatch => {
        await actionAddComment(postId, text)
        const { comments } = await dispatch(actionFindComment(postId))
        if (comments) {
            await dispatch(actionAddCommentAC(postId, comments))
        }
    }

export const actionProfilePageData = (id) =>
    async dispatch => {
        const userData = await dispatch(actionUserData(id))
        const userPosts = await dispatch(actionUserPost(id))
        if (userData, userPosts) {
            await dispatch(actionAddProfileDataAC(userData, userPosts))
        }
    }

export const actionFullSubscribe = (userId) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } },
            promise: { dataProfileAuth: { payload: { following } } } } = getState()
        console.log(id, following, userId)
        // actionSubscribe(id, following, userId)
        const followers = await dispatch(actionUpdateFollowers(userId))
        console.log(followers);
        // const userData = await dispatch(actionUserData(id))
        // const userPosts = await dispatch(actionUserPost(id))
        // if (userData, userPosts) {
        //     dispatch(actionAddProfileDataAC(userData, userPosts))
        // }
    }