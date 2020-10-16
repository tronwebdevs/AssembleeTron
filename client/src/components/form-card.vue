<template>
    <b-card
        class="text-center"
        :title="title"
        :header="errorMsg"
        header-text-variant="white"
        header-tag="header"
        header-bg-variant="danger"
    >
        <div v-if="loading" class="py-4">
            <b-spinner
                label="Loading"
                variant="primary"
                style="width:3rem;height:3rem"
            ></b-spinner>
        </div>
        <div v-else>
            <span class="d-block text-center text-muted mb-3 subtitle">
                {{ subtitle }}
            </span>
            <b-card-text
                :class="{ 'text-left': !centred }"
                class="pb-0 mb-1"
                v-if="text"
            >
                {{ text }}
            </b-card-text>

            <slot></slot>
        </div>
    </b-card>
</template>

<script>
export default {
    name: 'form-card',
    props: {
        title: String,
        subtitle: String,
        text: String,
        centred: Boolean,
        errorMsg: String,
        loading: Boolean
    }
};
</script>

<style scoped>
.subtitle {
    font-size: 0.8rem;
}
</style>
