<template>
    <b-card no-body>
        <template v-slot:header>
            <div @click="collapse = !collapse">
                Lista dei laboratori
                <small v-if="!collapse && mobile" class="text-muted ml-2">
                    (clicca per aprire)
                </small>
                <b-button variant="link" class="collapseSwitch">
                    <b-icon-chevron-up v-if="collapse"></b-icon-chevron-up>
                    <b-icon-chevron-down v-else></b-icon-chevron-down>
                </b-button>
            </div>
        </template>

        <b-collapse id="collapse" v-model="collapse">
            <div class="p-4">
                <LabListLine
                    v-for="(lab, index) in labs_available"
                    :borderBottom="index + 1 != labs_available.length"
                    :title="lab.title"
                    :description="lab.description"
                    :key="lab._id"
                />
            </div>
        </b-collapse>
    </b-card>
</template>

<script>
import { mapGetters } from 'vuex';
import LabListLine from '@/components/Student/LabListLine';

export default {
    name: 'LabsList',
    data() {
        return {
            collapse: window.innerWidth > 999
        };
    },
    computed: {
        ...mapGetters('student', ['labs_available']),
        mobile() {
            return window.innerWidth <= 999;
        }
    },
    components: {
        LabListLine
    }
};
</script>

<style scoped lang="scss">
button.collapseSwitch {
    position: absolute;
    right: 10px;
    top: 5px;
}
</style>
