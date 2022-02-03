import { Divider, Tooltip } from "antd"
import Paragraph from "antd/lib/typography/Paragraph"
import { Link } from "react-router-dom"
import moment from 'moment'
import { CCommentFieldPostTape } from "../CommentField"


export const PostCommentDate = ({ createdAt }) =>
    <Tooltip
        title={moment(new Date(+createdAt)).format('DD-MM-YYYY HH:mm:ss')}
    >
        {moment(new Date(+createdAt)).startOf('seconds').fromNow()}
    </ Tooltip>


const CommentPostInTape = ({ comment }) =>
    <div className='CommentPostFeed'>
        <Link to={`/profile/${comment.owner._id}`}>
            {comment?.owner?.nick || comment?.owner?.login}
        </Link>
        <PostCommentDate createdAt={comment.createdAt} />
        <Paragraph
            style={{ paddingLeft: 20 }}
            ellipsis={{ rows: 1, expandable: true, symbol: 'more' }}>
            {comment?.text}
        </Paragraph>
    </div>


const CommentsInnerPostInTape = ({ comments, _id }) =>
    <>
        {(comments.length > 2) && <Link to={`/post/${_id}`}>
            <Divider orientation="left">
                {`View ${comments.length} comments`}
            </Divider>
        </Link>}
        {comments.slice(-2).map(c => <CommentPostInTape key={c._id} comment={c} />)}
    </>


const CommentsContentPostInTape = ({ comments, _id }) =>
    <>
        {
            comments && comments.length
                ? <CommentsInnerPostInTape comments={comments} _id={_id} />
                : <Link to={`/post/${_id}`}>
                    <Divider orientation="left">
                        {comments?.length ? `View ${comments.length} comments` : 'No comments'}
                    </Divider>
                </Link>
        }
    </>


export const CommentsPostInTape = ({ comments, _id }) =>
    <>
        <CommentsContentPostInTape comments={comments} _id={_id} />
        <CCommentFieldPostTape id={_id} setOpen={() => { }} />
    </>