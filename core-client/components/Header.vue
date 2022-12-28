<template>

    <header id="header" class="fixed-top">

        <nav class="d-block navbar navbar-expand-md bg-white">

            <div class="container d-flex align-items-center">

                <a href="/" target="_self" class="navbar-brand">

                    <nuxt-img
                        format="svg"
                        height="25"
                        src="svg/logo-tokopolis.svg"
                        alt="Tokopolis Logo"
                    />

                </a> <!-- navbar-brand ends -->

                <b-navbar-nav v-if="loggedIn && mobileView" class="flex-row ml-auto">

                    <b-nav-item-dropdown
                        class="d-flex align-items-center"
                        no-caret
                        right
                    >

                        <template #button-content>

                            <fa icon="bell" style="font-size: 18px"/>

                        </template>

                        <b-dropdown-item href="#">Notification 1</b-dropdown-item>

                        <b-dropdown-item href="#">Notification 2</b-dropdown-item>

                        <b-dropdown-item href="#">Notification 3</b-dropdown-item>

                        <b-dropdown-item href="#">Notification 4</b-dropdown-item>

                    </b-nav-item-dropdown>

                    <b-nav-item href="/profil" class="ml-3">

                        <nuxt-img
                            width="30"
                            height="30"
                            preset="default"
                            :src="photo"
                            alt="User Avatar"
                            class="rounded-circle"
                        />

                    </b-nav-item>

                    <b-nav-item v-b-toggle.navbar-sidebar class="navbar-toggler ml-3">

                        <fa icon="bars" style="font-size: 1.2rem"/>

                    </b-nav-item>

                </b-navbar-nav>

                <b-navbar-nav v-if="!loggedIn && mobileView" class="flex-row ml-auto">

                    <b-nav-item href="/login" class="d-flex align-items-center">

                        <fa icon="right-to-bracket" class="text-primary" style="font-size: 1.2rem" />

                    </b-nav-item>

                    <b-nav-item v-b-toggle.navbar-sidebar class="navbar-toggler ml-3">

                        <fa icon="bars" style="font-size: 1.2rem"/>

                    </b-nav-item>

                </b-navbar-nav>

                <b-sidebar
                    id="navbar-sidebar"
                    width="100%"
                    bg-variant="white"
                    class="position-md-relative h-md-auto flex-grow-1"
                    sidebar-class="d-md-flex flex-md-row position-md-relative h-md-auto"
                    header-class="d-md-none"
                    body-class="my-md-auto p-md-0"
                    footer-class="my-md-auto p-md-0"
                >

                    <template #header="{ hide }">

                        <button class="navbar-toggler ml-auto"  @click="hide">

                            <fa icon="xmark" style="height: 36px; font-size: 1.4rem;" />

                        </button>

                    </template>

                    <b-navbar-nav v-if="!loggedIn" class="justify-content-md-center">

                        <b-nav-item
                            v-for="(menu, id) in menusGuest"
                            :key="id"
                            :href="menu.link"
                            class="mx-md-2 mb-1 mb-md-0"
                        >
                            {{ menu.text }}
                        </b-nav-item>

                    </b-navbar-nav>
                    <b-navbar-nav v-if="loggedIn" class="justify-content-md-center">

                        <b-nav-item
                            v-for="(menu, id) in menusLogin"
                            :key="id"
                            :href="menu.link"
                            class="mx-md-2 mb-1 mb-md-0"
                        >
                            {{ menu.text }}
                        </b-nav-item>

                    </b-navbar-nav>

                    <template #footer>

                        <b-navbar-nav v-if="loggedIn && mobileView">

                            <li class="nav-item">

                                <BaseButton tag="a" classes="text-white text-uppercase" block @click="logout">Keluar</BaseButton>

                            </li>

                        </b-navbar-nav>

                        <b-navbar-nav v-if="loggedIn && !mobileView">

                            <b-nav-item-dropdown
                                toggle-class="d-flex align-items-center h-100"
                                menu-class="notification-menu border py-0"
                                no-caret
                                right
                            >

                                <template #button-content>

                                    <fa icon="bell" style="font-size: 18px"/>

                                </template>

                                <b-dropdown-text>Some example text that's free-flowing within the dropdown menu.</b-dropdown-text>

                                <b-dropdown-text>Some example text that's free-flowing within the dropdown menu.</b-dropdown-text>

                            </b-nav-item-dropdown>

                            <b-nav-item-dropdown
                                toggle-class="d-flex align-items-center h-100"
                                menu-class="py-0 border"
                                right
                                no-caret
                            >

                                <template #button-content>

                                    <nuxt-img
                                        width="30"
                                        height="30"
                                        preset="default"
                                        :src="photo"
                                        alt="User Avatar"
                                        class="rounded-circle"
                                    />

                                    <div class="ml-2">

                                        <fa icon="angle-down" />

                                    </div>

                                </template>

                                <b-dropdown-item href="/profil">Profil</b-dropdown-item>

                                <b-dropdown-item @click="logout">Keluar</b-dropdown-item>

                            </b-nav-item-dropdown>

                        </b-navbar-nav>

                        <b-navbar-nav v-if="!loggedIn">

                            <b-nav-item href="/login" class="text-center mb-1 mb-md-0 mx-md-3">Masuk</b-nav-item>

                            <li class="nav-item">

                                <BaseButton tag="a" href="/register" classes="text-uppercase" block>Daftar</BaseButton>

                            </li>

                        </b-navbar-nav>

                    </template>

                </b-sidebar>

            </div> <!-- navbar-container ends -->

        </nav>

    </header>

</template>

<script>
import cookie from 'js-cookie'

export default {
    props: {
        mobileView: {
            type: Boolean,
            default: false
        },
        loggedIn: {
            type: Boolean,
            default: false
        },
        photo: {
            type: String,
            default: 'svg/avatar-default.svg'
        }
    },
    data() {
        return {
            scrollOffset: 70,
            scrolled: false,
            menusLogin: [
                { link: "/", text: "Home" },
                { link: "/produk", text: "Produk" },
                { link: "/daftar-polis", text: "Polis" },
                { link: "/daftar-claim", text: "Claim" },
            ],
            menusGuest: [
                { link: "/", text: "Home" },
                { link: "/tentang", text: "Tentang Kami" },
                { link: "/layanan", text: "Layanan" },
                { link: "/faq", text: "FAQ" },
            ],

        }
    },
    methods: {
        handleScroll(event) {
            if (window.scrollY > this.scrollOffset) {
                this.scrolled = true;
            } else {
                this.scrolled = false;
            }
        },
        // async handleClick(){
        //     await this.$axios.$get('api/transaction')
        //         .then ((response) => {
        //             console.log(response)
        //         })
        //         .catch (error => {
        //             console.log(error)
        //         })
        // }
        // ,
        async logout(){
            await cookie.remove('token')
            await cookie.remove('photo')

            await this.$store.commit('setData', { token: null, photo: null })
            // await this.$router.app.refresh()

            this.$router.push('/')
        }
    }
}
</script>