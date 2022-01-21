import { PlusOutlined } from "@ant-design/icons";
import { Button, message,Icon,  Upload } from "antd";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
    arrayMove,
    SortableContainer,
    SortableElement,
    SortableHandle
} from "react-sortable-hoc";
import { backURL } from "../../../helpers";

import style from "./styles.scss";


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}



const Handle = SortableHandle(({ props, tabIndex }) => {
    return (
        < div className={style.handle} tabIndex={tabIndex} >
            box
            <img src={`${backURL + '/' + props.response.url}`} alt="avatar" style={{ width: '100%' }} />

        </ div>
    )
})



const SortableItem = SortableElement(props => {
    const { value } = props;
    console.log(props);
    return (
        <div className="qq">
            <div className="content">
                {props.shouldUseDragHandle && <Handle props={value} />}
            </div>
            {/* <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal> */}
        </div>

    );
});

   const props = {
        name: 'photo',
        action: `${backURL}/upload`,
        headers: localStorage.authToken || sessionStorage.authToken ? { Authorization: 'Bearer ' + (localStorage.authToken || sessionStorage.authToken) } : {}
    }

const SortableList = SortableContainer(({ items, handlerChange, ...restProps }) => {
 
    return (
        <div className='ww'>
            {items.map((item, index) => (
                <SortableItem
                    key={`item-${item.uid}`}
                    index={index}
                    value={item}
                    {...restProps}
                />

            ))}
        
        </div>
    );
});


export function Apps() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false)
    const [imageLoad, setImageLoad] = useState(false)


    const handlerChange = async ({ file, fileList }) => {
        if (file.status === 'uploading') {
            // setLoading(true)
        }
        if (file.status === 'done') {
            console.log(file, fileList);
            setPhotos([...photos, file])
            message.success(`${file.name} file uploaded successfully`);
            // // await onUploadFile(file.response)
            // console.log(file);
            // setImageLoad(true)
            // setLoading(false)
        } else if (file.status === 'error') {
            // message.error(`${file.name} file upload failed.`);
        }
    }
console.log(photos);
    const onSortEnd = ({ oldIndex, newIndex }) => {
        setPhotos(arrayMove(photos, oldIndex, newIndex));
    };

    return (
        <div className="rrr" >
            <SortableList
                shouldUseDragHandle={true}
                useDragHandle
                axis="xy"
                items={photos}
                loading={loading}
                handlerChange={handlerChange}
                onSortEnd={onSortEnd}
            />
            <Upload {...props}
                multiple={true}
                listType="picture-card"
                showUploadList={false}
                onChange={handlerChange}>
                {/* {items.length >= 8 ? null : <div>
                    <PlusOutlined />
                
                </div>} */} 
                <div className="ant-upload-text">Upload</div>
            </Upload>   
        </div>
    );
}


