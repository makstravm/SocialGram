import { message, Spin } from 'antd'
import { connect } from 'react-redux'
import preloader from '../images/preloader.gif'

const PreloaderImg = () =>
    <div className='PreloaderImg'>
{/* <Spin size="large" /> */}
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