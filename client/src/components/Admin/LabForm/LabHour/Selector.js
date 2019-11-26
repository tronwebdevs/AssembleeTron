import React, { Fragment } from "react";
import { Row, Col } from "reactstrap";
import Select from "react-select";

const Selector = ({ name, value, setValue, classes, error, ...rest }) => {
	const options = [
		{
			label: "Classi",
			options: classes.map(c => ({ label: c, value: c }))
		}
	];

	const customStyle = {
		control: provided => ({
			...provided,
			borderColor: "#ced4da",
			borderRadius: "3px"
		}),
		indicatorSeparator: provided => ({
			...provided,
			borderColor: "#ced4da",
			backgroundColor: "#ced4da"
		})
	};

	const groupHeadingStyle = {
		margin: 0,
		padding: 0
	};

	const buttonStyle = {
		display: "block",
		width: "100%",
		padding: "8px 10px",
		backgroundColor: "#fbfbfc",
		border: "none",
		borderTop: "1px solid #ced4da"
	};

	const GroupHeading = ({ selectProps }) => (
		<div style={groupHeadingStyle}>
			<Row className="m-0">
				<Col xs="6" className="p-0">
					<button
						type="button"
						style={{
							...buttonStyle,
							borderRight: "1px solid #ced4da"
						}}
						onClick={() => setValue(selectProps.options[0].options)}
					>
						Seleziona tutte
					</button>
				</Col>
				<Col xs="6" className="p-0">
					<button
						type="button"
						style={buttonStyle}
						onClick={() => setValue([])}
					>
						Deseleziona tutte
					</button>
				</Col>
			</Row>
			<Row className="m-0">
				<Col xs="2" className="p-0">
					<span
						style={{
							...buttonStyle,
							borderRight: "1px solid #ced4da"
						}}
					>
						Solo
					</span>
				</Col>
				{[1, 2, 3, 4, 5].map(section => (
					<Col xs="2" className="p-0" key={section}>
						<button
							type="button"
							style={{
								...buttonStyle,
								borderRight: "1px solid #ced4da"
							}}
							onClick={() =>
								setValue(
									selectProps.options[0].options.filter(
										sec => +sec.value[0] === section
									)
								)
							}
						>
							{section}ª
						</button>
					</Col>
				))}
			</Row>
		</div>
	);

	return (
		<Fragment>
			<Select
				name={name}
				value={value}
				components={{ GroupHeading }}
				options={options}
				isMulti
				isSearchable
				styles={customStyle}
				placeholder={
					<span className="text-muted">Seleziona le classi</span>
				}
				className="basic-multi-select"
				closeMenuOnSelect={false}
				onChange={setValue}
				noOptionsMessage={() => "Nessun risultato trovato"}
				hideSelectedOptions={false}
				{...rest}
			/>
			{error ? (
				<span
					style={{
						color: "#fa4654",
						fontSize: "14px",
						marginTop: "0.25rem"
					}}
				>
					{error}
				</span>
			) : null}
		</Fragment>
	);
};

export default Selector;
