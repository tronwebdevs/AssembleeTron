import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { switchTheme } from '../../actions/preferencesActions';
import { Container } from 'reactstrap';
import { FaRegLightbulb, FaMoon } from 'react-icons/fa';
import moment from 'moment';

const Footer = ({ preferences, switchTheme }) => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const { theme } = preferences;
    let icon = <FaRegLightbulb />;

    if (theme === 'dark' || (userPrefersDark && theme === 'none')) {
        icon = <FaMoon />;
    }

    return (
        <footer>
            <Container className="text-center">
                <span className="footer-span">
                    Copyright © {moment().format('YYYY')}{' '}
                    <a href="https://www.tronweb.it"> TronWeb</a> | Made by Davide
                    Testolin |
                    <span 
                        style={{
                            padding: '0 10px',
                            cursor: 'pointer'
                        }}
                        onClick={() => switchTheme()}
                    >
                        {icon}
                    </span>
                </span>
            </Container>
        </footer>
    );
};

Footer.propTypes = {
    preferences: PropTypes.object.isRequired,
    switchTheme: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    preferences: state.preferences
});

export default connect(mapStateToProps, { switchTheme })(Footer);
