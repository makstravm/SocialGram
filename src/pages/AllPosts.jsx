import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { actionAllPosts, actionRemovePostsFeedAC } from '../actions';
import { CPosts } from '../components/main/Posts';
import { Container } from './Content';
import { CPreloader } from './Preloader';

const AllPosts = ({ posts, onAllPosts, postsRemove }) => {
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
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 500) {
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

export const CAllPosts = connect(state => ({ posts: state?.postsFeed?.posts || [] }), { onAllPosts: actionAllPosts, postsRemove: actionRemovePostsFeedAC, })(AllPosts)