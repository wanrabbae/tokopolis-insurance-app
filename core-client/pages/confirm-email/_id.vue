<template>
    <div class="container">
        <div style="margin: 150px">
            <b-img v-if="isVerified" center src="/svg/success.svg" width="200" height="200" alt="Center image"></b-img>
            <b-img v-if="!isVerified" center src="/svg/error.svg" width="200" height="200" alt="Center image"></b-img>
            <div v-if="isVerified"  class="text-center fw-bold h3" style="width: 100%;">
                Email Verified Successfully.
            </div>
            <div v-if="!isVerified"  class="text-center fw-bold h3 mt-3" style="width: 100%;">
                Email failed to verify.
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isVerified: null
        }
    },
    mounted() {
        this.verifyEmail()
    },
    methods: {
        async verifyEmail() {
            const id = this.$route.params.id;
            if (id !== null) {
                const decodedId = atob(id);
                await this.$axios.$get(`/api/confirm-email/${decodedId}`)
                    .then((resp) => {
                        if (resp.message?.toLowerCase() === "aksi berhasil") {
                            this.isVerified = true;
                        } else {
                            this.isVerified = false;
                        }
                    })
            }
        }
    }
}
</script>