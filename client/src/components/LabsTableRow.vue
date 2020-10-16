<template>
    <b-col cols="12" :class="{ 'mb-3 border-bottom': borderBottom }">
        <b-row>
            <b-col cols="3" class="py-2 pr-0">
                <span class="text-muted d-block text-center">
                    Ora {{ index + 1 }}:
                </span>
            </b-col>
            <b-col cols="9" class="py-2 pl-0">
                <b-row>
                    <b-col cols="12">
                        <span class="d-block">
                            {{ lab.title }}
                        </span>
                    </b-col>
                    <b-col cols="12">
                        <span class="d-block text-muted">
                            Aula: {{ lab.room }}
                        </span>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-col>
</template>

<script>
export default {
    name: 'LabsTableRow',
    props: {
        lab: Object,
        index: Number,
        borderBottom: Boolean
    }
};
</script>
