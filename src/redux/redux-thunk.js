import { actionAddComment, actionAddCommentAC, actionAddLikePost, actionAddLikePostAC, actionAuthLogin, actionFindComment, actionLogin, actionMyLikePost, actionPending, actionRegister, actionRejected, actionRemoveLikePost, actionRemoveLikePostAC, actionResolved, actionSubscribe, actionUpdateFollowers, actionAboutMe, actionProfilePagePost, actionProfilePageData, actionUnSubscribe, actionMyFolowingPosts, actionAddPostsFeedAC, actionAboutMeAC, actionSetAvatar, actionGetAvatar, actionUpdateMyAvatart, actionUpdateFollowersAC, actionProfilePostCount, actionUpdateMyFollowing } from "../actions"

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

export const actionFullAboutMe = () =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } } } = getState()
        const data = await dispatch(actionAboutMe(id))
        if (data) {
            await dispatch(actionAboutMeAC(data))
        }
    }

export const actionFullLogin = (login, password, remember) =>
    async (dispatch) => {
        const token = await dispatch(actionLogin(login, password))
        if (token) {
            await dispatch(actionAuthLogin(token, remember))
            actionFullAboutMe()
        }
    }

export const actionFullRegister = (login, password, remember) =>
    async dispatch => {
        await dispatch(actionRegister(login, password))
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            await dispatch(actionAuthLogin(token, remember))
        }
    }




export const actionFullRemoveLikePost = (likeId, postId) =>
    async dispatch => {
        await dispatch(actionRemoveLikePost(likeId))
        const { likes } = await dispatch(actionMyLikePost(postId))
        if (likes) {
            await dispatch(actionRemoveLikePostAC(postId, likes))
        }
    }

export const actionFullAddLikePost = (postId) =>
    async dispatch => {
        await dispatch(actionAddLikePost(postId))
        const { likes } = await dispatch(actionMyLikePost(postId))
        if (likes) {
            await dispatch(actionAddLikePostAC(postId, likes))
        }
    }

export const actionAddPostsFeed = (following) =>
    async (dispatch, getState) => {
        const { postsFeed: { posts, count } } = getState()
        if (posts?.length !== (count ? count : 1)) {
            const newArrFollowing = following.map(f => f._id)
            let postsResult = await dispatch(actionMyFolowingPosts(posts?.length, newArrFollowing))
            const countPosts = await dispatch(actionProfilePostCount(newArrFollowing))
            if (postsResult) {
                await dispatch(actionAddPostsFeedAC(countPosts, postsResult))
            }
        }
    }

export const actionFullAddComment = (postId, text) =>
    async dispatch => {
        await dispatch(actionAddComment(postId, text))
        const { comments } = await dispatch(actionFindComment(postId))
        if (comments) {
            await dispatch(actionAddCommentAC(postId, comments))
        }
    }

export const actionFullProfilePageData = (id) =>
    async (dispatch, getState) => {
        const { postsFeed: { posts, count } } = getState()
        if (posts?.length < (count ? count : 1)) {
            const dataProfile = await dispatch(actionProfilePageData(id))
            const userPosts = await dispatch(actionProfilePagePost(id, posts?.length))
            const countPosts = await dispatch(actionProfilePostCount([id]))
            if (dataProfile && userPosts) {
                await dispatch(actionAddPostsFeedAC(countPosts, userPosts, dataProfile))
            }
        }

    }

export const actionFullSubscribe = (userId) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } },
            promise: { aboutMe: { payload: { following } } } } = getState()
        await dispatch(actionSubscribe(id, following, userId))
        const { followers } = await dispatch(actionUpdateFollowers(userId))
        actionUpdateMyFollowing(id)
        if (followers) {
            await dispatch(actionUpdateFollowersAC(followers))
        }
    }

export const actionFullUnSubscribe = (userId) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } },
            myData: { following } } = getState()
        const newArrFollowing = [...following].filter(f => f._id !== userId)
        await dispatch(actionUnSubscribe(id, newArrFollowing))
        const { followers } = await dispatch(actionUpdateFollowers(userId))
        actionUpdateMyFollowing(id)
        if (followers) {
            await dispatch(actionUpdateFollowersAC(followers))
        }
    }

export const actionFullSetAvatar = (file) =>
    async (dispatch, getState) => {
        const { auth: { payload: { sub: { id } } } } = getState()
        await dispatch(actionSetAvatar(file, id))
        const { avatar } = await dispatch(actionGetAvatar(id))
        if (avatar) {
            await dispatch(actionUpdateMyAvatart(avatar))
        }
    }