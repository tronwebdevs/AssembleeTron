<template>
    <b-col cols="12" lg="4" class="mb-3 mb-lg-0">
        <b-card>
            <template v-slot:header>
                {{ title }}
            </template>
            <ul class="list-unstyled">
                <li v-for="(item, index) in items" :key="index">
                    <b-row class="align-items-center">
                        <b-col :cols="item.colSize || '3'">
                            {{ item.title }}
                        </b-col>
                        <b-col
                            >{{ item.text }}
                            <small className="text-muted">
                                {{ item.extra }}
                            </small></b-col
                        >
                    </b-row>
                </li>
            </ul>
            <slot name="buttons"> </slot>
        </b-card>
    </b-col>
</template>

<script>
export default {
    name: 'list-card',
    props: {
        title: String,
        items: Array
    }
};
</script>
