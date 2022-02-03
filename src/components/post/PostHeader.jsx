import { Col, Row, Button, Dropdown, Menu } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { UserAvatar } from '../UserAvatar'


const MenuOverlay = ({ postId }) =>
    <Menu>
        <Menu.Item key={'1'}>
            <Link to={`/edit/post/${postId}`}> Edit post</Link>
        </Menu.Item>
    </Menu >


const EditMyPostBtn = ({ myID, postId, owner }) =>
    <>
        {owner?._id === myID &&
            <Col>
                <Dropdown overlay={<MenuOverlay postId={postId} />} placement="bottomRight" trigger={['click']}>
                    <Button type='link'>
                        <MoreOutlined style={{ fontSize: '1.4em' }} />
                    </Button>
                </Dropdown>
            </Col>
        }
    </>
export const CEditMyPostBtn = connect(state => ({ myID: state?.aboutMe?._id }))(EditMyPostBtn)

export const PostHeader = ({ owner, children }) =>
    <Row justify="space-between" align='middle'>
        <Col>
            <Link to={`/profile/${owner?._id}`} className='owner'>
                <UserAvatar avatar={owner?.avatar} avatarSize={'45px'} />
                <span className='nick'>{owner?.nick ? owner.nick : owner?.login ? owner.login : 'Null'}</span>
            </Link >
        </Col>
        {children}
    </Row>




