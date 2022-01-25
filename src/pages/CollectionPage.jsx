import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { actionFullMyCollectionLoad, actionRemovePostsFeedAC } from '../actions';
import { CPosts } from '../components/main/Posts';
import { Container } from './Content';
import { CPreloader } from './Preloader';

export const CollectionPage = ({ onLoadPosts, postsRemove }) => {
    const [checkScroll, setCheckScroll] = useState(true)

    useEffect(() => {
        if (checkScroll) {
            onLoadPosts()
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
            <CPreloader promiseName='onLoadMyCollections' />
            <Divider><Title level={1}>Collections</Title></Divider>
            <CPosts /> 
        </Container>
    )
}
export const CCollectionPage = connect(state => ({ posts: state?.postsFeed?.posts || [] }), { onLoadPosts: actionFullMyCollectionLoad, postsRemove: actionRemovePostsFeedAC })(CollectionPage)
