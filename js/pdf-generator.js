async function getBase64FromUrl(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function generatePDF() {
  const clientName = document.getElementById('clientName').value || '';
  const clientAddress = document.getElementById('clientAddress').value || '';
  const siteName = document.getElementById('siteName').value || '';
  const refNo = document.getElementById('refNo').value || '';
  const rawDate = document.getElementById('date').value || '';
  const dateParts = rawDate.split('-');
  const date = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : '';
  const grandTotal = document.getElementById("grand-total").innerText || '0.00';
  const totalWords = document.getElementById("total-words").innerText || '';
  const currentTab = window.currentTab || 'bill';
  const docTitle = currentTab === 'quotation' ? 'QUOTATION' : 'BILL';
const fileName = currentTab === 'quotation' ? 'Quotation.pdf' : 'Bill.pdf';


  const items = [];
  let serial = 1;
  document.querySelectorAll('#itemsTable tbody tr').forEach(row => {
    const desc = row.cells[1].querySelector('input').value.trim();
    const qty = row.cells[2].querySelector('select').value || '0';
    const rate = row.cells[3].querySelector('input').value || '0';
    const amt = row.cells[4].innerText || '0';
    if (desc !== '') {
      items.push([
  { text: `${serial++}`, alignment: 'center' },
  { text: desc, noWrap: false },
  { text: qty === 'na' ? 'N/A' : qty, alignment: 'center', noWrap: true },
  { text: new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(rate), alignment: 'right' },
  { text: new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(parseFloat(amt.replace(/,/g, ''))), alignment: 'right' }
]);

    }
  });

  getBase64FromUrl('https://raw.githubusercontent.com/kmc2603/Subhendu-Da-Invoice-Generator/main/assets/signature.png')
    .then(signatureBase64 => {

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        defaultStyle: { font: 'Roboto' },
footer: function(currentPage, pageCount) {
  return {
    margin: [0, 6, 0, 10],
    alignment: 'center',
    fontSize: 10,
    italics: true,
    text: [
      { text: 'Email: ', color: 'black' },
      {
        text: 'chowdhuryardhendu00@gmail.com',
        color: '#1565C0',
        link: 'mailto:chowdhuryardhendu00@gmail.com'
      }
    ]
  };
},



        content: [
          
            {
  columns: [
    {
      width: '*',
      stack: [
        { text: 'M/S Ardhendu Chowdhury', style: 'header' },
        { text: 'Address: Shyamnagar, North 24 Parganas, West Bengal - 743127', style: 'value' }
      ]
    },
    {
      width: 'auto',
      stack: [
        { text: 'WhatsApp: 9038271075', style: 'value', alignment: 'right' },
        { text: 'Phone No: 9038982752', style: 'value', alignment: 'right' },
        { text: 'Reg. No: 547/2023-26', style: 'value', alignment: 'right' }
      ]
    }
  ],
  margin: [0, 0, 0, 14]
},
{
  canvas: [
    { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5 }
  ],
  margin: [0, 10, 0, 10]
},


          {
            columns: [
              { text: [{ text: 'Ref. No: ', style: 'refLabel' }, { text: refNo, style: 'refValue' }] },
              { text: [{ text: 'Dated: ', style: 'refLabel' }, { text: date, style: 'refValue' }], alignment: 'right' }
            ]
          },
           {
            text: currentTab.toUpperCase(),
            style: 'billTitle',
            alignment: 'center',
            margin: [0, 12, 0, 14]
          },
          { text: 'To,', style: 'label', margin: [0, 14, 0, 2] },
          { text: clientName, style: 'clientValue' },
          { text: clientAddress, style: 'clientValue' },
          { text: `Site Name: ${siteName}`, style: 'siteLabel', margin: [0, 0, 0, 10] },
          {
  table: {
    widths: ['auto', '*', 'auto', 60, 'auto'],  // slightly increase rate column
    body: [['Sl. No', 'Description', 'Qty', 'Rate (₹)', 'Amount (₹)'], ...items]
  },
  layout: {
    fillColor: (rowIdx) => rowIdx === 0 ? '#eeeeee' : null,
    hLineColor: '#333',
    vLineColor: '#333',
    paddingLeft: function(i, node) { return 4; },
    paddingRight: function(i, node) { return 4; },
    paddingTop: function(i, node) { return 6; },
    paddingBottom: function(i, node) { return 6; }
  },
            style: 'wrapText',
           margin: [0, 0, 0, 10]
},

          {
            text: `Grand Total: ₹${grandTotal}`,
            alignment: 'right',
            bold: true,
            style: 'grandTotal',
            margin: [0, 6, 0, 4]
          },
          {
            text: totalWords,
            italics: true,
            alignment: 'right',
            margin: [0, 0, 0, 14],
            style: 'totalWords'
          },

          
          
          ...(currentTab === 'bill' ? [] : []),
   {
  columns: [
    [],
    {
      width: 'auto',
      stack: [
        {
          image: signatureBase64,
          width: 160,
          alignment: 'right',
          margin: [-5, 10, 0, 4]
        },
        {
          text: 'For M/S Ardhendu Chowdhury',
          bold: true,
          alignment: 'right'
        }
      ]
    }
  ]
},
{
  margin: [0, 20, 0, 0],
  stack: [
    { text: 'A/C Details:', style: 'bankLabel', margin: [0, 10, 0, 2] },
    { text: 'Bank Name: Bank of Maharashtra', style: 'bankValue' },
    { text: 'A/C Name: Ardhendu Chowdhury', style: 'bankValue' },
    { text: 'A/C No.: 60293622134', style: 'bankValue' },
    { text: 'IFS Code: MAHB0000973', style: 'bankValue' },
    { text: 'PAN No.: ASSPC3871D', style: 'bankValue' }
  ]
    }

  ],

        styles: {
          header: { fontSize: 16, bold: true, color: '#0D47A1' },
          billTitle: {
  fontSize: 16,
  bold: true,
  decoration: 'underline',
  color: '#000000'
},
          infoBox: { fontSize: 10, lineHeight: 1.4 },
          label: { fontSize: 10, bold: true, color: '#333' },
          value: { fontSize: 10, color: '#222' },
          emailLink: { fontSize: 10, color: '#1565C0', decoration: 'underline' },
          clientValue: { fontSize: 11, color: '#263238' },
          refLabel: { fontSize: 11, color: '#888' },
          refValue: { fontSize: 11, color: '#000', bold: true },
          grandTotal: { fontSize: 13, color: '#1B5E20' },
          totalWords: { fontSize: 10, color: '#424242', italics: true },
          amountDue: { fontSize: 12 },
          bankLabel: { fontSize: 10, bold: true, color: '#37474F' },
          bankValue: { fontSize: 10, color: '#263238' },
          siteLabel: { fontSize: 11, color: '#006064', bold: true }
        }
      };

      pdfMake.createPdf(docDefinition).download(`${currentTab.toUpperCase()}_${refNo || 'document'}.pdf`);
    })
    .catch(error => {
      console.error("Failed to load signature image:", error);
      alert("Could not load signature image. Please check the URL or try again later.");
    });
}
