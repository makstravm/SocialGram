import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { actionAllPosts, actionRemovePostAC } from '../actions';
import { CPosts } from '../components/main/Posts';
import { Container } from './Content';
import { CPreloader } from './Preloader';

const AllPosts = ({ onAllPosts, postsRemove }) => {
    const [checkScroll, setCheckScroll] = useState(true)

    useEffect(() => {
        if (checkScroll) {
            onAllPosts()
            setCheckScroll(false)
        }
    }, [checkScroll])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
            postsRemove()
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
            <CPosts />
        </Container>
    )
}

export const CAllPosts = connect(null, { onAllPosts: actionAllPosts, postsRemove: actionRemovePostAC, })(AllPosts)