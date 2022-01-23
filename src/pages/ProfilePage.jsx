import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actionProfilePageData, actionRemovePostsFeedAC, actionSubscribe, actionUnSubscribe } from '../actions'
import { UserAvatar } from './Header'
import { CModalFollowers, CModalFollowing } from '../components/main/profilePage/ModalFollow'
import { DateCreated } from '../components/main/DateCreated'
import Text from 'antd/lib/typography/Text'
import { Container } from './Content'
import { CPosts } from '../components/main/Posts'

const ProfileFollowButton = ({ myID, userId, followers, onSubsuscribe, onUnSubsuscribe }) => {
    const followCheck = followers.find(f => f._id === myID && true)
    return (
        <Col className='Profile__setting'>
            {!!followCheck ?
                <Button onClick={() => onUnSubsuscribe(userId)}>UnSubscribe</Button> :
                <Button onClick={() => onSubsuscribe(userId)} type="primary">Subscribe</Button>}
        </Col>
    )
}

const CProfileFollowButton = connect(state => ({
    myID: state?.auth?.payload?.sub.id,
    followers: state?.postsFeed?.userData?.followers || []
}), { onSubsuscribe: actionSubscribe, onUnSubsuscribe: actionUnSubscribe })(ProfileFollowButton)


const ProfilePageData = ({ myID, data: { _id, avatar, login, nick, createdAt = '', followers, following }, count, setFollowing, setFollowers }) =>
    <Row className='Profile' >
        <Col flex={'150px'}>
            <UserAvatar avatarSize={'150px'} avatar={avatar} />
        </Col>
        <Col className='Profile__data' flex={'auto'} offset={2}>
            <Row align='top' justify='space-between' className='Profile__name'>
                <Col>
                    <h1>{nick || login || 'No Name'}</h1>
                    <span className='Profile__login'>{login || '----'}</span>
                </Col>
                <Col >
                    {myID !== _id
                        ? <CProfileFollowButton userId={_id} />
                        : <Button type=''><Link to={`/my-settings`}>Settings</Link></Button>}
                </Col>
            </Row>
            <Row align='middle' justify='space-between'>
                <Col className='Profile__created'>
                    <Text type='secondary'>Account created: <DateCreated date={createdAt} /></Text>
                </Col>
                {myID !== _id && <Col offset={1}>
                    <Link className='Profile__link-message' to='/message'>Send message</Link>
                </Col>}
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
    myID: state.auth.payload.sub.id || '',
    data: state?.postsFeed?.userData || {},
    count: state?.postsFeed?.count || null
}))(ProfilePageData)




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
        <Container>
            <CProfilePageData setFollowing={setFollowing} setFollowers={setFollowers} />
            {followers && < CModalFollowers statusModal={setFollowers} title={'Followers'} />}
            {following && < CModalFollowing statusModal={setFollowing} title={'Following'} />}
            <CPosts />
        </Container>
    )
}

export const CProfilePage = connect(state => ({
    posts: state?.postsFeed?.posts || []
}), { getProfileUser: actionProfilePageData, clearDataProfile: actionRemovePostsFeedAC })(ProfilePage)
