import moment from "moment";

export const validateInfoForm = ({
    title,
    date,
    subOpenDate,
    subOpenTime,
    subCloseDate,
    subCloseTime,
    sections,
    assemblyExists
}, infoSections, labsLength) => {
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
        assemblyExists === true &&
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
};

export const processAssemblyStats = (info, students, labs) => {
    const subscribeds = students.filter(std => std.labs !== null);

    if (subscribeds.length === 0) {
        return null;
    }

    // let subsSections = [];
    // let subsYear = [];
    // subscribeds.forEach(student => {
    //     const stdSec = subsSections.find(
    //         section => section[0] === student.section
    //     );
    //     const stdYear = subsYear.find(
    //         year => year[0] === student.section[0]
    //     );
    //     if (stdSec) {
    //         stdSec[1]++;
    //     } else {
    //         subsSections.push([
    //             student.section,
    //             1
    //         ]);
    //     }
    //     if (stdYear) {
    //         stdYear[1]++;
    //     } else {
    //         subsYear.push([
    //             student.section[0],
    //             1
    //         ]);
    //     }
    // });
    // subsSections = subsSections.sort((a, b) => ("" + a[0]).localeCompare(b[0]));

    let subsPerTime = [["subscriptions"]];
    let hoursOpen = moment(info.subscription.close).diff(moment(info.subscription.open), 'h');
    let increment = parseInt(hoursOpen / 40, 10);
    let timeCounterStart = moment(info.subscription.open);
    let timeCounterEnd = moment(info.subscription.open).add(increment, 'h');
    while (moment(info.subscription.close).diff(timeCounterEnd) >= 0) {
        let studentsLength = subscribeds.filter(({ labs }) => {
            let createdAt = moment(labs.createdAt);
            return (
                createdAt.diff(timeCounterStart) >= 0 && 
                createdAt.diff(timeCounterEnd) <= 0
            );
        }).length;
        subsPerTime[0].push(studentsLength);
        timeCounterStart.add(increment, 'h');
        timeCounterEnd.add(increment, 'h');
    }

    return {
        // subsSections,
        // subsYear,
        subsPerTime
    };
};

export const validateLabs = (labs, sections) => {
    let result = [];
    for (let i = 1; i <= 4; i++) {
        sections.forEach(section => {
            let canSub = false;
            labs.forEach(lab => {
                if (lab.info['h' + i].sections.indexOf(section) !== -1) {
                    canSub = true;
                }
            });
            if (canSub === false) {
                if (!result[i - 1]) {
                    result[i - 1] = [];
                }
                result[i - 1].push(section);
            }
        });
    }
    return result;
};