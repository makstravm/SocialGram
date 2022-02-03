import Avatar from "antd/lib/avatar/avatar"
import noAva from "../images/noAva.png"
import { backURL } from "../actions/actionsGetGql"

export const UserAvatar = ({ avatarSize, avatar }) =>
    <Avatar
        style={{
            width: avatarSize,
            height: avatarSize
        }}
        src={avatar && avatar?.url
            ? <img src={(backURL + '/' + avatar.url)} alt='avatar' />
            : <img src={noAva} alt="avatar" />
        } />

