<template>
    <b-row>
        <list-card title="Informazioni" :items="infoItems">
            <template v-slot:buttons>
                <router-link
                    :to="{ name: 'Admin/Info' }"
                    v-slot="{ href, navigate }"
                >
                    <b-button
                        variant="outline-primary"
                        block
                        :href="href"
                        @click="navigate"
                        >Vedi</b-button
                    >
                </router-link>
            </template>
        </list-card>
        <list-card title="Iscrizioni" :items="infoItems">
            <template v-slot:buttons>
                <router-link
                    :to="{ name: 'Admin/Stats' }"
                    v-slot="{ href, navigate }"
                >
                    <b-button
                        variant="outline-info"
                        block
                        :href="href"
                        @click="navigate"
                        >Vedi</b-button
                    >
                </router-link>
            </template>
        </list-card>
        <b-col cols="12" lg="4">
            <b-card>
                <template v-slot:header>
                    Elimina assemblea
                </template>
                <p>
                    Rimuovi tutti i laboratori, gli iscritti ed elimina
                    l'assemblea (necessario prima di creare una nuova assemblea)
                </p>
                <router-link
                    :to="{ name: 'Admin/Delete' }"
                    v-slot="{ href, navigate }"
                >
                    <b-button
                        variant="outline-danger"
                        block
                        :href="href"
                        @click="navigate"
                        >Elimina</b-button
                    >
                </router-link>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { mapGetters } from 'vuex';
import { DateTime } from 'luxon';
import listcard from '@/components/Admin/list-card';

export default {
    name: 'DashAssemblyRow',
    computed: {
        ...mapGetters('assembly', ['info']),
        infoItems() {
            return [
                {
                    title: 'Nome',
                    text: this.info.title || 'Assemblea Senza Nome'
                },
                { title: 'Data', text: this.date, extra: this.daysLeft },
                { title: 'Classi', text: this.info.sections.length }
            ];
        },
        date() {
            return DateTime.fromISO(this.info.date)
                .setLocale('it')
                .toLocaleString(DateTime.DATE_SHORT);
        },
        daysLeft() {
            let days = Math.round(
                DateTime.fromISO(this.info.date)
                    .setLocale('it')
                    .diff(DateTime.local().setLocale('it'), 'days')
                    .toObject().days
            );
            return '(' + days + ' giorni)';
        }
    },
    components: {
        'list-card': listcard
    }
};
</script>
