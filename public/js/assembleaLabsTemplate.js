"use strict";

$(function () {
    $(document).ready(function () {
        $('#labModal').on('shown.bs.modal', function (e) {
            if ($('#labModal').attr('data-method-required') == 'create') {
                $('#labID').val($('.lab-row').length + 1);
            }
        });
        $.post('/gestore/classi/get').done(function (data) {
            if (data.result == 200) {
                data.list.forEach(function (obj) {
                    $('#labClassiOra1').append('<option value="' + obj.Classe + '">' + obj.Classe + '</option>');
                    $('#labClassiOra2').append('<option value="' + obj.Classe + '">' + obj.Classe + '</option>');
                    $('#labClassiOra3').append('<option value="' + obj.Classe + '">' + obj.Classe + '</option>');
                    $('#labClassiOra4').append('<option value="' + obj.Classe + '">' + obj.Classe + '</option>');
                });

                for (var i = 1; i <= 4; i++) {
                    $('#labClassiOra' + i).selectpicker('refresh');
                }
            } else {
                $('#mainLabsTemplate').prepend('<div class="alert alert-danger fade show" role="alert">' + data.message + ' (guarda la console per ulteriori informazioni)</div>');
                console.error(data.error);
            }
        }).fail(function (error) {
            $('#mainLabsTemplate').prepend('<div class="alert alert-danger fade show" role="alert">Si è verificato un errore inaspettato nel ottenere le classi dal database (guarda la console per ulteriori informazioni)</div>');
            console.error('Si è verificato un errore inaspettato nel ottenere le classi dal database');
            console.error(error);
        });
        $('#labModalSubmit').click(function (event) {
            event.preventDefault();
            var labClassiOra1 = $('#labClassiOra1').val();
            var labClassiOra2 = $('#labClassiOra2').val();
            var labClassiOra3 = $('#labClassiOra3').val();
            var labClassiOra4 = $('#labClassiOra4').val();
            destroySelectpicker();

            if ($('#labName').val().trim() == '') {
                $('#labModalForm').html('<div class="alert alert-danger alert-dismissible fade show form-alert-error" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Non puoi lasciare il nome del laboratorio vuoto!</div>' + $('#labModalForm').html());
                buildSelectpicker();
                return;
            }

            if ($('#labDesc').val().trim() == '') {
                $('#labModalForm').html('<div class="alert alert-danger alert-dismissible fade show form-alert-error" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Non puoi lasciare la descrizione del laboratorio vuota!</div>' + $('#labModalForm').html());
                buildSelectpicker();
                return;
            }

            if ($('#labAula').val().trim() == '') {
                $('#labModalForm').html('<div class="alert alert-danger alert-dismissible fade show form-alert-error" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Non puoi lasciare l\'aula del laboratorio vuota!</div>' + $('#labModalForm').html());
                buildSelectpicker();
                return;
            }

            buildSelectpicker();
            var url;

            if ($('#labModal').attr('data-method-required') == 'create') {
                url = '/gestore/laboratori/nuovolab';
            } else if ($('#labModal').attr('data-method-required') == 'edit') {
                url = '/gestore/laboratori/modificalab';
            } else {
                console.error("Errore, impossibile determinare perchè hai aperto il modal");
                return;
            }

            var laboratorio = {
                labID: $('#labID').val(),
                labName: $('#labName').val(),
                labAula: $('#labAula').val(),
                labDesc: $('#labDesc').val(),
                labPostiOra1: $('#labPostiOra1').val(),
                labPostiOra2: $('#labPostiOra2').val(),
                labPostiOra3: $('#labPostiOra3').val(),
                labPostiOra4: $('#labPostiOra4').val(),
                labClassiOra1: labClassiOra1,
                labClassiOra2: labClassiOra2,
                labClassiOra3: labClassiOra3,
                labClassiOra4: labClassiOra4,
                lastsTwoH: +$('#lastsTwoH').is(':checked')
            };
            var target = $('#mainLabsTemplate').attr('data-labs-target');
            $.post(url, {
                lab: laboratorio,
                target: target
            }).done(function (resp) {
                if (resp.result == 200) {
                    var lab = resp.lab;

                    for (var i = 1; i <= 4; i++) {
                        if (lab["labClassiOra" + i]) {
                            lab["labClassiOra" + i] = JSON.stringify(lab["labClassiOra" + i]);
                        } else {
                            lab["labClassiOra" + i] = '[]';
                        }

                        if (!lab["labPostiOra" + i]) {
                            lab["labPostiOra" + i] = 0;
                        }
                    }

                    lab.lastsTwoH = +lab.lastsTwoH;
                    var ID = lab.labID;

                    if ($('#labModal').attr('data-method-required') == 'edit') {
                        var labRowCols = $('#lab' + ID).children();
                        $(labRowCols[1]).text(lab.labName);
                        $(labRowCols[2]).text(lab.labDesc);
                        $(labRowCols[3]).text(lab.labAula);
                        $(labRowCols[4]).text(lab.labPostiOra1);
                        $(labRowCols[5]).text(lab.labClassiOra1);
                        $(labRowCols[6]).text(lab.labPostiOra2);
                        $(labRowCols[7]).text(lab.labClassiOra2);
                        $(labRowCols[8]).text(lab.labPostiOra3);
                        $(labRowCols[9]).text(lab.labClassiOra3);
                        $(labRowCols[10]).text(lab.labPostiOra4);
                        $(labRowCols[11]).text(lab.labClassiOra4);
                        $(labRowCols[12]).text(lab.lastsTwoH);

                        if ($('#mainLabsTemplate').attr('data-labs-target') != 'memory') {
                            $('#mainLabsTemplate').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert">' + resp.message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                            $('html, body').animate({
                                scrollTop: $('body').offset().top
                            }, 500);
                        }
                    } else {
                        $('#labsListTbody').append('<tr class="lab-row" id="lab' + ID + '">' + '<th scope="row">' + ID + '</th>' + '<td>' + lab.labName + '</td>' + '<td>' + lab.labDesc + '</td>' + '<td>' + lab.labAula + '</td> ' + '<td class="d-none">' + lab.labPostiOra1 + '</td>' + '<td class="d-none">' + lab.labClassiOra1 + '</td>' + '<td class="d-none">' + lab.labPostiOra2 + '</td>' + '<td class="d-none">' + lab.labClassiOra2 + '</td>' + '<td class="d-none">' + lab.labPostiOra3 + '</td>' + '<td class="d-none">' + lab.labClassiOra3 + '</td>' + '<td class="d-none">' + lab.labPostiOra4 + '</td>' + '<td class="d-none">' + lab.labClassiOra4 + '</td>' + '<td class="d-none">' + lab.lastsTwoH + '</td>' + '<td>' + '<i class="fas fa-list-ul p-1 mx-1 text-primary" role="button" onclick="viewLab(' + ID + ')"></i>' + '<i class="fas fa-edit p-1 mx-1 text-warning" role="button" onclick="editLab(' + ID + ')"></i>' + '<i class="fas fa-trash-alt p-1 mx-1 text-danger" role="button" onclick="deleteLab(' + ID + ')"></i>' + '</td>' + '</tr>');

                        if ($('#mainLabsTemplate').attr('data-labs-target') != 'memory') {
                            $('#mainLabsTemplate').prepend('<div class="alert alert-success alert-dismissible fade show" role="alert">' + resp.message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
                            $('html, body').animate({
                                scrollTop: $('body').offset().top
                            }, 500);
                        }
                    }
                } else {
                    $('#mainLabsTemplate').prepend('<div class="alert alert-danger fade show" role="alert">Si è verificato un errore nel creare/modifcare il laboratorio: ' + resp.message + '</div>');
                }

                clearForm();
                $('#labModal').modal('hide');
            });
        });
        $('#labModalDeleteSubmit').click(function (event) {
            event.preventDefault();
        });
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

    if ($(rowCols[12]).text() === '1') {
        $('#lastsTwoH').prop('checked', true);
    }

    $('#labModal').attr('data-method-required', 'view').modal('show');
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

    if ($(rowCols[12]).text() === '1') {
        $('#lastsTwoH').prop('checked', true);
    }

    $('#labModal').attr('data-method-required', 'edit').modal('show');
}

function deleteLab(labID) {
    $('#deleteLabModal').modal('show');
    $('#labDeleteID').text(labID);
    $('#labModalDeleteSubmit').attr('onclick', 'submitDeleteLab(' + labID + ')');
}

function submitDeleteLab(labID) {
    $.post('/gestore/laboratori/eliminalab', {
        labID: labID
    }, function (resp) {
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
    $('#lastsTwoH').prop('checked', false);
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

function destroySelectpicker() {
    for (var i = 1; i <= 4; i++) {
        $('#labClassiOra' + i).selectpicker('destroy');
    }
}

function buildSelectpicker() {
    for (var i = 1; i <= 4; i++) {
        $('#labClassiOra' + i).selectpicker();
    }
}