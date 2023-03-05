// Indonesia language

const id_ID_strings = {
    validation: {
        "string.empty": `{{#label}} tidak boleh kosong`,
        "string.min": `Karakter minimal pada {{#label}} adalah {{#limit}}`,
        "string.pattern.base": `Format {{#label}} tidak didukung`,
        "any.required": `{{#label}} wajib diisi`,
        "any.only": `{{#label}} tidak sesuai`,
    },
    message: {
        field: {
            name: "Nama",
            fullname: "Nama Lengkap",
            label: "Label",
            email: "Email",
            password: "Password",
            password_confirmation: "Password Konfirmasi",
            password_new: "Password Baru",
            token: "Token",
            photo: "Foto",
            gender: "Jenis Kelamin",
            birth_date: "Tanggal Lahir",
            address: "Alamat",
            phone: "Nomor Telepon",
            city: "Kota",
            province: "Provinsi",
            identity_type: "Jenis Identitas",
            identity_number: "Nomor Identitas",
            image: "Gambar",
            description: "Deskripsi",
            short_description: "Deskripsi Singkat",
            type: "Tipe",
            rate: "Rate",

            year: "Tahun",
            brand: "Merk",
            model: "Model",
            sub_model: "Sub Model",
            price: "Harga",
            total: "Total Harga",
            plate: "Plat Nomor",
            plate_detail: "Detail Plat Nomor",
            color: "Warna",
            machine_number: "Nomor Mesin",
            skeleton_number: "Nomor Rangka",
            protection: "Perlindungan",
            use: "Penggunaan",
            accessories: "Aksesoris Kendaraan",
            start_date: "Tanggal Mulai",
            leader_id: "ID Leader",
            region_id: "ID Daerah",
            province_id: "ID Provinsi",
            city_id: "ID Kota",
            role: "Role",
            role_id: "ID Role",
            dealer_id: "ID Dealer",

            "address.village": "Alamat Desa/Kelurahan",
            "address.detail": "Alamat Lengkap",
            "address.use_to_ship": "Penggunaan Alamat untuk Pengiriman",

            "product.id": "Id Produk",
            "product.expansion": "Perluasan Asuransi",
            "product.discount.format": "Format Diskon",
            "product.discount.total": "Total Diskon",
            "product.commission": "Komisi",
            "product.extra_point": "Ekstra Poin",
            "product.admin_fee": "Biaya Admin",
            "product.stamp_fee": "Biaya Materai",
            "product.vehicle_max_year": "Batas Usia Kendaraan",
            "product.supported_brands": "Brand yang Didukung",
            "product.tnc": "Syarat dan Ketentuan",
            "product.claim": "Klaim",
            "product.company": "Nama Perusahaan",
            "product.brochure": "Brosur",
            "product.workshop": "Bengkel",
            "product.workshop_count": "Jumlah Bengkel",

            "transaction.id": "ID Transaksi",
            "transaction.status": "Status Transaksi",
            "transaction.condition": "Kondisi Kendaraan",

            "transaction.client.fullname": "Nama Lengkap Pemegang Polis",
            "transaction.client.email": "Email Pemegang Polis",
            "transaction.client.phone": "Nomor Telepon Pemegang Polis",

            "transaction.bastk": "File BASTK",
            "transaction.identity": "Foto Identitas",
            "transaction.stnk": "Foto STNK",
            "transaction.front": "Foto Bagian Depan",
            "transaction.back": "Foto Bagian Belakang",
            "transaction.left": "Foto Bagian Kiri",
            "transaction.right": "Foto Bagian Kanan",
            "transaction.dashboard": "Foto Dashboard",
            "transaction.optional": "Foto Tambahan",

            "payment.platform": "Platform Pembayaran",
            "endpoint.name": "Nama Endpoint",
            "endpoint.route": "URL Route",
            "endpoint.method": "Method",

            "claim.fullname": "Nama Pemegang Polis",
            "claim.transaction.id": "ID Transaksi",
            "claim.no_polis": "Nomor Polis Asuransi",
            "claim.incident_time": "Waktu Kejadian",
            "claim.location": "Lokasi Lengkap Kejadian",
            "claim.chronology": "Kronologis Kejadian",
            "claim.identity": "Foto Identitas",
            "claim.stnk": "Foto STNK",
            "claim.sim": "Foto SIM Pengemudi",
            "claim.document_optional": "Foto Document Opsional",
            "claim.damage1": "Foto Kerusakan 1",
            "claim.damage2": "Foto Kerusakan 2",
            "claim.damage3": "Foto Kerusakan 3",
            "claim.damage4": "Foto Kerusakan 4",
            "claim.status": "Status Staging",
        },
        mail: {
            register: "Notifikasi Registrasi",
            login: "Notifikasi Login",
            forget_password: "Notifikasi Lupa Password",
            email: "Verifikasi Email",
            "payment.created": "Notifikasi Pembayaran",
            "payment.success": "Pembayaran Berhasil",
            verify_spv: "Notifikasi Konfirmasi Supervisor",
            request_claim: "Request Claim Asuransi Telah Diterima",
            "transaction.file": "Notifikasi Berkas Transaksi",
        },
        success: {
            default: "Aksi Berhasil",
            "transaction.payment": "Pembayaran Berhasil",
            "webhook.midtrans": "Webhook Midtrans Berhasil",
            "webhook.xendit": "Webhook Xendit Berhasil",
        },
        error: {
            parameter: "Parameter tidak valid",
            auth: "Akun tidak ditemukan",
            "email.exist": "Email sudah ada",
            "email.guest.exist":
                "Tidak bisa menggunakan email yang telah terdaftar",
            password: "Kata sandi tidak valid",
            token: "Token tidak valid",
            "token.null": "Tidak ada token yang diberikan",
            "token.role": "Akses tidak diberikan",
            identity: "Nomor Identitas tidak valid",
            "vehicle.data": "Data Kendaraan tidak tersedia",
            "vehicle.price": "Harga Kendaraan tidak valid",
            "vehicle.acc": "Aksesoris Kendaraan tidak valid",
            "vehicle.acc.price": "Harga Aksesoris Kendaraan tidak valid",
            "vehicle.function": "Fungsi Kendaraan tidak valid",
            "vehicle.protection": "Proteksi Kendaraan tidak valid",
            "vehicle.plate.new": "Detail Plat Nomor tidak perlu diisi",
            "vehicle.plate.old": "Detail Plat Nomor wajib diisi",
            product: "Produk tidak ditemukan",
            "product.data": "Data Produk tidak tersedia",
            endpoint: "Endpoint tidak ditemukan",
            "compare.product": "Komparasi Produk tidak valid",
            transaction: "Transaksi Tidak Tersedia",
            "transaction.create": "Transaksi Gagal Dibuat",
            "transaction.quotation": "File Quotation tidak ditemukan",
            "transaction.payment": "Pembayaran gagal",
            "route.exist": "Route sudah ada",
            "role.exist": "Role sudah tersedia",
            "endpoint.notfound": "Data endpoint tidak ditemukan.",
            "role.notfound": "Data Role tidak ditemukan.",
            "address.province": "Data Provinsi tidak ditemukan",
            "address.regency": "Data Kabupaten/Kota tidak ditemukan",
            "address.district": "Data Kecamatan tidak ditemukan",
            "address.village": "Data Desa/Kelurahan tidak ditemukan",
            "claim.transaction.check": "ID Transaksi tidak valid!",
            "claim.incident_time":
                "Request Claim Maksimal 30 hari kalender dari tanggal sekarang/register",
        },
    },
};

module.exports.id_ID_strings = id_ID_strings;
