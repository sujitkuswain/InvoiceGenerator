function generateInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function formatDate() {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date().toLocaleDateString(undefined, options);
}

window.onload = function () {
  document.getElementById("invoiceNumber").textContent =
    generateInvoiceNumber();
  document.getElementById("invoiceDate").textContent = formatDate();
};

function addRow() {
  const table = document.getElementById("serviceTable");
  const newRow = document.createElement("tr");
  newRow.classList.add("item");
  newRow.innerHTML = `
            <td>
              <input type="text" name="service" class="input-field" placeholder="Service Type" required>
            </td>
            <td>
              <div class="service-container">
                <label class="service-label" for="originalAmount">Original Amount</label>
                <input type="number" name="originalAmount" class="input-field" required placeholder="Original Amount">
              </div>
              <div class="service-container">
                <label for="discountPercent" class="service-label">Discount (%)</label>
                <input type="number" name="discountPercent" class="input-field" required placeholder="Discount (%)">
              </div>
            </td>`;
  table.appendChild(newRow);
}

function deleteRow() {
  const table = document.getElementById("serviceTable");
  if (table.rows.length > 1) {
    table.deleteRow(-1);
  } else {
    alert("You must have at least one service.");
  }
}

function validateDetails() {
  let result = true;

  if (!document.querySelector("#clientName").value) {
    alert("Select client name");
    result = false;
  }

  if (!document.querySelector("#billingPeriod").value) {
    alert("Enter billing period");
    result = false;
  }

  const rows = document.querySelectorAll("#serviceTable tr");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const serviceName = row.querySelector('input[name="service"]').value;
    const originalAmount = parseFloat(
      row.querySelector('input[name="originalAmount"]').value
    );
    const discountPercent = parseFloat(
      row.querySelector('input[name="discountPercent"]').value
    );

    if (!serviceName || !originalAmount) {
      alert("Enter atleast one service and price");
      result = false;
      break; // exit the loop
    }
  }

  return result;
}

function generateInvoice() {
  if (!validateDetails()) return;

  const rows = document.querySelectorAll("#serviceTable tr");
  let total = 0;

  // Clear previous service rows
  const invoiceRows = document.querySelectorAll(".service-row");
  invoiceRows.forEach((row) => row.remove());

  document.querySelector("#serviceTable").classList.add("hidden");

  // Loop through each service row to calculate totals
  rows.forEach((row) => {
    const serviceName = row.querySelector('input[name="service"]').value;
    const originalAmount =
      parseFloat(row.querySelector('input[name="originalAmount"]').value) || 0;
    const discountPercent =
      parseFloat(row.querySelector('input[name="discountPercent"]').value) || 0;
    const discountAmount = (originalAmount * discountPercent) / 100;
    const finalAmount = originalAmount - discountAmount;

    let formattedFinalAmount = `₹${finalAmount.toFixed(2)}`;
    let displayRow = "";

    if (discountPercent === 0 || discountPercent === null) {
      // Display only the original amount when there is no discount
      displayRow = `<td>${serviceName}</td>        <td>${formattedFinalAmount}</td>`;
    } else {
      // If the discount percent is 100%, display "FREE"
      const formattedDiscount =
        discountPercent === 100 ? "FREE" : `${discountPercent}% off`;
      displayRow = `<td>${serviceName}</td>        <td>₹<span class="strikethrough">${originalAmount.toFixed(
        2
      )}</span> (${formattedDiscount}) ${formattedFinalAmount}</td>`;
    }

    // Display the formatted service details in a new row in the invoice
    const invoiceRow = document.createElement("tr");
    invoiceRow.classList.add("service-row");
    invoiceRow.classList.add("item");
    invoiceRow.innerHTML = `${displayRow}`;
    document.querySelector(".invoice-box table").appendChild(invoiceRow);

    total += finalAmount;
  });

  // Remove any existing total row before adding a new one
  const existingTotalRow = document.querySelector(
    ".invoice-box table tr.total"
  );
  if (existingTotalRow) {
    existingTotalRow.remove();
  }

  // Append total as a new row in the invoice
  const totalRow = document.createElement("tr");
  totalRow.classList.add("total");
  totalRow.innerHTML = `<td>Total:</td><td>₹${total.toFixed(2)}</td>`;
  document.querySelector(".invoice-box table").appendChild(totalRow);

  // Update total amount display
  // document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
  document.getElementById("invoiceSummary").classList.remove("hidden");
  document.getElementById("editButton").classList.remove("hidden");
  document.getElementById("btn-add-service").classList.add("hidden");
  document.getElementById("btn-delete-service").classList.add("hidden");
  document.getElementById("btn-generate-service").classList.add("hidden");
  document
    .querySelectorAll(".header-info")
    .forEach((el) => (el.readOnly = true));
  document.querySelector("#clientName").classList.add("disabled-dropdown");

  // console.log(document.getElementById('editButton'));
}

function editInvoice() {
  document.getElementById("serviceTable").classList.remove("hidden");
  const invoiceRows = document.querySelectorAll(".service-row");
  invoiceRows.forEach((row) => row.remove());
  // document.getElementById('totalAmount').textContent = '₹0.00';
  document.getElementById("editButton").classList.add("hidden");
  document.getElementById("invoiceSummary").classList.add("hidden");
  document
    .querySelectorAll(".header-info")
    .forEach((el) => (el.readOnly = false));
  document.querySelector("#clientName").classList.remove("disabled-dropdown");
  document.getElementById("btn-add-service").classList.remove("hidden");
  document.getElementById("btn-delete-service").classList.remove("hidden");
  document.getElementById("btn-generate-service").classList.remove("hidden");
}
