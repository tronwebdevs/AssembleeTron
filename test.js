let lab = {};
lab.labClassiOra1 = (lab.labClassiOra1 || []);
lab.labClassiOra2 = (lab.labClassiOra2 || []);
lab.labClassiOra3 = (lab.labClassiOra3 || []);
lab.labClassiOra4 = (lab.labClassiOra4 || []);

classi = uniqueArray(lab.labClassiOra1.concat(lab.labClassiOra2, lab.labClassiOra3, lab.labClassiOra4));

function uniqueArray(arrArg) {
    return arrArg.filter((elem, pos, arr) => {
        return arr.indexOf(elem) == pos;
    });
}