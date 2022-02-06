import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actionChangeSubscribeSagaAC, actionClearPostsTapeAC, actionClearProfileDataAC, actionProfileDataSagaAC } from '../actions/actonsCreators'
import { Container } from '../components/Container'
import { UserAvatar } from '../components/UserAvatar'
import { DateCreated } from '../components/post/PostDescription'
import Text from 'antd/lib/typography/Text'
import { CModalFollowers, CModalFollowing } from '../components/ModalFollow'
import { CGalleryMediaPostsUser } from '../components/GalleryMediaPostsUser'
import { CPreloader } from '../components/Preloader'


const ProfileFollowButton = ({ myID, userId, followers, onChangeSubscribe }) => {
    const followCheck = followers.find(f => f._id === myID && true)
    return (
        <Col className='Profile__setting'>
            {!!followCheck ?
                <Button onClick={() => onChangeSubscribe(userId, followCheck)}>UnSubscribe</Button> :
                <Button onClick={() => onChangeSubscribe(userId, followCheck)} type="primary">Subscribe</Button>}
        </Col>
    )
}


const CProfileFollowButton = connect(state => (
    {
        myID: state?.aboutMe._id,
        followers: state?.dataProfile?.followers || []
    }),
    {
        onChangeSubscribe: actionChangeSubscribeSagaAC
    })(ProfileFollowButton)


const ProfilePageName = ({ myID, data: { _id, login, nick } }) =>
    <Row align='top' justify='space-between' className='Profile__name'>
        <Col>
            <h1>{nick || login || 'No Name'}</h1>
            <span className='Profile__login'>{login || '----'}</span>
        </Col>
        <Col >
            {myID !== _id
                ? <CProfileFollowButton userId={_id} />
                : <Button type=''>
                    <Link to={`/my-settings`}>Settings</Link>
                </Button>}
        </Col>
    </Row>

const CProfilePageName = connect(state => ({
    myID: state?.aboutMe?._id,
    data: state?.dataProfile
}))(ProfilePageName)


const ProfilePageCreateAt = ({ myID, data: { _id, createdAt } }) =>
    <Row align='middle' justify='space-between'>
        <Col className='Profile__created'>
            <Text type='secondary'>
                Account created: <DateCreated date={createdAt} />
            </Text>
        </Col>
        {myID !== _id &&
            <Col offset={1}>
                <Link className='Profile__link-message' to='/message'>
                    Send message
                </Link>
            </Col>
        }
    </Row>

const CProfilePageCreateAt = connect(state => ({
    myID: state?.aboutMe?._id,
    data: state?.dataProfile
}))(ProfilePageCreateAt)


const ProfilePageStatistic = ({ count, data: { followers, following } }) => {
    const [openFollowers, setOpenFollowers] = useState(false)
    const [openFollowing, setOpenFollowing] = useState(false)
    return (
        <Row className='Profile__count' align='middle' justify='space-between' >
            <Col >
                <strong>{count || '0'}</strong>
                <span>Posts</span>
            </Col>
            <Col >
                <Button type="link" onClick={() => setOpenFollowers(true)}>
                    <strong>{followers?.length || '0'}</strong>
                    <span>Followers</span>
                </Button>
            </Col>
            <Col >
                <Button type="link" onClick={() => setOpenFollowing(true)}>
                    <strong>{following?.length || '0'}</strong>
                    <span>Following</span>
                </Button>
            </Col>
            {openFollowers && < CModalFollowers statusModal={setOpenFollowers} title={'Followers'} />}
            {openFollowing && < CModalFollowing statusModal={setOpenFollowing} title={'Following'} />}
        </ Row>
    )
}

const CProfilePageStatistic = connect(state => ({
    data: state?.dataProfile,
    count: state?.postsTape?.count
}))(ProfilePageStatistic)


const ProfilePageData = ({ children }) =>
    <>{children} </>


const ProfilePageDataContainer = ({ avatar }) =>
    <Row className='Profile' >
        <Col flex={'150px'}>
            <UserAvatar avatarSize={'150px'} avatar={avatar} />
        </Col>
        <Col className='Profile__data' flex={'auto'} offset={2}>
            <ProfilePageData>
                <CProfilePageName />
                <CProfilePageCreateAt />
                <CProfilePageStatistic />
            </ProfilePageData>
        </Col>
    </Row >

const CProfilePageData = connect(state => ({ avatar: state?.dataProfile?.avatar }))(ProfilePageDataContainer)



const ProfilePage = ({ match: { params: { _id } }, getProfileUser, clearProfileData, clearPostsTape }) => {

    const [checkScroll, setCheckScroll] = useState(true)

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return () => {
            document.removeEventListener('scroll', scrollHandler)
            setCheckScroll(true)
            clearProfileData()
            clearPostsTape()
        }
    }, [_id])

    useEffect(() => {
        if (checkScroll) {
            getProfileUser(_id)
            setCheckScroll(false)
        }
    }, [_id, checkScroll])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 300) {
            setCheckScroll(true)
        }
    }

    return (
        <Container>
            <CPreloader promiseName='userOneData'/>
            <CProfilePageData />
            <CGalleryMediaPostsUser />
        </Container>
    )
}

export const CProfilePage = connect(null,
    {
        getProfileUser: actionProfileDataSagaAC,
        clearProfileData: actionClearProfileDataAC,
        clearPostsTape: actionClearPostsTapeAC,
    })(ProfilePage)
