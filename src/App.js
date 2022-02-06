import 'antd/dist/antd.min.css'
import './App.scss';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { connect, Provider } from 'react-redux';
import store from './redux/redux-store';
import { Authorization } from './pages/Authorization';
import { CPostsTapeMyFollowing } from './pages/PostsTapeMyFollowing';
import HeaderComponent from './components/header/Header';
import { CProfilePage } from './pages/ProfilePage';
import { CAllPostsTape } from './pages/AllPostsTape';
import { CCollectionPage } from './pages/CollectionPage';
import { CSettingsPage } from './pages/SettingsPage';
import { CEditPostPage } from './pages/EditPostPage';
import { CPostOnePage } from './pages/PostOnePage';
import { CRRoute } from './hoc/RRoute';
import { FooterComponet } from './components/FooterComponent';
import { useMediaQuery } from 'react-responsive';


export const history = createHistory()


const Main = ({ children }) =>
    <div className='Main'>{children}</div>


const Content = ({ children }) =>
    <>{children}</>

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
                        <Route path='/tape' component={CPostsTapeMyFollowing} />
                        <Route path='/profile/:_id' component={CProfilePage} />
                        <Route path='/edit/post/:_id' component={CEditPostPage} />
                        <Route path='/my-settings' component={CSettingsPage} />
                        <Route path='/all' component={CAllPostsTape} />
                        <Route path='/my-collection' component={CCollectionPage} />
                        <CRRoute path='/post/:id' component={CPostOnePage} />
                        <Redirect from='/*' to='/tape' />
                    </Switch>
                </Main>
                {isTabletDevice && <FooterComponet />}
            </Content >
        }
    </Router >
}


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
