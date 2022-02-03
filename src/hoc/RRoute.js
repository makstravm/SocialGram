import { useEffect } from "react"
import { connect } from "react-redux"
import { Route } from "react-router-dom"



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



