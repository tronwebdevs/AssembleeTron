"use strict";

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }
}

$(document).ready(function () {
    function labsCheckValidity() {
        var selects = _toConsumableArray(document.getElementsByClassName('select-lab'));

        selects.forEach(function (el) {
            return el.setCustomValidity('');
        });
        var validated = true;
        var msg;
        selects.forEach(function (el, index) {
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

    $('select').change(function () {
        return $('#lab-from').removeClass('was-validated');
    });
    $('#lab-from').submit(function (event) {
        if (labsCheckValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        $('#lab-from').addClass('was-validated');
    });
});