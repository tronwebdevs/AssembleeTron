import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    body {
        background-color: #303030 !important;
    }

    span, h1, h2, h3, h4, h5, h6, b, p {
        color: #FFFFFF !important;
    }
    
    .card {
        background-color: #424242 !important;
    }

    footer {
        background-color: #212121;
    }

    footer span {
        color: rgba(255, 255, 255, .3) !important;
    }

    span.footer-span a {
        color: rgba(255, 255, 255, .2) !important;
    }

    .card .card-body span a {
        color: rgba(255, 255, 255, .4) !important;
    }

    .text-muted {
        color: rgba(255, 255, 255, .4) !important;
    }

    .input-group input, .input-group input:focus, .input-group input:disabled,
    .form-group input,  .form-group input:focus, .form-group input:disabled, 
    select, select:disabled, 
    textarea, textarea:disabled,
    .css-7560wg-control,
    .css-26l3qy-menu {
        background-color: #303030 !important;
    }

    .input-group input, .input-group input:focus,
    .form-group input,  .form-group input:focus,
    .form-group textarea, .form-group textarea:focus
    select, select:disabled {
        color: rgba(255, 255, 255, .6) !important;
    }

    .input-group input:disabled,
    .form-group input:disabled {
        color: #888e9a !important;
    }

    select.form-control {
        color: rgba(255, 255, 255, .4) !important;
    }

    .form-group ::placeholder, .input-group ::placeholder {
        color: rgba(255, 255, 255, .2) !important;
    }

    .css-1cpj9tp-control {
        border-color: #212121 !important;
        background-color: rgba(48, 48, 48, .5) !important;
    }
    .css-1idk9wn-control {
        border-color: #212121 !important;
        background-color: #303030 !important;
    }

    .css-1rhbuit-multiValue {
        background-color: rgba(255, 255, 255, .2) !important;
    }

    .css-12jo7m5 {
        color: rgba(255, 255, 255, .6) !important;
    }

    button.selector-btn {
        background-color: #333333;
        color: #FFFFFF;
        border-color: #212121 !important;
    }

    .custom-control-label {
        color: #FFFFFF;
    }

    .alert-danger {
        color: #fedadd !important;
        background-color: rgba(130, 36, 44, .5) !important;
        border-color: rgba(130, 36, 44, .2) !important;
    }

    nav.bg-white {
        background-color: #212121 !important;
    }

    nav.navbar-light .navbar-nav .nav-link {
        color: rgba(255, 255, 255, .6) !important;
    }
    nav.navbar-light .navbar-nav .nav-link.active {
        color: #467fcf !important;
    }

    .card .card-header {
        background-color: rgba(48, 48, 48, .4);
    }

    .card-body .border-bottom {
        border-bottom-color: rgba(255, 255, 255, .1) !important;
    }

    .info-sub-card button {
        color: #9E9E9E !important;
    }

    .modal-content {
        background-color: #424242 !important;
    }

    .modal-content .row div {
        color: #FFFFFF !important;
    }

    div.input-group-prepend span.input-group-text {
        background-color: #303030;
    }

    .custom-control-input:disabled ~ .custom-control-label::before {
        background-color: rgba(48, 48, 48, .4) !important;
    }

    .custom-control-label::before {
        background-color: #303030 !important;
    }

    div.tw-modal {
        box-shadow: 0 0 8px #303030;
    }

    div.ct-toast {
        background-color: #424242;
    }
    div.ct-toast div.ct-text {
        color: #FFFFFF;
    }
`;