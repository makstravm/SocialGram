import { all, call, delay, fork, join, put, select, takeEvery, takeLatest, takeLeading } from "redux-saga/effects";
import { actionAboutMe, actionAboutMeAC, actionAddComment, actionAddCommentAC, actionAddLikePost, actionAddLikePostAC, actionAddPostsFeedAC, actionAuthLogin, actionFindComment, actionFullAboutMe, actionFullLogIn, actionGetAvatar, actionLoadSearchUsers, actionLoadSubscribe, actionloadUnSubscribe, actionLogIn, actionMyLikePost, actionPending, actionPostsCount, actionPostsMyFollowing, actionProfileData, actionProfileDataAC, actionProfilePagePost, actionRegister, actionRejected, actionRemoveLikePost, actionRemoveLikePostAC, actionResolved, actionSetAvatar, actionUpdateFollowers, actionUpdateFollowersAC, actionUpdateMyAvatart, actionUpdateMyFollowing } from "../../actions";


//*************** Promise ******************//


function* promiseWorker({ name, promise }) {
    yield put(actionPending(name))
    try {
        let data = yield promise
        yield put(actionResolved(name, data))
        return data
    }
    catch (error) {
        yield put(actionRejected(name, error))
    }
}

function* promiseWatcher() {
    yield takeEvery('PROMISE_START', promiseWorker)
}


//*************** AUTHORIZATION ******************//


function* logInWorker({ login, password, remember }) {
    const token = yield call(promiseWorker, actionLogIn(login, password))
    if (token) {
        yield put(actionAuthLogin(token, remember))
        yield put(actionFullAboutMe())
    }
}

function* fullRegisrterWorker({ login, password, remember }) {
    yield call(promiseWorker, actionRegister(login, password))
    yield put(actionFullLogIn(login, password, remember))
}

function* loginWatcher() {
    yield takeEvery('FULL_LOGIN', logInWorker)
    yield takeEvery('FULL_REGISTER', fullRegisrterWorker)
}


//*************** ABOUT ME ******************//


function* aboutMeWorker() {
    const { auth } = yield select()
    if (auth?.payload?.sub?.id) {
        const data = yield call(promiseWorker, actionAboutMe(auth?.payload?.sub?.id))
        if (data) {
            yield put(actionAboutMeAC(data))
        }
    }
}

function* aboutMeWatcher() {
    yield takeEvery('ABOUT_ME', aboutMeWorker)
}


//*************** POSTS FEED ******************//


function* postsFeedWorker() {
    const {
        postsFeed: { posts, count },
        myData: { following }
    } = yield select()
    const newArrFollowing = following.map(f => f._id)
    if (posts?.length !== (count ? count : 1)) {
        const taskPosts = yield fork(promiseWorker, actionPostsMyFollowing(posts?.length, newArrFollowing))
        const taskCount = yield fork(promiseWorker, actionPostsCount(newArrFollowing))

        const [postsResult, countResult] = yield join([taskPosts, taskCount])

        if (postsResult && countResult) {
            yield put(actionAddPostsFeedAC(postsResult, countResult))
        }
    }

}

function* postsFeedWatcher() {
    yield takeLeading('POSTS_FEED', postsFeedWorker)
}


//*************** DATA PROFILE ******************//


function* dataProfileWorker({ id }) {
    const { postsFeed: { posts, count, userData } } = yield select()

    if ((posts?.length ? posts?.length : 0) < (count ? count : 1)) {
        if (!count) {
            const taskDataProfile = yield fork(promiseWorker, actionProfileData(id))
            const taskUserPosts = yield fork(promiseWorker, actionProfilePagePost(id, (posts?.length ? posts?.length : 0)))
            const taskCountPosts = yield fork(promiseWorker, actionPostsCount([id]))

            const [dataProfile, userPosts, countPosts] = yield join([taskDataProfile, taskUserPosts, taskCountPosts])

            if (dataProfile && userPosts) {
                yield put(actionProfileDataAC(userPosts, countPosts, dataProfile))
            }
        } else {
            console.log(2, posts.length);
            const userPosts = yield call(promiseWorker, actionProfilePagePost(id, posts?.length))
            if (userPosts) {
                yield put(actionProfileDataAC(userPosts, count, userData))
            }
        }
    }
}

function* dataProfileWatcher() {
    yield takeLeading('DATA_PROFILE', dataProfileWorker)
}


//*************** Find Users ******************//


function* findUserWorker({ value }) {
    yield delay(1500)
    yield call(promiseWorker, actionLoadSearchUsers(value))
}

function* findUserWatcher() {
    yield takeLatest('SEARCH_USERS', findUserWorker)
}


//*************** Like POST ******************//


function* addLikePostWorker({ postId }) {
    yield call(promiseWorker, actionAddLikePost(postId))
    const { likes } = yield call(promiseWorker, actionMyLikePost(postId))
    if (likes) {
        yield put(actionAddLikePostAC(postId, likes))
    }
}

function* delLikePostWorker({ likeId, postId }) {
    yield call(promiseWorker, actionRemoveLikePost(likeId))
    const { likes } = yield call(promiseWorker, actionMyLikePost(postId))
    console.log(likes);
    if (likes) {
        yield put(actionRemoveLikePostAC(postId, likes))
    }
}

function* likePostWatcher() {
    yield takeEvery('LIKE_POST', addLikePostWorker)
    yield takeEvery('DEL_LIKE_POST', delLikePostWorker)
}


//*************** SUBSCRIBE ******************//


function* subscribeWorker({ userId }) {
    const { auth: { payload: { sub: { id } } },
        promise: { aboutMe: { payload: { following } } } } = yield select()

    yield call(promiseWorker, actionLoadSubscribe(id, following, userId))
    const taskFollowers = yield fork(promiseWorker, actionUpdateFollowers(userId))
    yield fork(promiseWorker, actionUpdateMyFollowing(id))
    const { followers } = yield join(taskFollowers)

    if (followers) {
        yield put(actionUpdateFollowersAC(followers))
    }
}

function* unSubscribeWorker({ userId }) {
    const { auth: { payload: { sub: { id } } },
        promise: { aboutMe: { payload: { following } } } } = yield select()
    const newArrFollowing = [...following].filter(f => f._id !== userId)
    yield call(promiseWorker, actionloadUnSubscribe(id, newArrFollowing))
    const taskFollowers = yield fork(promiseWorker, actionUpdateFollowers(userId))
    yield fork(promiseWorker, actionUpdateMyFollowing(id))
    const { followers } = yield join(taskFollowers)

    if (followers) {
        yield put(actionUpdateFollowersAC(followers))
    }
}

function* subscribeWatcher() {
    yield takeEvery('UN_SUBSCRIBE', unSubscribeWorker)
    yield takeEvery('SUBSCRIBE', subscribeWorker)

}


//*************** COMMENTS ******************//


function* addCommentWorker({ postId, text }) {
    yield call(promiseWorker, actionAddComment(postId, text))
    const { comments } = yield call(promiseWorker, actionFindComment(postId))
    if (comments) {
        yield put(actionAddCommentAC(postId, comments))
    }
}

function* addCommentWatcher() {
    yield takeEvery('COMMENT_POST', addCommentWorker)
}


//*************** UPLOAD AVATAR ******************//


function* updateAvatarWorker({ file }) {
    const { auth: { payload: { sub: { id } } } } = yield select()
    yield call(promiseWorker, actionSetAvatar(file, id))
    const { avatar } = yield call(promiseWorker, actionGetAvatar(id))
    if (avatar) {
        yield put(actionUpdateMyAvatart(avatar))
    }
}

function* updateAvatarWatcher() {
    yield takeEvery('UPDATE_AVATAR', updateAvatarWorker)
}





export function* rootSaga() {
    yield all([
        promiseWatcher(),
        loginWatcher(),
        aboutMeWatcher(),
        postsFeedWatcher(),
        dataProfileWatcher(),
        findUserWatcher(),
        likePostWatcher(),
        subscribeWatcher(),
        addCommentWatcher(),
        updateAvatarWatcher(),

    ])
}