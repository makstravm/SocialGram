import { jwtDecode } from '../helpers'


export const authReducer = (state, { type, token }) => {
    if (!state) {
        if (localStorage.authToken) {
            type = 'AUTH_LOGIN'
            token = localStorage.authToken
        } else state = {}
    }

    if (type === 'AUTH_LOGIN') {
        localStorage.setItem('authToken', token)

        let payload = jwtDecode(token)
        if (typeof payload === 'object') {
            return {
                ...state,
                token,
                payload
            }
        } else return state
    }
    if (type === 'AUTH_LOGOUT') {
        localStorage.removeItem('authToken')
        return {}
    }
    return state
}

export const actionAuthLogin = token => ({ type: 'AUTH_LOGIN', token })

export const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })



// const actionRegister = (login, password) =>
//     actionPromise('register', gql(`
//                 mutation reg($login:String, $password:String){
//                 UserUpsert(user:{
//                     login:$login,
//                         password:$password,
//                         nick:$login}){
//                 _id login
//                 }
//             }
//             `, { login, password }))

// export const actionFullRegister = (login, password) =>
//     async dispatch => {
//         await actionRegister(login, password)
//         let token = await dispatch(actionLogin(login, password))
//         if (token) {
//             dispatch(actionAuthLogin(token))
//         }
//     }




