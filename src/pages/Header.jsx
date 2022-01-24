import React from 'react'
import logo from '../logo.svg';
import { Link } from 'react-router-dom';
import { CFieldSearch } from '../components/header/Search';
import { connect } from 'react-redux';
import { actionAuthLogout } from '../actions';
import Layout, { Header } from 'antd/lib/layout/layout';
import {  Col, Menu, Popover, Row } from 'antd';
import { UserOutlined, CompassOutlined, SettingOutlined, HomeOutlined, ImportOutlined, MessageOutlined, PlusCircleOutlined } from '@ant-design/icons/lib/icons';
import { UserAvatar } from '../components/header/UserAvatar';

const UserNav = () =>
    <div className='UserNav'>
        <CUserNavIcon />
    </div>



const ProfileDropMenu = ({ myID, onLogOut }) =>
    <Menu className='dropMenu'>
        <Menu.Item key={'0'}>
            <Link to={`/profile/${myID}`}><UserOutlined /> My Profile</Link>
        </Menu.Item>
        <Menu.Item key={'1'}>
            <Link to={'/my-settings'}><SettingOutlined /> Settings</Link>
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
            <Link to='/edit/post/new'><PlusCircleOutlined /></Link>
        </Col>
        <Col >
            <Link to='/all'><CompassOutlined /></Link>
        </Col>
        <Col>
            <Popover placement="bottomRight" content={<CProfileDropMenu myID={_id} />} trigger={['focus', 'hover']}>
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
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
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
