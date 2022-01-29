import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { Carousel, Empty } from "antd";
import React, { createRef } from "react";
import nodata from '../../../images/nodata.png'
import { backURL, videoRegExp } from '../../../helpers/index'
import MediaQuery from "react-responsive";

class PostImage extends React.Component {
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
                {!!images ? images.map((i, index) => i?.url ? <div
                    key={i._id}
                    onMouseEnter={() => this.moveOnDivArray(images.length, index)}
                    onMouseLeave={this.downOnDivArray}>
                    <MediaQuery minWidth={768}>
                        <button onClick={() => this.handlePrev()}
                            className={`Post__prev Post__btn ${this.state.movePrev ? '--active' : ''}`}><LeftCircleOutlined /></button>
                        <button onClick={() => this.handleNext()}
                            className={`Post__next Post__btn ${this.state.moveNext ? '--active' : ''}`}><RightCircleOutlined /></button>
                    </MediaQuery>
                    <div className="PostOne__wrapper-img">
                        {videoRegExp.test(i.originalFileName)
                            ? <video controls loop preload="true" height="500">
                                <source src={backURL + '/' + i.url} />
                            </video>
                            : <img src={backURL + '/' + i.url} />
                        }
                    </div>

                </div>
                    : <Empty key={i._id} image={nodata} description={false} />)
                    : <Empty image={nodata} description={false} />
                }
            </Carousel >
        );
    }
}

export default PostImage