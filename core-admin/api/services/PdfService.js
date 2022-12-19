const fs = require("fs")
const PDFDocument = require("pdfkit-table")

export default class PdfService {
    constructor() {}

    async createInvoice(data, path) {
        let doc = new PDFDocument({
            size: "A4",
            margin: 50
        })

        await this.generateHeader(doc, data)
        this.generateCustomerInformation(doc, data)

        this.createTableDetail(doc, data)
        this.createTableData(doc, data)
        this.createTableCalculate(doc, data)

        this.disclaimer(doc, data)

        this.generateFooter(doc)

        doc.end()
        doc.pipe(fs.createWriteStream(path))
    }

    async generateHeader(doc, data) {
        doc.image("view/static/img/logo-tokopolis.png", 50, 45, { width: 100 })
        doc.image(data.logo.product, doc.page.width/2 - 140/2, 50 + 22, { width: 140 })
    }

    generateCustomerInformation(doc, data) {
        doc
            .fillColor("#444444")
            .fontSize(18)
            .text("Slip Penawaran", 50, 165)

        this.generateHr(doc, 190)

        const customerInformationTop = 205

        doc
            .fontSize(10)
            .text(data.header[0].label, 50, customerInformationTop)
            .font("Helvetica-Bold")
            .text(data.header[0].text, 150, customerInformationTop)
            .font("Helvetica")
            .text(data.header[1].label, 50, customerInformationTop + 15)
            .text(data.header[1].text, 150, customerInformationTop + 15)
            .text(data.header[2].label, 50, customerInformationTop + 30)
            .text(data.header[2].text, 150, customerInformationTop + 30)
            .moveDown()

        this.generateHr(doc, 257)
    }

    createTableDetail(doc, data) {
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
            datas: data.detail.map(item => {
                return {
                    name: item.label,
                    value: item.text
                }
            })
        }

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
                doc.font("Helvetica").fontSize(10)
            },
        })
    }

    createTableData(doc, data) {
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
            datas: data.vehicle.map(item => {
                return {
                    name: item.label,
                    value: item.text
                }
            }),
          }

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
        })
    }

    createTableCalculate(doc, data) {
        const list = data.calculation.map(result => {
            var calculation =  `${data.currency} ${result.price}`

            if (result.percentage != null) {
                calculation = `${data.currency} ${result.price} x ${result.percentage}`
            }

            return {
                name: result.label,
                calculation: calculation,
                currency: data.currency,
                price: result.total
            }
        })

        list.push({
            name: 'bold:TOTAL',
            calculation: '',
            currency: `bold:${data.currency}`,
            price: `bold:${data.total}`,
        })

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
            datas: list,
          }

        doc.moveDown().table(table, {
            x: 50,
            padding: 5,
            columnSpacing: 7,
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(10);
            },
        })
    }

    disclaimer(doc, data) {
        doc.fillColor("#444444")

        doc.moveDown().text("DISCLAIMER / PENYANGKALAN", { align: "center", width: 500 })
        doc.moveDown().text("Calon Tertanggung wajib membaca Quotation Slip ini secara keseluruhan dan wajib memberikan persetujuan secara tertulis untuk memproses penerbitan polis. " +
            "Apabila kami menerima instruksi untuk memproses penerbitan polis asuransi, maka calon Tertanggung dianggap telah memahami dan menyetujui penawaran yang tercantum dalam Quotation Slip ini.", { align: "justify"})
        doc.moveDown().text("Quotation ini tunduk kepada polis asuransi yang akan diterbitkan oleh Perusahaan Asuransi. " + "Apabila terdapat perbedaan ketentuan dalam polis asuransi dan ketentuan dalam Quotation Slip ini, maka ketentuan dalam Polis Asuransi yang akan berlaku.", { align: "justify"})
        doc.moveDown().text("Apabila calon Tertanggung memiliki pertanyaan atas Quotation slip ini, mohon tidak ragu menghubungi kami melalui email support@istpro.com atau telepon (021) 79187909.", { align: "justify"})

        doc.moveDown()

        doc.image("view/static/img/next.png", doc.page.width/2 - 100/2, doc.y + 25, {
            width: 100,
            link: data.link
        })
    }

    generateFooter(doc) {
        let imageWidth = 100
        let startHeight = doc.page.height - 130

        doc.page.margins.bottom = 0

        doc.fontSize(10)
            .text("Quotation Powered by",
                50,
                startHeight,
                { align: "center", width: 500 }
            )
            .image("view/static/img/istpro.png",
                doc.page.width/2 - imageWidth/2, startHeight + 15, {
                width: imageWidth
            })
            .text("PT ISTPRO INTI NUSA",
                50, startHeight + 65,
                { align: "center", width: 500 }
            )
            .text("Izin No. KEP-157/KM.10/2007",
                50, startHeight + 79,
                { align: "center", width: 500 }
            )
            .text("Nomor Keanggotaan APARI : 148-2007/APPARINDO/2020",
                50, startHeight + 93,
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
}
