import { Button, Col, List, Row } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { actionFullSubscribe, actionProfilePageData } from '../../redux/redux-thunk'
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

const CModalFollowers = connect(state => ({ data: state?.profileData?.userData?.followers || [] }))(ModalFolower)
const CModalFollowing = connect(state => ({ data: state?.profileData?.userData?.following || [] }))(ModalFolower)


const ProfileSetting = ({ userId, onSubsuscribe }) => {
    useEffect(() => {

        return () => {

        }
    }, [])
    console.log(userId);
    return (
        <Col className='Profile__seting' offset={4}>
            <Button onClick={() => onSubsuscribe(userId)} type="primary">Primary Button</Button>
        </Col>
    )
}

const CProfileSetting = connect(null, { onSubsuscribe: actionFullSubscribe })(ProfileSetting)

const ProfilePageData = ({ data: { _id, avatar, login, nick, followers, following }, posts, setFollowing, setFollowers }) => {

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
                        <strong>{posts?.length || '0'}</strong>
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
    data: state?.profileData?.userData || {},
    posts: state?.profileData?.userPosts || []
}))(ProfilePageData)

const ProfilePage = ({ match: { params: { _id, id } }, getProfileUser }) => {
    const [followers, setFollowers] = useState(false)
    const [following, setFollowing] = useState(false)
    useEffect(() => {
        getProfileUser(_id)
    }, [_id])
    return (
        <>
            <CProfilePageData setFollowing={setFollowing} setFollowers={setFollowers} />
            {followers && < CModalFollowers statusModal={setFollowers} title={'Followers'} />}
            {following && < CModalFollowing statusModal={setFollowing} title={'Following'} />}
        </>
    )
}

export const CProfilePage = connect(null, { getProfileUser: actionProfilePageData })(ProfilePage)