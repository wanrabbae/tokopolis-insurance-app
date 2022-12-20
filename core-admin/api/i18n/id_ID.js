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
            leader_id: "Leader ID",
            region_id: "Region ID",
            province_id: "Province ID",
            city_id: "City ID",
            role_id: "Role ID",

            "address.village": "Alamat Desa/Kelurahan",
            "address.detail": "Alamat Lengkap",
            "address.use_to_ship": "Penggunaan Alamat untuk Pengiriman",

            "product.id": "Id Produk",
            "product.expansion": "Perluasan Asuransi",
            "product.discount.format": "Format Diskon",
            "product.discount.total": "Total Diskon",
            "product.tnc": "Syarat dan Ketentuan",
            "product.claim": "Klaim",
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
        },
        mail: {
            register: "Notifikasi Registrasi",
            login: "Notifikasi Login",
            forget_password: "Notifikasi Lupa Password",
            email: "Verifikasi Email",
            "payment.created": "Notifikasi Pembayaran",
            "payment.success": "Pembayaran Berhasil",
            verify_spv: "Notifikasi Konfirmasi Supervisor",
        },
        success: {
            default: "Aksi Berhasil",
            "webhook.midtrans": "Webhook Midtrans Berhasil",
            "webhook.xendit": "Webhook Xendit Berhasil",
        },
        "error": {
            'parameter': 'Parameter tidak valid',
            'auth': 'Akun tidak ditemukan',
            'email.exist': 'Email sudah ada',
            'email.guest.exist': 'Tidak bisa menggunakan email yang telah terdaftar',
            'password': 'Kata sandi tidak valid',
            'token': 'Token tidak valid',
            'token.null': 'Tidak ada token yang diberikan',
            'token.role': 'Akses tidak diberikan',
            'identity': 'Nomor Identitas tidak valid',
            'vehicle.data': 'Data Kendaraan tidak tersedia',
            'vehicle.price': 'Harga Kendaraan tidak valid',
            'vehicle.acc': 'Aksesoris Kendaraan tidak valid',
            'vehicle.acc.price': 'Harga Aksesoris Kendaraan tidak valid',
            'vehicle.function': 'Fungsi Kendaraan tidak valid',
            'vehicle.protection': 'Proteksi Kendaraan tidak valid',
            'vehicle.plate.new': 'Detail Plat Nomor tidak perlu diisi',
            'vehicle.plate.old': 'Detail Plat Nomor wajib diisi',
            'product': 'Produk tidak ditemukan',
            'product.data': 'Data Produk tidak tersedia',
            'endpoint': 'Endpoint tidak ditemukan',
            'compare.product': 'Komparasi Produk tidak valid',
            'transaction': 'Transaksi Tidak Tersedia',
            'transaction.create': 'Transaksi Gagal Dibuat',
            'transaction.discount': 'Diskon Transaksi tidak valid',
            'route.exist': 'Route sudah ada',
            'role.exist': 'Role sudah tersedia',
            'endpoint.notfound' : 'Data endpoint tidak ditemukan.',
            'role.notfound' : 'Data Role tidak ditemukan.',
            'address.province': 'Data Provinsi tidak ditemukan',
            'address.regency': 'Data Kabupaten/Kota tidak ditemukan',
            'address.district': 'Data Kecamatan tidak ditemukan',
            'address.village': 'Data Desa/Kelurahan tidak ditemukan',
        },
    },
};

module.exports.id_ID_strings = id_ID_strings;
