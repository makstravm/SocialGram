import 'antd/dist/antd.min.css'
import './App.scss';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { connect, Provider } from 'react-redux';
import store from './redux/redux-store';
import { Content, Main } from './pages/Content';
import { CProfilePage } from './pages/ProfilePage';
import HeaderComponent from './components/header/Header';
import { CMainPostsFeed } from './pages/MainPostsFeed';
import { CRRoute } from './helpers';
import { CPostPage } from './pages/PostPage';
import { CAllPosts } from './pages/AllPosts';
import { CEntityEditorPost } from './pages/EntityEditorPost';
import { CSettingsPage } from './pages/SettingsPage';
import { Authorization } from './pages/Authorization';
import { CCollectionPage } from './pages/CollectionPage';
import { useMediaQuery } from 'react-responsive';
import { FooterComponent } from './components/Footer';

export const history = createHistory()


const AppContent = ({ isToken }) => {
    const isTabletDevice = useMediaQuery({
        query: "(max-width: 786px)"
    })
    return <Router history={history}>
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
                        <Route path='/feed' component={CMainPostsFeed} />
                        <Route path='/profile/:_id' component={CProfilePage} />
                        <Route path='/edit/post/:_id' component={CEntityEditorPost} />
                        <Route path='/my-settings' component={CSettingsPage} />
                        <Route path='/all' component={CAllPosts} />
                        <Route path='/my-collection' component={CCollectionPage} />
                        <CRRoute path='/post/:id' component={CPostPage} />
                        <Redirect from='/*' to='/feed' />
                    </Switch>
                </Main>
                {isTabletDevice && <FooterComponent />}
            </Content >
        }
    </Router >
}

const CAppContent = connect(state => ({ isToken: state.auth?.token }))(AppContent)

function App() {
    return (
        <Provider store={store}>
            <CAppContent />
        </Provider>
    )
}

export default App;
