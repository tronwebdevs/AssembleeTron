import moment from "moment";

/**
 * Class to validate info forms
 * @author Davide Testolin
 */

class InfoFormValidation {
	static validate({
		title,
		date,
		subOpenDate,
		subOpenTime,
		subCloseDate,
		subCloseTime,
		sections
	}, infoSections, labsLength) {
		let errors = {};
		if (title === null || title.trim() === "") {
			errors.title = "Il titolo non puo' restare vuoto";
		}
		let dateMoment = moment(date);
		let subOpenMoment = moment(subOpenDate + " " + subOpenTime);
		let subCloseMoment = moment(subCloseDate + " " + subCloseTime);

		if (dateMoment.diff(moment()) < 0) {
			errors.date = "La data dell'assemblea non puo' essere passata";
		}

		if (subOpenMoment.diff(dateMoment) > 0) {
			errors.subOpenDate = "Le iscrizioni non possono aprire dopo la data dell'assemblea";
		}

		if (subCloseMoment.diff(dateMoment) > 0) {
			errors.subCloseDate = "Le iscrizioni non possono chiudere dopo la data dell'assemblea";
		} else if (subCloseMoment.diff(subOpenMoment) < 0) {
			errors.subCloseDate = "Le iscrizioni non possono chiudere prima di iniziare";
		}

		if (sections.length <= 0) {
			errors.sections = "Nessuna classe potrà partecipare all'assemblea";
		} else if (
			sections.length !== infoSections.length &&
			!sections.every((value, index) => value === infoSections[index]) &&
			labsLength > 0
		) {
			errors.sections =
				"Non puoi modificare le classi che partecipano all'assemblea " +
				"dato che ci sono gia' dei laboratori associati ad essa. " +
				"Riprova dopo aver eliminato tutti i laboratori.";
        }
        
        return errors;
	}
}

export default InfoFormValidation;