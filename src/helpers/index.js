import Icon from '@ant-design/icons';
import { backURL } from '../actions/actionsGetGql';

export const videoRegExp = (/\.(mp4|mov|avi|wmv|flv|flv|3gp|mpg)$/i)

export const propsUploadFile = {
    name: 'photo',
    action: `${backURL}/upload`,
    headers: localStorage.authToken || sessionStorage.authToken ? { Authorization: 'Bearer ' + (localStorage.authToken || sessionStorage.authToken) } : {}
}



const CircularGallerySvg = () =>
    <svg aria-label="Кольцевая галерея" color="#ffffff" fill="#ffffff" height="22" role="img" viewBox="0 0 48 48" width="22">
        <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
    </svg>

export const CircularGalleryIcon = props =>
    <Icon component={CircularGallerySvg} {...props} />


const CollectionSvgEmpty = () =>
    <svg viewBox="0 0 24 24" ><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeWidth="2"></polygon></svg>

export const CollectionEmptySvg = props =>
    <Icon component={CollectionSvgEmpty} {...props} />


const CollectionFillSvg = () =>
    <svg aria-label="Удалить" color="#262626" fill="#262626" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M20 22a.999.999 0 01-.687-.273L12 14.815l-7.313 6.912A1 1 0 013 21V3a1 1 0 011-1h16a1 1 0 011 1v18a1 1 0 01-1 1z"></path></svg>

export const CollectionSvgFill = props =>
    <Icon component={CollectionFillSvg} {...props} />




