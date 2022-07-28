<template>
    <b-card no-body>
        <b-card-header class="border-bottom px-0">
            <b-list-group>
                <b-list-group-item class="font-weight-bold">{{ user.name }}</b-list-group-item>
                <b-list-group-item>{{ user.email }}</b-list-group-item>
            </b-list-group>
            <div class="list-group"> 
            </div>
        </b-card-header>
        <b-card-body class="px-0">
            <b-list-group class="list-group-root">
                <b-list-group-item v-b-toggle.my-account-collapse class="pointer chevron">
                    <fa icon="user" class="mr-3"/><span>Akun Saya</span>
                </b-list-group-item>
                
                <b-collapse id="my-account-collapse" :visible="!mobileView" class="list-group">
                    <b-list-group-item href="/profil">Profil</b-list-group-item>
                    <b-list-group-item href="/profil/detail-identitas">Detail Identitas</b-list-group-item>
                    <b-list-group-item href="/profil/detail-bank">Detail Bank</b-list-group-item>
                </b-collapse>

                <b-list-group-item href="#">
                    <fa icon="award" class="mr-3"/><span>Reward</span>
                </b-list-group-item>
                <b-list-group-item href="/profil/ganti-password">
                    <fa icon="lock" class="mr-3"/><span>Ganti Password</span>
                </b-list-group-item>
            </b-list-group>
        </b-card-body>
    </b-card>
</template>

<script>
export default {
    props: {
        user: {
            type: Object,
            default() {
                return {
                    email: "-",
                    name: "-"
                 }
            }
        },
        mobileView: {
            type: Boolean,
            default: false
        }
    }
}
</script>