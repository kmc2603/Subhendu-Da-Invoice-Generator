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

  const items = [];
  let serial = 1;
  document.querySelectorAll('#itemsTable tbody tr').forEach(row => {
    const desc = row.cells[1].querySelector('input').value.trim();
    const qty = row.cells[2].querySelector('select').value || '0';
    const rate = row.cells[3].querySelector('input').value || '0';
    const amt = row.cells[4].innerText || '0';
    if (desc !== '') {
      items.push([
        `${serial++}`,
        desc,
        qty === 'na' ? 'N/A' : qty,
        new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(rate),
        new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(parseFloat(amt.replace(/,/g, '')))
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
    columns: [
      {
        text: 'Email: chowdhuryardhendu00@gmail.com',
        alignment: 'center',
        margin: [0, 10, 0, 10],
        fontSize: 10,
        color: '#1565C0',
        italics: true
      }
    ]
  };
},

        content: [
          {
            columns: [
              { text: 'M/S Ardhendu Chowdhury', style: 'header' },
              {
  text: currentTab.toUpperCase(),
  style: 'billTitle',
  alignment: 'center',
  margin: [0, 20, 0, 10]
}
            ]
          },
          {
            margin: [0, 6, 0, 10],
            table: {
              widths: ['*'],
              body: [[{
                stack: [
                  { text: [{ text: 'Address: ', style: 'label' }, { text: 'Shyamnagar, North 24 Parganas, West Bengal - 743127', style: 'value' }] },
                  { text: [{ text: 'Phone No: ', style: 'label' }, { text: '9038271075', style: 'value' }] },
                  { text: [{ text: 'Mobile No: ', style: 'label' }, { text: '9038982752', style: 'value' }] },
                  { text: [{ text: 'Reg. No: ', style: 'label' }, { text: '547/2023-26', style: 'value' }] },
                  {
                    
                  }
                ],
                style: 'infoBox'
              }]]
            },
            layout: {
              fillColor: '#f3f3f3',
              hLineColor: '#333',
              vLineColor: '#333'
            }
          },
          {
            columns: [
              { text: [{ text: 'Ref. No: ', style: 'refLabel' }, { text: refNo, style: 'refValue' }] },
              { text: [{ text: 'Dated: ', style: 'refLabel' }, { text: date, style: 'refValue' }], alignment: 'right' }
            ]
          },
          { text: 'Client Name:', style: 'label', margin: [0, 14, 0, 2] },
          { text: clientName, style: 'clientValue' },
          { text: clientAddress, style: 'clientValue' },
          { text: `Site Name: ${siteName}`, style: 'siteLabel', margin: [0, 0, 0, 10] },
          {
            table: {
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [['Sl. No', 'Description', 'Qty', 'Rate (₹)', 'Amount (₹)'], ...items]
            },
            layout: {
              fillColor: (rowIdx) => rowIdx === 0 ? '#eeeeee' : null,
              hLineColor: '#333',
              vLineColor: '#333'
            },
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
          ...(currentTab === 'bill'
            ? [
              {
                text: `Amount Due: ₹${grandTotal}`,
                bold: true,
                color: '#D32F2F',
                alignment: 'right',
                margin: [0, 0, 0, 4],
                style: 'amountDue'
              },
              {
                text: totalWords.replace("Amount in words:", "Amount Due in words:"),
                alignment: 'right',
                margin: [0, 0, 0, 14],
                style: 'totalWords',
                color: '#D32F2F'
              }
            ] : []),
          {
            columns: [
              [
                { text: 'A/C Details:', bold: true, margin: [0, 10, 0, 2] },
                { text: [{ text: 'Bank Name: ', style: 'bankLabel' }, { text: 'Bank of Maharashtra', style: 'bankValue' }] },
                { text: [{ text: 'A/C Name: ', style: 'bankLabel' }, { text: 'Ardhendu Chowdhury', style: 'bankValue' }] },
                { text: [{ text: 'A/C No.: ', style: 'bankLabel' }, { text: '60293622134', style: 'bankValue' }] },
                { text: [{ text: 'IFS Code: ', style: 'bankLabel' }, { text: 'MAHB0000973', style: 'bankValue' }] },
                { text: [{ text: 'PAN No.: ', style: 'bankLabel' }, { text: 'ASSPC3871D', style: 'bankValue' }] }
              ],
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
          }
        ],
        styles: {
          header: { fontSize: 16, bold: true, color: '#0D47A1' },
          billTitle: {
  fontSize: 16,
  bold: true,
  decoration: 'underline',
  color: '#000000'
}
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
