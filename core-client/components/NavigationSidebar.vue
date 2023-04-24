<template>

    <div class="card border">

        <div class="card-header border-bottom px-0 py-3">

            <b-list-group>

                <b-list-group-item class="font-weight-bold">{{ user.name }}</b-list-group-item>

                <b-list-group-item>{{ user.email }}</b-list-group-item>

            </b-list-group>

        </div> <!-- card-header ends -->

        <div class="card-body px-0 py-3">

            <b-list-group class="list-group-root">

                <b-list-group-item v-b-toggle.my-account-collapse class="pointer chevron">

                    <fa icon="user" class="mr-3"/><span>Akun Saya</span>

                </b-list-group-item>

                <b-collapse id="my-account-collapse" :visible="!mobileView" class="list-group">

                    <b-list-group-item href="/profil">Profil</b-list-group-item>

                    <b-list-group-item href="/profil/detail-identitas">Detail Identitas</b-list-group-item>
                    <b-list-group-item href="/profil/detail-npwp">NPWP</b-list-group-item>

                    <b-list-group-item href="/profil/detail-bank">Detail Bank</b-list-group-item>

                </b-collapse>

                <b-list-group-item v-if="isAgent()" v-b-toggle.agent-collapse class="pointer chevron">

                    <fa icon="percent" class="mr-3"/><span>Agent</span>

                </b-list-group-item>

                <b-collapse v-if="isAgent()" id="agent-collapse" :visible="!mobileView" class="list-group">

                    <b-list-group-item href="/profil/komisi">Komisi</b-list-group-item>

                    <b-list-group-item href="/profil/poin">Poin</b-list-group-item>

                </b-collapse>

                <!-- <b-list-group-item href="#">

                    <fa icon="award" class="mr-3"/><span>Reward</span>

                </b-list-group-item> -->

                <b-list-group-item v-if="!isAgent()" href="/profil/poin">

                    <fa icon="award" class="mr-3"/><span>Poin Reward</span>

                </b-list-group-item>

                <b-list-group-item href="/profil/ganti-password">

                    <fa icon="lock" class="mr-3"/><span>Ganti Password</span>

                </b-list-group-item>

            </b-list-group>

        </div> <!-- card-body ends -->

    </div> <!-- card ends -->

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
