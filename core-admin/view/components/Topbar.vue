<template>
    <header id="page-topbar">
        <div class="navbar-header">
            <div class="d-flex">
                <!-- LOGO -->
                <div class="navbar-brand-box">
                    <nuxt-link to="/" class="logo logo-dark">
                        <span class="logo-sm">
                            <img src="~/assets/images/logo-sm.png" alt height="22" />
                        </span>
                        <span class="logo-lg">
                            <img src="~/static/svg/logo-tokopolis.svg" alt height="30" />
                        </span>
                    </nuxt-link>

                    <nuxt-link to="/" class="logo logo-light">
                        <span class="logo-sm">
                            <img src="~/assets/images/logo-sm.png" alt height="22" />
                        </span>
                        <span class="logo-lg">
                            <img src="~/static/svg/logo-tokopolis.svg" alt height="30" />
                        </span>
                    </nuxt-link>
                </div>

                <button id="vertical-menu-btn" type="button" class="btn btn-sm px-3 font-size-16 header-item vertical-menu-btn" @click="toggleMenu">
                    <i class="fa fa-fw fa-bars"></i>
                </button>

                <!-- App Search-->
                <!-- <form class="app-search d-none d-lg-block">
                    <div class="position-relative">
                        <input type="text" class="form-control" :placeholder="$t('navbar.search.text')" />
                        <span class="uil-search"></span>
                    </div>
                </form> -->
            </div>

            <div class="d-flex">
                <b-dropdown variant="white" class="d-inline-block d-lg-none ms-2" toggle-class="header-item noti-icon" right menu-class="dropdown-menu-lg p-0 dropdown-menu-end">
                    <template #button-content>
                        <i class="uil-search"></i>
                    </template>
                    <form class="p-3">
                        <div class="form-group m-0">
                            <div class="input-group">
                                <input type="text" class="form-control" :placeholder="$t('navbar.search.text')" aria-label="Recipient's username" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="submit">
                                        <i class="mdi mdi-magnify"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </b-dropdown>

                <!-- <b-dropdown variant="white" right toggle-class="header-item">
                    <template #button-content>
                        <img class :src="flag" alt="Header Language" height="16" />
                        {{text}}
                    </template>
                    <b-dropdown-item v-for="(entry, i) in languages" :key="`Lang${i}`" class="notify-item" :value="entry" :link-class="{'active': entry.language === current_language}" @click="setLanguage(entry.language, entry.title, entry.flag)">
                        <img :src="`${entry.flag}`" alt="user-image" class="me-1" height="12" />
                        <span class="align-middle">{{ entry.title }}</span>
                    </b-dropdown-item>
                </b-dropdown> -->

                <b-dropdown class="d-inline-block" toggle-class="header-item" right variant="white" menu-class="dropdown-menu-end">
                    <template #button-content>
                        <img class="rounded-circle header-profile-user" src="~/static/img/DefaultProfile.png" alt="Header Avatar" />
                        <span class="d-none d-xl-inline-block ms-1 fw-medium font-size-15">Administrator</span>
                        <i class="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
                    </template>

                    <!-- item-->
                    <a class="dropdown-item" href="#">
                        <i class="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>
                        <span class="align-middle">{{ $t('navbar.dropdown.marcus.list.profile') }}</span>
                    </a>
                    <a class="dropdown-item d-block" href="#">
                        <i class="uil uil-cog font-size-18 align-middle me-1 text-muted"></i>
                        <span class="align-middle">{{ $t('navbar.dropdown.marcus.list.settings') }}</span>
                        <span class="badge bg-soft-success rounded-pill mt-1 ms-2">03</span>
                    </a>
                    <a class="dropdown-item" href="#" @click="logout">
                        <i class="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
                        <span class="align-middle">{{ $t('navbar.dropdown.marcus.list.logout') }}</span>
                    </a>
                </b-dropdown>
            </div>
        </div>
    </header>
</template>

<script>
/**
 * Topbar component
 */
export default {
    data() {
        return {
            languages: [{
                    flag: require("~/assets/images/flags/us.jpg"),
                    language: "en",
                    title: "English",
                },
                {
                    flag: require("~/assets/images/flags/indonesia.png"),
                    language: "id",
                    title: "Indonesia",
                },
                /*
                {
                    flag: require("~/assets/images/flags/spain.jpg"),
                    language: "es",
                    title: "spanish",
                },
                {
                    flag: require("~/assets/images/flags/china.png"),
                    language: "zh",
                    title: "Chinese",
                },
                {
                    flag: require("~/assets/images/flags/arabic.png"),
                    language: "ar",
                    title: "Arabic",
                },
                */
            ],
            current_language: this.$i18n.locale,
            text: null,
            flag: null,
            value: null,
        };
    },
    mounted() {
        this.value = this.languages.find((x) => x.language === this.$i18n.locale);
        this.text = this.value.title;
        this.flag = this.value.flag;
    },
    methods: {
        toggleMenu() {
            this.$parent.toggleMenu();
        },
        setLanguage(locale, country, flag) {
            this.$i18n.locale = locale;
            this.current_language = locale;
            this.text = country;
            this.flag = flag;
        },
        logout() {
            this.$logoutAccount()
        }
    },
};
</script>
