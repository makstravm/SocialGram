import { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Upload, message } from 'antd';
import { backURL, gql } from '../../helpers';
import { actionUpdateAvatar } from '../../actions';
import { Apps } from '../uploadPhoto';

const Add = ({ imageUrl, onUploadFile }) => {
    const [loading, setLoading] = useState(false)
    const [imageLoad, setImageLoad] = useState(false)
    const props = {
        name: 'photo',
        action: `${backURL}/upload`,
        headers: localStorage.authToken || sessionStorage.authToken ? { Authorization: 'Bearer ' + (localStorage.authToken || sessionStorage.authToken) } : {}
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
        <>
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
            <hr />
            <hr />
            <hr />
            <hr />
            {/* <Apps /> */}
        </>

    )
}

export const CAdd = connect(state => ({ imageUrl: state?.myData?.avatar?.url }), { onUploadFile: actionUpdateAvatar })(Add)




// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }

// class PicturesWall extends React.Component {
//   state = {
//     previewVisible: false,
//     previewImage: '',
//     fileList: [
//       {
//         uid: '-1',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//       },
//       {
//         uid: '-2',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//       },
//       {
//         uid: '-3',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//       },
//       {
//         uid: '-4',
//         name: 'image.png',
//         status: 'done',
//         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//       },
//       {
//         uid: '-5',
//         name: 'image.png',
//         status: 'error',
//       },
//     ],
//   };

//   handleCancel = () => this.setState({ previewVisible: false });

//   handlePreview = async file => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }

//     this.setState({
//       previewImage: file.url || file.preview,
//       previewVisible: true,
//     });
//   };

//   handleChange = ({ fileList }) => this.setState({ fileList });

//   render() {
//     const { previewVisible, previewImage, fileList } = this.state;
//     const uploadButton = (
//       <div>
//         <Icon type="plus" />
//         <div className="ant-upload-text">Upload</div>
//       </div>
//     );
//     return (
//       <div className="clearfix">
//         <Upload
//           action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
//           listType="picture-card"
//           fileList={fileList}
//           onPreview={this.handlePreview}
//           onChange={this.handleChange}
//         >
//           {fileList.length >= 8 ? null : uploadButton}
//         </Upload>
//         <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
//           <img alt="example" style={{ width: '100%' }} src={previewImage} />
//         </Modal>
//       </div>
//     );
//   }
// }