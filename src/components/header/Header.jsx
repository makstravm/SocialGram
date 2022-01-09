import React from 'react'
import logo from '../../logo.svg';
import { Link } from 'react-router-dom';
import { CFieldSearch, Searcha } from './Search';
import { connect } from 'react-redux';
import { actionProfilData } from '../../actions';
import { backURL } from '../../helpers';
import Layout, { Header } from 'antd/lib/layout/layout';
import { Avatar, Col, Image, Row } from 'antd';

const UserNav = ({ id, profileData }) => {
    profileData(id)
    return <div className='UserNav'>
        <CUserNavIcon />
    </div>
}

export const UserAvatar = ({ avatar, login = "user", nick }) => {
    return (
        <>
            {
                avatar && avatar?.url ?
                    <Avatar style={{
                        width: 40,
                        height: 40
                    }}
                        src={
                            <img src={(backURL + '/' + avatar.url)} alt='avatar' />
                        } /> :
                    <Avatar style={{
                        width: '40px',
                        height: '40px',
                        color: '#040c80',
                        backgroundColor: '#f8cff0'
                    }}>
                        <span style={{ fontWeight: 500, fontSize: '1.3em', lineHeight: '40px' }}>{nick ? nick[0].toUpperCase() : login ? login[0].toUpperCase() : 'U'}
                        </span>
                    </Avatar >
            }
        </>
    )
}



const UserNavIcon = ({ userData: { _id, avatar, login } }) =>
    <Row justify="end" align="middle" className='Header__userNav'>
        <Col >
            <Link to='/'>Home</Link>
        </Col>
        <Col >
            <Link to='/message'>Messsege</Link>
        </Col>
        <Col >
            <Link to='/add'>addq</Link>
        </Col>
        <Col >
            <Link to='/rar'>Random</Link>
        </Col>
        <Col>
            <Link to={`/${_id}`}>
                <UserAvatar avatar={avatar} login={login} />
            </Link>
        </Col>
    </Row>

const CUserNav = connect(state => ({ id: state.auth?.payload.sub.id || {} }), { profileData: actionProfilData })(UserNav)

const CUserNavIcon = connect(state => ({ userData: state.promise?.dataProfileAuth.payload || {} }))(UserNavIcon)

const Logo = () =>
    <Link to='/'>
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
