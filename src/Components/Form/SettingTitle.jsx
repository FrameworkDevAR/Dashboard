import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";
import NLS                  from "../../Core/NLS";

// Components
import Html                 from "../Common/Html";



// Styles
const Container = Styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: var(--main-padding) 0 0;

    &:first-child {
        padding-top: 0;
    }
`;

const Title = Styled.h3`
    margin: 0;
    color: var(--title-color);
    font-family: var(--title-font);
    font-size: 16px;
    font-weight: 600;
`;

const Description = Styled(Html)`
    margin: 0;
    color: var(--setting-description-color);
    font-size: var(--setting-description-size);
    line-height: 1.4;
`;



/**
 * The Setting Title, used to group the Setting Options of a section
 * @param {object} props
 * @returns {React.ReactElement}
 */
function SettingTitle(props) {
    const { isHidden, className, message, description } = props;


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <Container className={className}>
        <Title>{NLS.get(message)}</Title>
        {!!description && <Description
            variant="p"
            message={description}
        />}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
SettingTitle.propTypes = {
    isHidden    : PropTypes.bool,
    className   : PropTypes.string,
    message     : PropTypes.string.isRequired,
    description : PropTypes.string,
};

export default SettingTitle;
