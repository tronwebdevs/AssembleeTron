import React from 'react';
import {
	Col,
	Input,
	CustomInput,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	FormFeedback
} from 'reactstrap';
import Selector from './Selector';

const secList = [
	{
		label: 'Tutte',
		value: '@a'
	},
	{
		label: 'Classi prime',
		value: '@1'
	},
	{
		label: 'Classi seconde',
		value: '@2'
	},
	{
		label: 'Classi terze',
		value: '@3'
	},
	{
		label: 'Classi quarte',
		value: '@4'
	},
	{
		label: 'Classi quinte',
		value: '@5'
	}
];

const LabHour = ({
	h,
	classes,
	values,
	errors,
	handleChange,
	setFieldValue
}) => (
	<Col xs="12" md="4" sm="6" className="pb-xl-4">
		<span className="text-muted d-block mb-1">Ora {h + 1}</span>
		<InputGroup className="mb-2">
			<InputGroupAddon addonType="prepend">
				<InputGroupText>Posti: </InputGroupText>
			</InputGroupAddon>
			<Input
				type="number"
				name={'seatsH' + h}
				value={values.seats}
				invalid={errors.seats !== undefined}
				onChange={handleChange}
			/>
			<FormFeedback>{errors.seats}</FormFeedback>
		</InputGroup>
		{secList.map((el, index) => (
			<CustomInput
				key={index}
				type="checkbox"
				name={`classesH_${h}_${el.value}`}
				id={`classesH_${h}_${el.value}`}
				label={el.label}
				className="mb-2"
				checked={
					(values.classes || []).includes(el.value) ||
                    (values.classes || []).includes('@a')
				}
				disabled={values.seats <= 0}
				onChange={({ currentTarget }) => {
					const temp = currentTarget.name.split('_');
					let h = temp[1];
					let value = temp[2];
					if (currentTarget.checked === true) {
                        // Checking
						if (value !== '@a') {
                            let newClasses = values.classes.filter(
								c => c[0] !== value[1]
							);
							setFieldValue('classesH' + h, [
								...newClasses,
								value
							]);
						} else {
							setFieldValue('classesH' + h, [value]);
						}
                    } else {
                        // Unchecking
						if (values.classes.includes('@a') && value !== '@a') {
							let newClasses = values.classes.filter(
								c => c !== '@a'
							);
							for (let c of secList) {
								if (
									c.value !== value &&
									!values.classes.includes(c.value)
								) {
									newClasses.push(c.value);
								}
							}
							setFieldValue('classesH' + h, newClasses);
						} else {
							setFieldValue(
								'classesH' + h,
								values.classes.filter(c => c !== value)
							);
						}
					}
				}}
			/>
		))}
		<Selector
			name={`classesH_${h}_c`}
			id={`classesH_${h}_c`}
			value={values.classes
				.filter(c => c[0] !== '@' && c[0] !== '-')
				.map(cl => ({ label: cl, value: cl }))}
			classes={classes}
            setValue={value => 
                setFieldValue('classesH' + h, value.map(el => el.value))
            }
			error={errors.classes}
			isDisabled={values.seats <= 0}
		/>
		<span>
			Classi escluse:{' '}
			{values.classes
				.filter(c => c[0] === '-')
				.map(c => c.substring(1))
				.join(', ')}
		</span>
	</Col>
);

export default LabHour;
