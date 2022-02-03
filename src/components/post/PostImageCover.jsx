import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Carousel, Empty } from "antd";
import React, { createRef } from "react";
import nodata from '../../images/nodata.png'
import MediaQuery from "react-responsive";
import { backURL } from "../../actions/actionsGetGql";
import { videoRegExp } from "../../helpers";


const PostImageOrVideo = ({ url, originalFileName }) =>
    <div className="PostOne__wrapper-img">
        {
            videoRegExp.test(originalFileName)
                ? <video controls loop preload="true">
                    <source src={backURL + '/' + url} />
                </video>
                : <img src={backURL + '/' + url} alt="post image" />
        }
    </div>


const PostImageCaruselBtn = ({ styleClass, handlerClick, flagClass, children }) => 
        <MediaQuery minWidth={768}>
            <button onClick={() => handlerClick()}
                className={`${styleClass} Post__btn ${flagClass ? '--active' : ''}`}>
                {children}
            </button>
        </MediaQuery>


class PostImage extends React.Component {
    render() {
        const { url, originalFileName, handlePrev, handleNext, movePrev, moveNext } = this.props
        return (
            <>
                {url ? <>
                    <PostImageCaruselBtn styleClass={'Post__prev'} handlerClick={handlePrev} flagClass={movePrev} >
                        <LeftCircleOutlined />
                    </PostImageCaruselBtn>
                    <PostImageCaruselBtn styleClass={'Post__next'} handlerClick={handleNext} flagClass={moveNext} >
                        <RightCircleOutlined />
                    </PostImageCaruselBtn>
                    <PostImageOrVideo url={url} originalFileName={originalFileName} />
                </>
                    : <Empty image={nodata} description={false} />}
            </>)
    }
}

class PostImageCover extends React.Component {
    constructor(props) {
        super(props);
        this.carouselRef = createRef();
        this.state = {
            movePrev: false,
            moveNext: false
        }
    }

    handleNext = () => this.carouselRef.current.next(this);

    handlePrev = () => this.carouselRef.current.prev(this);

    moveOnDivArray = (length, index) => {
        if (length === 1) {
            this.setState({ movePrev: false, moveNext: false })
        } else if (index === 0) {
            this.setState({ movePrev: false, moveNext: true })
        } else if (index === length - 1 && length > 1) {
            this.setState({ movePrev: true, moveNext: false })
        } else {
            this.setState({ movePrev: true, moveNext: true })
        }
    }

    downOnDivArray = () => this.setState({ movePrev: false, moveNext: false })

    render() {

        const { images } = this.props
        return (
            <Carousel ref={this.carouselRef}
                effect="fade"
                infinite={false}
                dots={{ className: 'Post__dots' }
                }>
                {images
                    ? images.map((i, index) => <div
                        key={i._id}
                        onMouseEnter={() => this.moveOnDivArray(images.length, index)}
                        onMouseLeave={this.downOnDivArray}>
                        <PostImage
                            url={i.url}
                            handleNext={this.handleNext}
                            handlePrev={this.handlePrev}
                            originalFileName={i.originalFileName}
                            moveNext={this.state.moveNext}
                            movePrev={this.state.movePrev} />
                    </div>)
                    : <Empty image={nodata} description={false} />
                }
            </Carousel >
        );
    }
}

export default PostImageCover