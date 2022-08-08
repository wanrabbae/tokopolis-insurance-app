<template>
    
    <header id="header">
        
        <nav
            class="navbar navbar-expand-lg d-block"
            :class="[
                { ['fixed-lg-top']: transparent },
                transparent && !scrolled && !mobileView ? 'bg-transparent border-bottom-0' : 'bg-white',
            ]"
        >

            <div class="navbar-container d-flex align-items-center">

                <a href="/" target="_self" class="navbar-brand">
                    
                    <TokopolisLogo class="text-primary" height="38px"/>
                
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
        
                        <b-img :src="photo" class="avatar" />
        
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
                    class="position-lg-relative h-lg-auto flex-grow-1"
                    sidebar-class="d-lg-flex flex-lg-row position-lg-relative h-lg-auto"
                    header-class="d-lg-none"
                    body-class="my-lg-auto p-lg-0"
                    footer-class="my-lg-auto p-lg-0"
                >
                    
                    <template #header="{ hide }">
                        
                        <button class="navbar-toggler ml-auto"  @click="hide">
                            
                            <fa icon="xmark" style="height: 36px; font-size: 1.4rem;" />
                        
                        </button>
                    
                    </template>

                    <b-navbar-nav class="justify-content-lg-center">
                        
                        <b-nav-item 
                            v-for="(menu, id) in menus" 
                            :key="id" 
                            :href="menu.link" 
                            class="mx-lg-2 mb-1 mb-lg-0"
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
                                    
                                    <b-img :src="photo" class="avatar" />
                                    
                                    <div class="ml-2">
    
                                        <fa icon="angle-down" />
                                    
                                    </div>
                                
                                </template>
                                 <b-dropdown-item @click.once="handleClick">Test</b-dropdown-item>
                                <b-dropdown-item href="/profil">Profil</b-dropdown-item>

                                <b-dropdown-item @click="logout">Keluar</b-dropdown-item>
                
                            </b-nav-item-dropdown>
                        
                        </b-navbar-nav>

                        <b-navbar-nav v-if="!loggedIn">
                            
                            <b-nav-item href="/login" class="text-center mb-1 mb-lg-0 mx-lg-3">Masuk</b-nav-item>
                            
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
import TokopolisLogo from '../assets/svg/tokopolis-logo.svg'

export default {
    components: {
        TokopolisLogo
    },
    props: {
        mobileView: {
            type: Boolean,
            default: false
        },
        transparent: {
            type: Boolean,
            default: false
        },
        loggedIn: {
            type: Boolean,
            default: false
        },
        photo: {
            type: String,
            default: '/img/DefaultProfile.png'
        }
    },
    data() {
        return {
            scrollOffset: 70,
            scrolled: false,
            menus: [
                { link: "/", text: "Home" },
                { link: "/produk", text: "Produk" },
                { link: "/daftar-polis", text: "Polis" },
                { link: "/daftar-claim", text: "Claim" },
            ]
        }
    },
    beforeMount() {
        if(this.transparent) window.addEventListener('scroll', this.handleScroll);
    },
    mounted() {
        if (this.transparent) this.handleScroll();
    },
    beforeDestroy() {
        if (this.transparent) window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll(event) {
            if (window.scrollY > this.scrollOffset) {
                this.scrolled = true;
            } else {
                this.scrolled = false;
            }
        },
        async handleClick(){
            await this.$axios.$get('api/transaction')
                .then ((response) => {
                    console.log(response)
                })
                .catch (error => {
                    console.log(error)
                })
        }
        ,
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