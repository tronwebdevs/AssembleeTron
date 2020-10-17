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
        <list-card title="Iscrizioni" :items="subsInfo">
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
import { DateTime, Settings } from 'luxon';
import listcard from '@/components/Admin/list-card';

Settings.defaultLocale = 'it';

export default {
    name: 'DashAssemblyRow',
    computed: {
        ...mapGetters('assembly', ['info']),
        infoItems() {
            return [
                {
                    title: 'Nome',
                    content: this.info.title || 'Assemblea Senza Nome'
                },
                { title: 'Data', content: this.date, extra: this.daysLeft },
                { title: 'Classi', content: this.info.sections.length }
            ];
        },
        subsInfo() {
            return [
                {
                    title: 'Stato',
                    content: this.status
                },
                {
                    title: 'Apertura',
                    content: this.open
                },
                {
                    title: 'Chiusura',
                    content: this.close
                }
            ];
        },
        date() {
            return DateTime.fromISO(this.info.date).toLocaleString(
                DateTime.DATE_SHORT
            );
        },
        status() {
            return DateTime.fromISO(this.info.subscription.open)
                .diff(DateTime.local())
                .toObject().milliseconds < 0 &&
                DateTime.fromISO(this.info.subscription.close)
                    .diff(DateTime.local())
                    .toObject().milliseconds > 0
                ? '<span class="badge badge-success">Aperte</span>'
                : '<span class="badge badge-danger">Chiuse</span>';
        },
        open() {
            return DateTime.fromISO(this.info.subscription.open).toLocaleString(
                DateTime.DATETIME_SHORT
            );
        },
        close() {
            return DateTime.fromISO(
                this.info.subscription.close
            ).toLocaleString(DateTime.DATETIME_SHORT);
        },
        daysLeft() {
            let days = Math.round(
                DateTime.fromISO(this.info.date)
                    .diff(DateTime.local(), 'days')
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
