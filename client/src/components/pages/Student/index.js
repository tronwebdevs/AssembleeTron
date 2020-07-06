import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Error404Page } from 'tabler-react';
import { StudentRoute } from '../../Student/';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import Home from './Home';
import LabsSelect from './LabsSelect';
import ShowSub from './ShowSub';

const Wrapper = styled.div`
    .studentpage-enter {
        opacity: 0;
        transform: translateX(-2%);
    }

    .studentpage-enter-done {
        opacity: 1;
        transform: translateX(0);
        transition: opacity 200ms, transform 200ms;
    }

    .studentpage-exit {
        opacity: 1;
        transform: translateX(0);
    }

    .studentpage-exit-active {
        opacity: 0;
        transform: translateX(200px);
        transition: opacity 200ms, transform 200ms;
    }
`;

const Student = ({ location }) => (
    <Wrapper style={{ height: '100%' }}>
        <TransitionGroup style={{ height: '100%' }}>
            <CSSTransition
                key={location.key}
                timeout={{ enter: 100, exit: 100 }}
                classNames="studentpage"
            >
                <Switch location={location}>
                    <StudentRoute path="/" component={Home} exact />
                    <StudentRoute path="/iscrizione" component={LabsSelect} exact />
                    <StudentRoute path="/conferma" component={ShowSub} exact />
                    <Route
                        component={props => (
                            <Error404Page
                                action={'Indietro'}
                                subtitle={'Oof... Pagina non trovata...'}
                                details={
                                    'La pagina che stai cercando non è stata trovata'
                                }
                                {...props}
                            />
                        )}
                    />
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    </Wrapper>
);

export default Student;
