<template>
    <section id="terms-of-service" class="main-content">
        <b-container class="py-5 text-justify">
            <h1 class="text-center my-4">DISCLAIMER</h1>

            <p class="mb-5">
                Dengan mengakses Tokopolis sebagai platform web application yang menyediakan layanan asuransi berbasis teknologi atau insurtech yang mudah dan terjangkau untuk semua orang, agar Anda dapat menemukan beragam produk asuransi untuk ketenangan pikiran Anda dari risiko finansial tak terduga, Anda selaku pengunjung perlu menyetujui Disclaimer atau Pasal Sanggahan yang ada di situs ini.
                Seluruh konten di web application ini dapat mengalami perubahan tanpa pemberitahuan sebelumnya. Jika Anda menemukan kesalahan pengetikan atau informasi yang ada di website kami, Anda dapat melaporkannya melalui kontak yang telah disediakan.
            </p>

            <h2>Tautan ke Situs Lainnya</h2>
            <p class="mb-5">
                Jika Anda mengakses tautan ke situs pihak ketiga, termasuk pada iklan, Anda akan meninggalkan situs Tokopolis yang sedang Anda kunjungi dan beralih ke situs yang Anda pilih. Karena itu kami tidak dapat mengontrol kegiatan pihak ketiga, sehingga kami tidak bertanggung jawab atas penggunaan Data Pribadi Anda oleh pihak ketiga tersebut, dan tidak dapat menjamin bahwa pihak ketiga akan mematuhi kebijakan privasi yang sama seperti PT Istpro Inti Nusa.
            </p>
            <p class="mb-5">
                Kami menyarankan Anda untuk selalu membaca kebijakan privasi setiap situs web pihak ketiga yang Anda kunjungi. Jika Anda mengunjungi situs web pihak ketiga yang terhubung ke situs Tokopolis, pastikan untuk membaca kebijakan privasi situs web tersebut sebelum memberikan data pribadi Anda.
            </p>

            <h2>Penggunaan Konten</h2>
            <p class="mb-5">
                Setiap blogger atau pemilik situs web DILARANG KERAS menyalin, mengutip sebagian atau seluruh informasi dari situs Tokopolis tanpa mencantumkan link sumber dari semua aset yang dimiliki Tokopolis. Link yang digunakan harus memberikan tautan langsung ke halaman yang dijadikan referensi.
            </p>
            <p class="mb-5">
                Dengan adanya halaman Disclaimer atau Pasal Sanggahan ini, Tokopolis dibebaskan dari segala tindakan dan pelanggaran akibat penggunaan informasi yang ada di situs ini. Segala tindakan menyalin atau menggandakan informasi tanpa mencantumkan sumber dari Tokopolis akan diproses melalui undang-undang ITE yang berlaku di Indonesia.
            </p>

            <h2>Ketentuan Hukum</h2>
            <p class="mb-5">
                Masyarakat dan pembaca yang menggunakan berita dan artikel dari Artikel Tokopolis bersedia untuk bertanggung jawab secara pribadi dan penuh atas terjadinya suatu tindakan penyalahgunaan dan hilangnya seluruh atau sebagian data pribadi dan atau konten, serta atas segala pernyataan, gagasan, pendapat, kekeliruan, kesalahan, hingga ketidaktepatan atau kekurangan konten yang telah ditempatkan dan/atau ditayangkan.
            </p>
            <p class="mb-5">
                Pembaca bersedia untuk membebaskan Tokopolis, termasuk seluruh staf di dalamnya, dari segala permasalahan hukum yang timbul atas pemuatan konten di Blog Tokopolis. Data dan atau informasi yang tersedia di Tokopolis hanya digunakan sebagai rujukan atau referensi belaka, dan tidak diharapkan untuk tujuan perdagangan, transaksi keuangan atau bisnis, maupun transaksi lainnya.
            </p>
            <p class="mb-5">
                Walau berbagai upaya telah dilakukan untuk menampilkan data dan atau informasi seakurat mungkin, Tokopolis dan semua mitra yang menyediakan data dan informasi, termasuk para pengelola halaman, tidak bertanggung jawab atas segala kesalahan dan keterlambatan memperbarui data atau informasi, atau segala kerugian yang timbul karena tindakan yang berkaitan dengan penggunaan data atau informasi yang disajikan oleh kami."
            </p>

            <h2>Informasi Kontak</h2>
            <p class="mb-5">
                Jika Anda memiliki pertanyaan atau saran mengenai Disclaimer atau Pasal Sanggahan ini, Anda dapat menghubungi kami melalui cs@tokopolis.id
            </p>
        </b-container>
    </section>
</template>

<script>
export default {
    data() {
        return {
            title: 'Kebijakan Privasi',
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
.main-content {
    margin-top: 110px;
}

h1, h2, h3, h4, p, ol {
    color: #221A29;
}
h1 {
    font-size: 28px;
}
h2 {
    font-size: 20px;
    color: #48414D;
}
h3 {
    font-size: 18px;
    margin-bottom: 5rem;
}
p {
    font-size: 14px;
}
a {
    color: #FF7900;
    text-decoration: underline;
}
ol {
    font-size: 1.4rem;
    padding-left: 2rem;
}
li {
    padding-left: 1.5rem;
}
ol.point {
    list-style-type: none;
    counter-reset: item;
}
ol.point > li {
    display: table;
    counter-increment: item;
    margin-bottom: 0.6em;
}
ol.point > li:before {
    content: counters(item, ".") ". ";
    display: table-cell;
    padding-right: 0.6em;
}
ol.point > li li {
    margin: 0;
}
ol.point > li li:before {
    content: counters(item, ".") " ";
}
</style>
