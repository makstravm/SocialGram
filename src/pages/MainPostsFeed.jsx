import { Card, Col, Row, Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Paragraph from 'antd/lib/typography/Paragraph'
import Text from 'antd/lib/typography/Text'
import { actionPostsFeed, actionRemovePostAC } from '../actions'
import { DateCreated } from '../components/main/DateCreated'
import PostImage from '../components/main/postsFeed/PostImage'
import { CPostUserPanel } from '../components/main/postsFeed/PostUserPanel'
import { Container } from './Content'
import { CPostTitle } from '../components/main/post/PostTitle'
import { CPreloader } from './Preloader'
import { CFieldCommentSend } from '../components/main/postsFeed/FieldComment'
import { PostCommentDate } from '../components/main/post/PostComment'
import Title from 'antd/lib/typography/Title'


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

const CommentPostFeed = ({ comment }) =>
    <div className='CommentPostFeed'>
        <Link to={`/profile/${comment.owner._id}`}>
            {comment?.owner?.nick || comment?.owner?.login}
        </Link>
        <PostCommentDate createdAt={comment.createdAt} />
        <Paragraph ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}>
            {comment?.text}
        </Paragraph>
    </div>

export const CommentSPostFeed = ({ comments = [], _id }) =>
    <>
        {
            comments && comments.length
                ? <>
                    {(comments.length > 2) && <Link to={`/post/${_id}`}>
                        <Divider orientation="left">
                            {comments?.length ? `View ${comments.length} comments` : 'No comments'}
                        </Divider>
                    </Link>}
                    {comments.slice(0, 2).map(c => <CommentPostFeed key={c._id} comment={c} />)}
                </>
                : <Link to={`/post/${_id}`}>
                    <Divider orientation="left">
                        {comments?.length ? `View ${comments.length} comments` : 'No comments'}
                    </Divider>
                </Link>
        }
        <CFieldCommentSend id={_id} setOpen={() => { }} />
    </>

const Post = ({ postData: { _id, text, title, owner, images, createdAt = '', comments, likes, collections } }) =>
    <div className='Post'>
        <Card
            title={<CPostTitle owner={owner} postId={_id} />}
            cover={<PostImage images={images} />}
        >
            <CPostUserPanel postId={_id}
                likes={likes}
                collections={collections}
                styleFontSize='1.7em' />
            <PostDescription title={title} description={text} date={createdAt} />
            <CommentSPostFeed comments={comments} _id={_id} />
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
            {Array.isArray(posts) && posts.length
                ? posts.map(p => <Post key={p._id} postData={p} />)
                : <Title level={4}>
                    The tape is empty. Subscribe to users to see them
                    posts or create your own
                </Title>}
        </Container>
    )
}

export const CMainPostsFeed = connect(state => ({
    posts: state?.post?.posts || [],
    following: state?.myData?.following || []
}), {
    postsFollowing: actionPostsFeed,
    clearState: actionRemovePostAC,
})(MainPostsFeed)