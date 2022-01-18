import { Col, List, Row, Skeleton } from 'antd';
import Modal from 'antd/lib/modal/Modal'
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionFindFollowers, actionFindFollowing } from '../../../actions';
import { UserAvatar } from '../../../pages/Header';


const ModalFolower = ({ id, status, statusModal, data, title, follow }) => {
    const handleCancel = () => statusModal(false);

    useEffect(() => {
        follow(id)
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
                />}
        </Modal>
    )
}

export const CModalFollowers = connect(state => ({
    id: state?.postsFeed?.userData?._id,
    data: state?.promise?.findFollow?.payload?.followers || [],
    status: state?.promise?.findFollow?.status
}), { follow: actionFindFollowers })(ModalFolower)

export const CModalFollowing = connect(state => ({
    id: state?.postsFeed?.userData?._id,
    data: state?.promise?.findFollow?.payload?.following || [],
    status: state?.promise?.findFollow?.status
}), { follow: actionFindFollowing })(ModalFolower)
