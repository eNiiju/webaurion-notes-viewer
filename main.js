/* ------------------------------------------------------------------------- */
/*                             Global variables                              */
/* ------------------------------------------------------------------------- */

const $ = (css, parent = document) => parent.querySelector(css);
const $$ = (css, parent = document) => Array.from(parent.querySelectorAll(css));
const id$ = (id, parent = document) => parent.getElementById(id);

const acceptedFileTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel'];

let csvData = null;



/* ------------------------------------------------------------------------- */
/*                              Event handlers                               */
/* ------------------------------------------------------------------------- */

id$('csv-file').addEventListener('change', handleCsvFileChange);
$('.button-validate-wrapper').addEventListener('click', handleValidateFileUpload);
id$('select-lessons').addEventListener('change', handleSelectLesson);



/* ------------------------------------------------------------------------- */
/*                                 Functions                                 */
/* ------------------------------------------------------------------------- */

/**
 * Parses a CSV file content in JSON and store it inside
 * the `csvData` global variable.
 * @param {string} csvContent CSV's file data as a string
 */
function parseCsv(csvContent) {
    csvData = CSVJSON.csv2json(csvContent, { parseNumbers: true });
}

/**
 * Handles the `change` event for the `#csv-file` input file. 
 */
function handleCsvFileChange() {
    const file = this.files[0];

    if (!file) return;
    if (!acceptedFileTypes.includes(file.type)) {
        alert('Mauvais format de fichier. (CSV)');
        return;
    }

    // Update file name shown to the user
    this.form['csv-file-name'].value = this.files[0].name;

    // Read the content of the file as a string
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = e => parseCsv(e.target.result);
    reader.onerror = e => console.error(e);
}

/**
 * Handles the press of the file upload validation button.
 */
function handleValidateFileUpload() {
    if (!csvData) return;

    // Hide the file upload form and show the main content
    $('.csv-form').style.display = 'none';
    $('main').style.display = 'block';

    // Retrieve all test names from the CSV file
    const testNames = csvData.map(data => data['??preuve'].split(' - ')[0]);

    // Remove duplicates
    const uniqueTestNames = [...new Set(testNames)];

    // Add options to the select-lessons element
    id$('select-lessons').innerHTML = uniqueTestNames.map(name => `<option value="${name}">${name}</option>`).join('');

    // Select the first option
    handleSelectLesson(uniqueTestNames[0]);
}

/**
 * Handles the `change` event for the `#select-lessons` select element.
 * @param {string?} value The selected option's value
 */
function handleSelectLesson(value) {
    const selectedLesson = this.value ?? value;
    const notes = csvData.filter(data => data['??preuve'].startsWith(selectedLesson));

    $('.tests').innerHTML = notes.map(note => `
        <div class="test" id="test-${note['id.??preuve']}" onclick="toggleTestInfos(${note['id.??preuve']})">
            <div class="test-main-infos">
                <div class="left">
                    <div class="test-name-and-details">
                        <h2 class="test-name">${note['??preuve'].split(' - ')[1]}</h2>
                        <h3 class="test-details">${note['D??tail sur le contr??le']}</h3>
                    </div>
                </div>
                <div class="right">
                    <span class="test-note">${note['Note'] ? note['Note'] : 'X'}</span>
                </div>
            </div>

            <div class="test-more-infos">
                <div class="test-info">
                    <div class="test-info-title">ID ??preuve</div>
                    <div class="test-info-value">${note['id.??preuve']}</div>
                </div>
                <div class="test-info">
                    <div class="test-info-title">Type de contr??le</div>
                    <div class="test-info-value">${note['Modalit?? de contr??le de connaissances']}</div>
                </div>
                <div class="test-info">
                    <div class="test-info-title">Coef. de la moyenne du CC/CT dans la moyenne de la mati??re</div>
                    <div class="test-info-value">${note['Coef de la moyenne du CC ou CT dans la moy de la mati??re']}</div>
                </div>
                <div class="test-info">
                    <div class="test-info-title">Coef. de l'??preuve dans la moyenne CC/CT</div>
                    <div class="test-info-value">${note['Coefficient de l\'??preuve dans la moyenne CC ou CT']}</div>
                </div>
                <div class="test-info">
                    <div class="test-info-title">Date du contr??le</div>
                    <div class="test-info-value">${note['D??but']} - ${note['Fin']}</div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Toggle the visibility of a test's infos.
 * @param {number} testId The test's id
 */
function toggleTestInfos(testId) {
    const testElement = id$(`test-${testId}`);
    testElement.classList.toggle('active');
}
