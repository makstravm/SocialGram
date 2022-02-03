import { Col, Row } from "antd"
import Paragraph from "antd/lib/typography/Paragraph"
import Text from "antd/lib/typography/Text"
import { connect } from "react-redux"


export const DateCreated = ({ date = '' }) => {

    const newDate = new Date(date * 1)
    const resultDate = new Intl.DateTimeFormat('default').format(newDate)

    return (
        <>
            {resultDate}
        </>
    )
}

const PostTitle = ({ title, date }) =>
    <Row justify='space-between'>
        <Col >
            {!!title && <Text level={3} strong>{title}</Text>}
        </Col>
        <Col >
            <Text type='secondary'>
                <DateCreated date={date} />
            </Text>
        </Col>
    </Row>

export const PostDescription = ({ title, description, date }) =>
    <>
        <PostTitle title={title} date={date} />
        <Paragraph ellipsis={true ? { rows: 1, expandable: true, symbol: '...More' } : false}>
            {description}
        </Paragraph>
    </>


export const CPostDescription = connect(state => ({
    title: state?.postOne?.title,
    description: state?.postOne?.text,
    date: state?.postOne?.createdAt
}))(PostDescription) 