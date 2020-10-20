<template>
    <b-card class="mb-1 mb-md-4 p-3" no-body>
        <div class="d-flex align-items-center">
            <span :class="['mr-3 stamp text-white', 'bg-' + iconBg]"
                ><b-icon :icon="icon"></b-icon
            ></span>
            <div>
                <h3>
                    <router-link :to="{ name: to }">
                        {{ title }} <small>{{ subtitle }}</small>
                    </router-link>
                </h3>
            </div>
        </div>
    </b-card>
</template>

<script>
export default {
    name: 'StampCard',
    props: {
        title: String,
        subtitle: String,
        to: String,
        icon: String,
        iconBg: String
    }
};
</script>

<style scoped lang="scss">
@import '~bootstrap';

.stamp {
    padding: $spacer * 0.5 $spacer * 0.75;
    border-radius: $spacer * 0.25;

    &.bg-blue {
        background-color: $blue;
    }
    &.bg-indigo {
        background-color: $indigo;
    }
    &.bg-purple {
        background-color: $purple;
    }
    &.bg-pink {
        background-color: $pink;
    }
    &.bg-red {
        background-color: $red;
    }
    &.bg-orange {
        background-color: $orange;
    }
    &.bg-yellow {
        background-color: $yellow;
    }
    &.bg-green {
        background-color: $green;
    }
    &.bg-teal {
        background-color: $teal;
    }
    &.bg-cyan {
        background-color: $cyan;
    }
}

h3 {
    margin: 0;
    padding: 0;
    font-size: 1.8rem;
    font-weight: bold;

    small {
        font-size: 0.9rem;
    }

    a,
    small,
    a:hover {
        color: $black;
    }
}
</style>
