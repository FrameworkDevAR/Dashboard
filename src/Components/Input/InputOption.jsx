import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Components
import Menu                 from "../Menu/Menu";
import Html                 from "../Common/Html";
import Icon                 from "../Common/Icon";



// Styles
const Container = Styled.li.attrs(({ hasValue, forValue, hasCreate, forCreate, isOnlyOption, isSelected, isTitle, leftSpace }) => ({ hasValue, forValue, hasCreate, forCreate, isOnlyOption, isSelected, isTitle, leftSpace }))`
    margin: 0;
    color: var(--title-color);
    background-color: var(--white-color);

    ${(props) => props.leftSpace && `
        margin-left: 16px;
    `}

    ${(props) => props.hasValue && `
        scroll-margin-top: 51px;
    `}
    ${(props) => props.forValue && `
        position: sticky;
        top: 0;
        font-weight: bold;

        ::before {
            content: "";
            position: absolute;
            top: -8px;
            left: 0;
            width: 100%;
            height: 8px;
            background: var(--white-color);
        }
    `}
    ${(props) => (props.forValue && !props.isOnlyOption) && `
        padding-bottom: 4px;
        margin-bottom: 4px;
        border-bottom: 2px solid var(--border-color-light);
    `}

    ${(props) => props.hasCreate && `
        scroll-margin-bottom: 51px;
    `}
    ${(props) => props.forCreate && `
        position: sticky;
        bottom: 0;
        font-weight: bold;
        color: var(--primary-color);

        ::after {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 100%;
            height: 8px;
            background: var(--white-color);
        }
    `}
    ${(props) => (props.forCreate && !props.isOnlyOption) && `
        margin-top: 4px;
        padding-top: 4px;
        border-top: 2px solid var(--border-color-light);
    `}
`;

const Content = Styled.div.attrs(({ inlineDescription, isSelected, isTitle }) => ({ inlineDescription, isSelected, isTitle }))`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    font-size: 14px;
    border-radius: var(--border-radius);
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
        background-color: var(--light-gray);
    }

    ${(props) => props.inlineDescription && `
        flex-direction: row;
        align-items: baseline;
        gap: 8px;
    `}

    ${(props) => props.isSelected && `
        background-color: var(--primary-color);
        color: white;
        &:hover {
            background-color: var(--primary-color);
        }
    `}

    ${(props) => props.isTitle && `
        padding: 8px 8px 4px 8px;
        text-align: left;
        font-size: 12px;
        white-space: nowrap;
        color: var(--font-lighter);
        cursor: default;

        &:hover {
            background-color: var(--white-color);
        }
    `}
`;

const Option = Styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Text = Styled(Html)`
    flex-grow: 2;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const Description = Styled(Html).attrs(({ isSelected }) => ({ isSelected }))`
    color: var(--font-lightest);
    font-size: 13px;

    ${(props) => props.isSelected && `
        color: rgba(255, 255, 255, 0.8);
    `}
`;



/**
 * The Input Option Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function InputOption(props) {
    const {
        isHidden, className,
        hasValue, forValue,
        hasCreate, forCreate, isOnlyOption, isTitle, leftSpace,
        icon, content, message, description, inlineDescription,
        isSelected, hasChecks, isChecked, onMouseDown,
        direction, onClose, children,
    } = props;


    // The References
    const itemRef = React.useRef(null);

    // The Current State
    const [ menuOpen, setMenuOpen ] = React.useState(false);


    // Variable
    const hasIcon   = Boolean(icon || hasChecks);
    const iconValue = hasChecks ? (isChecked ? "checkbox-on" : "checkbox-off") : (icon || "");
    const hasMenu   = Boolean(children && children.length);


    // Do the Render
    if (isHidden) {
        return <React.Fragment />;
    }
    return <>
        <Container
            ref={itemRef}
            className={className}
            hasValue={hasValue}
            forValue={forValue}
            hasCreate={hasCreate}
            forCreate={forCreate}
            isOnlyOption={isOnlyOption}
            isTitle={isTitle}
            leftSpace={leftSpace}
            onMouseDown={isTitle ? undefined : onMouseDown}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
        >
            <Content
                inlineDescription={inlineDescription}
                isSelected={isSelected}
                isTitle={isTitle}
            >
                <Option>
                    <Icon
                        isHidden={!hasIcon}
                        icon={iconValue}
                        size="20"
                    />
                    <Text
                        content={content}
                        message={message}
                    />
                    <Icon
                        isHidden={!hasMenu}
                        icon="closed"
                        size="20"
                    />
                </Option>
                <Description
                    content={description}
                    isSelected={isSelected}
                />
            </Content>
        </Container>

        {hasMenu && <Menu
            open={menuOpen}
            targetRef={itemRef}
            direction={direction}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
            onClose={onClose}
            isSubmenu
        >
            {children}
        </Menu>}
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
InputOption.propTypes = {
    isHidden          : PropTypes.bool,
    className         : PropTypes.string,
    hasValue          : PropTypes.bool,
    forValue          : PropTypes.bool,
    hasCreate         : PropTypes.bool,
    forCreate         : PropTypes.bool,
    isOnlyOption      : PropTypes.bool,
    isTitle           : PropTypes.bool,
    leftSpace         : PropTypes.bool,
    icon              : PropTypes.string,
    content           : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    message           : PropTypes.string,
    description       : PropTypes.string,
    inlineDescription : PropTypes.bool,
    isSelected        : PropTypes.bool,
    hasChecks         : PropTypes.bool,
    isChecked         : PropTypes.bool,
    onMouseDown       : PropTypes.func,
    direction         : PropTypes.string,
    onClose           : PropTypes.func,
    children          : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
InputOption.defaultProps = {
    isHidden     : false,
    className    : "",
    direction    : "right",
    hasCreate    : false,
    forCreate    : false,
    isOnlyOption : false,
    isTitle      : false,
    leftSpace    : false,
};

export default InputOption;
