import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import MediaItem            from "../Media/MediaItem";
import ScrollFade           from "../Common/ScrollFade";



// Constants
const SHADOW_SPACE = 4;

// Styles
const Fade = Styled(ScrollFade)`
    margin: -${SHADOW_SPACE}px;
`;

const Section = Styled.section.attrs(({ inDialog, extraSpace }) => ({ inDialog, extraSpace }))`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    grid-auto-rows: max-content;
    gap: var(--main-gap);
    box-sizing: border-box;
    max-height: calc(var(--media-height) - ${(props) => props.extraSpace - SHADOW_SPACE * 2}px);
    overflow: auto;
    padding: ${SHADOW_SPACE}px;

    ${(props) => props.inDialog && `
        --media-item-height: 100px;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 12px;
    `}
`;



/**
 * The Media Grid Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function MediaGrid(props) {
    const {
        items, inDialog, canEdit, extraSpace, isSelected,
        openElem, isMoving, dragIndex, dropIndex, movedIndex, dragStyle,
        onAction, onGrab,
    } = props;

    // The References
    const gridRef = React.useRef(null);


    // Do the Render
    return <Fade passedRef={gridRef}>
        <Section inDialog={inDialog} extraSpace={extraSpace} ref={gridRef}>
            {items.map((elem, index) => {
                const isCurrent = isMoving && index === dragIndex;
                return <MediaItem
                    key={index}
                    elem={elem}
                    className={`media-item-${index}`}
                    style={isCurrent ? dragStyle : null}
                    isHidden={index === movedIndex}
                    isMoving={isCurrent}
                    isTarget={index === dropIndex}
                    isSelected={isSelected(elem)}
                    hasActions={!isCurrent && canEdit && !elem.isBack}
                    isLoading={openElem === elem}
                    onAction={onAction}
                    onMouseDown={(e) => onGrab(e, elem, index)}
                />;
            })}
        </Section>
    </Fade>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
MediaGrid.propTypes = {
    items      : PropTypes.array.isRequired,
    inDialog   : PropTypes.bool,
    canEdit    : PropTypes.bool,
    extraSpace : PropTypes.number,
    isSelected : PropTypes.func.isRequired,
    openElem   : PropTypes.object,
    isMoving   : PropTypes.bool,
    dragIndex  : PropTypes.number,
    dropIndex  : PropTypes.number,
    movedIndex : PropTypes.number,
    dragStyle  : PropTypes.object,
    onAction   : PropTypes.func,
    onGrab     : PropTypes.func,
};

export default MediaGrid;
