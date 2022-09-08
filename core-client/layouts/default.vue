<template>
    <div>
        <Header :mobile-view="mobileView" :logged-in="isLoggedIn" :photo="userPhoto" />
        <NuxtChild class="main-wrapper" :mobile-view="mobileView" keep-alive />
        <Footer />
    </div>
</template>

<script>
import cookie from 'js-cookie';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default {
    components: {
        Header,
        Footer
    },
    data() {
        return {
            mobileBreakpoint: 768,
            mobileView: false,
        }
    },
    computed:{
        isLoggedIn() {
            return this.$store.state.token != null
        },
        userPhoto() {
            if(this.$store.state.photo != null && this.$store.state.photo !== 'null') {
                return this.$config.baseAPI + this.$store.state.photo;
            } else {
                return '/img/DefaultProfile.png';
            }
        }
    },
    beforeMount() {
        window.addEventListener('resize', this.handleResize);
    },
    mounted() {
        this.getUserPhoto();
        this.handleResize();
    },
    beforeDestroy() {
        window.addEventListener('resize', this.handleResize);
    },
    methods: {
        async getUserPhoto() {
            if(this.$store.state.photo === null && this.$store.state.photo === 'null') {
                await this.$axios.$get('api/user')
                .then ((response) => {
                    if (response && response.data.profile.photo != null) {
                        const photo = response.data.profile.photo;
                        
                        cookie.set('photo', photo, { expires: 1 });
                    }
                })
                .catch (error => {
                    console.log(error);
                })
            }
        },
        handleResize(event) {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            
            if (width < this.mobileBreakpoint) {
                this.mobileView = true;
            } else {
                this.mobileView = false;
            }
        }
    }
}
</script>