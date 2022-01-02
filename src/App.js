import './App.scss';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { connect, Provider } from 'react-redux';
import { store } from './redux/redux-store';
import { Authorization } from './pages/Authorization';
import { Content } from './pages/Content';




export const history = createHistory()


const AppContent = ({ isToken }) =>
    <Router history={history}>
        {!isToken
            ?
            <Switch>
                <Route path='/login' component={Authorization} />
                <Redirect from='/*' to='/login' />
            </Switch>
            :
            <Switch>
                <Route path='/' component={Content} exact />
                {/* <Redirect from='/*' to='/' /> */}
            </Switch>
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
