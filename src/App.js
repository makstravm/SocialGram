import 'antd/dist/antd.min.css'
import './App.scss';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { connect, Provider } from 'react-redux';
import store from './redux/redux-store';
import { Content, Main } from './pages/Content';
import { CProfilePage } from './pages/ProfilePage';
import HeaderComponent from './pages/Header';
import { CMainPostsFeed } from './pages/MainPostsFeed';
import { CRRoute, promiseName } from './helpers';
import { CPostPage } from './pages/PostPage';
import { CAllPosts } from './pages/AllPosts';
import { CEntityEditorPost } from './pages/EntityEditorPost';
import { SettingsPage } from './pages/SettingsPage';
import { Authorization } from './pages/Authorization';
import { CPreloader } from './pages/Preloader';
import { CCollectionPage } from './pages/CollectionPage';

export const history = createHistory()

const AppContent = ({ isToken }) =>
    <Router history={history}>
        {!isToken
            ?
            <Switch>
                <Route path='/auth/:_id'
                    component={Authorization} />
                <Redirect from='/*' to='/auth/login' />
            </Switch>
            :
            <Content>
                <HeaderComponent />
                <Main>
                    <Switch>
                        <Route path='/' component={CMainPostsFeed} exact />
                        <Route path='/profile/:_id' component={CProfilePage} />
                        {/* <Route path='/message' component={Aside} /> */}
                        <Route path='/edit/post/:_id' component={CEntityEditorPost} />
                        <Route path='/my-settings' component={SettingsPage} />
                        <Route path='/all' component={CAllPosts} />
                        <Route path='/my-collection' component={CCollectionPage} />
                        <CRRoute path='/post/:id' component={CPostPage} />
                        <Redirect from='/*' to='/' />
                        {/* <Redirect from='/*' to='/post/:id' /> */}
                    </Switch>
                </Main>
            </Content >
        }
    </Router >

const CAppContent = connect(state => ({ isToken: state.auth?.token }))(AppContent)
store.subscribe(() => console.log(store.getState()))

function App() {
    return (
        <Provider store={store}>
            <CAppContent />
        </Provider>
    )
}

export default App;
