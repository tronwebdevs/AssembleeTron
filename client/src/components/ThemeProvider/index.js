import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GlobalDarkTheme from './DarkTheme';

const ThemeProvider = ({ preferences, children }) => {
    let theme = preferences.theme;
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (userPrefersDark && theme === 'none') {
        theme = 'dark';
    }

    return (
        <React.Fragment>
            {theme === 'dark' ? (
                <GlobalDarkTheme />
            ) : null}

            {children}
        </React.Fragment>
    );
};

ThemeProvider.propTypes = {
    preferences: PropTypes.object.isRequired,
    children: PropTypes.any
};

const mapStateToProps = state => ({
    preferences: state.preferences
});

export default connect(mapStateToProps)(ThemeProvider);