import { Card, Col, Row, Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Paragraph from 'antd/lib/typography/Paragraph'
import Text from 'antd/lib/typography/Text'
import { actionPostsFeed, actionRemovePostsFeedAC } from '../actions'
import { DateCreated } from '../components/main/DateCreated'
import PostImage from '../components/main/postsFeed/PostImage'
import { CPostUserPanel } from '../components/main/postsFeed/PostUserPanel'
import { Container } from './Content'
import { CPostTitle } from '../components/main/post/PostTitle'
import { CPreloader } from './Preloader'


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
        <Paragraph ellipsis={true ? { rows: 1, expandable: true, symbol: '...More' } : false}>
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
            title={<CPostTitle owner={owner} postId={_id} />}
            cover={<PostImage images={images} />}
        >
            <CPostUserPanel postId={_id} likes={likes} styleFontSize='1.7em' />
            <PostDescription title={title} description={text} date={createdAt} />
            <Comments comments={comments} _id={_id} />
        </Card>
    </div>


const MainPostsFeed = ({ posts, postsFollowing, clearState, following }) => {

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
            clearState()

        }
    }, [])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 500) {
            setCheckScroll(true)
        }
    }

    return (
        <Container>
            <CPreloader promiseName='followingPosts' />
            {Array.isArray(posts) && posts.map(p => <Post key={p._id} postData={p} />)}
        </Container>
    )
}

export const CMainPostsFeed = connect(state => ({
    posts: state?.postsFeed?.posts || [],
    following: state?.myData?.following || []
}), {
    postsFollowing: actionPostsFeed,
    clearState: actionRemovePostsFeedAC,
})(MainPostsFeed)