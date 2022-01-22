import { Card, Col, Row, Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { UserAvatar } from './Header'
import Paragraph from 'antd/lib/typography/Paragraph'
import Text from 'antd/lib/typography/Text'
import { actionPostsFeed, actionRemovePostsFeedAC } from '../actions'
import { DateCreated } from '../components/main/DateCreated'
import PostImage from '../components/main/postsFeed/PostImage'
import { CPostUserPanel } from '../components/main/postsFeed/PostUserPanel'

export const PostTitle = ({ owner }) =>
    <Row justify="start" align='middle'>
        <Link to={`/profile/${owner?._id}`} className='owner'>
            <UserAvatar avatar={owner?.avatar} avatarSize={'45px'} />
            <span className='nick'>{owner?.nick ? owner.nick : owner?.login ? owner.login : 'Null'}</span>
        </Link >
    </Row>


export const PostDescription = ({ title, description, date }) =>
    <>
        <Row justify='space-between'>
            <Col >
                {!!title && <Text level={3} strong>{title}</Text>}
            </Col>
            <Col >
                <Text type='secondary'>
                    <DateCreated date={date} />
                </Text>
            </Col>
        </Row>
        <Paragraph ellipsis={true ? { rows: 1, expandable: true, symbol: '...' } : false}>
            {description}
        </Paragraph>
    </>

export const Comments = ({ comments = [], _id }) =>
        <Link to={`/post/${_id}`}>
            <Divider orientation="left">
                {comments?.length ? `View ${comments.length} comments` : 'No comments'}
            </Divider>
        </Link>

const Post = ({ postData: { _id, text, title, owner, images, createdAt = '', comments, likes } }) =>
    <div className='Post'>
        <Card
            title={<PostTitle owner={owner} />}
            cover={<PostImage images={images} />}
        >
            <CPostUserPanel postId={_id} likes={likes} styleFontSize='1.7em' />
            <PostDescription title={title} description={text} date={createdAt} />
            <Comments comments={comments} _id={_id} />
        </Card>
    </div>


const MainPostsFeed = ({ posts, postsFollowing, postsFollowingRemove, following }) => {

    const [checkScroll, setCheckScroll] = useState(true)

    useEffect(() => {
        if (checkScroll && following.length !== 0) {
            postsFollowing()
            setCheckScroll(false)
        }
    }, [checkScroll, following])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
            postsFollowingRemove()

        }
    }, [])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 500) {
            setCheckScroll(true)
        }
    }

    return (
        <>
            {Array.isArray(posts) && posts.map(p => <Post key={p._id} postData={p} />)}
        </>
    )
}

export const CMainPostsFeed = connect(state => ({
    posts: state?.postsFeed?.posts || [],
    following: state?.myData.following || []
}), {
    postsFollowing: actionPostsFeed,
    postsFollowingRemove: actionRemovePostsFeedAC,
})(MainPostsFeed)