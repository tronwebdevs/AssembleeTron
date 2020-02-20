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
	const errors = {};
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

export const validateLabForm = (values, lab, labs, info) => {
	const errors = {};
	if (values._id !== lab._id) {
		labs.forEach(lab => {
			if (lab._id === values._id) {
				errors._id = 'ID duplicato';
			}
			if (lab.room === values.room.trim()) {
				errors.room = `Aula identica al laboratorio "${lab.title}"`;
			}
			if (lab.title === values.title.trim()) {
				errors.title = `Esiste gia' un laboratorio con questo titolo ("${lab.title}")`;
			}
			if (
				lab.description === values.description.trim() &&
				values.description !== '-'
			) {
				errors.description = `Esiste gia' un laboratorio con questa descrizione ("${lab.title}")`;
			}
		});
	}
	if (values.title.trim() === '') {
		errors.title = "Il titolo non puo' restare vuoto";
	}
	if (values.room.trim() === '') {
		errors.room = "L'aula non puo' restare vuota";
	}
	if (values.description.trim() === '') {
		errors.description = "La descrizione non puo' restare vuota";
	}

	if (values.two_h === true && info.tot_h % 2 !== 0 && values["seatsH" + (info.tot_h - 1)] !== 0) {
        errors["seatsH" + (info.tot_h - 1)] = 'In un laboratorio di 2 ore questa ora deve essere vuota';
    }

	for (let i = 0; i < info.tot_h; i++) {
		if (values['seatsH' + i] > 0 && values['classesH' + i].length <= 0) {
			errors['classesH' + i] = "Devi selezionare almeno una classe partecipante per quest'ora";
		}
		if (values.two_h === true && (i + 1) < info.tot_h) {
			if (i % 2 === 0) {
				if (values['seatsH' + i] !== values['seatsH' + (i + 1)]) {
					errors['seatsH' + (i + 1)] = 'Il numero posti di questa ora deve essere ' +
						                         "uguale a quello dell'ora precedente";
				}
				if (
					values['classesH' + i].length !== 0 &&
					(
                        values['classesH' + i].length !== values['classesH' + (i + 1)].length ||
						values['classesH' + i].filter(sec =>
                            values['classesH' + (i + 1)].find(
                                ({ value }) => value === sec.value
                            ) !== undefined
                        ).length === 0
                    )
				) {
					errors['classesH' + (i + 1)] = "Le classi partecipati di quest'ora devono essere " +
						                           "uguali a quelle dell'ora precedente";
				}
			}
		}
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
