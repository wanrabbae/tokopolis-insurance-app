<template>
    <div>
        <section class="bg-primary py-5">
            <b-container class="my-3">
                <h1 class="text-center text-white mb-4">Halo, ada yang bisa kami bantu?</h1>

                <b-row class="justify-content-center">
                    <b-col cols="8">
                        <b-form>
                            <b-form-group class="mb-0">
                                <b-input-group class="bg-white rounded">
                                    <input
                                        v-model="search"
                                        placeholder="Cari Asuransi"
                                        class="form-control bg-transparent border-0"
                                        :class="{'is-invalid': invalid && validated}"
                                        required
                                    >

                                    <b-input-group-append class="d-flex align-items-center">
                                        <BaseButton
                                            type="white"
                                            native-type="submit"
                                            class="px-3 bg-transparent border-0 shadow-none"
                                        >
                                            <fa icon="search"/>
                                        </BaseButton>
                                    </b-input-group-append>
                                </b-input-group>
                            </b-form-group>
                        </b-form>
                    </b-col>
                </b-row>
            </b-container>
        </section>

        <section class="my-5">
            <b-container>
                <h1 class="text-center mb-5">Frequently Asked Question</h1>

                <b-row align-h="center">
                    <b-col v-for="(question, index) in questions" :key="index" cols="4" class="mb-4">
                        <a href="#">
                            <b-card bg-variant="white" align="center" class="h-100" body-class="d-flex justify-content-center align-items-center">
                                {{ question }}
                            </b-card>
                        </a>
                    </b-col>
                </b-row>
            </b-container>
        </section>

        <section class="my-5">
            <b-container class="bv-example-row">
                <h1 class="text-center mb-5">Kategori</h1>

                <b-row align-h="center" class="px-0 px-md-5 mx-0 mx-md-5">
                    <b-col v-for="(card, index) in questionCategoryCards" :key="index" cols="4" class="mb-4">
                        <a :href="card.link">
                            <b-card bg-variant="white" align="center" class="h-100 py-3">
                                <b-card-img :src="card.icon" :alt="card.text" class="mb-4" style="max-width: 130px"></b-card-img>
                                <b-card-title title-tag="h5" class="mb-0">{{ card.text }}</b-card-title>
                            </b-card>
                        </a>
                    </b-col>
                </b-row>
            </b-container>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: 'FAQ',
            search: null,
            questions: [
                "Bagaimana Cara Mendaftar Di PIQO?",
                "Bagaimana Cara Melihat Asuransi yang tersedia?",
                "Metode pembayaran apa saja yang bisa digunakan untuk membeli asuransi dari PIQO?",
                "Apa yang harus saya lakukan jika kontrak Polis saya hilang atau rusak?",
                "Apa maksud dari Asuransi Kendaraan TLO?",
                "Bagaimana jika mobil yang saya beli sudah memiliki asuransi?"
            ],
            questionCategoryCards: [
                {
                    icon: "svg/question.svg",
                    text: "Pertanyaan Umum",
                    link: "#"
                },
                {
                    icon: "svg/smartphone.svg",
                    text: "Pertanyaan Asuransi Smartphone",
                    link: "#"
                },
                {
                    icon: "svg/mobil.svg",
                    text: "Pertanyaan Asuransi Mobil",
                    link: "#"
                },
                {
                    icon: "svg/motor.svg",
                    text: "Pertanyaan Asuransi Motor",
                    link: "#"
                },
                {
                    icon: "svg/kesehatan.svg",
                    text: "Pertanyaan Asuransi Kesehatan",
                    link: "#"
                },
                {
                    icon: "svg/santunan.svg",
                    text: "Pertanyaan Asuransi Santunan Tunai",
                    link: "#"
                },
                {
                    icon: "svg/jiwa.svg",
                    text: "Pertanyaan Asuransi Kesehatan",
                    link: "#"
                },
                {
                    icon: "svg/penyakit-tropis.svg",
                    text: "Pertanyaan Asuransi Penyakit Tropis",
                    link: "#"
                },
                {
                    icon: "svg/perjalanan.svg",
                    text: "Pertanyaan Asuransi Perjalanan",
                    link: "#"
                }
            ],
        }
    },
    head() {
        return {
            titleTemplate: `${this.title} | %s`,
        }
    }
}
</script>
