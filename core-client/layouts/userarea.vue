<template>

  <div>

    <Header :mobile-view="mobileView" :logged-in="isLoggedIn" :photo="userPhoto" />

    <main class="main-wrapper" style="background-color: #f6f5fc">

        <div class="container py-5 py-md-6">

            <div class="row">

                <div class="col-12 col-md-4 mb-3 mb-md-5">

                    <NavigationSidebar :user="user" :mobile-view="mobileView"/>

                </div> <!-- col-12.col-md-4 ends -->

                <div class="col-12 col-md-8">

                    <NuxtChild keep-alive />

                </div> <!-- col-12.col-md-8 ends -->

            </div> <!-- row ends -->

        </div> <!-- container ends -->

    </main>

    <Footer />

  </div>

</template>

<script>
import cookie from 'js-cookie';

export default {
    middleware: 'auth',
    data() {
        return {
            user: {
                name: '-',
                email: '-'
            },
            mobileBreakpoint: 972,
            mobileView: false
        }
    },
    computed:{
        isLoggedIn() {
            return this.$store.state.token != null
        },
        userPhoto() {
            if(this.$store.state.photo != null && this.$store.state.photo !== 'null') {
                return this.$config.serverURL+this.$store.state.photo;
            } else {
                return '/svg/avatar-default.svg';
            }
        }
    },
    beforeMount() {
        window.addEventListener('resize', this.handleResize);
    },
    mounted(){
        this.getProfileData();
        this.getUserPhoto();
        this.handleResize();
    },
    beforeDestroy() {
        window.addEventListener('resize', this.handleResize);
    },
    methods :{
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
        async getProfileData() {
            await this.$axios.$get('api/user')
                .then ((response) => {
                    if (response) {
                        this.user.name = response.data.fullname
                        this.user.email = response.data.email
                    }
                })
                .catch (error => {
                    console.log(error);
                    return null;
                })
        },
        handleResize(event) {
            if (document.documentElement.clientWidth < this.mobileBreakpoint) {
                this.mobileView = true;
            } else {
                this.mobileView = false;
            }
        }
    }
}
</script>
