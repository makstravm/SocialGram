import { createStore, combineReducers, applyMiddleware } from 'redux';
import { authReducer } from './reducers/auth-reducer';
// import { postReducer } from './reducers/post-reducer';
import createSagaMiddleware from 'redux-saga'
import { promiseReducer } from './reducers/promise-reducer';
import { rootSaga } from './saga';
import { actionAboutMeSagaAC } from '../actions/actonsCreators';
import { aboutMeReducer } from './reducers/aboutMe-reducer';
import { postsTapeReducer } from './reducers/postsTape-reducer';
import { profileDataReducer } from './reducers/profileData-reducer';
import { postOneReducer } from './reducers/postOne-reducer';


const sagaMiddleware = createSagaMiddleware()

const store = createStore(combineReducers({
    auth: authReducer,
    promise: promiseReducer,
    aboutMe: aboutMeReducer,
    postsTape: postsTapeReducer,
    postOne: postOneReducer,
    dataProfile: profileDataReducer,
}),
    applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)

store.dispatch(actionAboutMeSagaAC())

export default store;