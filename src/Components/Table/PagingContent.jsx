import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Core
import NLS                  from "../../Core/NLS";
import Responsive           from "../../Core/Responsive";

// Components
import IconLink             from "../Link/IconLink";
import Icon                 from "../Common/Icon";
import CircularLoader       from "../Loader/CircularLoader";



// Styles
const PagingLoader = Styled(CircularLoader)`
    --loader-size: 12px;
    --loader-border-width: 2px;

    margin-right: 12px;
`;

const Rows = Styled.p`
    margin: 0 8px 0 0;

    @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
        display: none;
    }
`;

const Pages = Styled.p`
    margin: 0 16px 0 0;
`;

const Amount = Styled.div.attrs(({ isDisabled }) => ({ isDisabled }))`
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 16px;
    border: 1px solid var(--border-color-medium);
    border-radius: var(--border-radius);

    ${(props) => !props.isDisabled && `
        :hover {
            border-color: var(--input-border-hover);
        }
    `}

    @media (max-width: ${Responsive.WIDTH_FOR_MOBILE}px) {
        display: none;
    }
`;

const Select = Styled.select`
    appearance: none;
    display: block;
    width: 56px;
    padding: 4px 18px 4px 4px;
    font-size: 11px;
    text-align: center;
    text-align-last: center;
    font-weight: normal;
    line-height: 1;
    color: var(--table-color);
    border: none;
    background-color: transparent;
    outline: none;

    &:disabled {
        color: var(--table-color);
        opacity: 1;
    }
`;

const SelectIcon = Styled(Icon)`
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
`;

const PageIcon = Styled(IconLink).attrs(({ isDisabled }) => ({ isDisabled }))`
    ${(props) => props.isDisabled && `
        --link-color: var(--darker-gray);
        --link-background: transparent;
    `}
`;



/**
 * The Paging Content Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function PagingContent(props) {
    const { sort, total, fetch, isPaging } = props;


    // The Current State
    const [ showLoader, setShowLoader ] = React.useState(false);
    const [ pending,    setPending    ] = React.useState(null);


    // Show the loader after a delay, so a fast Paging never shows it
    React.useEffect(() => {
        if (!isPaging) {
            setShowLoader(false);
            return undefined;
        }
        const timer = window.setTimeout(() => setShowLoader(true), 300);
        return () => window.clearTimeout(timer);
    }, [ isPaging ]);

    // The asked values are shown until the sort has them, or the fetch ends without them
    React.useEffect(() => {
        if (!isPaging) {
            setPending(null);
        }
    }, [ sort.page, sort.amount, isPaging ]);


    // Variables
    const current      = pending ?? sort;
    const rowOptions   = [ 10, 25, 50, 100, 250, 500 ].map((value) => ({ key : value, value }));
    const from         = total === 0 ? 0 : current.page * current.amount + 1;
    const to           = Math.min(total, (current.page + 1) * current.amount);
    const lastPage     = Math.ceil(total / current.amount) - 1;
    const prevDisabled = isPaging || current.page === 0;
    const nextDisabled = isPaging || current.page >= lastPage;


    // Handles the Paging, showing the asked values while they are fetched
    const handleFetch = (params) => {
        setPending(params);
        fetch(params);
    };

    // Handles the Amount Change
    const handleAmount = (e) => {
        handleFetch({ ...sort, page : 0, amount : Number(e.target.value) });
    };

    // Handles the Page Change
    const handlePage = (page) => {
        handleFetch({ ...sort, page });
    };


    // Handles the First Page button
    const handleFirstPage = () => {
        handlePage(0);
    };

    // Handles the Prev Page button
    const handlePrevPage = () => {
        handlePage(sort.page - 1);
    };

    // Handles the Next Page button
    const handleNextPage = () => {
        handlePage(sort.page + 1);
    };

    // Handles the Last Page button
    const handleLastPage = () => {
        handlePage(lastPage);
    };


    // Do the Render
    return <>
        {isPaging && showLoader && <PagingLoader
            isTiny
        />}
        <Rows>{NLS.get("GENERAL_ROWS_PER_PAGE")}</Rows>
        <Amount isDisabled={isPaging}>
            <Select
                name="rowsPerPage"
                value={current.amount}
                onChange={handleAmount}
                disabled={isPaging}
            >
                {rowOptions.map((option) => <option
                    key={option.key}
                    value={option.key}
                >
                    {option.value}
                </option>)}
            </Select>
            <SelectIcon
                icon="expand"
                size="18"
            />
        </Amount>
        <Pages>{NLS.format("GENERAL_PAGE_OF", String(from), String(to), total)}</Pages>

        <PageIcon
            variant="black"
            icon="first"
            onClick={handleFirstPage}
            isDisabled={prevDisabled}
            isSmall
        />
        <PageIcon
            variant="black"
            icon="prev"
            onClick={handlePrevPage}
            isDisabled={prevDisabled}
            isSmall
        />
        <PageIcon
            variant="black"
            icon="next"
            onClick={handleNextPage}
            isDisabled={nextDisabled}
            isSmall
        />
        <PageIcon
            variant="black"
            icon="last"
            onClick={handleLastPage}
            isDisabled={nextDisabled}
            isSmall
        />
    </>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
PagingContent.propTypes = {
    fetch    : PropTypes.func,
    isPaging : PropTypes.bool,
    sort     : PropTypes.object,
    total    : PropTypes.number.isRequired,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
PagingContent.defaultProps = {
    isPaging : false,
};

export default PagingContent;
