<template>
    <authed-wrapper>
        <b-row>
            <b-col cols="12" lg="4">
                <StampCard
                    icon="list-ul"
                    iconBg="blue"
                    :title="String(stats.labs)"
                    subtitle="Laboratori"
                    to="Admin/Labs"
                />
            </b-col>
            <b-col cols="12" lg="4">
                <StampCard
                    icon="people"
                    iconBg="green"
                    :title="String(stats.subs)"
                    subtitle="Partecipanti"
                    to="Admin/Stats"
                />
            </b-col>
            <b-col cols="12" lg="4">
                <StampCard
                    icon="people"
                    iconBg="red"
                    :title="String(stats.students)"
                    subtitle="Studenti"
                    to="Admin/Stats"
                />
            </b-col>
        </b-row>
        <AssemblyInfo />
        <b-row>
            <NewAssemblyHelp />
            <ExportAssemblyHelp />
        </b-row>
    </authed-wrapper>
</template>

<script>
import { mapGetters } from 'vuex';
import authedwrapper from '@/components/Admin/authed-wrapper';
import StampCard from '@/components/Admin/StampCard';
import AssemblyInfo from '@/components/Admin/AssemblyInfo/';
import NewAssemblyHelp from '@/components/Admin/Help/NewAssembly';
import ExportAssemblyHelp from '@/components/Admin/Help/ExportAssembly';

export default {
    name: 'Dashboard',
    computed: {
        ...mapGetters('assembly', ['stats'])
    },
    components: {
        'authed-wrapper': authedwrapper,
        StampCard,
        AssemblyInfo,
        NewAssemblyHelp,
        ExportAssemblyHelp
    }
};
</script>

<style scoped lang="scss">
div.student_div {
    text-align: left;
    max-width: 400px;
    display: inline-block;
    padding: 20px;
    background-color: gainsboro;
}
b.error {
    display: block;
    margin: 20px 0;
    color: red;
}
</style>
