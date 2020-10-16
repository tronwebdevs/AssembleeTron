<template>
    <div
        :class="[
            'col-12 ' + (borderBottom ? 'mb-3 border-bottom' : ''),
            'lab-row-student'
        ]"
    >
        <b-row>
            <b-col cols="12" sm="5" :style="[pb]">
                <span class="font-weight-bold">
                    {{ title }}
                </span>
            </b-col>
            <b-col cols="12" sm="7">
                <p class="text-left mb-2">{{ description }}</p>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    name: 'LabListLine',
    computed: {
        pb() {
            return window.innerWidth < 999 ? '.2rem' : 0;
        }
    },
    props: {
        title: String,
        description: String,
        borderBottom: Boolean
    }
};
</script>
