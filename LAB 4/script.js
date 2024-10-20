const dataDirectory = './data/';
const referenceFile = 'reference.json';
const data3File = 'data3.json';

function populateTable(data) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear any existing data

    data.forEach((entry) => {
        const row = document.createElement('tr');
        const [firstName, lastName] = entry.name.split(' ');
        row.innerHTML = `
            <td>${firstName}</td>
            <td>${lastName}</td>
            <td>${entry.id}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Approach 1: Synchronous XMLHttpRequest
function fetchDataSync() {
    const data = [];
    
    const request = new XMLHttpRequest();
    request.open('GET', dataDirectory + referenceFile, false);
    request.send();
    
    if (request.status === 200) {
        const reference = JSON.parse(request.responseText);
        
        // Fetch data1.json
        request.open('GET', dataDirectory + reference.data_location, false);
        request.send();
        if (request.status === 200) {
            const data1 = JSON.parse(request.responseText);
            data.push(...data1.data);
            
            // Fetch data2.json
            request.open('GET', dataDirectory + data1.data_location, false);
            request.send();
            if (request.status === 200) {
                const data2 = JSON.parse(request.responseText);
                data.push(...data2.data);
                
                // Fetch data3.json
                request.open('GET', dataDirectory + data3File, false);
                request.send();
                if (request.status === 200) {
                    const data3 = JSON.parse(request.responseText);
                    data.push(...data3.data);
                }
            }
        }
    }
    
    populateTable(data);
}

// Approach 2: Asynchronous XMLHttpRequest with Callbacks
function fetchDataAsync() {
    const data = [];
    
    const requestReference = new XMLHttpRequest();
    requestReference.open('GET', dataDirectory + referenceFile, true);
    requestReference.onreadystatechange = function () {
        if (requestReference.readyState === 4 && requestReference.status === 200) {
            const reference = JSON.parse(requestReference.responseText);
            
            const requestData1 = new XMLHttpRequest();
            requestData1.open('GET', dataDirectory + reference.data_location, true);
            requestData1.onreadystatechange = function () {
                if (requestData1.readyState === 4 && requestData1.status === 200) {
                    const data1 = JSON.parse(requestData1.responseText);
                    data.push(...data1.data);
                    
                    const requestData2 = new XMLHttpRequest();
                    requestData2.open('GET', dataDirectory + data1.data_location, true);
                    requestData2.onreadystatechange = function () {
                        if (requestData2.readyState === 4 && requestData2.status === 200) {
                            const data2 = JSON.parse(requestData2.responseText);
                            data.push(...data2.data);
                            
                            const requestData3 = new XMLHttpRequest();
                            requestData3.open('GET', dataDirectory + data3File, true);
                            requestData3.onreadystatechange = function () {
                                if (requestData3.readyState === 4 && requestData3.status === 200) {
                                    const data3 = JSON.parse(requestData3.responseText);
                                    data.push(...data3.data);
                                    populateTable(data);
                                }
                            };
                            requestData3.send();
                        }
                    };
                    requestData2.send();
                }
            };
            requestData1.send();
        }
    };
    requestReference.send();
}

// Approach 3: Fetch with Promises
function fetchDataWithFetch() {
    const data = [];
    
    fetch(dataDirectory + referenceFile)
        .then((response) => response.json())
        .then((reference) => {
            return fetch(dataDirectory + reference.data_location);
        })
        .then((response) => response.json())
        .then((data1) => {
            data.push(...data1.data);
            return fetch(dataDirectory + data1.data_location);
        })
        .then((response) => response.json())
        .then((data2) => {
            data.push(...data2.data);
            return fetch(dataDirectory + data3File);
        })
        .then((response) => response.json())
        .then((data3) => {
            data.push(...data3.data);
            populateTable(data);
        })
        .catch((error) => console.error('Error fetching data:', error));
}
