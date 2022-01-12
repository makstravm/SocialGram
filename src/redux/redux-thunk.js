import { actionAddComment, actionAddCommentAC, actionAddLikePost, actionAddLikePostAC, actionAuthLogin, actionFindComment, actionLogin, actionMyLikePost, actionPending, actionRegister, actionRejected, actionRemoveLikePost, actionRemoveLikePostAC, actionResolved, actionSubscribe, actionUpdateFollowers, actionAboutMe, actionProfilePagePost, actionProfilePageDataAC, actionProfilePageData, actionUnSubscribe, actionUpdateFollowingAC, actionRenderPostsAC, actionRenderPostsFeedAC } from "../actions"
import { actionMyFolowingPosts } from "./postsFeed-reducer"

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

export const actionRenderPostsFeed = (skip) =>
    async dispatch => {
        let posts = await dispatch(actionMyFolowingPosts(skip))
        if (posts) {
            await dispatch(actionRenderPostsFeedAC(posts))
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

export const actionFullProfilePageData = (id) =>
    async dispatch => {
        const userData = await dispatch(actionProfilePageData(id))
        const userPosts = await dispatch(actionProfilePagePost(id))
        if (userData && userPosts) {
            await dispatch(actionProfilePageDataAC(userData, userPosts))
        }
    }

export const actionFullSubscribe = (userId) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } },
            promise: { aboutMe: { payload: { following } } } } = getState()
        await actionSubscribe(id, following, userId)
        await dispatch(actionAboutMe())
        const { followers } = await dispatch(actionUpdateFollowers(userId))

        if (followers) {
            await dispatch(actionUpdateFollowingAC(followers))
        }
    }

export const actionFullUnSubscribe = (userId) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } },
            promise: { aboutMe: { payload: { following } } } } = getState()
        const newArrFollowing = [...following].filter(f => f._id !== userId)
        await actionUnSubscribe(id, newArrFollowing)
        await dispatch(actionAboutMe())
        const { followers } = await dispatch(actionUpdateFollowers(userId))

        if (followers) {
            await dispatch(actionUpdateFollowingAC(followers))
        }
    }

