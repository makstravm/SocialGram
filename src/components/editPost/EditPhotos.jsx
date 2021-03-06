import { DeleteOutlined, EyeOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, message, Image, Progress, Upload } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import React, { useState } from "react";
import {
    arrayMove,
    SortableContainer,
    SortableElement,
    SortableHandle
} from "react-sortable-hoc";
import { backURL } from "../../actions/actionsGetGql";
import { propsUploadFile, videoRegExp } from "../../helpers";


const SortableItemMask = ({ removePhotosItem, chekMedia, setVisible, id }) =>
    <div className="SortableItemMask">
        {!chekMedia && <Button type="link" onClick={() => setVisible(true)}>
            <EyeOutlined />
        </Button>}
        <Button type="link" onClick={() => removePhotosItem(id)}>
            <DeleteOutlined />
        </Button>
    </div>


const Handle = SortableHandle(({ tabIndex, value, removePhotosItem }) => {
    const [visible, setVisible] = useState(false);
    const chekMedia = videoRegExp.test(value.originalFileName)
    return (
        <div className="Handle" tabIndex={tabIndex} >
            <SortableItemMask id={value._id} setVisible={setVisible} chekMedia={chekMedia} removePhotosItem={removePhotosItem} />
            {chekMedia
                ? <video >
                    <source src={backURL + '/' + value.url} />
                </video>
                : <img src={backURL + '/' + value.url} />
            }
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


const SortableList = SortableContainer(({ items = [], ...restProps }) => {
    return (
        <div className='SortableList'>
            {items?.map((item, index) => (
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


export function EditPhotos({ photos = [], setPhotos }) {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    let count = []
    const handlerChange = ({ file, fileList }) => {
        if (file.status === "uploading") {
            setLoading(true)
            setProgress(file.percent)
        } else if (file.status === 'done') {
            console.log(file, fileList)
            count = []
            message.success(`${file.name} file uploaded successfully`);
            setPhotos([...photos || [], file.response])
        } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }
    }

    const beforeUpload = (file) => {
        if (count.length + photos.length > 8) {
            message.error('Error, upload Max 8 elements')
            return false
        } else {
            count = [...count, file]
        }
    }

    const removePhotosItem = (id) => setPhotos(photos.filter(p => p._id !== id))
    const onSortEnd = ({ oldIndex, newIndex }) => {
        setPhotos(arrayMove(photos, oldIndex, newIndex));
    };

    return (
        <div className="EditPhotos" >
            {photos.length < 8 &&
                <Dragger {...propsUploadFile}
                    className="EditPhotos__box"
                    maxCount={8}
                    beforeUpload={beforeUpload}
                    multiple={true}
                    listType="picture-card"
                    showUploadList={false}
                    onChange={handlerChange}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <div className="ant-upload-text">
                        Click or drag file to this area to upload
                        <p>{photos?.length} / 8</p>
                    </div>
                </Dragger>
            }
            {loading &&
                <Progress
                    showInfo={false}
                    percent={progress}
                    strokeColor={{
                        '0%': '#10136c',
                        '50%': '#755596',
                        '100%': '#fdc229',
                    }}
                />}
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


