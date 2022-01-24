import Icon from '@ant-design/icons';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

export const backURL = 'http://hipstagram.asmer.fs.a-level.com.ua'

export const propsUploadFile = {
    name: 'photo',
    action: `${backURL}/upload`,
    headers: localStorage.authToken || sessionStorage.authToken ? { Authorization: 'Bearer ' + (localStorage.authToken || sessionStorage.authToken) } : {}
}

export const jwtDecode = (token) => {
    try {
        let arrToken = token.split('.')
        let base64Token = atob(arrToken[1])
        return JSON.parse(base64Token)
    }
    catch (e) {
        console.log('Ой, ошибочка вышла ' + e);
    }
}

const getGQL = url =>
    async (query, variables = {}) => {
        let obj = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                ...(localStorage.authToken
                    ? { Authorization: 'Bearer ' + localStorage.authToken }
                    : sessionStorage.authToken
                        ? { Authorization: 'Bearer ' + sessionStorage.authToken }
                        : {})
            },
            body: JSON.stringify({ query, variables })
        })
        let a = await obj.json()
        if (!a.data && a.errors)
            throw new Error(JSON.stringify(a.errors))
        return a.data[Object.keys(a.data)[0]]
    }

export const gql = getGQL(backURL + '/graphql');

const CircularGallerySvg = () =>
    <svg aria-label="Кольцевая галерея" color="#ffffff" fill="#ffffff" height="22" role="img" viewBox="0 0 48 48" width="22">
        <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
    </svg>

export const CircularGalleryIcon = props =>
    <Icon component={CircularGallerySvg} {...props}/>

const RRoute = ({ action, component: Component, ...routeProps }) => {
    const WrapperComponent = (componentProps) => {
        useEffect(() => {
            action(componentProps.match)
        })
        return <Component {...componentProps} />
    }
    return <Route {...routeProps} component={WrapperComponent} />
}

export const CRRoute = connect(null, { action: match => ({ type: 'ROUTE', match }) })(RRoute)