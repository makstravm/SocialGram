import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { myFolowingPosts } from '../actions'
import Header from '../components/header/Header'
import { CMainContent } from '../components/main/MainContent'



const Main = ({ children }) =>
    <>{children}</>


export const CMain = connect(null, { postsFollowing: myFolowingPosts })(Main)

export const Content = () => {
    return (
        <>
            <Header />
            <Main>
                <CMainContent />
                {/* <Aside /> */}
            </Main>
        </>
    )
}


