import React from 'react'
import logo from '../../logo.svg';
import { Link, NavLink } from 'react-router-dom';
import { CFieldSearch } from './Search';
import { connect } from 'react-redux';
import { actionAuthLogout, actionRemoveMyDataAC } from '../../actions';
import { Header } from 'antd/lib/layout/layout';
import { Col, Menu, Popover, Row } from 'antd';
import { UserOutlined, CompassOutlined, SettingOutlined, HomeOutlined, ImportOutlined, MessageOutlined, PlusCircleOutlined } from '@ant-design/icons/lib/icons';
import { UserAvatar } from './UserAvatar';
import { CollectionEmptySvg } from '../../helpers';
import MediaQuery from "react-responsive";


export const UserNav = () =>
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
            <MediaQuery minWidth={768}>
                <Popover placement="bottomRight" content={<CProfileDropMenu myID={_id} />}>
                    <UserAvatar avatar={avatar} login={login} avatarSize={'45px'} />
                </Popover>
            </MediaQuery>
            <MediaQuery maxWidth={768}>
                <Popover placement="topRight"  content={<CProfileDropMenu myID={_id} />}>
                    <UserAvatar avatar={avatar} login={login} avatarSize={'45px'} />
                </Popover>
            </MediaQuery>
        </Col>
    </Row >

const CUserNavIcon = connect(state => ({ userData: state.myData || {} }))(UserNavIcon)


const Logo = () =>
    <Link className='Logo' to='/'>
        <img src={logo} alt='logo' width='180vw' />
    </Link>


const HeaderComponent = () =>
    <Header style={{ position: 'fixed', zIndex: 3, width: '100%' }}>
        <Row justify="space-between" align="middle" className='Header__inner'>
            <Col >
                <Logo />
            </Col>
            <Col >
                <CFieldSearch />
            </Col>
            <MediaQuery minWidth={768}>
                <Col >
                    <UserNav />
                </Col>
            </MediaQuery>
        </Row>
    </Header>


export default HeaderComponent 
