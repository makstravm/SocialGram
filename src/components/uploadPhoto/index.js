import { DeleteOutlined, EyeOutlined, InboxOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Icon, Upload, Image } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import ImgCrop from 'antd-img-crop';
import {
    arrayMove,
    SortableContainer,
    SortableElement,
    SortableHandle
} from "react-sortable-hoc";
import { backURL } from "../../helpers";


const SortableItemMask = ({ removePhotosItem, setVisible, id }) =>
    <div className="SortableItemMask">
        <Button type="link" onClick={() => setVisible(true)}>
            <EyeOutlined />
        </Button>
        <Button type="link" onClick={() => removePhotosItem(id)}>
            <DeleteOutlined />
        </Button>
    </div>


const Handle = SortableHandle(({ tabIndex, value, removePhotosItem }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className="Handle" tabIndex={tabIndex} >
            <SortableItemMask id={value._id} setVisible={setVisible} removePhotosItem={removePhotosItem} />
            <img src={`${backURL + '/' + value.url}`} alt="avatar" style={{ width: '100%' }} />
            <Image className="hidden-item"
                width={200}
                style={{ display: 'none' }}
                preview={{
                    visible,
                    src: backURL + '/' + value.url,
                    onVisibleChange: value => {
                        setVisible(value);
                    },
                }}
            />
        </ div>
    )
})


const SortableItem = SortableElement(props => {
    const { value, removePhotosItem } = props
    return (
        <div className="SortableItem">
            <Handle value={value} removePhotosItem={removePhotosItem} />
        </div >
    );
});

const props = {
    name: 'photo',
    action: `${backURL}/upload`,
    headers: localStorage.authToken || sessionStorage.authToken ? { Authorization: 'Bearer ' + (localStorage.authToken || sessionStorage.authToken) } : {},
}

const SortableList = SortableContainer(({ items,...restProps }) => {
    return (
        <div className='SortableList'>
            {items.map((item, index) => (
                <SortableItem
                    key={`item-${item._id}`}
                    index={index}
                    value={item}
                    {...restProps}
                />
            ))}
        </div>
    );
});


export function EditPhotos({ photos, setPhotos }) {

    const handlerChange = async ({ file }) => {
        if (file.status === 'done') {

            setPhotos([...photos, file.response])
            message.success(`${file.name} file uploaded successfully`);
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }
    }
    const removePhotosItem = (id) => setPhotos(photos.filter(p => p._id !== id))

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setPhotos(arrayMove(photos, oldIndex, newIndex));
    };

    return (
        <div className="EditPhotos" >
            {photos.length >= 8 ? null
                : <Dragger {...props} className="EditPhotos__box"
                    multiple={true}
                    listType="picture-card"
                    showUploadList={false}
                    onChange={handlerChange}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Dragger>
            }
            <></>
            <SortableList
                shouldUseDragHandle={true}
                useDragHandle
                axis="xy"
                removePhotosItem={removePhotosItem}
                items={photos}
                onSortEnd={onSortEnd}
            />
        </div>
    );
}


