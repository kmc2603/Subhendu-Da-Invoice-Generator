window.currentTab = 'bill';

window.currentTab = "bill"; // Default

function switchTab(tabName) {
  window.currentTab = tabName;

  // Remove active class from all
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.classList.remove("active");
    if (tab.dataset.tab === tabName) tab.classList.add("active");
  });

  // Update the heading
  const heading = document.getElementById("tab-heading");
  if (heading) {
    heading.textContent = tabName === "quotation" ? "QUOTATION" : "BILL";
  }

  console.log("Switched to tab:", window.currentTab);
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      switchTab(tab.dataset.tab);
    });
  });

  // Optional: auto-uppercase reference input
  const refInput = document.getElementById("refNo");
  if (refInput) {
    refInput.addEventListener("input", () => {
      refInput.value = refInput.value.toUpperCase();
    });
  }
});




function addItem() {
  const table = document.getElementById("itemsTable").querySelector("tbody");
  const rowIndex = table.rows.length + 1;
  const row = table.insertRow();
  const quantityOptions = Array.from({ length: 5555 }, (_, i) => `<option value="${i+1}">${i+1}</option>`).join('');
  row.innerHTML = `
  <td data-label="Sl. No.">${rowIndex}</td>
  <td data-label="Description"><input type="text" placeholder="Description" /></td>
  <td data-label="Quantity">
    <select onchange="updateTotal()" onkeydown="return false">
      <option value="na">N/A</option>
      ${quantityOptions}
    </select>
  </td>
  <td data-label="Rate"><input type="number" placeholder="Rate" oninput="updateTotal()" /></td>
  <td data-label="Amount" class="amount">0</td>
  <td data-label="Remove"><button onclick="this.parentElement.parentElement.remove(); updateTotal();">❌</button></td>
`;

}

function updateTotal() {
  let total = 0;
  document.querySelectorAll("#itemsTable tbody tr").forEach(row => {
    const qtySelect = row.cells[2].querySelector("select");
    const rateInput = row.cells[3].querySelector("input");
    const qtyVal = qtySelect.value;
    const rate = parseFloat(rateInput.value || 0);
    let amount = 0;

    if (qtyVal === 'na') {
      amount = rate;
    } else {
      const q = parseInt(qtyVal);
      if (!isNaN(q) && q > 0) {
        amount = q * rate;
      }
    }

    row.cells[4].innerText = formatCurrency(amount);
    total += amount;
  });
  document.getElementById("grand-total").innerText = formatCurrency(total);
  document.getElementById("total-words").innerText = inWords(total);
}

function formatCurrency(num) {
  return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(num);
}

function inWords(num) {
  if (num === 0) return 'Zero';
  const a = [ '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen' ];
  const b = [ '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety' ];
  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + numToWords(n % 100) : '');
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
    return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
  };
  return 'Amount in words: Rupees ' + numToWords(Math.floor(num)) + ' only';
}
