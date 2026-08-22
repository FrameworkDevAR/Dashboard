// spell-checker: disable
import { createGlobalStyle } from "styled-components";



// Styles
const EditorStyle = createGlobalStyle`
    .tox-tinymce.tox-tinymce {
        font-family: var(--main-font);
        border: 1px solid var(--input-border-color);
        border-radius: var(--input-border-radius, var(--border-radius));
    }
    .editorfield-error .tox-tinymce {
        border-color: var(--error-color);
    }
    .tox-promotion {
        display: none;
    }

    // Inline Editor
    .tox.tox.tox-tinymce-inline .tox-editor-header {
        box-shadow: var(--box-shadow);
        border: none;
        translate: 0 4px;
    }


    // Menu
    .tox .tox-menu.tox-menu {
        & {
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            border: none;
            cursor: pointer;
            z-index: var(--z-menu);
        }
        &.tox-collection.tox-collection--list {
            padding: 8px;
        }
        &.tox-swatches-menu.tox-swatches-menu {
            box-shadow: none;
            margin: 0;
        }
    }


    // Buttons
    .tox {
        .tox-button.tox-button,
        .tox-tbtn.tox-tbtn,
        .tox-mbtn.tox-mbtn.tox-mbtn,
        .tox-split-button.tox-split-button {
            border-radius: var(--border-radius);
            cursor: pointer;
        }
        .tox-mbtn__select-label.tox-mbtn__select-label {
            cursor: pointer;
        }
        .tox-insert-table-picker .tox-insert-table-picker__selected.tox-insert-table-picker__selected {
            background-color: hsla(216, 98%, 44%, 0.7);
            border-color: hsla(216, 98%, 44%, 0.7);
        }

        .tox-tbtn.tox-tbtn:hover,
        .tox-tbtn.tox-tbtn:focus,
        .tox-mbtn.tox-mbtn.tox-mbtn.tox-mbtn:hover,
        .tox-mbtn.tox-mbtn.tox-mbtn.tox-mbtn:focus,
        .tox-mbtn--active.tox-mbtn--active.tox-mbtn--active,
        .tox-collection__item--active.tox-collection__item--active.tox-collection__item--active {
            background-color: var(--light-gray) !important;
            border-radius: var(--border-radius);
        }

        .tox-tbtn--enabled.tox-tbtn--enabled,
        .tox-tbtn--enabled.tox-tbtn--enabled:hover,
        .tox-collection__item--enabled.tox-collection__item--enabled.tox-collection__item--enabled {
            background-color: var(--dark-gray);
            border-radius: var(--border-radius);
        }

        .tox-split-button.tox-split-button:hover {
            box-shadow: 0 0 0 1px var(--light-gray) inset;
        }
    }


    // Inputs
    .tox {
        .tox-form__group.tox-form__group {
            position: relative;
            margin-top: 12px;
            margin-bottom: 0px;
        }
        .tox-form > .tox-form__group.tox-form__group:first-child {
            margin-top: 0px;
        }
        .tox-form__controls-h-stack.tox-form__controls-h-stack.tox-form__controls-h-stack > div {
            margin-top: 0;
            margin-bottom: 0;
        }
        .tox-form__controls-h-stack.tox-form__controls-h-stack.tox-form__controls-h-stack > :not(:first-child) {
            margin-left: 12px;
        }

        .tox-label.tox-label {
            position: absolute;
            top: 4px;
            left: 12px;
            font-size: 12px;
            font-family: var(--main-font);
            z-index: 2;
        }
        .tox-label.tox-label + .tox-textfield,
        .tox-label.tox-label + .tox-textarea.tox-textarea,
        .tox-label.tox-label + .tox-listboxfield .tox-listbox--select,
        .tox-label.tox-label + .tox-color-input .tox-textfield,
        .tox-label.tox-label + .tox-form__controls-h-stack .tox-textfield {
            padding-top: 16px;
        }

        .tox-textfield.tox-textfield,
        .tox-textarea.tox-textarea,
        .tox-listbox--select.tox-listbox--select.tox-listbox--select {
            padding-left: 12px;
            border-radius: var(--border-radius);
            border: 1px solid var(--input-border-color);
            font-size: var(--input-font);
            font-family: var(--main-font);
        }
        .tox-textfield.tox-textfield:hover,
        .tox-listbox--select.tox-listbox--select.tox-listbox--select:hover {
            border-color: var(--input-border-focus);
        }
        .tox-textarea.tox-textarea.tox-textarea:focus,
        .tox-textfield.tox-textfield.tox-textfield:focus,
        .tox-listbox--select.tox-listbox--select.tox-listbox--select:focus {
            border-color: var(--input-border-focus);
            box-shadow: 0 0 0 1px var(--input-border-focus);
        }
        .tox-color-input.tox-color-input span {
            top: 18px;
        }
        .tox-checkbox.tox-checkbox {
            font-size: var(--input-font);
            font-family: var(--main-font);
            transform: translateY(14px);
        }
        .tox-color-picker-container.tox-color-picker-container {
            margin-bottom: 6px;
        }
    }


    // Dialog
    .tox-tinymce-aux.tox-tinymce-aux {
        z-index: var(--z-dialog);
    }
    .tox .tox-dialog-wrap__backdrop.tox-dialog-wrap__backdrop {
        background-color: var(--drop-color);
    }
    .tox .tox-dialog.tox-dialog {
        border-radius: var(--dialog-radius);
    }

    // Dialog Header
    .tox .tox-dialog .tox-dialog__header {
        & {
            box-sizing: border-box;
            height: var(--dialog-header);
            color: var(--black-color);
            padding: 0px var(--dialog-padding);
        }
        .tox-dialog__title.tox-dialog__title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: var(--title-font);
        }
        .tox-dialog__title.tox-dialog__title::before {
            content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAtOTYwIDk2MCA5NjAiIHdpZHRoPSIyNHB4IiBmaWxsPSIjMDAwMDAwIj48cGF0aCBkPSJNMzYwLTM2MHYtMTcwbDM2Ny0zNjdxMTItMTIgMjctMTh0MzAtNnExNiAwIDMwLjUgNnQyNi41IDE4bDU2IDU3cTExIDEyIDE3IDI2LjV0NiAyOS41cTAgMTUtNS41IDI5LjVUODk3LTcyOEw1MzAtMzYwSDM2MFptNDI0LTM2OCA1Ny01Ni01Ni01Ni01NyA1NiA1NiA1NlpNMjAwLTEyMHEtMzMgMC01Ni41LTIzLjVUMTIwLTIwMHYtNTYwcTAtMzMgMjMuNS01Ni41VDIwMC04NDBoMzU3TDI4MC01NjN2MjgzaDI4MmwyNzgtMjc4djM1OHEwIDMzLTIzLjUgNTYuNVQ3NjAtMTIwSDIwMFoiLz48L3N2Zz4=");
            display: block;
            width: 24px;
            height: 24px;
        }
        .tox-button {
            color: var(--black-color);
            padding: 0;
            border: none;
        }
        .tox-button.tox-button.tox-button:hover {
            background-color: var(--hover-overlay, rgba(0, 0, 0, 0.1));
        }
    }

    // Dialog Body
    .tox .tox-dialog .tox-dialog__body {
        div:empty {
            display: none;
        }

        .tox-dialog__body-content {
            padding: 2px var(--dialog-padding);
        }

        .tox-dialog__body-nav {
            padding: 0 0 24px 24px;
        }
        .tox-dialog__body-nav-item.tox-dialog__body-nav-item {
            box-sizing: border-box;
            width: 100%;
            padding: 6px 12px;
            color: var(--title-color);
            background-color: var(--lighter-gray);
            border-radius: var(--border-radius);
            border: none;
            text-align: center;
        }
        .tox-dialog__body-nav-item--active.tox-dialog__body-nav-item--active {
            background-color: var(--primary-color);
            color: white;
        }
    }

    // Dialog Footer
    .tox .tox-dialog .tox-dialog__footer {
        & {
            height: var(--dialog-footer);
            padding: 0 var(--dialog-padding);
        }
        .tox-dialog__footer-end.tox-dialog__footer-end {
            flex-direction: row-reverse;
        }
        .tox-button {
            padding: 8px 16px;
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            font-weight: normal;
            font-size: 12px;
            line-height: 12px;
            text-transform: uppercase;
            transition: all 0.5s;
        }
        .tox-button:hover {
            color: var(--primary-color);
            box-shadow: inset 0 0 0 2em white;
        }
        .tox-button--secondary {
            background-color: var(--light-gray);
            border-color: var(--light-gray);
        }
        .tox-button--secondary:hover {
            color: var(--black-color);
            box-shadow: inset 0 0 0 2em var(--lighter-gray);
        }
    }
`;

export default EditorStyle;
