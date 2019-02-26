$(document).ready(() => {
    function labsCheckValidity() {
        let selects = [...document.getElementsByClassName('select-lab')];
        selects.forEach(el => el.setCustomValidity(''));
        let validated = true;
        let msg;
        selects.forEach((el, index) => {
            if (el.options[el.selectedIndex].getAttribute('data-twoH') == 1) {
                if (index % 2 == 0) {
                    if (el.value == selects[index + 1].value) {
                        document.getElementById('if-' + selects[index + 1].name).innerText = '';
                        selects[index + 1].setCustomValidity('');
                    } else {
                        validated = false;
                        msg = 'Questo laboratorio deve essere uguale a quello dell\'ora precedente (2 ore)';
                        document.getElementById('if-' + selects[index + 1].name).innerText = msg;
                        selects[index + 1].setCustomValidity(msg);
                    }
                } else {
                    if (el.value == selects[index - 1].value) {
                        document.getElementById('if-' + selects[index - 1].name).innerText = '';
                        selects[index - 1].setCustomValidity('');
                    } else {
                        validated = false;
                        msg = 'Questo laboratorio deve essere uguale a quello dell\'ora successiva (2 ore)';
                        document.getElementById('if-' + selects[index - 1].name).innerText = msg;
                        selects[index - 1].setCustomValidity(msg);
                    }
                }
            }
        });
        return validated;
    }
    $('select').change(() => $('#lab-from').removeClass('was-validated'));
    $('#lab-from').submit((event) => {
        if (labsCheckValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        $('#lab-from').addClass('was-validated');
        
    });
});