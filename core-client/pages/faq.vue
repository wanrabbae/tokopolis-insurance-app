<template>
    <div>
        <section class="bg-dark-blue" style="padding: 82px 0 110px 0">
            <b-container>
                <h1 class="text-center text-white mb-5">Halo, ada yang bisa kami bantu?</h1>

                <b-row class="justify-content-center">
                    <b-col cols="11">
                        <b-form>
                            <b-form-group class="mb-0">
                                <b-input-group class="d-flex align-items-center justify-content-center bg-white rounded-lg" style="padding: 14px 20px">
                                    <input
                                        v-model="search"
                                        placeholder="Cari Polis"
                                        class="form-control bg-transparent border-0 p-0"
                                        style="font-size: 24px"
                                        required
                                    >

                                    <b-input-group-append class="d-flex align-items-center">
                                        <BaseButton
                                            type="secondary"
                                            native-type="submit"
                                            class="bg-transparent border-0 shadow-none p-0"
                                        >
                                            <fa :icon="['fas', 'magnifying-glass']" style="width: 28px; height: 28px; color: #707070"/>
                                        </BaseButton>
                                    </b-input-group-append>
                                </b-input-group>
                            </b-form-group>
                        </b-form>
                    </b-col>
                </b-row>
            </b-container>
        </section>

        <br>
        <br>

        <section class="my-5">
            <b-container>
                <h1 class="text-center mb-5">Frequently Asked Question</h1>

                <b-row align-h="center">
                    <b-col v-for="(question, index) in questions" :key="index" cols="12" md="6" lg="4" class="mb-4">
                        <a id="faq-question" href="#">
                            <b-card bg-variant="white" align="center" class="h-100 rounded-lg" body-class="d-flex justify-content-center align-items-center" style="box-shadow: 0 3px 6px rgb(0 0 0 / 16%)">
                                <span>{{ question }}</span>
                            </b-card>
                        </a>
                    </b-col>
                </b-row>
            </b-container>
        </section>

        <br>
        <br>

        <section class="my-5">
            <b-container class="bv-example-row">
                <h1 class="text-center mb-5">Kategori</h1>

                <b-row align-h="center">
                    <b-col v-for="(card, index) in questionCategoryCards" :key="index" cols="12" md="6" lg="4" class="mb-4">
                        <a id="faq-category" :href="card.link">
                            <b-card bg-variant="white" align="center" class="h-100 rounded-lg" style="box-shadow: 0 3px 6px rgb(0 0 0 / 16%)">
                                <b-card-img :src="card.icon" :alt="card.text" class="mb-1 mx-auto" style="max-width: 200px"></b-card-img>
                                <p class="mt-3 mb-0">{{ card.text }}</p>
                            </b-card>
                        </a>
                    </b-col>
                </b-row>
            </b-container>
        </section>

        <br>
        <br>

    </div>
</template>

<script>
export default {
    data() {
        return {
            title: 'FAQ',
            search: null,
            questions: [
                "Bagaimana Cara Mendaftar Di Tokopolis?",
                "Bagaimana Cara Melihat Asuransi yang tersedia?",
                "Metode pembayaran apa saja yang bisa digunakan untuk membeli asuransi dari Tokopolis?",
                "Apa yang harus saya lakukan jika kontrak Polis saya hilang atau rusak?",
                "Apa maksud dari Asuransi Kendaraan TLO?",
                "Bagaimana jika mobil yang saya beli sudah memiliki asuransi?"
            ],
            questionCategoryCards: [
                {
                    icon: "svg/new/Icon Pertanyaan Umum.svg",
                    text: "Pertanyaan Umum",
                    link: "#"
                },
                {
                    icon: "svg/new/polis-smartphone.svg",
                    text: "Pertanyaan Asuransi Smartphone",
                    link: "#"
                },
                {
                    icon: "svg/car.svg",
                    text: "Pertanyaan Asuransi Mobil",
                    link: "#"
                },
                {
                    icon: "svg/new/polis-motocycle.svg",
                    text: "Pertanyaan Asuransi Motor",
                    link: "#"
                },
                {
                    icon: "svg/new/polis-health.svg",
                    text: "Pertanyaan Asuransi Kesehatan",
                    link: "#"
                },
                {
                    icon: "svg/new/Icon Polis Santunan Tunai.svg",
                    text: "Pertanyaan Asuransi Santunan Tunai",
                    link: "#"
                },
                {
                    icon: "svg/new/polis-life.svg",
                    text: "Pertanyaan Asuransi Kesehatan",
                    link: "#"
                },
                {
                    icon: "svg/new/Icon Polis Penyakit Tropis.svg",
                    text: "Pertanyaan Asuransi Penyakit Tropis",
                    link: "#"
                },
                {
                    icon: "svg/new/Icon Polis Perjalanan.svg",
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

<style lang="scss" scoped>
h1 {
    font-size: 3rem;
}

#faq-question {
    .card {
        font-size: 24px;
        color: #221A29;
        font-weight: 500;
        &:hover {
            color: #FF7900 !important;
        }
    }
}

#faq-category {
    .card {
        font-size: 24px;
        color: #221A29;
        font-weight: 500;
        &:hover {
            color: #FF7900 !important;
        }
    }
}
</style>
