<template>
    <div>
        <section id="about-hero">
            <b-img src="/img/about.png"></b-img>
        </section>

        <section id="about" class="my-5">
            <b-container>
                <h1 class="mb-4">Apa itu PIQO?</h1>

                <div class="mb-4">
                    <ul>
                        <li>Asisten terbaikmu untuk kebutuhan asuransi dan rencana keuangan </li>
                        <li> Virtual Konsultan terbaik untuk pembelian hingga proses pengajuan klaim asuransi mu</li>
                        <li>Platform marketplace asuransi terbaik untuk membandingkan asuransi, menampilkan harga dan manfaat terbaik sesuai kebutuhan asuransimu.</li>
                        <li>Polis management yang user friendly, memudahkan kamu untuk mengetahui polis yang kamu miliki hingga klaim yang sedang kamu proses secara real-time.</li>
                    </ul>
                </div>

                <p class="mb-4">Misi kami yakni terus membuat alternatif solusi atas permasalahan khususnya dibidang finansial dan asuransi dengan cara pengembangan digitalisasi yang efektif dan efisien.</p>
            </b-container>
        </section>

        <section id="core-value" class="my-5">
            <b-container>
                <h1 class="text-center mb-5">Core Value PIQO - 5C</h1>

                <b-row class="justify-content-center px-0 px-md-5 mx-0 mx-lg-5">
                    <b-col v-for="(card, index) in coreValueCards" :key="index" cols="12" md="6" lg="4" class="mb-4">
                        <b-card bg-variant="secondary" align="center" class="h-100 py-4 border shadow-none">
                            <b-card-img :src="card.icon" :alt="card.title" class="mb-4" style="max-width: 96px"></b-card-img>
                            <b-card-title title-tag="h4" class="mb-4">{{ card.title }}</b-card-title>
                            <b-card-text>{{ card.description }}</b-card-text>
                        </b-card>
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
            coreValueCards: [
                {
                    icon: "/svg/costumer-first.svg",
                    title: "Costumer First",
                    description: "Mengutamakan rasa aman dan tentram kepada pelanggan dengan pelayanan terbaik melalui sistem digitalisasi"
                },
                {
                    icon: "/svg/care.svg",
                    title: "Care",
                    description: "Memberikan kepedulian bagi sesama untuk menciptakan ekosistem terbaik"
                },
                {
                    icon: "/svg/capable.svg",
                    title: "Capable",
                    description: "Dapat diandalkan untuk memberikan kepuasan pelanggan"
                },
                {
                    icon: "/svg/computerize.svg",
                    title: "Computerize",
                    description: "Sistem digitalisasi mejadi value penting bagi kami untuk kemudahan semua pihak"
                },
                {
                    icon: "/svg/cheerful.svg",
                    title: "Cheerful",
                    description: "Memberikan suasana lingkungan kerja yang gembira, penuh semangat, memberikan energi positif guna keberlangsungan perusahaan"
                }
            ],
        }
    },
    head() {
        return {
            title: 'Tentang - Pico Insurtech',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'Deskripsi Halaman'
                }
            ]
        };
    }
}
</script>