import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Card                 from "./Card";
import Html                 from "../Common/Html";
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled(Card)`
    h3 {
        margin-bottom: var(--main-gap);
    }
`;

const List = Styled.ul`
    display: flex;
    flex-direction: column;
    gap: calc(var(--main-gap) / 2);
    margin: 0;
    padding: 0;
    list-style: none;
`;

const Item = Styled.li`
    display: flex;
    align-items: flex-start;
    gap: calc(var(--main-gap) / 2);
    color: var(--font-color);
    font-size: 13px;
    line-height: 1.4;
`;

const ItemIcon = Styled(Icon)`
    flex-shrink: 0;
    margin-top: 1px;
    font-size: 16px;
    color: var(--success-color);
`;

const ItemText = Styled(Html)`
    b {
        color: var(--title-color);
        font-weight: 600;
    }
`;



/**
 * The Check Card Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function CheckCard(props) {
    const { isHidden, className, message, items } = props;


    // Do the Render
    return <Container
        isHidden={isHidden || !items.length}
        className={className}
        message={message}
        withBackground
    >
        <List>
            {items.map((item) => <Item key={item}>
                <ItemIcon icon="check-circle" />
                <ItemText variant="span" message={item} />
            </Item>)}
        </List>
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
CheckCard.propTypes = {
    isHidden  : PropTypes.bool,
    className : PropTypes.string,
    message   : PropTypes.string,
    items     : PropTypes.arrayOf(PropTypes.string),
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
CheckCard.defaultProps = {
    isHidden  : false,
    className : "",
    message   : "",
    items     : [],
};

export default CheckCard;
