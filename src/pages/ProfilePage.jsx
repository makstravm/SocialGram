import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'antd'
import postNoData from '../images/profile-post-no.jpeg'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actionFindFollowers, actionFindFollowing, actionProfilePageData, actionRemovePostsFeedAC, actionSubscribe, actionUnSubscribe } from '../actions'
import { backURL, CircularGalleryIcon } from '../helpers'
import { UserAvatar } from './Header'
import { CModalFollowers, CModalFollowing } from '../components/main/profilePage/ModalFollow'
import { DateCreated } from '../components/main/DateCreated'
import Text from 'antd/lib/typography/Text'





const ProfileFollow = ({ myID, userId, followers, onSubsuscribe, onUnSubsuscribe }) => {
    const followCheck = followers.find(f => f._id === myID && true)
    return (
        <Col className='Profile__seting' offset={4}>
            {!!followCheck ?
                <Button onClick={() => onUnSubsuscribe(userId)}>UnSubscribe</Button> :
                <Button onClick={() => onSubsuscribe(userId)} type="primary">Subscribe</Button>}
        </Col>
    )
}

const CProfileSetting = connect(state => ({
    myID: state?.auth?.payload?.sub.id,
    followers: state?.postsFeed?.userData?.followers || []
}), { onSubsuscribe: actionSubscribe, onUnSubsuscribe: actionUnSubscribe })(ProfileFollow)


const ProfilePageData = ({ data: { _id, avatar, login, nick, createdAt = '', followers, following }, count, setFollowing, setFollowers }) =>
    <Row className='Profile' >
        <Col span={8}>
            <UserAvatar avatarSize={'150px'} avatar={avatar} />
        </Col>
        <Col span={14} offset={1}>
            <Row align='top' className='Profile__name'>
                <Col>
                    <h1>{nick || login || 'No Name'}</h1>
                    <span className='Profile__login'>{login || '----'}</span>
                </Col>
                <Col>
                    <CProfileSetting userId={_id} />
                </Col>
            </Row>
            <Row align='middle'>
                <Col >
                    <Text type='secondary'>Account created: <DateCreated date={createdAt} /></Text>
                </Col>
                <Col offset={2}>
                    <Link className='Profile__link-message' to='/message'>Send message</Link>
                </Col>
            </Row>
            <Row className='Profile__count' align='middle' justify='space-between'>
                <Col >
                    <strong>{count || '0'}</strong>
                    <span>Posts</span>
                </Col>
                <Col >
                    <Button type="link" onClick={() => setFollowers(true)}>
                        <strong>{followers?.length || '0'}</strong>
                        <span>Followers</span>
                    </Button>
                </Col>
                <Col >
                    <Button type="link" onClick={() => setFollowing(true)}>
                        <strong>{following?.length || '0'}</strong>
                        <span>Following</span>
                    </Button>
                </Col>
            </Row>
        </Col >
    </Row >

const CProfilePageData = connect(state => ({
    data: state?.postsFeed?.userData || {},
    count: state?.postsFeed?.count || null
}))(ProfilePageData)


const ProfilePagePosts = ({ posts }) =>
    <Row gutter={[15, 15]}>
        {Array.isArray(posts) && posts.map(p => <Col key={p._id} span={8}>
            <Link to={`/post/${p._id}`}>
                <Card className='Profile__post' hoverable>
                    {p?.images && p?.images[0] && p.images[0]?.url
                        ?
                        p.images.length === 1
                            ?
                            < img src={(backURL + '/' + p?.images[0].url)} alt='post Img' />
                            :
                            <div className='Profile__box' >
                                <CircularGalleryIcon className='Profile__box-icon' style={{ stroke: 'black' }} />
                                <img src={(backURL + '/' + p?.images[0]?.url)} alt='post Img' />
                            </div>
                        :
                        <img src={postNoData} />}
                </Card>
            </Link>

        </Col>
        )
        }
    </Row >


export const CProfilePagePosts = connect(state => ({ posts: state.postsFeed?.posts || [] }))(ProfilePagePosts)

const ProfilePage = ({ match: { params: { _id } }, getProfileUser, clearDataProfile }) => {
    const [followers, setFollowers] = useState(false)
    const [following, setFollowing] = useState(false)
    const [checkScroll, setCheckScroll] = useState(true)

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
            setCheckScroll(true)
            clearDataProfile()
        }
    }, [_id])

    useEffect(() => {
        if (checkScroll) {

            getProfileUser(_id)
            setCheckScroll(false)
        }
    }, [_id, checkScroll])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 500) {
            setCheckScroll(true)
        }
    }

    return (
        <>
            <CProfilePageData setFollowing={setFollowing} setFollowers={setFollowers} />
            {followers && < CModalFollowers statusModal={setFollowers} title={'Followers'} />}
            {following && < CModalFollowing statusModal={setFollowing} title={'Following'} />}
            <CProfilePagePosts />
        </>
    )
}

export const CProfilePage = connect(state => ({
    posts: state?.postsFeed?.posts || []
}), { getProfileUser: actionProfilePageData, clearDataProfile: actionRemovePostsFeedAC })(ProfilePage)