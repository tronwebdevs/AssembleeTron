import React, { Fragment } from "react";
import Select from "react-select";

const Selector = ({ name, value, setValue, classes, error, ...rest }) => {

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

	return (
		<Fragment>
			<Select
				name={name}
				value={value}
				options={classes.map(c => ({ label: c, value: c }))}
				isMulti
				isSearchable
				styles={customStyle}
				placeholder={
					<span className="text-muted">Classi specifiche</span>
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
