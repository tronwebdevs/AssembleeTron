<template>
    <b-form @submit.prevent="handleSubmit">
        <b-form-group>
            <b-form-select
                v-model="selected[0]"
                :options="options"
                placeholder="Prima ora"
            ></b-form-select>
        </b-form-group>
        <b-form-group>
            <b-form-select
                v-model="selected[1]"
                :options="options"
                placeholder="Seconda ora"
            ></b-form-select>
        </b-form-group>
        <b-form-group>
            <b-form-select
                v-model="selected[2]"
                :options="options"
                placeholder="Terza ora"
            ></b-form-select>
        </b-form-group>
        <b-form-group>
            <b-form-select
                v-model="selected[3]"
                :options="options"
                placeholder="Quarta ora"
            ></b-form-select>
        </b-form-group>
        <b-button variant="primary" small block type="submit"
            >Iscriviti</b-button
        >
    </b-form>
</template>

<script>
export default {
    name: 'LabsSelectForm',
    data() {
        return {
            valid: false,
            selected: [0, 0, 0, 0],
            options: [
                {
                    value: 0,
                    text: 'Prima ora',
                    disabled: true
                },
                {
                    value: 0,
                    text: 'apple'
                },
                {
                    value: 0,
                    text: 'tomatoes'
                },
                {
                    value: 0,
                    text: 'eggs'
                }
            ]
        };
    },
    methods: {
        handleSubmit() {
            alert(1);
        }
    }
};
</script>

<style>
.v-select__selections {
    padding: 2px 0 !important;
}
</style>
