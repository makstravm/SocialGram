import { Card, Col, Row, Carousel, Empty, Button } from 'antd'
import React, { createRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { backURL } from '../../helpers'
import { UserAvatar } from '../header/Header'
import nodata from '../../images/nodata.png'
import { HeartFilled, HeartOutlined, LeftCircleOutlined, RightCircleOutlined, SendOutlined, } from '@ant-design/icons'
import Paragraph from 'antd/lib/typography/Paragraph'
import Text from 'antd/lib/typography/Text'
import TextArea from 'antd/lib/input/TextArea'
import { actionAddPostsFeed, actionFullAddComment, actionFullAddLikePost, actionFullRemoveLikePost } from '../../redux/redux-thunk'

const PostTitle = ({ owner }) =>
    <Link to={`/${owner?._id}`} className='owner'>
        <Row justify="start" align='middle'>
            <Col >
                <UserAvatar avatar={owner?.avatar} login={owner?.login} avatarSize={'45px'} nick={owner?.nick} />
            </Col>
            <Col offset={1}>
                <span>{owner?.nick ? owner.nick : owner?.login ? owner.login : 'Null'}</span>
            </Col>
        </Row>
    </Link >

class PostImage extends React.Component {
    constructor(props) {
        super(props);
        this.carouselRef = createRef();
        this.state = {
            movePrev: false,
            moveNext: false
        }
    }

    handleNext = () => this.carouselRef.current.next(this);

    handlePrev = () => this.carouselRef.current.prev(this);

    moveOnDivArray = (length, index) => {
        if (length === 1) {
            this.setState({ movePrev: false, moveNext: false })
        } else if (index === 0) {
            this.setState({ movePrev: false, moveNext: true })
        } else if (index === length - 1 && length > 1) {
            this.setState({ movePrev: true, moveNext: false })
        } else {
            this.setState({ movePrev: true, moveNext: true })
        }
    }

    downOnDivArray = () => this.setState({ movePrev: false, moveNext: false })

    render() {

        const { images } = this.props
        return (
            <Carousel ref={this.carouselRef}
                effect="fade"
                infinite={false}
                dots={{ className: 'Post__dots' }
                }>
                {!!images ?
                    images.map((i, index) => i?.url ? <div key={i._id}
                        onMouseEnter={() => this.moveOnDivArray(images.length, index)}
                        onMouseLeave={this.downOnDivArray}>
                        <button onClick={() => this.handlePrev()}
                            className={`Post__prev Post__btn ${this.state.movePrev ? '--active' : ''}`}><LeftCircleOutlined /></button>
                        <button onClick={() => this.handleNext()}
                            className={`Post__next Post__btn ${this.state.moveNext ? '--active' : ''}`}><RightCircleOutlined /></button>
                        <img src={backURL + '/' + i.url} />
                    </div> :
                        <Empty key={i._id} image={nodata} description={false} />) :
                    <Empty image={nodata} description={false} />
                }
            </Carousel >
        );
    }
}

const HeartLike = ({ styleFontSize, likeStatus, changeLike }) =>
    <Button
        onClick={() => changeLike()}
        type="none"
        shape="circle"
        icon={
            likeStatus ?
                <HeartFilled style={{ color: '#ff6969', fontSize: `${styleFontSize}` }} /> :
                <HeartOutlined style={{ color: '#1890ff', fontSize: `${styleFontSize}` }} />}
    />

const PostUserPanel = ({ myID, postId, likes, addLikePost, removeLikePost }) => {
    let likeStatus
    let likeId
    likes.find(l => {
        if (l.owner._id === myID) {
            likeStatus = true
            likeId = l._id
        } else {
            likeStatus = false
        }
    })

    const changeLike = () => likeStatus ? removeLikePost(likeId, postId) : addLikePost(postId)
    const styleFontSize = '1.7em'

    return (
        <>
            <Row className="Post__panel-btn">
                <Col className='Post__heart'>
                    <HeartLike
                        changeLike={changeLike}
                        likeStatus={likeStatus}
                        styleFontSize={styleFontSize} />
                </Col>
                <Col>
                </Col>
            </Row>
            {!!likes.length && <strong>Likes: {likes.length}</strong>}
        </>
    )
}

const CPostUserPanel = connect(state => ({
    myID: state.auth.payload.sub.id || '',
    myLikes: state?.promise?.myLikes?.payload || [],
}), {
    addLikePost: actionFullAddLikePost,
    removeLikePost: actionFullRemoveLikePost,
})(PostUserPanel)

const PostDescription = ({ title, description, date }) =>
    <>
        <Row justify='space-between'>
            <Col >
                {!!title && <Text level={3} strong>{title}</Text>}
            </Col>
            <Col >
                <Text type='secondary'>{date}</Text>
            </Col>
        </Row>
        <Paragraph ellipsis={true ? { rows: 1, expandable: true, symbol: 'more' } : false}>
            {description}
        </Paragraph>
    </>

const Comments = ({ comments }) =>
    <>
        {comments && comments.length > 2 &&
            <Link to={`/#`}>
                <Text type={'secondary'} level={3}>{`Посмотреть все ${comments.length} комментария`}</Text>
            </Link>}
        {comments && <div>
            <div className='Post__comments'>
                <Link to={`/#`}>{comments[comments?.length - 2]?.owner?.nick || comments[comments?.length - 2]?.owner?.login}: </Link>
                <span>{comments[comments?.length - 2]?.text}</span>
            </div>
            <div className='Post__comments'>
                <Link to={`/#`}>{comments[comments?.length - 1]?.owner?.login || comments[comments?.length - 1]?.owner?.login}: </Link>
                <span>{comments[comments?.length - 1]?.text}</span>
            </div>
        </div>}
    </>


const FieldCommentSend = ({ postId, sentComment }) => {
    const [commentValue, setCommentValue] = useState('')
    const [error, setError] = useState(false)

    const changeComentTextarea = (e) => {
        setCommentValue(e.currentTarget.value)
        setError(false)
    }
    const sendCommentValid = (value) => {
        if (value.trim() !== '') {
            sentComment(postId, value.trim())
            setCommentValue('')
        } else {
            setError(true)
        }
    }
    return (
        <>
            {error && <Text type='danger'>Field is required</Text>}
            <Row align='middle' className='Post__send-comment'>
                <Col flex='auto' offset={1}>
                    <TextArea value={commentValue}
                        placeholder="Add a comment ..."
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        onChange={changeComentTextarea}
                        bordered={false}
                    />
                </Col>
                <Col span={2}>
                    <Button
                        onClick={() => sendCommentValid(commentValue)}
                        icon={< SendOutlined
                            style={{ fontSize: '1.2em', opacity: .6 }} />} />
                </Col>
            </Row>
        </>
    )
}

const CFieldCommentSend = connect(null, { sentComment: actionFullAddComment })(FieldCommentSend)

const Post = ({ postData: { _id, text, title, owner, images, createdAt, comments, likes } }) => {
    const date = new Date(createdAt * 1)
    const resultDate = new Intl.DateTimeFormat('default').format(date)
    return (
        <div className='Post'>
            <Card
                title={<PostTitle owner={owner} />}
                cover={<PostImage images={images} />}
                actions={[<CFieldCommentSend postId={_id} />]}
            >
                <CPostUserPanel postId={_id} likes={likes} />
                <PostDescription title={title} description={text} date={resultDate} />
                <Comments comments={comments} />
            </Card>
        </div>
    )
}

const MainPostFeed = ({ posts, postsFollowing }) => {
    const [checkScroll, setCheckScroll] = useState(true)

    useEffect(async () => {
        if (checkScroll) {
            await postsFollowing(posts.length)
            setCheckScroll(false)
        }
    }, [checkScroll])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 500) {
            setCheckScroll(true)
        }
    }
    return (
        <>
            {posts.map(p => <Post key={p._id} postData={p} />)}
        </>
    )
}

export const CMainPostFeed = connect(state => ({
    posts: state?.postsFeed?.posts || []
}), {
    postsFollowing: actionAddPostsFeed,
})(MainPostFeed)