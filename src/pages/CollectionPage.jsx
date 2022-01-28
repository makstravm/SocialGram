import { Divider } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { actionFullMyCollectionLoad, actionRemovePostsFeedAC } from '../actions';
import { CPosts } from '../components/main/Posts';
import { Container } from './Content';
import { CPreloader } from './Preloader';

export const CollectionPage = ({ onLoadPosts, postsRemove }) => {

    useEffect(() => {
        onLoadPosts()
        return () => {
            postsRemove()
        }
    }, [])

    return (
        <Container>
            <CPreloader promiseName='onLoadMyCollections' />
            <Divider><Title level={1}>Collections</Title></Divider>
            <CPosts />
        </Container>
    )
}
export const CCollectionPage = connect(state => ({ posts: state?.postsFeed?.posts || [] }), { onLoadPosts: actionFullMyCollectionLoad, postsRemove: actionRemovePostsFeedAC })(CollectionPage)
