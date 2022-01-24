import { all, call, delay, fork, join, put, select, takeEvery, takeLatest, takeLeading } from "redux-saga/effects";
import { actionAboutMe, actionAboutMeAC, actionAddComment, actionAddCommentAC, actionAddLikeComment, actionAddLikeCommentAC, actionAddLikePost, actionAddLikePostAC, actionAddPostsFeedAC, actionAllPostsCount, actionAuthLogin, actionClearPromise, actionFindComment, actionFindLikeComment, actionFindSubComment, actionFullAboutMe, actionFullLogIn, actionGetAllPosts, actionGetAvatar, actionGetFindFollowers, actionGetFindFollowing, actionGetFindLiked, actionGetPostAC, actionLoadSearchUsers, actionLoadSubscribe, actionloadUnSubscribe, actionLogIn, actionMyLikePost, actionPending, actionPostsCount, actionPostsMyFollowing, actionProfileData, actionProfileDataAC, actionProfilePagePost, actionPromise, actionRegister, actionRejected, actionRemoveLikeComment, actionRemoveLikeCommentAC, actionRemoveLikePost, actionRemoveLikePostAC, actionRemovePostsFeedAC, actionResolved, actionSentPost, actionSetAvatar, actionSubAddComment, actionUpdateFollowers, actionUpdateFollowersAC, actionUpdateMyAvatart, actionUpdateMyFollowing, actionUpdateMyFollowingAC, actionUpdateSubCommentAC, actionUpsertAboutMe } from "../../actions";
import { queries } from "../../actions/actionQueries";
import { gql } from "../../helpers";


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


//*************** ROUTE ******************//


function* routeWorker({ match }) {
    if (match.path in queries) {
        const { name, query, variables } = queries[match.path](match)
        const result = yield call(promiseWorker, actionPromise(name, gql(query, variables)))
        if (result) {
            yield put(actionGetPostAC(result))
        }
    }
}

function* routeWatcher() {
    yield takeEvery('ROUTE', routeWorker)
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
    yield all([takeEvery('FULL_LOGIN', logInWorker), takeEvery('FULL_REGISTER', fullRegisrterWorker)])
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

function* aboutMeUpsertWorker({ nick, login }) {
    const { myData: { _id } } = yield select()
    const newMyData = { _id, nick, login }
    console.log(newMyData);
    const result = yield call(promiseWorker, actionUpsertAboutMe(newMyData))
    if (result) {
        yield put(actionAboutMeAC(result))
        yield put(actionClearPromise('upsertAboutMe'))
    }
}


function* aboutMeWatcher() {
    yield all([
        takeEvery('ABOUT_ME', aboutMeWorker),
        takeEvery('ABOUT_ME_UPSERT', aboutMeUpsertWorker),
    ])
}


//*************** POSTS FEED ******************//


function* postsFeedWorker() {
    const {
        postsFeed: { posts, count },
        myData: { following, _id }
    } = yield select()
    !Array.isArray(posts) && (yield put(actionRemovePostsFeedAC()))
    const newArrFollowing = following.map(f => f._id)
    if (posts?.length !== (count ? count : 1)) {
        const taskPosts = yield fork(promiseWorker, actionPostsMyFollowing(posts?.length, [...newArrFollowing, _id]))
        const taskCount = yield fork(promiseWorker, actionPostsCount([...newArrFollowing, _id]))

        const [postsResult, countResult] = yield join([taskPosts, taskCount])

        if (postsResult && countResult) {
            yield put(actionAddPostsFeedAC(postsResult, countResult))
        }
    }
}
function* allPostsFeedWorker() {
    const {
        postsFeed: { posts, count }
    } = yield select()
    !Array.isArray(posts) && (yield put(actionRemovePostsFeedAC()))
    if (posts?.length !== (count ? count : 1)) {
        const taskPosts = yield fork(promiseWorker, actionGetAllPosts(posts?.length))
        const taskCount = yield fork(promiseWorker, actionAllPostsCount())

        const [postsResult, countResult] = yield join([taskPosts, taskCount])

        if (postsResult && countResult) {
            yield put(actionAddPostsFeedAC(postsResult, countResult))
        }
    }
}


function* postsFeedWatcher() {
    yield all([
        takeLeading('POSTS_FEED', postsFeedWorker),
        takeLeading('ALL_POSTS', allPostsFeedWorker),
    ])
}


//*************** DATA PROFILE ******************//


function* dataProfileWorker({ id }) {
    const { postsFeed: { posts, count, userData } } = yield select()
    if ((posts?.length ? posts?.length : 0) < (count ? count : 1)) {
        if (!count) {
            yield put(actionRemovePostsFeedAC())
            const taskDataProfile = yield fork(promiseWorker, actionProfileData(id))
            const taskUserPosts = yield fork(promiseWorker, actionProfilePagePost(id, (posts?.length ? posts?.length : 0)))
            const taskCountPosts = yield fork(promiseWorker, actionPostsCount([id]))

            const [dataProfile, userPosts, countPosts] = yield join([taskDataProfile, taskUserPosts, taskCountPosts])

            if (dataProfile && userPosts) {
                yield put(actionProfileDataAC(userPosts, countPosts, dataProfile))
            }
        } else {
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


//*************** Like POST / COMMENT ******************//


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

function* addLikeCommentWorker({ commentId }) {
    yield call(promiseWorker, actionAddLikeComment(commentId))
    const { likes } = yield call(promiseWorker, actionFindLikeComment(commentId))
    if (likes) {
        yield put(actionAddLikeCommentAC(commentId, likes))
    }
}

function* delLikeCommentWorker({ likeId, commentId }) {
    yield call(promiseWorker, actionRemoveLikeComment(likeId))
    const { likes } = yield call(promiseWorker, actionFindLikeComment(commentId))
    console.log(likes);
    if (likes) {
        yield put(actionRemoveLikeCommentAC(commentId, likes))
    }
}

function* likePostWatcher() {
    yield all([
        takeEvery('LIKE_POST', addLikePostWorker),
        takeEvery('DEL_LIKE_POST', delLikePostWorker),
        takeEvery('LIKE_COMMENT', addLikeCommentWorker),
        takeEvery('DEL_LIKE_COMMENT', delLikeCommentWorker),
    ])
}


//*************** SUBSCRIBE ******************//


function* subscribeWorker({ userId }) {
    const { auth: { payload: { sub: { id } } },
        promise: { aboutMe: { payload: { following: f } } } } = yield select()

    yield call(promiseWorker, actionLoadSubscribe(id, f, userId))
    const taskFollowers = yield fork(promiseWorker, actionUpdateFollowers(userId))
    const taskMyFollowing = yield fork(promiseWorker, actionUpdateMyFollowing(id))
    const [{ followers }, { following }] = yield join([taskFollowers, taskMyFollowing])
    if (followers) {
        yield put(actionUpdateFollowersAC(followers))
        yield put(actionUpdateMyFollowingAC(following))
    }
}

function* unSubscribeWorker({ userId }) {
    const { auth: { payload: { sub: { id } } },
        promise: { aboutMe: { payload: { following: f } } } } = yield select()
    const newArrFollowing = [...f].filter(f => f._id !== userId)
    yield call(promiseWorker, actionloadUnSubscribe(id, newArrFollowing))
    const taskFollowers = yield fork(promiseWorker, actionUpdateFollowers(userId))
    const taskMyFollowing = yield fork(promiseWorker, actionUpdateMyFollowing(id))
    const [{ followers }, { following }] = yield join([taskFollowers, taskMyFollowing])
    if (followers) {
        yield put(actionUpdateFollowersAC(followers))
        yield put(actionUpdateMyFollowingAC(following))
    }
}

function* subscribeWatcher() {
    yield all([takeLeading('UN_SUBSCRIBE', unSubscribeWorker), takeLeading('SUBSCRIBE', subscribeWorker)])

}


//*************** COMMENTS ******************//


function* addCommentWorker({ text }) {
    const { postsFeed: { posts: { _id } } } = yield select()
    console.log(text);
    yield call(promiseWorker, actionAddComment(_id, text))
    const { comments } = yield call(promiseWorker, actionFindComment(_id))
    console.log(comments, _id);
    if (comments) {
        yield put(actionAddCommentAC(comments))
    }
}

function* addSubCommentWorker({ commentId, text }) {
    yield call(promiseWorker, actionSubAddComment(commentId, text))
    yield call(findSubCommentWorker, { commentId })
}

function* findSubCommentWorker({ commentId }) {
    console.log(commentId);
    const { answers } = yield call(promiseWorker, actionFindSubComment(commentId))
    if (answers) {
        yield put(actionUpdateSubCommentAC(commentId, answers))
    }
}

function* addCommentWatcher() {
    yield all([
        takeEvery('COMMENT_POST', addCommentWorker),
        takeEvery('FIND_SUBCOMMENT', findSubCommentWorker),
        takeEvery('ADD_SUB_COMMENT', addSubCommentWorker)
    ])
}


//*************** UPLOAD AVATAR ******************//


function* updateAvatarWorker({ file }) {
    const { auth: { payload: { sub: { id } } } } = yield select()
    console.log(file, id);
    yield call(promiseWorker, actionSetAvatar(file, id))
    const { avatar } = yield call(promiseWorker, actionGetAvatar(id))
    console.log(avatar);
    if (avatar) {
        yield put(actionUpdateMyAvatart(avatar))
    }
}

function* updateAvatarWatcher() {
    yield takeEvery('UPDATE_AVATAR', updateAvatarWorker)
}


//*************** FIND FOLLOWING/FOLLOWERS ******************//


function* findFollowersWorker({ _id }) {
    yield call(promiseWorker, actionGetFindFollowers(_id))
}

function* findFollowingWorker({ _id }) {
    yield call(promiseWorker, actionGetFindFollowing(_id))
}

function* findLikedWorker({ _id }) {
    yield call(promiseWorker, actionGetFindLiked(_id))
}

function* findFollowWatcher() {
    yield all([
        takeEvery('FIND_FOLLOWERS', findFollowersWorker),
        takeEvery('FIND_FOLLOWING', findFollowingWorker),
        takeEvery('FIND_LIKED', findLikedWorker)
    ])
}


//*************** Create Post ******************//


function* sentPostWorker({ images, text, title }) {
    let imagesId = images.map(im => ({ _id: im._id }))
    const { postsFeed: { posts } } = yield select()
    const upSertPostObj = {
        ...posts,
        images: imagesId,
        text,
        title
    }
    const result = yield call(promiseWorker, actionSentPost(upSertPostObj))
    if (result) {
        yield put(actionClearPromise('sentPost'))
    }
}

function* sentPostWatcher() {
    yield takeEvery('CREATE_POST', sentPostWorker)
}




export function* rootSaga() {
    yield all([
        promiseWatcher(),
        routeWatcher(),
        loginWatcher(),
        aboutMeWatcher(),
        postsFeedWatcher(),
        dataProfileWatcher(),
        findUserWatcher(),
        likePostWatcher(),
        subscribeWatcher(),
        addCommentWatcher(),
        updateAvatarWatcher(),
        findFollowWatcher(),
        sentPostWatcher(),

    ])
}