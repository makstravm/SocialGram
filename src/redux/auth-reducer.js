import { jwtDecode } from '../helpers'


export const authReducer = (state, { type, token, remember }) => {
    if (!state) {
        if (localStorage.authToken || sessionStorage.authToken) {
            type = 'AUTH_LOGIN'
            token = localStorage.authToken || sessionStorage.authToken
        } else state = {}
    }

    if (type === 'AUTH_LOGIN') {
        remember ?
            localStorage.setItem('authToken', token) :
            sessionStorage.setItem('authToken', token)
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

export const actionAuthLogin = (token, remember) => ({ type: 'AUTH_LOGIN', token, remember })

export const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })



