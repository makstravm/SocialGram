import { all, call, delay, fork, join, put, select, takeEvery, takeLatest, takeLeading } from "redux-saga/effects";
import { queries } from "../../actions/actionQueries";
import { actionAddComment, actionAllPostsCount, actionChangeSubscribed, actionCreatOrEditPost, actionDelLikeComment, actionDelLikePost, actionEditComment, actionGetAboutMe, actionGetAllPosts, actionGetAllUsers, actionGetAvatar, actionGetCommentOne, actionGetCommentPost, actionGetLikeComment, actionGetMyCollection, actiongetMyFollowing, actionGetMyLikePosts, actionGetPostsMyCollection, actionGetPostsMyFollowing, actionGetPostsTapeCount, actionGetProfileData, actionGetProfilePagePosts, actionGetSubComment, actionGetUserFollowers, actionLogIn, actionOnAddLikeComment, actionOnLikeComment, actionOnLikePost, actionRegister, actionSetAvatar, actionSubAddComment, actionUpsertAboutMe, actionUpsertPostsInCollections, gql } from "../../actions/actionsGetGql";
import { actionAboutMeAC, actionAboutMeSagaAC, actionAddCommentPostInTapeAC, actionAddCommentPostOneAC, actionAddPostsInPostsTapeAC, actionAuthLoginAC, actionChangeMyAvatartAC, actionChangeStatusLikePostOneAC, actionChangeStatusLikePostTapeAC, actionClearPostsOneAC, actionClearPromise, actionEditCommentAC, actionFullLogInSagaAC, actionLikeCommentAC, actionPending, actionPostOneDataAC, actionProfileDataAC, actionPromise, actionRejected, actionResolved, actionUpdateCommentAC, actionUpdateMyFollowingAC, actionUpdateUserFollowersAC, actionUpsertCollectionAC } from "../../actions/actonsCreators";


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
    yield put(actionClearPostsOneAC())
    if (match.path in queries) {
        const { name, query, variables } = queries[match.path](match)
        const result = yield call(promiseWorker,
            actionPromise(name, gql(query, variables)))
        if (result) {
            yield put(actionPostOneDataAC(result))
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
        yield put(actionAuthLoginAC(token, remember))
        yield put(actionAboutMeSagaAC())
    }
}

function* fullRegisrterWorker({ login, password, remember }) {
    const result = yield call(promiseWorker, actionRegister(login, password))
    if (result) yield put(actionFullLogInSagaAC(login, password, remember))
}

function* loginWatcher() {
    yield all([takeEvery('FULL_LOGIN', logInWorker), takeEvery('FULL_REGISTER', fullRegisrterWorker)])
}


//*************** ABOUT ME ******************//


function* aboutMeWorker() {
    const { auth } = yield select()
    if (auth?.payload?.sub?.id) {
        const taskData = yield fork(promiseWorker, actionGetAboutMe(auth?.payload?.sub?.id))
        const taskCollection = yield fork(promiseWorker, actionGetMyCollection(auth?.payload?.sub?.id))
        const [dataResult, collectionResult] = yield join([taskData, taskCollection])
        if (dataResult) {
            yield put(actionAboutMeAC({ ...dataResult, collection: collectionResult }))
        }
    }
}

function* aboutMeUpsertWorker({ nick, login }) {
    const { aboutMe: { _id } } = yield select()
    const newMyData = { _id, nick, login }
    yield call(promiseWorker, actionUpsertAboutMe(newMyData))
    const result = yield call(promiseWorker, actionGetAboutMe(_id))
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


//*************** TAPE POSTS  ******************//


function* postsTapeMyFollowingWorker() {

    const { postsTape: { posts, count }, aboutMe } = yield select()
    const newArrFollowing = aboutMe?.following && aboutMe?.following.map(f => f._id)

    if (posts?.length !== (count ? count : 1)) {

        const taskPosts = yield fork(promiseWorker, actionGetPostsMyFollowing(posts?.length, [...newArrFollowing || [], aboutMe?._id]))
        const taskCount = yield fork(promiseWorker, actionGetPostsTapeCount([...newArrFollowing || [], aboutMe?._id]))

        const [postsResult, countResult] = yield join([taskPosts, taskCount])

        if (postsResult && countResult) {
            yield put(actionAddPostsInPostsTapeAC(postsResult, countResult))
        }
    }
}

function* allPostsTapeWorker() {
    const { postsTape: { posts, count } } = yield select()

    if (posts?.length !== (count ? count : 1)) {
        const taskPosts = yield fork(promiseWorker, actionGetAllPosts(posts?.length))
        const taskCount = yield fork(promiseWorker, actionAllPostsCount())

        const [postsResult, countResult] = yield join([taskPosts, taskCount])

        if (postsResult && countResult) {
            yield put(actionAddPostsInPostsTapeAC(postsResult, countResult))
        }
    }
}

function* postsTapeWatcher() {
    yield all([
        takeLeading('GET_POSTS_TAPE', postsTapeMyFollowingWorker),
        takeLeading('ALL_POSTS', allPostsTapeWorker),
    ])
}


//*************** DATA PROFILE ******************//


function* dataProfileWorker({ id }) {

    const { postsTape: { posts, count } } = yield select()
    if ((posts?.length ? posts?.length : 0) < (count ? count : 1)) {
        if (!count) {

            const taskDataProfile = yield fork(promiseWorker, actionGetProfileData(id))
            const taskUserPosts = yield fork(promiseWorker, actionGetProfilePagePosts(id, (posts?.length ? posts?.length : 0)))
            const taskCountPosts = yield fork(promiseWorker, actionGetPostsTapeCount([id]))

            const [dataProfile, userPosts, countPosts] = yield join([taskDataProfile, taskUserPosts, taskCountPosts])

            if (dataProfile && userPosts) {
                yield put(actionProfileDataAC(dataProfile))
                yield put(actionAddPostsInPostsTapeAC(userPosts, countPosts))
            }
        } else {
            const userPosts = yield call(promiseWorker, actionGetProfilePagePosts(id, posts?.length))
            if (userPosts) {
                yield put(actionAddPostsInPostsTapeAC(userPosts))
            }
        }
    }
}

function* dataProfileWatcher() {
    yield takeLeading('DATA_PROFILE', dataProfileWorker)
}


//*************** Find Users ******************//


function* searchAllUserWorker({ value }) {
    yield delay(1000)
    yield call(promiseWorker, actionGetAllUsers(value))
}

function* searchAllUserWatcher() {
    yield takeLatest('SEARCH_USERS', searchAllUserWorker)
}


//*************** Like POST / COMMENT ******************//


function* changeLikePostWorker({ postId, likeId }) {

    const handlerStatusLikePost = () => likeId
        ? actionDelLikePost(likeId)
        : actionOnLikePost(postId)

    yield call(promiseWorker, handlerStatusLikePost())
    return yield call(promiseWorker, actionGetMyLikePosts(postId))
}

function* changeLikePostTapeWorker({ postId, likeId }) {
    const { likes } = yield call(changeLikePostWorker, { postId, likeId })
    if (likes) {
        yield put(actionChangeStatusLikePostTapeAC(postId, likes))
    }
}

function* changeLikePostOneWorker({ postId, likeId }) {
    const { likes } = yield call(changeLikePostWorker, { postId, likeId })
    if (likes) {
        yield put(actionChangeStatusLikePostOneAC(postId, likes))
    }
}


function* changeLikeCommentWorker({ commentId, likeId }) {

    const handlerStatusLikePost = () => likeId
        ? actionDelLikeComment(likeId)
        : actionOnLikeComment(commentId)

    yield call(promiseWorker, handlerStatusLikePost())
    const { likes } = yield call(promiseWorker, actionGetLikeComment(commentId))
    if (likes) {
        yield put(actionLikeCommentAC(commentId, likes))
    }
}

function* likePostWatcher() {
    yield all([
        takeLeading('CHANGE_LIKE_POST_TAPE', changeLikePostTapeWorker),
        takeLeading('CHANGE_LIKE_POST_ONE', changeLikePostOneWorker),
        takeLeading('CHANGE_LIKE_COMMENT', changeLikeCommentWorker),
    ])
}


//*************** SUBSCRIBE ******************//


function* subscribeWorker({ userId, followCheck }) {
    const { aboutMe: { _id, following: f } } = yield select()
    const newFollowingArray = followCheck
        ? {
            _id,
            following: [...f.filter(f => f._id !== userId)]
        }
        : {
            _id,
            following: [...f || [], { _id: userId }]
        }

    yield call(promiseWorker, actionChangeSubscribed(newFollowingArray))
    const taskFollowers = yield fork(promiseWorker, actionGetUserFollowers(userId))
    const taskMyFollowing = yield fork(promiseWorker, actiongetMyFollowing(_id))

    const [{ followers }, { following }] = yield join([taskFollowers, taskMyFollowing])

    if (followers && following) {
        yield put(actionUpdateUserFollowersAC(followers))
        yield put(actionUpdateMyFollowingAC(following))
    }
}

function* subscribeWatcher() {
    yield takeLeading('CHANGE_SUBSCRIBE', subscribeWorker)
}


//*************** COMMENTS ******************//


function* addCommentPostTapeWorker({ postId, text }) {
    yield call(promiseWorker, actionAddComment(postId, text))
    const { comments } = yield call(promiseWorker, actionGetCommentPost(postId))
    if (comments) {
        yield put(actionAddCommentPostInTapeAC(postId, comments))
    }
}

function* addCommentPostOneWorker({ postId, text }) {
    yield call(promiseWorker, actionAddComment(postId, text))
    const { comments } = yield call(promiseWorker, actionGetCommentPost(postId))
    if (comments) {
        yield put(actionAddCommentPostOneAC(postId, comments))
    }
}

function* editCommentWorker({ commentId, text }) {
    yield call(promiseWorker, actionEditComment(commentId, text))
    const result = yield call(promiseWorker, actionGetCommentOne(commentId))
    if (result) {
        yield put(actionEditCommentAC(commentId, result))
    }
}

function* addSubCommentWorker({ commentId, text }) {
    yield call(promiseWorker, actionSubAddComment(commentId, text))
    yield call(getSubCommentWorker, { commentId })
}

function* getSubCommentWorker({ commentId }) {
    const { answers } = yield call(promiseWorker, actionGetSubComment(commentId))
    if (answers) {
        yield put(actionUpdateCommentAC(commentId, answers))
    }
}

function* commentWatcher() {
    yield all([
        takeLeading('ADD_COMMENT_POST_TAPE', addCommentPostTapeWorker),
        takeLeading('ADD_COMMENT_POST_ONE', addCommentPostOneWorker),
        takeEvery('EDIT_COMMENT', editCommentWorker),
        takeEvery('GET_SUBCOMMENT', getSubCommentWorker),
        takeLeading('ADD_SUB_COMMENT', addSubCommentWorker)
    ])
}


//*************** UPLOAD AVATAR ******************//


function* updateAvatarWorker({ file }) {
    const { aboutMe: { _id } } = yield select()
    yield call(promiseWorker, actionSetAvatar(file, _id))
    const { avatar } = yield call(promiseWorker, actionGetAvatar(_id))
    if (avatar) {
        yield put(actionChangeMyAvatartAC(avatar))
    }
}

function* updateAvatarWatcher() {
    yield takeEvery('UPDATE_AVATAR', updateAvatarWorker)
}


//*************** Create Post ******************//


function* sentPostWorker({ images, text, title }) {
    let imagesId = images.map(im => ({ _id: im._id }))
    const { postOne: { _id } } = yield select()
    const upSertPostObj = {
        _id,
        images: imagesId,
        text,
        title
    }
    const result = yield call(promiseWorker, actionCreatOrEditPost(upSertPostObj))
    if (result) {
        yield put(actionClearPromise('sentPost'))
    }
}

function* sentPostWatcher() {
    yield takeEvery('CREATE_POST', sentPostWorker)
}


//*************** COLLECTION ******************//

function* handlerCollectionWorker({ _id, flag }) {
    const { aboutMe: { _id: myID, collection } } = yield select()
    const newCollection = flag
        ? collection?.posts.filter(c => c._id !== _id)
        : [...collection?.posts || [], { _id }]
    yield call(promiseWorker, actionUpsertPostsInCollections(collection?._id, newCollection))
    const newData = yield call(promiseWorker, actionGetMyCollection(myID))
    if (newData) yield put(actionUpsertCollectionAC(newData))
}

function* loadCollectionWorker() {
    const { aboutMe: { collection }, dataProfile
    } = yield select()
    if (collection?._id) {
        const [{ posts: newResult }] = yield call(promiseWorker, actionGetPostsMyCollection(collection?._id, dataProfile?.posts?.length))
        if (newResult) {
            yield put(actionAddPostsInPostsTapeAC(newResult))
        }
    }
}

function* handlerCollectionWatcher() {
    yield all([
        takeLeading('HANDLER_UPSERT_COLLECTION', handlerCollectionWorker),
        takeEvery('LOAD_COLLECTION', loadCollectionWorker)
    ])
}



export function* rootSaga() {
    yield all([
        promiseWatcher(),
        routeWatcher(),
        loginWatcher(),
        aboutMeWatcher(),
        postsTapeWatcher(),
        dataProfileWatcher(),
        searchAllUserWatcher(),
        likePostWatcher(),
        subscribeWatcher(),
        commentWatcher(),
        updateAvatarWatcher(),
        // findFollowWatcher(),
        sentPostWatcher(),
        handlerCollectionWatcher(),

    ])
}