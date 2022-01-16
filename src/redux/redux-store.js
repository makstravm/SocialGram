import { createStore, combineReducers, applyMiddleware } from 'redux';
import { authReducer } from './auth-reducer';
import { myProfileReducer } from './myProfile-reducer';
import { postsFeedReducer } from './postFeed-reducer';
import { promiseReducer } from './promise-reducer';
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './saga';
import { actionFullAboutMe } from '../actions'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(combineReducers({
    auth: authReducer,
    promise: promiseReducer,
    myData: myProfileReducer,
    postsFeed: postsFeedReducer,
}),
    applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)

store.dispatch(actionFullAboutMe())

export default store;