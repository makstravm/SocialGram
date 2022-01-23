import { Col, Row, Button, Dropdown, Menu } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { UserAvatar } from '../../../pages/Header'

const MenuOverlay = ({ postId }) =>
    <Menu>
        <Menu.Item>
            <Link to={`/edit/post/${postId}`}> Edit post</Link>
        </Menu.Item>
    </Menu >

export const PostTitle = ({ owner, myID, postId }) =>
    <Row justify="space-between" align='middle'>
        <Col>
            <Link to={`/profile/${owner?._id}`} className='owner'>
                <UserAvatar avatar={owner?.avatar} avatarSize={'45px'} />
                <span className='nick'>{owner?.nick ? owner.nick : owner?.login ? owner.login : 'Null'}</span>
            </Link >
        </Col>
        {owner?._id === myID && <Col>
            <Dropdown overlay={<MenuOverlay postId={postId} />} placement="bottomRight" trigger={['click']}>
                <Button type='link'><MoreOutlined style={{ fontSize: '1.4em' }} /></Button>
            </Dropdown>

        </Col>}
    </Row>



export const CPostTitle = connect(state => ({ myID: state?.auth?.payload?.sub?.id || '' }))(PostTitle)