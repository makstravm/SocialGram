import 'antd/dist/antd.min.css'
import './App.scss';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { connect, Provider } from 'react-redux';
import  store  from './redux/redux-store';
import { Authorization } from './components/Authorization';
import { Content, Main } from './pages/Content';
import { CProfilePage } from './components/main/Profile';
import { CAdd } from './components/main/Add';
import HeaderComponent from './pages/Header';
import { CMainPostsFeed } from './pages/MainPostsFeed';

export const history = createHistory()


const Aside = () =>
    <div>sdfsdgsgsdg</div>
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
                        <Route path='/message' component={Aside} />
                        <Route path='/add' component={CAdd} />
                        <Redirect from='/*' to='/' />
                    </Switch>
                </Main>
            </Content >


            // <Switch>
            //     <Route path='/' component={Content} exact />
            //     <Redirect from='/auth/*' to='/' />
            // </Switch>
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
