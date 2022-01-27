import { message, Spin } from 'antd'
import { connect } from 'react-redux'
import preloader from '../images/preloader.gif'

<Spin size="large" />
const PreloaderImg = () =>
    <div className='PreloaderImg'>
        <img src={preloader} alt="preloader" />
    </div>

const Preloader = ({ promiseName, promiseState }) =>
    <>
        {promiseState[promiseName]?.status === 'PENDING'
            ? <PreloaderImg />
            :
            promiseState[promiseName]?.status === 'REJECTED'
                ?
                message.error(`${promiseState[promiseName]?.error}`) :
                null}
    </>
export const CPreloader = connect(state => ({ promiseState: state.promise }))(Preloader)