import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { myFolowingPosts } from '../actions'
import Header from '../components/header/Header'
import { CMainContent } from '../components/main/MainContent'



const Main = ({ children }) =>
    <div className='qq'>{children}</div>


export const CMain = connect(null, { postsFollowing: myFolowingPosts })(Main)

const Aside = () =>
    <div>sdfsdgsgsdg</div>

export const Content = () => {
    return (
        <>
            <Header />
            <Main>
                <Switch>
                    <CMainContent />
                    <Route path='/message' componernt={Aside} />
                </Switch>

            </Main>
        </>
    )
}


