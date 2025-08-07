// ✅ Final Revamped generatePDF function for Bill/Quotation Generator using pdfMake
// Place this inside your `pdf-generator.js`

function generatePDF() {
  const { clientName, siteName, items, grandTotal, totalWords, billType } = collectData();

  const docDefinition = {
    content: [
      // === HEADER ===
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'M/S Ardhendu Chowdhury', style: 'title' },
              { text: 'Address: Shyamnagar, North 24 Parganas, West Bengal - 743127', style: 'subTitle' }
            ]
          },
          {
            width: 'auto',
            stack: [
              { text: 'Phone No: 9038271075', style: 'subTitle' },
              { text: 'Mobile No: 9038982752', style: 'subTitle' },
              { text: 'Reg. No: 547/2023-26', style: 'subTitle' }
            ],
            alignment: 'right'
          }
        ]
      },
      { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 520, y2: 5, lineWidth: 1 }] },

      // === REF AND DATE ===
      {
        columns: [
          { text: 'Ref. No:', style: 'ref' },
          { text: 'Dated:', alignment: 'right', style: 'ref' }
        ],
        margin: [0, 8, 0, 8]
      },

      // === BILL / QUOTATION ===
      { text: billType.toUpperCase(), alignment: 'center', bold: true, fontSize: 13, margin: [0, 4, 0, 10] },

      // === CLIENT INFO ===
      {
        columns: [
          { text: `Client Name: ${clientName || ''}`, style: 'client' },
          { text: `Site Name: ${siteName || ''}`, style: 'client' }
        ],
        margin: [0, 0, 0, 8]
      },

      // === TABLE ===
      {
        table: {
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Sl. No', bold: true },
              { text: 'Description', bold: true },
              { text: 'Qty', bold: true },
              { text: 'Rate (₹)', bold: true },
              { text: 'Amount (₹)', bold: true }
            ],
            ...items.map((item, index) => [
              index + 1,
              item.description,
              item.quantity,
              item.rate,
              item.amount
            ])
          ]
        },
        layout: 'lightHorizontalLines'
      },

      // === GRAND TOTAL ===
      {
        text: `Grand Total: ₹${grandTotal}`,
        style: 'grandTotal',
        alignment: 'right',
        margin: [0, 8, 0, 2]
      },
      {
        text: totalWords,
        alignment: 'right',
        style: 'totalWords',
        margin: [0, 0, 0, 16]
      },

      // === SIGNATURE ===
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            stack: [
              {
                image: signatureBase64, // ensure you define or import this variable
                width: 120,
                alignment: 'right',
                margin: [0, 0, 0, 2]
              },
              { text: 'For M/S Ardhendu Chowdhury', alignment: 'right', style: 'signature' }
            ]
          }
        ],
        margin: [0, 0, 0, 60]
      }
    ],

    // === FOOTER ===
    footer: function (currentPage, pageCount) {
      return {
        columns: [
          // Bank Details Left
          {
            width: '*',
            stack: [
              { text: 'A/C Details:', style: 'bankLabel', margin: [0, 0, 0, 2] },
              {
                text: 'Bank Name: Bank of Maharashtra\nA/C Name: Ardhendu Chowdhury\nA/C No: 1234567890\nIFSC: MAHB0000123\nPAN: ABCDE1234F',
                style: 'bankValue'
              }
            ],
            margin: [40, 0, 0, 10],
            alignment: 'left'
          },
          // Email Center
          {
            width: '*',
            text: 'Email: ar.chowdhury@email.com',
            style: 'emailLink',
            alignment: 'center',
            margin: [0, 15, 0, 10],
            link: 'mailto:ar.chowdhury@email.com'
          },
          // Empty right
          {
            width: '*',
            text: ''
          }
        ]
      };
    },

    styles: {
      title: { fontSize: 14, bold: true, color: '#1565C0' },
      subTitle: { fontSize: 10 },
      ref: { fontSize: 10 },
      client: { fontSize: 10 },
      grandTotal: { fontSize: 11, bold: true, color: 'green' },
      totalWords: { fontSize: 10 },
      signature: { fontSize: 10, bold: true },
      bankLabel: { fontSize: 10, bold: true, color: '#37474F' },
      bankValue: { fontSize: 10, color: '#263238' },
      emailLink: {
        fontSize: 10,
        color: '#1565C0',
        decoration: 'underline',
        bold: false
      }
    },

    pageMargins: [40, 60, 40, 100] // Top and bottom margins adjusted for fixed footer
  };

  pdfMake.createPdf(docDefinition).download(`${billType}_${clientName}.pdf`);
}
