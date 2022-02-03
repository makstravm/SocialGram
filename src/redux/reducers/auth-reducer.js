
const jwtDecode = (token) => {
    try {
        let arrToken = token.split('.')
        let base64Token = atob(arrToken[1])
        return JSON.parse(base64Token)
    }
    catch (e) {
        console.log('Ой, ошибочка вышла ' + e);
    }
}

export const authReducer = (state, { type, token, remember }) => {
    if (!state) {
        if (localStorage.authToken || sessionStorage.authToken) {
            type = 'AUTH-LOGIN'
            token = localStorage.authToken || sessionStorage.authToken
        } else state = {}
    }

    if (type === 'AUTH-LOGIN') {
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
    if (type === 'AUTH-LOGOUT') {
        localStorage.removeItem('authToken')
        sessionStorage.removeItem('authToken')
        return {}
    }
    return state
}



