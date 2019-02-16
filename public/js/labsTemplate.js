$(document).ready(function() {
    $('#labModal').on('shown.bs.modal', function (e) {
        if ($('#labModal').attr('data-method-required') == 'create') {
            $('#labID').val($('.lab-row').length + 1);
        }
    });

    // Get classi
    $.post('/gestore/dashboard/assemblea/classi/get').done(function(data) {
        if (data.result == 200) {
            // Carica classi nelle liste
            data.list.forEach(function(obj) {
                $('#labClassiOra1').append('<option value="' + obj.Classe + '">' + obj.Classe + '</option>');
                $('#labClassiOra2').append('<option value="' + obj.Classe + '">' + obj.Classe + '</option>');
                $('#labClassiOra3').append('<option value="' + obj.Classe + '">' + obj.Classe + '</option>');
                $('#labClassiOra4').append('<option value="' + obj.Classe + '">' + obj.Classe + '</option>');
            });

            // Refresh menu bootstrap-select
            $('#labClassiOra1').selectpicker('refresh');
            $('#labClassiOra2').selectpicker('refresh');
            $('#labClassiOra3').selectpicker('refresh');
            $('#labClassiOra4').selectpicker('refresh');
        } else {
            $('#mainLabsTemplate').prepend('<div class="alert alert-danger fade show" role="alert">' + data.message + ' (guarda la console per ulteriori informazioni)</div>');
            console.error(data.error);
        }
    }).fail(function(error) {
        $('#mainLabsTemplate').prepend('<div class="alert alert-danger fade show" role="alert">Si è verificato un errore inaspettato nel ottenere le classi dal database (guarda la console per ulteriori informazioni)</div>');
        console.error('Si è verificato un errore inaspettato nel ottenere le classi dal database');
    });

    $('#labModalSubmit').click(function(event) {
        event.preventDefault();

        // Memorizza valore classi per laboratorio nelle ore 1,2,3,4
        var labClassiOra1 = JSON.stringify($('#labClassiOra1').val());
        var labClassiOra2 = JSON.stringify($('#labClassiOra2').val());
        var labClassiOra3 = JSON.stringify($('#labClassiOra3').val());
        var labClassiOra4 = JSON.stringify($('#labClassiOra4').val());

        // Bypass bug di duplicazione su Invio-Errore-Annulla
        $('#labClassiOra1').selectpicker('destroy');
        $('#labClassiOra2').selectpicker('destroy');
        $('#labClassiOra3').selectpicker('destroy');
        $('#labClassiOra4').selectpicker('destroy');

        if ($('#labName').val().trim() == '') {
            $('#labModalForm').html('<div class="alert alert-danger alert-dismissible fade show form-alert-error" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Non puoi lasciare il nome del laboratorio vuoto!</div>' + $('#labModalForm').html());
            // Bypass bug di duplicazione su Invio-Errore-Annulla
            $('#labClassiOra1').selectpicker();
            $('#labClassiOra2').selectpicker();
            $('#labClassiOra3').selectpicker();
            $('#labClassiOra4').selectpicker();
            return;
        }
        if ($('#labDesc').val().trim() == '') {
            $('#labModalForm').html('<div class="alert alert-danger alert-dismissible fade show form-alert-error" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Non puoi lasciare la descrizione del laboratorio vuota!</div>' + $('#labModalForm').html());
            // Bypass bug di duplicazione su Invio-Errore-Annulla
            $('#labClassiOra1').selectpicker();
            $('#labClassiOra2').selectpicker();
            $('#labClassiOra3').selectpicker();
            $('#labClassiOra4').selectpicker();
            return;
        }
        if ($('#labAula').val().trim() == '') {
            $('#labModalForm').html('<div class="alert alert-danger alert-dismissible fade show form-alert-error" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Non puoi lasciare l\'aula del laboratorio vuota!</div>' + $('#labModalForm').html());
            // Bypass bug di duplicazione su Invio-Errore-Annulla
            $('#labClassiOra1').selectpicker();
            $('#labClassiOra2').selectpicker();
            $('#labClassiOra3').selectpicker();
            $('#labClassiOra4').selectpicker();
            return;
        }

        $('#labClassiOra1').selectpicker();
        $('#labClassiOra2').selectpicker();
        $('#labClassiOra3').selectpicker();
        $('#labClassiOra4').selectpicker();

        var url;
        if ($('#labModal').attr('data-method-required') == 'create') {
            url = '/gestore/dashboard/assemblea/laboratori/nuovolab';
        } else if ($('#labModal').attr('data-method-required') == 'edit') {
            url = '/gestore/dashboard/assemblea/laboratori/modificalab';
        } else {
            console.error("Errore, impossibile determinare perchè hai aperto il modal");
            return;
        }

        var laboratorio = {
            labID: $('#labID').val(),
            labName: $('#labName').val(),
            labAula: $('#labAula').val(),
            labDesc:  $('#labDesc').val(),
            labPostiOra1: $('#labPostiOra1').val(),
            labPostiOra2: $('#labPostiOra2').val(),
            labPostiOra3: $('#labPostiOra3').val(),
            labPostiOra4: $('#labPostiOra4').val(),
            labClassiOra1: $('#labClassiOra1').val(),
            labClassiOra2: $('#labClassiOra2').val(),
            labClassiOra3: $('#labClassiOra3').val(),
            labClassiOra4: $('#labClassiOra4').val(),
            lastsTwoH: $('#lastsTwoH').is(':checked')
        };

        var target = $('#mainLabsTemplate').attr('data-labs-target');

        //console.log(laboratorio);

        $.post(url, { lab: laboratorio, target: target }).done(function(resp) {
            if (resp.result == 200) {
                // Rimuove vecchio lab nella tabella
                if ($('#labModal').attr('data-method-required') == 'edit') {
                    var labRowCols = $('#lab' + $('#labID').val()).children();
                    // Modifica la riga nella tabella
                    $(labRowCols[1]).text($('#labName').val());
                    $(labRowCols[2]).text($('#labDesc').val());
                    $(labRowCols[3]).text($('#labAula').val());
                    $(labRowCols[4]).text($('#labPostiOra1').val());
                    $(labRowCols[5]).text(labClassiOra1);
                    $(labRowCols[6]).text($('#labPostiOra2').val());
                    $(labRowCols[7]).text(labClassiOra2);
                    $(labRowCols[8]).text($('#labPostiOra3').val());
                    $(labRowCols[9]).text(labClassiOra3);
                    $(labRowCols[10]).text($('#labPostiOra4').val());
                    $(labRowCols[11]).text(labClassiOra4);
                    $(labRowCols[12]).text(( $('#lastsTwoH').is(':checked') ? 'Sì' : 'No' ));

                    if ($('#mainLabsTemplate').attr('data-labs-target') != 'memory') {
                        $('#mainLabsTemplate').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert">' + resp.message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                    }
                } else {
                    // Aggiunge nuovo lab
                    $('#labsListTbody').append('<tr class="lab-row" id="lab' + $('#labID').val() + '">' +
                        '<th scope="row">' + $('#labID').val() + '</th>' +
                        '<td>' + $('#labName').val() + '</td>' +
                        '<td>' + $('#labDesc').val() + '</td>' +
                        '<td>' + $('#labAula').val() + '</td> ' +
                        '<td class="d-none">' + $('#labPostiOra1').val() + '</td>' +
                        '<td class="d-none">' + labClassiOra1 + '</td>' +
                        '<td class="d-none">' + $('#labPostiOra2').val() + '</td>' +
                        '<td class="d-none">' + labClassiOra2 + '</td>' +
                        '<td class="d-none">' + $('#labPostiOra3').val() + '</td>' +
                        '<td class="d-none">' + labClassiOra3 + '</td>' +
                        '<td class="d-none">' + $('#labPostiOra4').val() + '</td>' +
                        '<td class="d-none">' + labClassiOra4 + '</td>' +
                        '<td class="d-none">' + ( $('#lastsTwoH').is(':checked') ? 'Sì' : 'No' ) + '</td>' +
                        '<td>' +
                            '<i class="fas fa-list-ul p-1 mx-1 text-primary" role="button" onclick="viewLab(' + $('#labID').val() + ')"></i>' +
                            '<i class="fas fa-edit p-1 mx-1 text-warning" role="button" onclick="editLab(' + $('#labID').val() + ')"></i>' +
                            '<i class="fas fa-trash-alt p-1 mx-1 text-danger" role="button" onclick="deleteLab(' + $('#labID').val() + ')"></i>' +
                        '</td>' +
                    '</tr>');

                    if ($('#mainLabsTemplate').attr('data-labs-target') != 'memory') {
                        $('#mainLabsTemplate').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert">' + resp.message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                    }
                }
            } else {
                $('#mainLabsTemplate').prepend('<div class="alert alert-danger fade show" role="alert">Si è verificato un errore nel eliminare il laboratorio: ' + resp.message + '</div>');
            }
            // Ripulisce il form
            clearForm();
            // Nasconde il modal
            $('#labModal').modal('hide');
        });
    });

    $('#labModalDeleteSubmit').click(function(event) {
        event.preventDefault();
    });
});

function newLab() {
    clearForm();
    unlockForm();
    $('#labModalTitle').text('Crea laboratorio');
    $('#labModal').attr('data-method-required', 'create').modal('show');
}

function viewLab(labID) {
    lockForm();
    $('#labModalTitle').text('Analizza laboratorio');
    var rowCols = $('#lab' + labID).children();
    $('#labID').val(labID);
    $('#labName').val($(rowCols[1]).text());
    $('#labDesc').val($(rowCols[2]).text());
    $('#labAula').val($(rowCols[3]).text());
    $('#labPostiOra1').val($(rowCols[4]).text());
    $('#labClassiOra1').selectpicker('val', JSON.parse($(rowCols[5]).text()));
    $('#labPostiOra2').val($(rowCols[6]).text());
    $('#labClassiOra2').selectpicker('val', JSON.parse($(rowCols[7]).text()));
    $('#labPostiOra3').val($(rowCols[8]).text());
    $('#labClassiOra3').selectpicker('val', JSON.parse($(rowCols[9]).text()));
    $('#labPostiOra4').val($(rowCols[10]).text());
    $('#labClassiOra4').selectpicker('val', JSON.parse($(rowCols[11]).text()));
    if ($(rowCols[12]).text() == 'Sì') {
        $('#lastsTwoH').attr('checked', true);
    }

    $('#labModal').modal('show');
}

function editLab(labID) {
    clearForm();
    unlockForm();
    $('#labModalTitle').text('Modifica laboratorio');
    var rowCols = $('#lab' + labID).children();
    $('#labID').val(labID);
    $('#labName').val($(rowCols[1]).text());
    $('#labDesc').val($(rowCols[2]).text());
    $('#labAula').val($(rowCols[3]).text());
    $('#labPostiOra1').val($(rowCols[4]).text());
    $('#labClassiOra1').selectpicker('val', JSON.parse($(rowCols[5]).text()));
    $('#labPostiOra2').val($(rowCols[6]).text());
    $('#labClassiOra2').selectpicker('val', JSON.parse($(rowCols[7]).text()));
    $('#labPostiOra3').val($(rowCols[8]).text());
    $('#labClassiOra3').selectpicker('val', JSON.parse($(rowCols[9]).text()));
    $('#labPostiOra4').val($(rowCols[10]).text());
    $('#labClassiOra4').selectpicker('val', JSON.parse($(rowCols[11]).text()));
    if ($(rowCols[12]).text() == 'Sì') {
        $('#lastsTwoH').attr('checked', true);
    }

    $('#labModal').attr('data-method-required', 'edit').modal('show');
}

function deleteLab(labID) {
    $('#deleteLabModal').modal('show');
    $('#labDeleteID').text(labID);
    $('#labModalDeleteSubmit').attr('onclick', 'submitDeleteLab(' + labID + ')')
}

function submitDeleteLab(labID) {
    $.post('/gestore/dashboard/assemblea/laboratori/eliminalab', { labID: labID }, function(resp) {
        if (resp.result == 200) {
            $('#deleteLabModal').modal('hide');
            $('#lab' + labID).remove();

            $('#mainLabsTemplate').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert">' + resp.message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
        } else {
            $('#mainLabsTemplate').prepend('<div class="alert alert-danger fade show" role="alert">Si è verificato un errore nel eliminare il laboratorio: ' + resp.message + '</div>');
        }
    });
}

function clearForm() {
    $('#labID').val('');
    $('#labName').val('');
    $('#labDesc').val('');
    $('#labAula').val('');
    $('#labPostiOra1').val(0);
    $('#labPostiOra2').val(0);
    $('#labPostiOra3').val(0);
    $('#labPostiOra4').val(0);
    if ($('#lastsTwoH').is(':checked')) {
        $('#lastsTwoH').trigger('click');
    }
    $('#labClassiOra1').selectpicker('deselectAll');
    $('#labClassiOra2').selectpicker('deselectAll');
    $('#labClassiOra3').selectpicker('deselectAll');
    $('#labClassiOra4').selectpicker('deselectAll');
    $('.form-alert-error').remove();
}

function lockForm() {
    $('#labModalSubmit').hide();
    $('#labModalReset').hide();
    $('#labModalDismiss').show();

    $('#labName').attr('disabled', 'disabled');
    $('#labDesc').attr('disabled', 'disabled');
    $('#labAula').attr('disabled', 'disabled');
    $('#labPostiOra1').attr('disabled', 'disabled');
    $('#labPostiOra2').attr('disabled', 'disabled');
    $('#labPostiOra3').attr('disabled', 'disabled');
    $('#labPostiOra4').attr('disabled', 'disabled');
    $('#lastsTwoH').attr('disabled', 'disabled');
    $('#labClassiOra1').attr('disabled', 'disabled');
    $('#labClassiOra2').attr('disabled', 'disabled');
    $('#labClassiOra3').attr('disabled', 'disabled');
    $('#labClassiOra4').attr('disabled', 'disabled');
}

function unlockForm() {
    $('#labModalSubmit').show();
    $('#labModalReset').show();
    $('#labModalDismiss').hide();

    $('#labName').removeAttr('disabled');
    $('#labDesc').removeAttr('disabled');
    $('#labAula').removeAttr('disabled');
    $('#labPostiOra1').removeAttr('disabled');
    $('#labPostiOra2').removeAttr('disabled');
    $('#labPostiOra3').removeAttr('disabled');
    $('#labPostiOra4').removeAttr('disabled');
    $('#lastsTwoH').removeAttr('disabled');
    $('#labClassiOra1').removeAttr('disabled');
    $('#labClassiOra2').removeAttr('disabled');
    $('#labClassiOra3').removeAttr('disabled');
    $('#labClassiOra4').removeAttr('disabled');
}
