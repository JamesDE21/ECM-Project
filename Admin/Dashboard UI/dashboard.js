//EVACUATION CENTER CAPACITY CHART
var occupied = 0; //Default
var capacity = 5;


var ctx = document.getElementById('capacityChart').getContext('2d');
document.getElementById('chartValue').innerText = occupied; // Set initial chart value
var chartValue = document.getElementById('chartValue'); 
checkOccupancy();

function getColor(value) {
    if (value <= 0.15 * capacity) return 'green';
    if (value <= 0.40 * capacity) return 'lime';
    if (value <= 0.60 * capacity) return 'yellow';
    if (value <= 0.85 * capacity) return '#ff6200';
    return 'red';
}

var capacityChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [occupied, capacity - occupied],
            backgroundColor: [getColor(occupied), 'gray']
        }],
        labels: ['Occupied', 'Available']
    },
    options: {
        responsive: true,
        legend: {
            display: false
        },
        cutoutPercentage: 80,
        tooltips: {
            enabled: true,
            mode: 'nearest',
            intersect: false,
            callbacks: {
                label: function(tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var value = dataset.data[tooltipItem.index];
                    var label = data.labels[tooltipItem.index];
                    return `${label}: ${value}`;
                }
            },
            custom: function(tooltip) {
                if (!tooltip) return;
                // Set the z-index property for the tooltip if needed
                tooltip.displayColors = true;
                var tooltipEl = document.getElementById('chartjs-tooltip');
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = '<table></table>';
                    document.body.appendChild(tooltipEl);
                }
                tooltipEl.style.zIndex = '9999'; // Ensure tooltip is on top
            }
        },
        hover: {
            mode: 'nearest',
            intersect: false,
            onHover: function(event, elements) {
                if (elements.length) {
                    chartValue.classList.add('hidden');
                } else {
                    chartValue.classList.remove('hidden');
                }
            }
        }
    }
});

function updateChart() {
    document.getElementById('chartValue').innerText = occupied; // Update chart value
    capacityChart.data.datasets[0].data[0] = occupied; // Update occupied count in chart
    capacityChart.data.datasets[0].data[1] = capacity - occupied; // Update available count in chart
    capacityChart.data.datasets[0].backgroundColor[0] = getColor(occupied); // Update chart color
    capacityChart.update(); // Redraw the chart
    checkOccupancy();
}

//QR CODE FUNCTIONALITY
document.getElementById("qrButton").onclick = function() {
    $('#qrModal').modal('show');
}

function generateQRCode(idValue) {
    const qr = new QRious({
        value: idValue,
        size: 200 // You can adjust the size as needed
    });
    const qrCodeImage = document.getElementById('qrCodeImage');
    qrCodeImage.src = qr.toDataURL();
}

generateQRCode('10010002'); //Backend: ID Value

function downloadQRCode() {
    const qrCodeImage = document.getElementById('qrCodeImage');
    const link = document.createElement('a');
    link.href = qrCodeImage.src;
    link.download = 'qr-code.png'; // Change to .png to match the generated QR code format
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printQRCode() {
    const qrCodeImage = document.getElementById('qrCodeImage');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                </style>
            </head>
            <body>
                <img src="${qrCodeImage.src}" onload="window.print();window.close()">
            </body>
        </html>
    `);
    printWindow.document.close();
}

//SEARCH BY NAME FUNCTIONALITY
function searchName() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("userTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}

//SORT FUNCTIONALITY
function sortTable(column) {
    var table, rows, switching, i, x, y, shouldSwitch, switchCount = 0;
    table = document.getElementById("userTable");
    switching = true;
    var dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;

            if (column === 'name') {
                x = rows[i].getElementsByTagName("TD")[0];
                y = rows[i + 1].getElementsByTagName("TD")[0];
            } else if (column === 'age') {
                x = rows[i].getElementsByTagName("TD")[2];
                y = rows[i + 1].getElementsByTagName("TD")[2];
            }

            if (dir === "asc") {
                if (column === 'name' && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                } else if (column === 'age' && parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (column === 'name' && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                } else if (column === 'age' && parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCount++;
        } else {
            if (switchCount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

//USER LIST CRUD OPERATIONS
function addUser() {
    trimInput(); // Trim the input fields before validation
    const form = document.getElementById('addUserForm');

    if (form.checkValidity()) {
        const lastName = document.getElementById('userLastName').value;
        const firstName = document.getElementById('userFirstName').value;
        const middleInitial = document.getElementById('userMiddleInitial').value;
        const suffix = document.getElementById('userSuffix').value;
        const address = document.getElementById('userAddress').value;
        const age = document.getElementById('userAge').value;
        const contact = document.getElementById('userContact').value;

        if (!middleInitial) {
            alert('Middle Initial is required.');
            return;
        }

        let formattedName = `${lastName}, ${firstName}`;
        if (middleInitial) {
            formattedName += ` ${middleInitial}.`;
        }
        if (suffix) {
            formattedName += ` ${suffix}`;
        }

        const tbody = document.querySelector('#userTable tbody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${formattedName}</td>
            <td>${address}</td>
            <td>${age}</td>
            <td>${contact}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(this)">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(this)">❌</button>
            </td>
        `;

        tbody.appendChild(newRow);

        occupied++; // Increment occupied count
        updateChart(); // Update the chart
        checkOccupancy(); //Check occupy value, disables add user button

        $('#addUserModal').modal('hide');
        form.reset();
    } else {
        form.reportValidity();
    }
}

function editUser(button) {
    const row = button.parentElement.parentElement;
    const name = row.cells[0].innerText;
    const address = row.cells[1].innerText;
    const age = row.cells[2].innerText;
    const contact = row.cells[3].innerText;


    const [lastName, rest] = name.split(', ');
    const nameParts = rest ? rest.split(' ') : [];

    let firstName = '';
    let middleInitial = '';
    let suffix = '';

    // Helper function to check if a string is a middle initial
    function isMiddleInitial(part) {
        return /^[A-Z]\.$/.test(part);
    }

    // Extract first name, middle initial, and suffix
    for (let i = 0; i < nameParts.length; i++) {
        if (isMiddleInitial(nameParts[i])) {
            middleInitial = nameParts[i].replace('.', '');
            suffix = nameParts.slice(i + 1).join(' ');
            break;
        } else {
            firstName += (firstName ? ' ' : '') + nameParts[i];
        }
    }

    document.getElementById('editUserLastName').value = lastName;
    document.getElementById('editUserFirstName').value = firstName;
    document.getElementById('editUserMiddleInitial').value = middleInitial;
    document.getElementById('editUserSuffix').value = suffix;
    document.getElementById('editUserAddress').value = address;
    document.getElementById('editUserAge').value = age;
    document.getElementById('editUserContact').value = contact;

    document.getElementById('editUserModal').setAttribute('data-row', row.rowIndex);

    $('#editUserModal').modal('show');
}

function updateUser() {
    editUserTrimInput(); // Trim the inputs
    const form = document.getElementById('editUserForm');

    if (form.checkValidity()) {
        const rowIndex = document.getElementById('editUserModal').getAttribute('data-row');
        const tbody = document.querySelector('#userTable tbody');
        const row = tbody.rows[rowIndex - 1];


        const lastName = document.getElementById('editUserLastName').value;
        const firstName = document.getElementById('editUserFirstName').value;
        const middleInitial = document.getElementById('editUserMiddleInitial').value;
        const suffix = document.getElementById('editUserSuffix').value;
        const address = document.getElementById('editUserAddress').value;
        const age = document.getElementById('editUserAge').value;
        const contact = document.getElementById('editUserContact').value;

        let formattedName = `${lastName}, ${firstName}`;
        if (middleInitial) {
            formattedName += ` ${middleInitial}.`;
        }
        if (suffix) {
            formattedName += ` ${suffix}`;
        }

        row.cells[0].innerText = formattedName;
        row.cells[1].innerText = address;
        row.cells[2].innerText = age;
        row.cells[3].innerText = contact;

        $('#editUserModal').modal('hide');
        form.reset();
    } else {
        form.reportValidity();
    }
}

function deleteUser(button) {
    const row = button.parentElement.parentElement;
    row.remove();

    occupied--; // Decrement occupied count
    updateChart(); // Update the chart
}

//DISABLE ADD USER BUTTON WHEN FULLY OCCUPIED
function checkOccupancy() {
    const addUserButton = document.getElementById('addUserButton');
    if (occupied >= capacity) {
        addUserButton.disabled = true;
    } else {
        addUserButton.disabled = false;
    }
}

//TRIM TRAILING SPACE INPUTS
function trimInput() {
    var lastnameInput = document.getElementById("userLastName");
    var firstnameInput = document.getElementById("userFirstName");
    var addressInput = document.getElementById("userAddress");
    
    lastnameInput.value = lastnameInput.value.trim();
    firstnameInput.value = firstnameInput.value.trim();
    addressInput.value = addressInput.value.trim();
    
}

function editUserTrimInput() {
    var lastnameUpdate = document.getElementById("editUserLastName");
    var firstnameUpdate = document.getElementById("editUserFirstName");
    var addressUpdate = document.getElementById("editUserAddress");
    lastnameUpdate.value = lastnameUpdate.value.trim();
    firstnameUpdate.value = firstnameUpdate.value.trim();
    addressUpdate.value = addressUpdate.value.trim();
}

//'09' CONTACT NUMBER INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    const contactInput = document.getElementById('userContact');
    const addUserModal = document.getElementById('addUserModal');

    // Function to initialize contact input
    function initializeContactInput() {
        contactInput.value = '09'; // Initial value
    }

    // Initialize the contact input when the modal is shown
    $('#addUserModal').on('shown.bs.modal', function () {
        initializeContactInput();
    });

    // Initialize the contact input when the form is reset
    document.getElementById('addUserForm').addEventListener('reset', initializeContactInput);

    contactInput.addEventListener('input', function() {
        let value = contactInput.value.replace(/\D/g, ''); // Remove non-digits

        // Ensure it always starts with '09'
        if (!value.startsWith('09')) {
            value = '09' + value.substring(2);
        }

        if (value.length > 4) {
            value = value.substring(0, 4) + ' ' + value.substring(4);
        }
        if (value.length > 8) {
            value = value.substring(0, 8) + ' ' + value.substring(8);
        }
        if (value.length > 13) {
            value = value.substring(0, 13);
        }

        contactInput.value = value;
    });

    contactInput.addEventListener('keydown', function(e) {
        const key = e.key;
        const value = contactInput.value;
        if (key === 'Backspace' && value.endsWith(' ')) {
            contactInput.value = value.slice(0, -1); // Remove space on backspace
        }
    });
});



















// Ensure the DOM is fully loaded before executing scripts. REMOVE THIS FUNCTION ONCE DONE
/*document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the logged-in email from sessionStorage
    var loggedInEmail = sessionStorage.getItem('loggedInEmail');

    // Check if the email is available
    if (loggedInEmail) {
        // Alert the email
        alert('Logged in as: ' + loggedInEmail);
    } else {
        alert("No logged-in email found.");
    }
});*/

$(document).ready(function() {
    // Automatically open the modal when the page loads
    $('#infoModal').modal('show');

    document.getElementById('infoForm').addEventListener('submit', function(event) {
        event.preventDefault();

        var name = document.getElementById('adminName').value;
        var address = document.getElementById('adminAddress').value;
        var telephone = document.getElementById('adminTelephone').value;
        var capacity = document.getElementById('capacity').value;

        var email = sessionStorage.getItem('loggedInEmail'); // Assuming email is stored in sessionStorage on login

        if (email) {
            dummyDatabase.updateAccountDetails(email, name, address, telephone, capacity);

            // Close the modal
            $('#infoModal').modal('hide');

            alert('Account details updated successfully!\n\n' +
                'Name: ' + updatedAccount.name + '\n' +
                'Address: ' + updatedAccount.address + '\n' +
                'Telephone: ' + updatedAccount.telephoneNo + '\n' +
                'Capacity: ' + updatedAccount.capacity);
        } else {
            alert('No logged-in user found.');
        }
    });
});



/*document.querySelector('.dashboard .header button').addEventListener('click', function() {
    var account = dummyDatabase.accounts.find(account => account.email === loggedInEmail);

    if (account) {
        document.getElementById('name').value = account.name;
        document.getElementById('address').value = account.address;
        document.getElementById('telephone').value = account.telephoneNo;
        document.getElementById('capacity').value = account.capacity;

        var infoModal = new bootstrap.Modal(document.getElementById('infoModal'));
        infoModal.show();
    }
});*/

