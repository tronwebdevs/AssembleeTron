import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
	Form,
	FormGroup,
	CustomInput,
	FormFeedback,
	Button,
	Card,
	CardHeader,
	CardBody,
	Row,
	Col
} from 'reactstrap';
import Selector from '../LabForm/LabHour/Selector';

const ExcClassForm = ({
	tot_h,
	sections,
	handleReset,
	handleSubmit
}) => (
	<div id="form-card-wrapper" style={{ boxShadow: '0 0 8px #9E9E9E' }}>
		<Card
			className="m-0 p-0"
			style={{
				borderTop: '5px solid',
				borderTopColor: '#206bc4'
			}}
		>
			<CardHeader>
				<b>Escludi classi</b>
			</CardHeader>
			<CardBody>
				<p>
					Questa funzione ti permette di escludere una o più classi da
					tutti i laboratori in una determinata fascia, con la
					possibilità di generare automaticamente un laboratorio per
					gli studenti esclusi.
				</p>
				<Formik
					initialValues={{
						h: '0',
						sections: [],
						autoGenLab: true
					}}
					onReset={handleReset}
					onSubmit={handleSubmit}
				>
					{({
						values,
						errors,
						handleChange,
						handleSubmit,
						handleReset,
						isSubmitting,
						setFieldValue
					}) => (
						<Form onSubmit={handleSubmit}>
							<Row>
								<Col xs="12" lg="4">
									<FormGroup>
										<CustomInput
											type="select"
											name="h"
											id="h"
											value={values.h}
											onChange={handleChange}
											invalid={errors.autoGenLab}
										>
											{[...Array(tot_h).keys()].map(h => (
												<option value={h} key={h}>
													Ora {h + 1}
												</option>
											))}
										</CustomInput>
										<FormFeedback>
											{errors.autoGenLab}
										</FormFeedback>
									</FormGroup>
								</Col>
								<Col xs="12" lg="8">
									<FormGroup>
										<Selector
											name="sections"
											value={values.sections}
											classes={sections}
											setValue={value =>
												setFieldValue('sections', value)
											}
											error={errors.sections}
										/>
									</FormGroup>
								</Col>
							</Row>
							<FormGroup>
								<CustomInput
									type="checkbox"
									name="autoGenLab"
									id="autoGenLab"
									label="Genera automaticamente un laboratorio per le classi escluse"
									checked={values.autoGenLab}
									invalid={errors.autoGenLab}
									onChange={handleChange}
								/>
								<FormFeedback>{errors.autoGenLab}</FormFeedback>
							</FormGroup>
							<FormGroup className="pt-2 mb-0">
								<Row>
									<Col
										xs={{ size: '3', offset: '3' }}
										className="pr-1"
									>
										<Button
											type="submit"
											block
											color="primary"
											disabled={isSubmitting}
										>
											Salva
										</Button>
									</Col>
									<Col xs="3" className="pl-1">
										<Button
											type="button"
											onClick={handleReset}
											disabled={isSubmitting}
											block
											outline
											color="danger"
										>
											Annulla
										</Button>
									</Col>
								</Row>
							</FormGroup>
						</Form>
					)}
				</Formik>
			</CardBody>
		</Card>
	</div>
);

ExcClassForm.propTypes = {
    tot_h: PropTypes.number.isRequired,
	sections: PropTypes.array.isRequired,
    handleReset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
};

export default ExcClassForm;
