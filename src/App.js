import 'antd/dist/antd.min.css'
import './App.scss';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { connect, Provider } from 'react-redux';
import { store } from './redux/redux-store';
import { Authorization } from './components/Authorization';
import { Content, Main } from './pages/Content';
import HeaderComponent from './components/header/Header';
import { CMainPostFeed } from './components/main/MainPostFeed.js';

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
            <Switch>
                <Content>
                    <HeaderComponent />
                    <Main>
                        <Route path='/' component={CMainPostFeed} exact />
                        <Route path='/message' component={Aside} />
                        <Redirect path='/*' from='/' />
                    </Main>
                </Content >
            </Switch>

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
