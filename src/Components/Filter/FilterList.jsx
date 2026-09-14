import React                from "react";
import PropTypes            from "prop-types";
import Styled               from "styled-components";

// Utils
import Utils                from "../../Utils/Utils";

// Components
import FilterField          from "./FilterField";
import IconLink             from "../Link/IconLink";



// Styles
const Container = Styled.div.attrs(({ columns, showButton }) => ({ columns, showButton }))`
    --filter-columns: ${(props) => props.columns};

    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(var(--filter-columns), 1fr);
    gap: var(--main-gap);
    height: calc(var(--filter-input-height) + 4px);
    margin: 0 0 calc(var(--main-gap) - 2px) 0;
    padding: 3px 1px 1px;
    overflow-y: hidden;
    overflow-x: auto;

    ${(props) => props.showButton && `
        grid-template-columns: repeat(var(--filter-columns), 1fr) calc(var(--filter-input-height) + 1px);
        padding-right: 0;
    `}
`;

const FilterButton = Styled.div`
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: calc(1px - var(--main-gap));
    padding-left: var(--main-gap);
    padding-right: 1px;
    background-color: var(--filter-background);
    z-index: 1;
`;

const FilterIcon = Styled(IconLink)`
    --link-size: calc(var(--filter-input-height) - 8px);
    --link-radius: var(--border-radius);
    --link-background: var(--filter-input-hover);

    font-size: 16px;
    padding: 4px;
    background-color: var(--filter-input-background);
`;



/**
 * The Filter List Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function FilterList(props) {
    const {
        className, values, initialData,
        onChange, onFilter, clearButton, hideButton, children,
    } = props;


    // Parse the Items
    const items         = [];
    const fields        = {};
    const initialErrors = {};

    if (children) {
        for (const child of Utils.getVisibleChildren(children)) {
            items.push(child.props);
            if (child.props.type === "double") {
                for (const subChild of Utils.getVisibleChildren(child.props.children)) {
                    fields[subChild.props.name]        = "";
                    initialErrors[subChild.props.name] = "";
                }
            } else {
                fields[child.props.name]        = "";
                initialErrors[child.props.name] = "";
            }
        }
    }

    let initial = initialData || fields;
    initial = values ? { ...initial, ...values } : initial;


    // The Current State
    const [ loading, setLoading ] = React.useState(false);
    const [ data,    setData    ] = React.useState(initial);
    const [ errors,  setErrors  ] = React.useState(initialErrors);


    // Handle the Values change
    React.useEffect(() => {
        setData({ ...initial });
    }, [ JSON.stringify(values) ]);

    // Handles the Input Update
    const handleUpdate = (name, value, secName, secValue, onInputChange) => {
        let filterData = { ...data, [name] : value };
        if (secName) {
            filterData = { ...filterData, [secName] : secValue };
        }
        if (onInputChange) {
            const newData = onInputChange(data, value);
            if (newData) {
                filterData = newData;
            }
        }
        if (onChange) {
            onChange(filterData);
        }
        setData(filterData);
        setErrors({ ...errors, [name] : "" });
        return filterData;
    };

    // Handles the Submit
    const handleSubmit = async (filterData = data) => {
        setLoading(true);
        setData(filterData);
        setErrors(initialErrors);
        try {
            await onFilter(filterData);
            setLoading(false);
        } catch (errors) {
            setLoading(false);
            setErrors(errors);
        }
    };

    // Handles the Filter
    const handleFilter = (hasClear) => {
        if (hasClear) {
            setData({ ...initialData });
            handleSubmit({ ...initialData });
        } else {
            handleSubmit();
        }
    };


    // Variables
    const hasClear   = clearButton && JSON.stringify(data) !== JSON.stringify(initialData);
    const showButton = !hideButton || hasClear;


    // Do the Render
    return <Container
        className={className}
        columns={items.length}
        showButton={showButton}
    >
        {items.map((item) => <FilterField
            {...item}
            key={item.name}
            data={data}
            errors={errors}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
            items={item.children ?? []}
        />)}

        {showButton && <FilterButton>
            <FilterIcon
                variant="black"
                isDisabled={loading}
                icon={hasClear ? "filter-clear" : "filter"}
                onClick={() => handleFilter(hasClear)}
            />
        </FilterButton>}
    </Container>;
}

/**
 * The Property Types
 * @type {object} propTypes
 */
FilterList.propTypes = {
    className   : PropTypes.string,
    onChange    : PropTypes.func,
    onFilter    : PropTypes.func.isRequired,
    values      : PropTypes.object,
    initialData : PropTypes.object,
    clearButton : PropTypes.bool,
    hideButton  : PropTypes.bool,
    children    : PropTypes.any,
};

/**
 * The Default Properties
 * @type {object} defaultProps
 */
FilterList.defaultProps = {
    clearButton : false,
    hideButton  : false,
};

export default FilterList;
