import React, { useState } from 'react'
import authBg from '../images/authBg.png'
import { connect } from 'react-redux'
import { NavLink, Route } from 'react-router-dom'
import { actionFullLogin } from '../actions'


import { Form, Input, Button, Row, Col, Card, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const FormInput = ({ buttonTitle, onSignIn }) => {
    const onFinish = ({ login, password }) => {
        console.log('Received values of form: ', );
        onSignIn(login, password)
    };
    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            labelCol={{ flex: '25px' }}
            layout={'vertical'}
            onFinish={onFinish}
        >
            <Form.Item
                name="login"
                label='Login'
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                label='Password'
                rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item >
                <Button type="primary" className="login-form-button" htmlType="submit">
                    {buttonTitle}
                </Button>
            </Form.Item>
        </Form>
    )
}
const actionRegister = (login, pas) => alert('hi'+ login + ' ' + pas)
const CLoginForm = connect(null, { onSignIn: actionFullLogin })(FormInput)
const CRegisterForm = connect(null, { onSignIn: actionRegister })(FormInput)

export const Authorization = ({ match: { params: { _id } } }) => {
    console.log(_id);
    return (
        <div className='Authorization' style={{ backgroundImage: `url(${authBg})` }}>
            <Row justify="end" align="middle" className='Authorization__form'>
                <Col >
                    <Card style={{ width: 380 }} >
                        <NavLink activeClassName='active' to={`/auth/login`}><span>Log In</span></NavLink>
                        <Divider type="vertical" />
                        <NavLink activeClassName='active' to={'/auth/registration'}>Registration</NavLink>
                        <Divider>{_id === 'login' ? 'Log in' : 'Registration'}</Divider >
                        {_id === 'login' ? <CLoginForm buttonTitle={'Sign In'} /> : <CRegisterForm buttonTitle={'Sign up'} />}

                    </Card>
                </Col>
            </Row >
        </div>
    )
}


