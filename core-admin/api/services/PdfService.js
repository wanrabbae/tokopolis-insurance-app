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
            return {
                name: result.label,
                calculation: `${data.currency} ${result.price} x ${result.percentage}`,
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
        doc.moveDown().text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
        doc.moveDown().text("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.")
        doc.moveDown().text("Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.")

        doc.moveDown()

        doc.image("view/static/img/next.png", doc.page.width/2 - 100/2, doc.y + 25, {
            width: 100,
            link: data.link
        })
    }

    generateFooter(doc) {
        let imageWidth = 140
        let startHeight = doc.page.height - 120

        doc.page.margins.bottom = 0

        doc.fontSize(10)
            .text("Proposal & Penawaran Asuransi Didukung Oleh",
                50,
                startHeight,
                { align: "center", width: 500 }
            )
            .image("view/static/img/logo-tokopolis.png",
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
}
