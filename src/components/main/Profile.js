import { Button, Col, List, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actionProfilePageData, actionRemovePostsFeedAC, actionSubscribe, actionUnSubscribe } from '../../actions'
import { backURL } from '../../helpers'
import { UserAvatar } from '../header/Header'

const ModalFolower = ({ statusModal, data, title }) => {

    const handleCancel = () => statusModal(false);

    return (
        <Modal className='Modal'
            title={title}
            visible={true}
            destroyOnClose={true}
            footer={null}
            onCancel={handleCancel}>
            <></>
            <List className='Modal__inner'
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item >
                        <Link to={`/profile/${item._id}`} style={{ width: '100%' }} onClick={handleCancel}>
                            <Row align='middle' >
                                <Col>
                                    <UserAvatar avatar={item.avatar} avatarSize={'40px'} />
                                </Col>
                                <Col offset={2}>{item.nick || item.login || 'No Name'}</Col>
                            </Row>
                        </Link>
                    </List.Item>
                )}
            />
        </Modal>
    )
}

const CModalFollowers = connect(state => ({ data: state?.postsFeed?.userData?.followers || [] }))(ModalFolower)
const CModalFollowing = connect(state => ({ data: state?.postsFeed?.userData?.following || [] }))(ModalFolower)


const ProfileSetting = ({ myID, userId, followers, onSubsuscribe, onUnSubsuscribe }) => {
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
}), { onSubsuscribe: actionSubscribe, onUnSubsuscribe: actionUnSubscribe })(ProfileSetting)

const ProfilePageData = ({ data: { _id, avatar, login, nick, followers, following }, count, setFollowing, setFollowers }) => {

    return (
        <Row className='Profile' align='middle'>
            <Col span={8}>
                <UserAvatar avatarSize={'150px'} avatar={avatar} />
            </Col>
            <Col span={14} offset={1}>
                <Row align='top'>
                    <Col>
                        <h1>{nick || login || 'No Name'}</h1>
                        <span className='Profile__login'>{login || '----'}</span>
                    </Col>
                    < CProfileSetting userId={_id} />
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
    )
}

const CProfilePageData = connect(state => ({
    data: state?.postsFeed?.userData || {},
    count: state?.postsFeed?.count || null
}))(ProfilePageData)


const ProfilePagePosts = ({ posts }) => {
    return (
        <Row>
            {posts.map(p => <Col key={p._id}>
                {p.images && p.images[0] && p.images[0].url && <img src={(backURL + '/' + p?.images[0].url)} alt='post Img' />}
            </Col>)
            }
        </Row >
    )

}

export const CProfilePagePosts = connect(state => ({ posts: state.postsFeed?.posts || [] }))(ProfilePagePosts)

const ProfilePage = ({ match: { params: { _id } }, posts, count, getProfileUser, clearDataProfile }) => {
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
        if (checkScroll ) {
         
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
