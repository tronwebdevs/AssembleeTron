<template>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.prevent="handleSubmit"
        class="pa-6"
    >
        <v-select :items="items" label="Prima ora" class="pb-0" outlined filled
            ><template slot="selection" slot-scope="data">
                <!-- HTML that describe how select should render selected items -->
                {{ data.item.name }} - {{ data.item.description }}
            </template></v-select
        >
        <v-select
            :items="items"
            label="Seconda ora"
            class="pb-0"
            outlined
            filled
        ></v-select>
        <v-select
            :items="items"
            label="Terza ora"
            class="pb-0"
            outlined
            filled
        ></v-select>
        <v-select
            :items="items"
            label="Quarta ora"
            class="pb-0"
            outlined
            filled
        ></v-select>
        <v-btn color="primary" elevation="0" small block type="submit"
            >Iscriviti</v-btn
        >
    </v-form>
</template>

<script>
export default {
    name: 'LabsSelectForm',
    data() {
        return {
            valid: false,
            items: ['apple', 'orange', 'tomatoes', 'eggs']
        };
    }
};
</script>

<style>
.v-select__selections {
    padding: 2px 0 !important;
}
</style>
