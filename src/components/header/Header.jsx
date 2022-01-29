import React from 'react'
import logo from '../../logo.svg';
import { Link, NavLink } from 'react-router-dom';
import { CFieldSearch } from './Search';
import { connect } from 'react-redux';
import { Header } from 'antd/lib/layout/layout';
import { Col, Row } from 'antd';
import { CompassOutlined, HomeOutlined, MessageOutlined, PlusCircleOutlined } from '@ant-design/icons/lib/icons';
import { UserAvatar } from './UserAvatar';
import MediaQuery from "react-responsive";
import { CollectionEmptySvg } from '../../helpers';


const UserNavIcon = ({ userData: { _id, avatar, login } }) =>
    < Row justify="end" align="middle" className='Header__userNav' >
        <Col >
            <NavLink to='/feed'><HomeOutlined /></NavLink>
        </Col>
        <Col >
            <NavLink to='/direct'><MessageOutlined /></NavLink>
        </Col>
        <Col >
            <NavLink to='/edit/post/new'><PlusCircleOutlined /></NavLink>
        </Col>
        <Col >
            <NavLink to='/all'><CompassOutlined /></NavLink>
        </Col>
        <Col >
            <NavLink to='/my-collection'><CollectionEmptySvg /></NavLink>
        </Col>
        <MediaQuery minWidth={787}>
            <Col>
                <Link to={`/profile/${_id}`}>
                    <UserAvatar avatar={avatar} login={login} avatarSize={'45px'} />
                </Link>
            </Col>
        </MediaQuery>
        <MediaQuery maxWidth={786}>
            <Col>
                <Link to={`/profile/${_id}`}>
                    <UserAvatar avatar={avatar} login={login} avatarSize={'45px'} />
                </Link>
            </Col>
        </MediaQuery>
    </Row >

export const CUserNavIcon = connect(state => ({ userData: state.myData || {} }))(UserNavIcon)


const Logo = () =>
    <Link className='Logo' to='/'>
        <img src={logo} alt='logo' width='180vw' />
    </Link>


const HeaderComponent = () =>
    <Header style={{ position: 'fixed', zIndex: 3, width: '100%' }}>
        <Row justify="space-between" align="middle" className='Header__inner'>
            <Col flex={2}>
                <Logo />
            </Col>
            <Col flex={1}>
                <CFieldSearch />
            </Col>
            <MediaQuery minWidth={787}>
                <Col flex={2}>
                    <CUserNavIcon />
                </Col>
            </MediaQuery>
        </Row>
    </Header>


export default HeaderComponent 
