import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, StampCard } from 'tabler-react';

const SmallCard = ({
    color,
    icon,
    link,
    title,
    subtitle
}) => (
    <Grid.Col width={12} md={4}>
        <StampCard
            color={color}
            icon={icon}
            header={
                <Link to={link}>
                    {title} <small>{subtitle}</small>
                </Link>
            }
        />
    </Grid.Col>
);

SmallCard.propTypes = {
    color: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
};

export default SmallCard;