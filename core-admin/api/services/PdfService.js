const fs = require("fs")
const PDFDocument = require("pdfkit-table")

export default class PdfService {
    constructor() {}

    createInvoice(invoice, path) {
        let doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        this.generateHeader(doc);
        this.generateCustomerInformation(doc, invoice);

        this.createTableDetail(doc);
        this.createTableData(doc);
        this.createTableCalculate(doc);

        this.disclaimer(doc)

        this.generateFooter(doc);

        doc.end();
        doc.pipe(fs.createWriteStream(path));
    }

    generateHeader(doc) {
        doc.image("view/static/img/logo-pico-purple.png", 50, 45, { width: 100 })
            .image("view/static/img/mega-insurance.png", doc.page.width/2 - 140/2, 50 + 35, {
                width: 140
            })
    }

    generateCustomerInformation(doc, invoice) {
        doc
            .fillColor("#444444")
            .fontSize(18)
            .text("Slip Penawaran", 50, 165);

        this.generateHr(doc, 190);

        const customerInformationTop = 205;

        doc
            .fontSize(10)
            .text("Nomor:", 50, customerInformationTop)
            .font("Helvetica-Bold")
            .text("[QUOTATION NO]", 150, customerInformationTop)
            .font("Helvetica")
            .text("Jenis Asuransi:", 50, customerInformationTop + 15)
            .text("Asuransi Kendaraan Bermotor (PSAKBI)", 150, customerInformationTop + 15)
            .text("Tanggal Terbit:", 50, customerInformationTop + 30)
            .text("21 Juli 2022", 150, customerInformationTop + 30)
            .moveDown();

        this.generateHr(doc, 257);
    }

    createTableDetail(doc) {
        const table = {
            title: "Detail Transaksi",
            headers: [
                {
                    label: "Item",
                    property: 'name',
                    width: 160,
                    renderer: null,
                    headerColor: '#fff',
                },
                {
                    label: "Nilai",
                    property: 'value',
                    width: 190,
                    renderer: null,
                    headerColor: '#fff',
                },
            ],
            datas: [
                {
                    name: 'Nama Tertanggung',
                    value: 'Rahmat Ansori',
                },
                {
                    name: 'Nama Produk',
                    value: 'Mega Auto Comprehensive',
                },
                {
                    name: 'Tipe',
                    value: 'Comprehensive',
                },
                {
                    name: 'Periode Asuransi',
                    value: '25 Juli 2022 - 25 Juli 2023',
                },
            ],
          };
          // the magic
          doc.table(table, {
            x: 50,
            y: 280,
            padding: 5,
            columnSpacing: 7,
            hideHeader: true,
            divider: {
                horizontal: { disabled: true },
            },
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(10);
            },
          });
          // done!
    }

    createTableData(doc) {
        const table = {
            title: "Objek Pertanggungan",
            headers: [
                {
                    label: "Item",
                    property: 'name',
                    width: 160,
                    renderer: null,
                    headerColor: '#fff',
                },
                {
                    label: "Perhitungan",
                    property: 'value',
                    width: 190,
                    renderer: null,
                    headerColor: '#fff',
                },
            ],
            datas: [
                {
                    name: 'Merk Kendaraan',
                    value: '[BRAND]',
                },
                {
                    name: 'Model Kendaraan',
                    value: '[SUB MODEL]',
                },
                {
                    name: 'Tipe Kendaraan',
                    value: '[VEHICLE TYPE]',
                },
                {
                    name: 'Kategori Kendaraan',
                    value: '[VEHICLE CATEGORY]',
                },
                {
                    name: 'Kategori Lokasi',
                    value: '[LOCATION CATEGORY]',
                },
                {
                    name: 'Fungsi Kendaraan',
                    value: '[VEHICLE FUNCTION]',
                },
                {
                    name: 'Tahun Kendaraan',
                    value: '[VEHICLE BUILT YEAR]',
                },
                {
                    name: 'Perlengkapan Kendaraan',
                    value: '[ITEM NAME 1]',
                },
            ],
          };
          // the magic
          doc.moveDown().table(table, {
            x: 50,
            padding: 5,
            columnSpacing: 7,
            hideHeader: true,
            divider: {
                horizontal: { disabled: true },
            },
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(10);
            },
          });
          // done!
    }

    createTableCalculate(doc) {
        const table = {
            title: "Perhitungan Premi",
            headers: [
                {
                    label: "Item",
                    property: 'name',
                    width: 130,
                    renderer: null,
                    headerColor: '#fff',
                },
                {
                    label: "Perhitungan",
                    property: 'calculation',
                    width: 190,
                    renderer: null,
                    headerColor: '#fff',
                },
                {
                    label: "Premi",
                    property: 'currency',
                    width: 40,
                    renderer: null,
                    headerColor: '#fff',
                    columnColor: '#fff',
                    columnOpacity: 100
                },
                {
                    label: "",
                    property: 'price',
                    width: 140,
                    headerColor: '#fff',
                    align: 'right',
                    // renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {
                    //     return `U$ ${Number(value).toFixed(2)}`
                    // }
                },
            ],
            datas: [
                {
                    name: 'Comprehensive',
                    calculation: 'IDR 226.200.000 x 3.18%',
                    currency: 'IDR',
                    price: '5,454,040.00',
                },
                {
                    name: 'Personal Accident Passenger',
                    calculation: 'IDR 226.200.000 x 0.1% x [SEAT]',
                    currency: 'IDR',
                    price: '30,000.00',
                },
                {
                    options: { separation: true },
                    name: 'Earthquake',
                    calculation: 'IDR 226.200.000 x 0.12%',
                    currency: 'IDR',
                    price: '271,440.00',
                },
                {
                    name: 'bold:TOTAL',
                    calculation: '',
                    currency: 'bold:IDR',
                    price: 'bold:5,785,480.00',
                },
            ],
          };
          // the magic
          doc.moveDown().table(table, {
            x: 50,
            padding: 5,
            columnSpacing: 7,
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(10);
            },
          });
          // done!
    }

    disclaimer(doc) {
        doc.moveDown().text("DISCLAIMER / PENYANGKALAN", { align: "center", width: 500 })
        doc.moveDown().text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
        doc.moveDown().text("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.")
        doc.moveDown().text("Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")

//         doc.lineCap('butt')
//    .lineTo(100, 50)
//    .stroke()
    }

    generateFooter(doc) {
        let imageWidth = 70
        let startHeight = doc.page.height - 120

        doc.page.margins.bottom = 0

        doc.fontSize(10)
            .text("Proposal & Penawaran Asuransi Didukung Oleh",
                50,
                startHeight,
                { align: "center", width: 500 }
            )
            .image("view/static/img/logo-pico-purple.png",
                doc.page.width/2 - imageWidth/2, startHeight + 20, {
                width: imageWidth
            })
            .text("Bekerja sama dengan Pialang Asuransi [NAMA PT]",
                50, startHeight + 58,
                { align: "center", width: 500 }
            )
            .text("JL. TB Simatupang Banjarsari 1 No. 8C",
                50, startHeight + 72,
                { align: "center", width: 500 }
            )
            .text("Cilandak Barat, Kecamatan Cilandak, Kota Jakarta Selatan, DKI Jakarta, 12430",
                50, startHeight + 85,
                { align: "center", width: 500, lineBreak: false, }
            )
    }

    generateTableRow(
        doc,
        y,
        item,
        calculation,
        quantity,
        lineTotal
    ) {
        doc
            .fontSize(10)
            .text(item, 50, y, { width: 130 })
            .text(calculation, 170, y)
            .text(quantity, 390, y, { width: 90 })
            .text(lineTotal, 0, y, { align: "right" });
    }

    generateHr(doc, y) {
        doc
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }

    formatCurrency(cents) {
        return (cents).toFixed(2);
    }

    formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return year + "/" + month + "/" + day;
    }
}
