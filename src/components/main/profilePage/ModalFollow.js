import { Col, List, Row, Skeleton } from 'antd';
import Modal from 'antd/lib/modal/Modal'
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionFindFollowers, actionFindFollowing, actionFindLiked } from '../../../actions';
import { UserAvatar } from '../../header/UserAvatar';


const ModalFolower = ({ id, status, statusModal, data, title, follow }) => {
    const handleCancel = () => statusModal(false);

    useEffect(() => {
        follow(id)
    }, [])
    const newData = data.map(d => d.owner ? d.owner : d)
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
                />}
        </Modal>
    )
}

export const CModalFollowers = connect(state => ({
    id: state?.post?.userData?._id,
    data: state?.promise?.findFollow?.payload?.followers || [],
    status: state?.promise?.findFollow?.status
}), { follow: actionFindFollowers })(ModalFolower)

export const CModalFollowing = connect(state => ({
    id: state?.post?.userData?._id,
    data: state?.promise?.findFollow?.payload?.following || [],
    status: state?.promise?.findFollow?.status
}), { follow: actionFindFollowing })(ModalFolower)

export const CModalPostLiked = connect(state => ({
    data: state?.promise?.findLiked?.payload || [],
    status: state?.promise?.findLiked?.status
}), { follow: actionFindLiked })(ModalFolower)

