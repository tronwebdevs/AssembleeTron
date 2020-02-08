import moment from 'moment';

export const validateInfoForm = (
	{
		title,
		date,
		subOpenDate,
		subOpenTime,
		subCloseDate,
		subCloseTime,
		sections,
		tot_h,
		assemblyExists
	},
	infoSections,
	labsLength
) => {
	let errors = {};
	if (title === null || title.trim() === '') {
		errors.title = "Il titolo non puo' restare vuoto";
	}
	let dateMoment = moment(date);
	let subOpenMoment = moment(subOpenDate + ' ' + subOpenTime);
	let subCloseMoment = moment(subCloseDate + ' ' + subCloseTime);

	if (dateMoment.diff(moment()) < 0) {
		errors.date = "La data dell'assemblea non puo' essere passata";
	}

	if (subOpenMoment.diff(dateMoment) > 0) {
		errors.subOpenDate =
			"Le iscrizioni non possono aprire dopo la data dell'assemblea";
	}

	if (subCloseMoment.diff(dateMoment) > 0) {
		errors.subCloseDate =
			"Le iscrizioni non possono chiudere dopo la data dell'assemblea";
	} else if (subCloseMoment.diff(subOpenMoment) < 0) {
		errors.subCloseDate =
			'Le iscrizioni non possono chiudere prima di iniziare';
	}

	if (sections.length <= 0) {
		errors.sections = "Nessuna classe potrà partecipare all'assemblea";
	} else if (
		assemblyExists === true &&
		sections.length !== infoSections.length &&
		!sections.every((value, index) => value === infoSections[index]) &&
		labsLength > 0
	) {
		errors.sections =
			"Non puoi modificare le classi che partecipano all'assemblea " +
			"dato che ci sono gia' dei laboratori associati ad essa. " +
			'Riprova dopo aver eliminato tutti i laboratori.';
	}

	if (tot_h < 1) {
		errors.tot_h =
			"Il numero di ore di durata dell'assemblea non puo' essere minore di 1";
	}

	return errors;
};

export const processAssemblyStats = (info, students, labs) => ({
	subsPerTime: [['subscriptions']]
});

export const validateLabs = (labs, sections, tot_h) => {
	let result = [];
	for (let i = 0; i < tot_h; i++) {
		sections.forEach(section => {
			let canSub = false;
			labs.forEach(lab => {
				if (lab.info[i].sections.indexOf(section) !== -1) {
					canSub = true;
				}
			});
			if (canSub === false) {
				if (!result[i]) {
					result[i] = [];
				}
				result[i].push(section);
			}
		});
	}
	return result;
};
