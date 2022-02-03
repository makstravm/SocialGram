import { EditOutlined, } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Upload, message, } from 'antd';
import ImgCrop from 'antd-img-crop';
import { actionChangeAvatarSagaAC } from '../actions/actonsCreators';
import { propsUploadFile } from '../helpers';
import { UserAvatar } from './UserAvatar';


const ChangeAvatar = ({ avatar, onUploadFile }) => {
    const handleChange = ({ file }) => {
        if (file.status === 'done') {
            message.success(`${file.name} file uploaded successfully`);
            onUploadFile(file.response)
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }
    }
    return (
        <ImgCrop rotate shape='round'>
            <Upload {...propsUploadFile}
                listType="picture-card"
                showUploadList={false}
                onChange={handleChange}
                className="avatar-uploader">
                <UserAvatar avatarSize={'150px'} avatar={avatar} />
                <span className='edit-icon'>
                    <EditOutlined style={{ fontSize: '1.4em', color: '#1890ff ' }} />
                </span>
            </Upload>
        </ImgCrop>
    )
}

export const CChangeAvatar = connect(state => ({ avatar: state?.aboutMe?.avatar }), { onUploadFile: actionChangeAvatarSagaAC })(ChangeAvatar)
