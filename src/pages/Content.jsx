import { Col, Row } from 'antd'
import React from 'react'




export const Container = ({ children }) =>
    <Row justify='center' className='Main__inner'>
        <Col xs={{ span: 24 }} sm={{ span: 20 }} md={{ span: 16 }} lg={{ span: 14 }} xl={{ span: 12 }} >
            {children}
        </Col>
    </Row>


export const Main = ({ children }) =>
    <div className='Main'>{children}</div>




export const Content = ({ children }) =>
    <>{children}</>

