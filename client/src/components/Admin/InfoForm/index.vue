<template>
    <div>
        <b-row>
            <GeneralForm :handleSubmit="handleSubmit" />
            <DateForm :handleSubmit="handleSubmit" />
            <SubsForm :handleSubmit="handleSubmit" />
        </b-row>
        <b-row>
            <SectionsForm :handleSubmit="handleSubmit" />
        </b-row>
    </div>
</template>

<script>
import GeneralForm from './GeneralForm';
import DateForm from './DateForm';
import SubsForm from './SubsForm';
import SectionsForm from './SectionsForm';

export default {
    name: 'InfoForm',
    props: {
        handleSubmit: Function
    },
    components: {
        GeneralForm,
        DateForm,
        SubsForm,
        SectionsForm
    }
};
</script>
