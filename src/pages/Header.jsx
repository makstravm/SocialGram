import React from 'react'
import logo from '../logo.svg';
import { Link, NavLink } from 'react-router-dom';
import { CFieldSearch } from '../components/header/Search';
import { connect } from 'react-redux';
import { actionAuthLogout, actionRemoveMyDataAC } from '../actions';
import Layout, { Header } from 'antd/lib/layout/layout';
import { Col, Menu, Popover, Row } from 'antd';
import { UserOutlined, CompassOutlined, SettingOutlined, HomeOutlined, ImportOutlined, MessageOutlined, PlusCircleOutlined } from '@ant-design/icons/lib/icons';
import { UserAvatar } from '../components/header/UserAvatar';
import { CollectionEmptySvg } from '../helpers';

const UserNav = () =>
    <div className='UserNav'>
        <CUserNavIcon />
    </div>





const ProfileDropMenu = ({ myID, onLogOut, removeMydata }) =>
    <Menu className='dropMenu'>
        <Menu.Item key={'0'}>
            <Link to={`/profile/${myID}`}><UserOutlined /> My Profile</Link>
        </Menu.Item>
        <Menu.Item key={'1'}>
            <Link to={'/my-collection'}>< CollectionEmptySvg className='dropMenu__icon' />Collection</Link>
        </Menu.Item>
        <Menu.Item key={'2'}>
            <Link to={'/my-settings'}><SettingOutlined /> Settings</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key={'3'}>
            <button onClick={() => {
                onLogOut()
                removeMydata()
            }}><ImportOutlined /> Log out</button>
        </Menu.Item>
    </Menu>

const CProfileDropMenu = connect(null, { onLogOut: actionAuthLogout, removeMydata: actionRemoveMyDataAC })(ProfileDropMenu)


const UserNavIcon = ({ userData: { _id, avatar, login } }) =>
    < Row justify="end" align="middle" className='Header__userNav' >
        <Col >
            <NavLink to='/feed'><HomeOutlined /></NavLink>
        </Col>
        <Col >
            <NavLink to='/message'><MessageOutlined /></NavLink>
        </Col>
        <Col >
            <NavLink to='/edit/post/new'><PlusCircleOutlined /></NavLink>
        </Col>
        <Col >
            <NavLink to='/all'><CompassOutlined /></NavLink>
        </Col>
        <Col>
            <Popover placement="bottomRight" content={<CProfileDropMenu myID={_id} />}>
                <></>
                <UserAvatar avatar={avatar} login={login} avatarSize={'45px'} />
            </Popover>
        </Col>
    </Row >

const CUserNavIcon = connect(state => ({ userData: state.myData || {} }))(UserNavIcon)


const Logo = () =>
    <Link className='Logo' to='/'>
        <img src={logo} alt='logo' width='180vw' />
    </Link>


const HeaderComponent = () =>
    <Layout>
        <Header style={{ position: 'fixed', zIndex: 3, width: '100%' }}>
            <Row justify="space-between" align="middle" className='Header__inner'>
                <Col span={8}>
                    <Logo />
                </Col>
                <Col span={8}>
                    <CFieldSearch />
                </Col>
                <Col span={8}>
                    <UserNav />
                </Col>
            </Row>
        </Header>
    </Layout>


export default HeaderComponent 
