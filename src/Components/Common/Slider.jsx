import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import Icon                 from "../Common/Icon";
import Video                from "../Common/Video";

// Variants
const Variant = {
    IMAGE : "image",
    VIDEO : "video",
};



// Styles
const Container = Styled.section.attrs(({ ratio, radius }) => ({ ratio, radius }))`
    position: relative;
    overflow: hidden;
    border-radius: ${(props) => props.radius ? `${props.radius}px` : "var(--border-radius)"};
    background-color: var(--lighter-gray);
    touch-action: none;
    ${(props) => props.ratio && `aspect-ratio: ${props.ratio};`}

    &:hover .slider-arrow,
    &:hover .slider-dots {
        opacity: 1;
    }
`;

const Content = Styled.div`
    display: flex;
    height: 100%;

    & > div {
        flex-shrink: 0;
        height: 100%;
    }
`;

const Image = Styled.img`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: zoom-in;
`;

const Arrow = Styled.button`
    position: absolute;
    z-index: 1;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    color: var(--font-color);
    font-size: 18px;
    cursor: pointer;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.2s;

    &.slider-prev {
        left: 8px;
    }
    &.slider-next {
        right: 8px;
    }
`;

const Dots = Styled.div.attrs(({ showAlways }) => ({ showAlways }))`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8px;
    display: flex;
    justify-content: center;
    gap: 6px;
    opacity: ${(props) => props.showAlways ? 1 : 0};
    transition: opacity 0.2s;

    span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.55);
        cursor: pointer;
        transition: background-color 0.35s, transform 0.35s;
    }
    span.slider-current {
        background-color: white;
        transform: scale(1.3);
    }
`;



/**
 * The Slider Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function Slider(props) {
    const {
        variant, data, className, height, ratio, radius, withArrows, withDots,
        alwaysDots, autoSlide, time, onClick, onSlide,
    } = props;


    // The Current State
    const [ update,     setUpdate     ] = React.useState(0);
    const [ timer,      setTimer      ] = React.useState(null);
    const [ index,      setIndex      ] = React.useState(props.index);
    const [ touchStart, setTouchStart ] = React.useState(0);
    const [ touchDiff,  setTouchDiff  ] = React.useState(0);


    // Goes back to the given Index when it or the list changes
    React.useEffect(() => {
        setIndex(props.index < data.length ? props.index : 0);
    }, [ props.index, data.length ]);

    // Start the Slider
    React.useEffect(() => {
        if (timer) {
            window.clearTimeout(timer);
        }
        if (autoSlide) {
            setTimer(window.setTimeout(() => gotoDir(1), time * 1000));
        }
        return () => {
            if (timer) {
                window.clearTimeout(timer);
            }
        };
    }, [ autoSlide, update ]);

    // Moves the Slider to the given Index
    const gotoIndex = (index) => {
        if (timer) {
            window.clearTimeout(timer);
        }

        let newIndex = index;
        if (index < 0) {
            newIndex = data.length - 1;
        } else if (index > data.length - 1) {
            newIndex = 0;
        }
        setIndex(newIndex);

        if (onSlide) {
            onSlide(newIndex);
        }
        if (autoSlide) {
            setUpdate(update + 1);
        }
    };

    // Moves the Slider to the given Direction
    const gotoDir = (direction) => {
        gotoIndex(index + direction);
    };


    // Handle the Touch Start
    const handleTouchStart = (e) => {
        if (data.length > 1) {
            setTouchStart(e.touches[0].clientX);
        }
    };

    // Handle the Touch Move
    const handleTouchMove = (e) => {
        if (data.length > 1) {
            setTouchDiff(e.touches[0].clientX - touchStart);
        }
    };

    // Handle the Touch End
    const handleTouchEnd = () => {
        if (data.length === 1) {
            return;
        }

        setTouchStart(0);
        setTouchDiff(0);
        if (Math.abs(touchDiff) < 50) {
            if (onClick && data[index]) {
                onClick(data[index], index);
            }
        } else if (touchDiff < 0 && index < data.length - 1) {
            gotoDir(1);
        } else if (touchDiff > 0 && index > 0) {
            gotoDir(-1);
        }
    };


    // Variables
    const dots       = Utils.createArrayOf(data.length, 0);
    const showArrows = Boolean(withArrows && data.length > 1);
    const showDots   = Boolean((withDots || alwaysDots) && data.length > 1);
    const slStyle    = { width : `calc(100% / ${data.length})` };
    const cntStyle   = {
        height     : height ? `${height}px` : "inherit",
        width      : `calc(100% * ${data.length})`,
        transform  : `translateX(calc(-100% / ${data.length} * ${index} + ${touchDiff}px))`,
        transition : touchDiff ? "none" : "transform 0.35s ease",
    };


    // Do the Render
    return <Container
        className={`slider ${className}`}
        ratio={ratio}
        radius={radius}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
        <Content className="slider-content" style={cntStyle}>
            {data.map((elem, position) => <div key={elem.source || position} style={slStyle}>
                {variant === Variant.IMAGE && <Image
                    alt={elem.name}
                    src={elem.source}
                    onClick={() => onClick(elem, position)}
                />}
                {variant === Variant.VIDEO && <Video
                    title={elem.name}
                    source={elem.source}
                />}
            </div>)}
        </Content>

        {showArrows && <>
            <Arrow type="button" className="slider-arrow slider-prev" onClick={() => gotoDir(-1)}>
                <Icon icon="prev" />
            </Arrow>
            <Arrow type="button" className="slider-arrow slider-next" onClick={() => gotoDir(1)}>
                <Icon icon="next" />
            </Arrow>
        </>}

        {showDots && <Dots className="slider-dots" showAlways={alwaysDots}>
            {dots.map((elem) => <span
                key={elem}
                className={Number(index) === Number(elem) ? "slider-current" : ""}
                onClick={() => gotoIndex(elem)}
            />)}
        </Dots>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
Slider.propTypes = {
    className  : PropTypes.string,
    variant    : PropTypes.string,
    data       : PropTypes.array.isRequired,
    onClick    : PropTypes.func,
    onSlide    : PropTypes.func,
    height     : PropTypes.number,
    ratio      : PropTypes.string,
    radius     : PropTypes.number,
    index      : PropTypes.number,
    withArrows : PropTypes.bool,
    withDots   : PropTypes.bool,
    alwaysDots : PropTypes.bool,
    autoSlide  : PropTypes.bool,
    time       : PropTypes.number,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
Slider.defaultProps = {
    onClick    : (() => {}),
    variant    : Variant.IMAGE,
    className  : "",
    height     : 0,
    ratio      : "",
    radius     : 0,
    index      : 0,
    withArrows : false,
    withDots   : false,
    alwaysDots : false,
    autoSlide  : false,
    time       : 5,
};

export default Slider;
