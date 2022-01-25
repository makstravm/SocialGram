import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { actionFullLogIn, actionFullRegister } from '../actions';

const FormAuthorization = ({ buttonTitle, onSignIn, loginChek }) => {

    useEffect(() => {
        if (loginChek.status === "RESOLVED" && loginChek.payload === null) {
            console.log(loginChek?.payload);
            message.error({
                content: 'Wrong login or password',
                className: 'custom-class',
                style: {
                    marginTop: '20vh',
                },
            })
        }
    }, [loginChek.status]);


    const onFinish = ({ login, password, remember }) => {
        onSignIn(login, password, remember)
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
            size='middle'
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
            <Form.Item
                name="remember"
                valuePropName="checked"
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Form.Item >
                <Button type="primary" className="login-form-button" htmlType="submit">
                    {buttonTitle}
                </Button>
            </Form.Item>
        </Form>
    )
}
export const CLoginForm = connect(state => ({ loginChek: state?.promise?.login || {} }), { onSignIn: actionFullLogIn, })(FormAuthorization)
export const CRegisterForm = connect(state => ({ status: state?.promise?.login }), { onSignIn: actionFullRegister, })(FormAuthorization)




