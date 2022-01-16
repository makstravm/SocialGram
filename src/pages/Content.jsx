import { Col, Row } from 'antd'
import React from 'react'




export const Main = ({ children }) =>
    <Row justify='center' className='Main'>
        <Col xs={{ span: 24 }} sm={{ span: 20 }} md={{ span: 16 }} lg={{ span: 14 }} xl={{span:12}}className='Main__inner'>
            {children}
        </Col>
    </Row>



export const Content = ({ children }) =>
    <>{children}</>

