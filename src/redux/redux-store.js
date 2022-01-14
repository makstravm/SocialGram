import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './auth-reducer';
import { myProfileReducer } from './myProfile-reducer';
import { postsFeedReducer } from './postFeed-reducer';
import { promiseReducer } from './promise-reducer';
import { actionFullAboutMe } from './redux-thunk';



const store = createStore(combineReducers({
    auth: authReducer,
    promise: promiseReducer,
    myData: myProfileReducer,
    postsFeed: postsFeedReducer,
}),
    applyMiddleware(thunk))

store.dispatch(actionFullAboutMe())

export default store;