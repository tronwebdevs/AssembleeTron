$(document).ready(() => {
    $('select.select-lab').each((index, el) => {
        let num = +$(el).attr('name').slice(3);
        if ( (num % 2) != 0) {
            $(el).change(() => {
                if ($(`select[name="ora${num}"]`).children("option:selected").attr('data-twoH') == 1) {
                    $(`select[name="ora${num + 1}"]`).val($(`select[name="ora${num}"`).val());
                } else if ($(`select[name="ora${num + 1}"]`).children("option:selected").attr('data-twoH') == 1) {
                    $(`select[name="ora${num + 1}"`).val('default');
                }
            });
        } else {
            $(el).change(() => {
                if ($(`select[name="ora${num}"]`).children("option:selected").attr('data-twoH') == 0) {

                    if ($(`select[name="ora${num - 1}"]`).children("option:selected").attr('data-twoH') == 1) {

                        if ($(`select[name="ora${num}"]`).val() != $(`select[name="ora${num - 1}"]`).val()) {

                            $(`select[name="ora${num}"]`).val($(`select[name="ora${num - 1}"]`).val());
                        }
                    }
                } else {
                    if ($(`select[name="ora${num}"]`).val() != $(`select[name="ora${num - 1}"]`).val()) {

                        $(`select[name="ora${num}"]`).val($(`select[name="ora${num - 1}"]`).val());
                    }
                }
            });
        }
    });
});