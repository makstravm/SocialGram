import { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Upload, message } from 'antd';
import { backURL, gql } from '../../helpers';
import { actionSetAvatar } from '../../actions';
import { actionFullSetAvatar } from '../../redux/redux-thunk';

const Add = ({ imageUrl, onUploadFile }) => {
    const [loading, setLoading] = useState(false)
    const [imageLoad, setImageLoad] = useState(false)
    const props = {
        name: 'photo',
        action: `${backURL}/upload`,
        headers: localStorage.authToken || sessionStorage.authToken ? { Authorization: 'Bearer ' + (localStorage.authToken||sessionStorage.authToken) } : {}
    }

    const handleChange = async ({ file }) => {
   
        if (file.status === 'uploading') {
            setLoading(true)
        }
        if (file.status === 'done') {
            message.success(`${file.name} file uploaded successfully`);
            await onUploadFile(file.response)
            console.log(file);
            setImageLoad(true)
            setLoading(false)
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }
    }
    
    return (
        <Upload {...props}
            listType="picture-card"
            showUploadList={false}
            onChange={handleChange}
            className="avatar-uploader">
            {imageLoad ?
                <img src={`${backURL + '/' + imageUrl}`} alt="avatar" style={{ width: '100%' }} /> :
                <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>}
        </Upload>
    )
}

export const CAdd = connect(state => ({ imageUrl: state?.myData?.avatar?.url}), { onUploadFile: actionFullSetAvatar })(Add)