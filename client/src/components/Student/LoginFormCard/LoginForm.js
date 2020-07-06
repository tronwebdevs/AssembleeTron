import React from 'react';
import StandaloneFormPage from '../../StandaloneFormPage';
import {
	Spinner,
	Button,
	FormGroup,
    Input,
	CustomInput,
	FormFeedback
} from 'reactstrap';
import moment from 'moment';

import FormCard from '../../FormCard';
import StudentIdHelp from './StudentIdHelp';
import AlreadyLoggedBox from './AlreadyLoggedBox';

const LoginForm = ({
    onSubmit,
	onChange,
	onBlur,
	values,
	errors,
	isSubmitting,
    userInfo,
	assemblyInfo
}) => (
	<StandaloneFormPage>
		<FormCard
			title={`Iscrizioni per l'${assemblyInfo.title}`}
			subtitle={moment(assemblyInfo.date).format('DD/MM/YYYY')}
			text={userInfo ? 'Sei già loggato come:' : 'Inserisci la tua matricola per entrare:'}
			onSubmit={onSubmit}
		>
			
            {userInfo ? (
                <FormGroup className="mb-1">
                    <AlreadyLoggedBox
                        name={userInfo.name}
                        section={userInfo.section}
                    />
                </FormGroup>
            ) : (
                <React.Fragment>
                    <FormGroup className="mb-1">
                        <Input
                            type="text"
                            placeholder="Matricola"
                            name="studentID"
                            onChange={onChange}
                            onBlur={onBlur}
                            autoFocus={true}
                            value={values.studentID}
                            invalid={errors.studentID !== undefined}
                        />
                        <FormFeedback>{errors.studentID}</FormFeedback>
                    </FormGroup>
                    <FormGroup className="mb-2">
                        <CustomInput
                            type="checkbox"
                            id="remeberMe"
                            label="Ricordami"
                            name="remeberMe"
                            value={false}
                            checked={values.remeberMe}
                            onChange={onChange}
                        />
                    </FormGroup>
                </React.Fragment>
            )}
			<span className="text-center">
				<FormGroup className="mb-1">
					<CustomInput
						type="radio"
						id="partRadio"
						label="Partecipo"
						name="part"
						value="1"
						checked={values.part === '1'}
						onChange={onChange}
						onBlur={onBlur}
						inline
					/>
					<CustomInput
						type="radio"
						id="noPartRadio"
						label="Non partecipo"
						name="part"
						value="0"
						onChange={onChange}
						onBlur={onBlur}
						checked={values.part === '0'}
						inline
					/>
				</FormGroup>
			</span>
			{errors.part ? (
				<div className="input-feedback text-danger">{errors.part}</div>
			) : null}
			<FormGroup className="pt-2">
				<Button
					type="submit"
					color="primary"
					block={true}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<Spinner color="light" size="sm" />
					) : (
						'Entra'
					)}
				</Button>
			</FormGroup>
		</FormCard>
		<StudentIdHelp />
	</StandaloneFormPage>
);

export default LoginForm;
