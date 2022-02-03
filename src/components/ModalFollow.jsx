import { Col, List, Row, Skeleton } from 'antd';
import Modal from 'antd/lib/modal/Modal'
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionGetFindFollowers, actionGetFindFollowing, actionGetPostUsersLiked } from '../actions/actionsGetGql';
import { UserAvatar } from './UserAvatar';


const ModalDataInner = ({ _id, avatar, nick, handleCancel }) =>
    <Link to={`/profile/${_id}`} onClick={() => handleCancel()} style={{ width: '100%' }} >
        <Row align='middle' >
            <Col>
                <UserAvatar avatar={avatar} avatarSize={'40px'} />
            </Col>
            <Col offset={2}>
                {nick}
            </Col>
        </Row>
    </Link >


const ModalDataInfo = ({ id, status, statusModal, data, title, getData }) => {

    const handleCancel = () => statusModal(false);
    const newData = data.map(d => d.owner ? d.owner : d)

    useEffect(() => {
        getData(id)
    }, [])


    return (
        <Modal className='Modal'
            title={title}
            visible={true}
            destroyOnClose={true}
            footer={null}
            onCancel={handleCancel}>
            {status !== 'RESOLVED'
                ? <Skeleton className='Modal__inner' avatar active paragraph={{ rows: 0 }} />
                : <List className='Modal__inner'
                    itemLayout="horizontal"
                    dataSource={newData}
                    renderItem={item => (
                        <List.Item >
                            <ModalDataInner
                                _id={item._id}
                                avatar={item.avatar}
                                nick={item.nick || item.login || 'No Name'}
                                handleCancel={handleCancel} />
                        </List.Item>
                    )}
                />}
        </Modal>
    )
}

export const CModalFollowers = connect(state => ({
    id: state?.dataProfile?._id,
    data: state?.promise?.findFollow?.payload?.followers || [],
    status: state?.promise?.findFollow?.status
}), { getData: actionGetFindFollowers })(ModalDataInfo)

export const CModalFollowing = connect(state => ({
    id: state?.dataProfile?._id,
    data: state?.promise?.findFollow?.payload?.following || [],
    status: state?.promise?.findFollow?.status
}), { getData: actionGetFindFollowing })(ModalDataInfo)

export const CModalUsersLiked = connect(state => ({
    data: state?.promise?.usersPostLiked?.payload || [],
    status: state?.promise?.usersPostLiked?.status
}), { getData: actionGetPostUsersLiked })(ModalDataInfo)

