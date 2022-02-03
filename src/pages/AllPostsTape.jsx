import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { actionAllGetPostsSagaAC, actionClearPostsTapeAC, actionGetAllPostsSagaAC } from '../actions/actonsCreators';
import { Container } from '../components/Container';
import { CGalleryMediaPostsUser } from '../components/GalleryMediaPostsUser';
import { CPreloader } from '../components/Preloader';


const AllPostsTape = ({ onGetAllPosts, clearPostsTape }) => {
    const [checkScroll, setCheckScroll] = useState(true)

    useEffect(() => {
        if (checkScroll) {
            onGetAllPosts()
            setCheckScroll(false)
        }
    }, [checkScroll])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
            clearPostsTape()
        }
    }, [])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 300) {
            setCheckScroll(true)
        }
    }

    return (
        <Container>
            <CPreloader promiseName='allPosts' />
            <CGalleryMediaPostsUser />
        </Container>
    )
}

export const CAllPostsTape = connect(null, { onGetAllPosts: actionGetAllPostsSagaAC, clearPostsTape: actionClearPostsTapeAC })(AllPostsTape)