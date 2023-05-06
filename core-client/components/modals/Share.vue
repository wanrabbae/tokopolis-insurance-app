/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */
<template>

    <b-modal v-bind="$attrs" hide-header centered body-class="p-4" @ok="okHandler">

        <div class="text-left">
            <h4 class="mb-3">Bagikan Polis</h4>
            <hr>
        </div>

        <div>
            <p>Bagikan link via</p>
            <p>
            <div class="row">
                <div class="col-md-2">
                    <div class="border rounded-circle border-success p-2">
                        <a :href="`https://api.whatsapp.com/send?text=Nasabah yang terhormat, %0D%0A%0D%0ABerikut kami sampaikan proposal penawaran sesuai dengan kebutuhan asuransi yang anda minta. %0D%0ALink : ${$config.serverURL}${epolicy} . %0D%0ABesar harapan kami atas kepercayaan yang anda berikan. %0D%0A%0D%0ATerima Kasih. %0D%0A%0D%0ARegards, %0D%0A%0D%0ATeam Tokopolis.`" target="_blank">
                            <img src="/img/whatsapp.png" width="50px" height="50px" />
                        </a>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="border rounded-circle border-danger p-2">
                        <a :href="`mailto:?subject=@t&body=Nasabah yang terhormat, %0D%0DBerikut kami sampaikan proposal penawaran sesuai dengan kebutuhan asuransi yang anda minta. %0DLink : ${$config.serverURL}${epolicy} . %0DBesar harapan kami atas kepercayaan yang anda berikan. %0D%0DTerima Kasih. %0D%0DRegards, %0D%0DTeam Tokopolis.`">
                            <img src="/img/gmail.png" width="50px" height="50px" />
                        </a>
                    </div>
                </div>
            </div>
            </p>
            <p class="mt-3">Copy Link</p>
            <p>
            <div class="input-group mb-3">
                <span class="input-group-text rounded-0 border-right-0">
                    <img src="/img/link.png" width="15px" height="15px" />
                </span>
                <input ref="url" type="text" class="form-control border-left-0" readonly :value="`${$config.serverURL}${epolicy}`">
                <button class="btn btn-primary rounded-0" type="button" @click="copyUrl()">Copy</button>
            </div>
            </p>
            <p class="mt-3">Atau Cetak Pdf</p>
            <p>
            <div class="row">
                <div class="col-md-2">
                    <div class="border rounded-circle border-danger p-2 bg-danger">
                        <a :href="$config.apiURL + epolicy" target="_blank" :disabled="epolicy === undefined || epolicy === null">
                            <img src="/img/pdf.png" width="50px" height="50px" />
                        </a>
                    </div>
                </div>
            </div>
            </p>
        </div>

        <template #modal-footer="{ ok }">

            <BaseButton :disabled="model.name == ''" block @click="ok()">Close</BaseButton>

        </template>
    </b-modal>

</template>

<script>
import BaseButton from '../BaseButton'

export default {
    components: {
        BaseButton
    },
    props: [
        'epolicy', 'idpolis'
    ],
    data() {
        return {
            model: {
                value: '0',
                bank: 'Bank Mandiri',
                rekening: '12345678',
                nama_rekening: 'John Doe',
                link: `mailto:?subject=@t&body=Nasabah yang terhormat, \n\nBerikut kami sampaikan proposal penawaran sesuai dengan 
                kebutuhan asuransi yang anda minta. \nLink : ${this.$config.serverURL}${this.idpolis} . Besar harapan kami 
                atas kepercayaan yang anda berikan. \n\nTerima Kasih. \n\nRegards, \n\nTeam Tokopolis.`,
                // idpolis: this.$props.idpolis,
                description: `
                Nasabah yang terhormat, 
                        
                Berikut kami sampaikan proposal penawaran sesuai dengan kebutuhan asuransi yang anda minta. 
                Link : ${this.$config.serverURL}${this.idpolis} . Besar harapan kami atas kepercayaan yang anda berikan. 
                        
                Terima Kasih. 
                        
                Regards,
                        
                Team Tokopolis.
                        `
            }
        }
    },
    methods: {
        okHandler(bvModalEvt) {
            this.$emit('close')
        },
        openWhatsappAction() {
            console.log('opened');
        },
        async copyUrl() {
            await navigator.clipboard.writeText(this.$refs.url.value);
        }
    }
}
</script>