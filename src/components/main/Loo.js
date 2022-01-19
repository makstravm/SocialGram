import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { backURL } from '../../helpers';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { arrayMove, sortableContainer, sortableElement } from 'react-sortable-hoc';

function getBase64(file) {
    return new Promise((resolve, reject) => {

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export class Loo extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-2',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-3',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-4',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-xxx',
                percent: 50,
                name: 'image.png',
                status: 'uploading',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-5',
                name: 'image.png',
                status: 'error',
            },
        ],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async (file, fileList) => {
        console.log(fileList);
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ file, fileList }) => {
        if (file.status === 'uploading') {
            // setLoading(true)
        }
        if (file.status === 'done') {
            console.log(fileList);
            // message.success(`${file.name} file uploaded successfully`);
            // await onUploadFile(file.response)
            // setImageLoad(true)
            // setLoading(false)
        } else if (file.status === 'error') {
            // message.error(`${file.name} file upload failed.`);
        }
        this.setState({ fileList });
    }
    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        const props = {
            name: 'photo',
            action: `${backURL}/upload`,
            headers: localStorage.authToken || sessionStorage.authToken ? { Authorization: 'Bearer ' + (localStorage.authToken || sessionStorage.authToken) } : {}
        }
        return (
            <>
                <Upload {...props}
                    listType="picture-card"
                    multiple={true}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                {/* <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal> */}
            </>
        );
    }
}


const SortableItem = sortableElement(({ value }) => <li>{value}</li>);

const SortableContainer = sortableContainer(({ children }) => {
    return <ul>{children}</ul>;
});

export class Adafghh extends Component {
    state = {
        items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ items }) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }));
    };

    render() {

        const { items } = this.state;

        return (
            <SortableContainer onSortEnd={this.onSortEnd} >
                {items.map((value, index) => (
                    <SortableItem key={`item-${value}`} index={index} axis="xy" value={value} />
                ))}
            </SortableContainer>
        );
    }
}

