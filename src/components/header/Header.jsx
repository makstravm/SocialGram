import React from 'react'
import logo from '../../logo.svg';
import { Link } from 'react-router-dom';
import { CFieldSearch } from './Search';
import { connect } from 'react-redux';
import { actionAuthLogout, actionProfilData } from '../../actions';
import { backURL } from '../../helpers';
import Layout, { Header } from 'antd/lib/layout/layout';
import { Avatar, Col, Menu, Popover, Row } from 'antd';
import { UserOutlined, CompassOutlined, SettingOutlined, HomeOutlined, ImportOutlined, MessageOutlined, PlusCircleOutlined } from '@ant-design/icons/lib/icons';

const UserNav = ({ id, profileData }) => {
    profileData(id)
    return <div className='UserNav'>
        <CUserNavIcon />
    </div>
}

export const UserAvatar = ({ avatarSize, avatar, login = "user", nick }) => {
    return (
        <>
            {
                avatar && avatar?.url ?
                    <Avatar style={{
                        width: avatarSize,
                        height: avatarSize
                    }}
                        src={
                            <img src={(backURL + '/' + avatar.url)} alt='avatar' />
                        } /> :
                    <Avatar style={{
                        width: avatarSize,
                        height: avatarSize,
                        color: '#040c80',
                        backgroundColor: '#f8cff0'
                    }}>
                        <span style={{ fontWeight: 500, fontSize: '1.3em', lineHeight: avatarSize }}>{nick ? nick[0].toUpperCase() : login ? login[0].toUpperCase() : 'U'}
                        </span>
                    </Avatar >
            }
        </>
    )
}
const ProfileDropMenu = ({ onLogOut }) =>
    <Menu className='dropMenu'>
        <Menu.Item key={'0'}>
            <Link to={'/'}><UserOutlined /> My Profile</Link>
        </Menu.Item>
        <Menu.Item key={'1'}>
            <Link to={'/'}><SettingOutlined /> Settings</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key={'2'}>
            <button onClick={() => onLogOut()}><ImportOutlined /> Log out</button>
        </Menu.Item>
    </Menu>

const CProfileDropMenu = connect(null, { onLogOut: actionAuthLogout })(ProfileDropMenu)

const UserNavIcon = ({ userData: { _id, avatar, login } }) =>
    <Row justify="end" align="middle" className='Header__userNav'>
        <Col >
            <Link to='/'><HomeOutlined /></Link>
        </Col>
        <Col >
            <Link to='/message'><MessageOutlined /></Link>
        </Col>
        <Col >
            <Link to='/add'><PlusCircleOutlined /></Link>
        </Col>
        <Col >
            <Link to='/rar'><CompassOutlined /></Link>
        </Col>
        <Col>
            <Popover placement="bottomRight" content={<CProfileDropMenu myID={_id} />} trigger={'click'}>
                <></>
                <UserAvatar avatar={avatar} login={login} avatarSize={'45px'} />
            </Popover>
        </Col>
    </Row >

const CUserNav = connect(state => ({ id: state.auth?.payload.sub.id || {} }), { profileData: actionProfilData })(UserNav)

const CUserNavIcon = connect(state => ({ userData: state.promise?.dataProfileAuth.payload || {} }))(UserNavIcon)

const Logo = () =>
    <Link className='Logo' to='/'>
        <img src={logo} alt='logo' width='180vw' />
    </Link>

const HeaderComponent = () =>
    <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Row justify="space-between" align="middle" className='Header__inner'>
                <Col span={8}>
                    <Logo />
                </Col>
                <Col span={8}>
                    <CFieldSearch />
                </Col>
                <Col span={8}>
                    <CUserNav />
                </Col>
            </Row>
        </Header>
    </Layout>


export default HeaderComponent 
