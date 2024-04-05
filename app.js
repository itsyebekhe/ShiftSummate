// Helper function to convert time to minutes
const timeToMinutes = (time) => {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
};

// Constants for day and night boundaries
const nightStart = 22 * 60; // 10 PM in minutes
const nightEnd = 6 * 60; // 6 AM in minutes

// Function to calculate salary
function calculateSalary(startTime, endTime, dayRate, nightRate) {
	// Convert start and end times to minutes
	const start = timeToMinutes(startTime);
	const end = timeToMinutes(endTime);

	// Initialize dayTime and nightTime
	let dayTime = 0;
	let nightTime = 0;

	// Calculate dayTime and nightTime
	for (let t = start; t !== end; t = (t + 1) % (24 * 60)) {
		if ((t >= nightEnd && t < nightStart)) {
			dayTime++;
		} else {
			nightTime++;
		}
		// When the loop reaches the end time, break out of the loop
		if (t === end - 1) break;
	}

	// Convert minutes to hours
	dayTime /= 60;
	nightTime /= 60;

	// Calculate salary
	const salary = dayTime * dayRate + nightTime * nightRate;
	return salary;
}

// Function to convert Gregorian date to Jalaali date
function convertToJalaali(gregorianDate) {
  // Split the Gregorian date string into year, month, and day
  var parts = gregorianDate.split('-');
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10); // JavaScript months are zero-based
  var day = parseInt(parts[2], 10);

  // Convert the Gregorian date to Jalaali
  var jalaaliDate = jalaali.toJalaali(year, month, day);

  // Format the Jalaali date as a string
  var formattedDate = jalaaliDate.jy + '/' + jalaaliDate.jm.toString().padStart(2, '0') + '/' + jalaaliDate.jd.toString().padStart(2, '0');

  // Return the formatted Jalaali date
  return formattedDate;
}

// Function to update table with Jalaali dates
function updateWithJalaaliDates() {
  var table = document.getElementById('shiftTable');
  var rows = table.getElementsByTagName('tr');

  for (var i = 1; i < rows.length; i++) { // Skip the header row
    var cells = rows[i].getElementsByTagName('td');
    var gregorianDate = cells[1].innerText; // Assuming the date is in the second column
    var jalaaliDate = convertToJalaali(gregorianDate);
    cells[1].innerText = jalaaliDate; // Update the date cell with the Jalaali date
  }
}
// Initialize a variable to keep track of the total salary
let totalSalary = 0;

// Function to add shift details to the table and update total salary
function addShiftDetails(data) {
	var workplace = data ? data.workplace : document.getElementById('workplace').value;
	var date = data ? data.date : document.getElementById('date').value;
	var startTime = data ? data.startTime : document.getElementById('startTime').value;
	var endTime = data ? data.endTime : document.getElementById('endTime').value;
	var dayRate = data ? parseFloat(data.dayRate) : parseFloat(document.getElementById('dayRate').value);
	var nightRate = data ? parseFloat(data.nightRate) : parseFloat(document.getElementById('nightRate').value);

	// Calculate the salary for the shift
	var salary = calculateSalary(startTime, endTime, dayRate, nightRate);

	// Update the total salary
	totalSalary += salary;

	// Create a new row for the table
	var table = document.getElementById('shiftTable');
	var row = table.insertRow(-1);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var cell6 = row.insertCell(5);
	var cell7 = row.insertCell(6);
	var cell8 = row.insertCell(7);
	var cell9 = row.insertCell(8);

	// Insert data into the new row
	cell1.innerHTML = workplace;
	cell2.innerHTML = date;
	cell3.innerHTML = startTime;
	cell4.innerHTML = endTime;
	cell5.innerHTML = dayRate.toFixed(2);
	cell6.innerHTML = nightRate.toFixed(2);
	cell7.innerHTML = salary.toFixed(2);
	cell8.innerHTML = totalSalary.toFixed(2);

	// Create edit and delete buttons
	var editButton = document.createElement('button');
	editButton.innerHTML = 'ویرایش';
	editButton.onclick = function() {
		editRow(row);
	};
	cell9.appendChild(editButton);

	var deleteButton = document.createElement('button');
	deleteButton.innerHTML = 'حذف';
	deleteButton.onclick = function() {
		deleteRow(row);
	};
	cell9.appendChild(deleteButton);

	// Clear input fields after adding the shift details
	if (!data) {
		document.getElementById('workplace').value = '';
		document.getElementById('date').value = '';
		document.getElementById('startTime').value = '';
		document.getElementById('endTime').value = '';
		document.getElementById('dayRate').value = '';
		document.getElementById('nightRate').value = '';
	}
}
// Function to copy table content to clipboard
function copyTableToClipboard() {
	var table = document.getElementById('shiftTable');
	var rows = table.getElementsByTagName('tr');
	var text = '';

	for (var i = 1; i < rows.length; i++) { // Skip the header row
		var cells = rows[i].getElementsByTagName('td');
		text += cells[1].innerText + ' ' + cells[0].innerText + ' ' + cells[2].innerText + ' تا ' + cells[3].innerText + '\n';
	}

	// Create a temporary textarea to copy the text
	var textarea = document.createElement('textarea');
	textarea.value = text;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);

	alert('Table content copied to clipboard!');
}
// Function to save table data to localStorage
function saveTableToLocalStorage() {
    var table = document.getElementById('shiftTable');
    var rows = table.getElementsByTagName('tr');
    var data = [];

    for (var i = 1; i < rows.length; i++) { // Skip the header row
        var cells = rows[i].getElementsByTagName('td');
        var rowData = {
            workplace: cells[0].innerText,
            date: cells[1].innerText,
            startTime: cells[2].innerText,
            endTime: cells[3].innerText,
            dayRate: cells[4].innerText,
            nightRate: cells[5].innerText,
            salary: cells[6].innerText,
            totalSalary: cells[7].innerText
        };
        data.push(rowData);
    }

    // Convert the data to a JSON string and save it to localStorage
    localStorage.setItem('shiftTableData', JSON.stringify(data));
    alert('Table data saved to localStorage!');
}

// Function to reset the table
function resetTable() {
	var table = document.getElementById('shiftTable');
	var rows = table.getElementsByTagName('tr');

	// Start from the last row and delete until only the header row is left
	while (rows.length > 1) {
		table.deleteRow(rows.length - 1);
	}

	// Reset the total salary
	totalSalary = 0;
	document.cookie = "shiftTableData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	alert('Table reset!');
}

// Function to delete a row
function deleteRow(row) {
	var table = document.getElementById('shiftTable');
	table.deleteRow(row.rowIndex);
	updateTotalSalary();
	alert('Row deleted!');
}

// Function to edit a row
function editRow(row) {
	// Hide the "Add Shift and Calculate Salary" button
	document.querySelector('button[onclick="addShiftDetails()"]').style.display = 'none';

	// Show the form fields and the "Submit Changes" and "Cancel" buttons
	var form = document.getElementById('shiftForm');
	form.style.display = 'block';
	document.getElementById('submitEdit').style.display = 'inline-block';
	document.getElementById('cancelEdit').style.display = 'inline-block';

	// Populate the form fields with the current row's data
	form.elements.workplace.value = row.cells[0].innerText;
	form.elements.date.value = row.cells[1].innerText;
	form.elements.startTime.value = row.cells[2].innerText;
	form.elements.endTime.value = row.cells[3].innerText;
	form.elements.dayRate.value = row.cells[4].innerText;
	form.elements.nightRate.value = row.cells[5].innerText;

	// Store the row reference in a data attribute for later use
	form.dataset.editRow = row.rowIndex;
}

function getPreviousRow(rowIndex) {
  const table = document.getElementById('shiftTable');
  const previousRow = (rowIndex > 0 && rowIndex < table.rows.length)
    ? table.rows[rowIndex - 1]
    : null;
  return previousRow;
}

// Function to update shift details
function updateShiftDetails(event) {
  event.preventDefault(); // Prevent the form from submitting

  var form = document.getElementById('shiftForm');
  var rowIndex = form.dataset.editRow;
  var previousRowIndex = getPreviousRow(rowIndex);
  var row = document.getElementById('shiftTable').rows[rowIndex];
  var previousRow = previousRowIndex !== null ? document.getElementById('shiftTable').rows[previousRowIndex] : null;

  // Update the row with the new shift details
  row.cells[0].innerText = form.elements.workplace.value;
  row.cells[1].innerText = form.elements.date.value;
  row.cells[2].innerText = form.elements.startTime.value;
  row.cells[3].innerText = form.elements.endTime.value;
  row.cells[4].innerText = form.elements.dayRate.value;
  row.cells[5].innerText = form.elements.nightRate.value;

  // Recalculate the salary and update the total salary
  var salary = calculateSalary(form.elements.startTime.value, form.elements.endTime.value, parseFloat(form.elements.dayRate.value), parseFloat(form.elements.nightRate.value));
  row.cells[6].innerText = salary.toFixed(2);

  // Get the total salary from the previous row and column 7
  var totalSalary = previousRow ? parseFloat(previousRow.cells[7].innerText) : 0;
  totalSalary += salary; // Add the new salary
  row.cells[7].innerText = totalSalary.toFixed(2); // Update the total salary in the current row

  // Clear the form data and hide the form buttons
  form.reset();
  delete form.dataset.editRow;
  document.getElementById('submitEdit').style.display = 'none';
  document.getElementById('cancelEdit').style.display = 'none';

  // Show the "Add Shift and Calculate Salary" button
  document.querySelector('button[onclick="addShiftDetails()"]').style.display = 'inline-block';
}
// Function to cancel editing
function cancelTheEdit() {
	var form = document.getElementById('shiftForm');
	form.reset();
	delete form.dataset.editRow;

	// Hide the form buttons and show the "Add Shift and Calculate Salary" button
	document.getElementById('submitEdit').style.display = 'none';
	document.getElementById('cancelEdit').style.display = 'none';
	document.querySelector('button[onclick="addShiftDetails()"]').style.display = 'inline-block';
}

// Load table data from localStorage on page load
window.onload = function() {
    var localStorageData = localStorage.getItem('shiftTableData');
    if (localStorageData) {
        var data = JSON.parse(localStorageData);
        for (var i = 0; i < data.length; i++) {
            addShiftDetails(data[i]);
        }
    }
};

function exportTableToCSV() {
  const table = document.getElementById('shiftTable');
  const rows = Array.from(table.querySelectorAll('tr')).map(row => {
    return Array.from(row.querySelectorAll('td, th')).map(cell => {
      return cell.innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/"/g, '""');
    });
  });

  const csvContent = Papa.unparse(rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'shift_details.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importCSV(file) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const table = document.getElementById('shiftTable');
      table.innerHTML = ''; // Clear the table

      results.data.forEach((rowData, index) => {
        const rowElement = document.createElement('tr');

        Object.values(rowData).forEach(cellData => {
          const cellElement = document.createElement(index === 0 ? 'th' : 'td');
          cellElement.textContent = cellData;
          rowElement.appendChild(cellElement);
        });

        table.appendChild(rowElement);
      });
    }
  });
}

function importFileClick() {
  document.getElementById('importFile').click();
}