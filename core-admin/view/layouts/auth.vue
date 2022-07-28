<template>
    <div>
        <Nuxt />
    </div>
</template>

<script>
export default {
    mounted() {
        document.body.classList.add("authentication-bg");
    }
};
</script>