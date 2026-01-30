/**
 * TCX Heart Rate Merger - Frontend Application
 * All processing is done client-side in the browser.
 */

// Configuration
const CONFIG = {
    MAX_FILE_SIZE_MB: 15,
};

// TCX namespace
const TCX_NAMESPACE = 'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2';

// DOM Elements
const form = document.getElementById('merge-form');
const hrFileInput = document.getElementById('hr-file');
const mainFileInput = document.getElementById('main-file');
const hrFileInfo = document.getElementById('hr-file-info');
const mainFileInfo = document.getElementById('main-file-info');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const resultDiv = document.getElementById('result');
const resultSuccess = document.getElementById('result-success');
const resultError = document.getElementById('result-error');
const resultMessage = document.getElementById('result-message');
const errorMessage = document.getElementById('error-message');
const downloadBtn = document.getElementById('download-btn');

// State
let mergedFileData = null;
let mergedFilename = 'merged_activity.tcx';

/**
 * Validate file size before processing
 * @param {File} file - The file to validate
 * @returns {Object} - {valid: boolean, message: string}
 */
function validateFile(file) {
    const maxSizeBytes = CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024;
    
    if (!file) {
        return { valid: false, message: '' };
    }
    
    if (!file.name.toLowerCase().endsWith('.tcx')) {
        return { valid: false, message: 'Please select a .tcx file' };
    }
    
    if (file.size > maxSizeBytes) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return { 
            valid: false, 
            message: `File too large (${sizeMB} MB). Maximum size is ${CONFIG.MAX_FILE_SIZE_MB} MB` 
        };
    }
    
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return { valid: true, message: `✓ ${file.name} (${sizeMB} MB)` };
}

/**
 * Update file info display
 * @param {HTMLElement} infoElement - The info element to update
 * @param {Object} validation - The validation result
 */
function updateFileInfo(infoElement, validation) {
    infoElement.textContent = validation.message;
    infoElement.className = 'file-info ' + (validation.valid ? 'valid' : 'error');
}

/**
 * Check if form is valid and update submit button state
 */
function updateFormState() {
    const hrValid = hrFileInput.files.length > 0 && validateFile(hrFileInput.files[0]).valid;
    const mainValid = mainFileInput.files.length > 0 && validateFile(mainFileInput.files[0]).valid;
    submitBtn.disabled = !(hrValid && mainValid);
}

/**
 * Show/hide loading state
 * @param {boolean} loading - Whether to show loading state
 */
function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.hidden = loading;
    btnLoading.hidden = !loading;
}

/**
 * Show result section
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - The message to display
 */
function showResult(success, message) {
    resultDiv.hidden = false;
    resultSuccess.hidden = !success;
    resultError.hidden = success;
    
    if (success) {
        resultMessage.textContent = message;
    } else {
        errorMessage.textContent = message;
    }
}

/**
 * Hide result section
 */
function hideResult() {
    resultDiv.hidden = true;
    mergedFileData = null;
}

/**
 * Download the merged file
 */
function downloadMergedFile() {
    if (!mergedFileData) return;
    
    const blob = new Blob([mergedFileData], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mergedFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

/**
 * Read file as text
 * @param {File} file - The file to read
 * @returns {Promise<string>} - The file content as text
 */
function readFileAsText(file) {
    return file.text();
}

/**
 * XPath helper with namespace support for TCX
 * @param {Document|Element} context - The context to search in
 * @param {string} xpath - The XPath expression
 * @returns {Array<Element>} - Array of matching elements
 */
function tcxQuery(context, xpath) {
    const doc = context.ownerDocument || context;
    const resolver = () => TCX_NAMESPACE;
    const result = doc.evaluate(
        xpath,
        context,
        resolver,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    const elements = [];
    for (let i = 0; i < result.snapshotLength; i++) {
        elements.push(result.snapshotItem(i));
    }
    return elements;
}

/**
 * Get or create HeartRateBpm element in a trackpoint
 * @param {Document} doc - The XML document
 * @param {Element} trackpoint - The trackpoint element
 * @returns {Element} - The HeartRateBpm/Value element
 */
function getOrCreateHRElement(doc, trackpoint) {
    // Look for existing HeartRateBpm element
    let hrbpm = tcxQuery(trackpoint, 'tcx:HeartRateBpm')[0];
    
    if (!hrbpm) {
        // Create HeartRateBpm element with proper namespace
        hrbpm = doc.createElementNS(TCX_NAMESPACE, 'HeartRateBpm');
        const value = doc.createElementNS(TCX_NAMESPACE, 'Value');
        hrbpm.appendChild(value);
        trackpoint.appendChild(hrbpm);
    }
    
    // Get or create Value element
    let value = tcxQuery(hrbpm, 'tcx:Value')[0];
    if (!value) {
        value = doc.createElementNS(TCX_NAMESPACE, 'Value');
        hrbpm.appendChild(value);
    }
    
    return value;
}

/**
 * Merge heart rate data from one TCX document into another
 * @param {string} hrContent - XML content of TCX file with HR data
 * @param {string} mainContent - XML content of TCX file to merge into
 * @returns {Object} - {mergedContent: string, count: number}
 */
function mergeTcxHeartRate(hrContent, mainContent) {
    const parser = new DOMParser();
    
    // Parse both XML documents
    const hrDoc = parser.parseFromString(hrContent, 'application/xml');
    const mainDoc = parser.parseFromString(mainContent, 'application/xml');
    
    // Check for parsing errors
    const hrError = hrDoc.querySelector('parsererror');
    const mainError = mainDoc.querySelector('parsererror');
    
    if (hrError) {
        throw new Error('Failed to parse HR file: Invalid XML');
    }
    if (mainError) {
        throw new Error('Failed to parse main file: Invalid XML');
    }
    
    // Build timestamp -> HR value map from HR file
    const hrMap = new Map();
    const hrTrackpoints = tcxQuery(hrDoc, '//tcx:Trackpoint');
    
    for (const tp of hrTrackpoints) {
        const timeEl = tcxQuery(tp, 'tcx:Time')[0];
        const hrValueEl = tcxQuery(tp, 'tcx:HeartRateBpm/tcx:Value')[0];
        
        if (timeEl && hrValueEl) {
            hrMap.set(timeEl.textContent, hrValueEl.textContent);
        }
    }
    
    // Merge HR values into main file
    let count = 0;
    const mainTrackpoints = tcxQuery(mainDoc, '//tcx:Trackpoint');
    
    for (const tp of mainTrackpoints) {
        const timeEl = tcxQuery(tp, 'tcx:Time')[0];
        
        if (timeEl && hrMap.has(timeEl.textContent)) {
            const valueEl = getOrCreateHRElement(mainDoc, tp);
            valueEl.textContent = hrMap.get(timeEl.textContent);
            count++;
        }
    }
    
    // Serialize back to XML string
    const serializer = new XMLSerializer();
    let mergedContent = serializer.serializeToString(mainDoc);
    
    // Add XML declaration if missing
    if (!mergedContent.startsWith('<?xml')) {
        mergedContent = '<?xml version="1.0" encoding="UTF-8"?>\n' + mergedContent;
    }
    
    return { mergedContent, count };
}

/**
 * Submit the form and process files locally
 * @param {Event} e - The submit event
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    hideResult();
    setLoading(true);
    
    try {
        // Read both files
        const [hrContent, mainContent] = await Promise.all([
            readFileAsText(hrFileInput.files[0]),
            readFileAsText(mainFileInput.files[0])
        ]);
        
        // Perform the merge
        const { mergedContent, count } = mergeTcxHeartRate(hrContent, mainContent);
        
        // Store result for download
        mergedFileData = mergedContent;
        
        // Generate output filename based on main file
        const mainFileName = mainFileInput.files[0].name;
        const baseName = mainFileName.replace(/\.tcx$/i, '');
        mergedFilename = `${baseName}_with_hr.tcx`;
        
        showResult(
            true, 
            `Successfully merged heart rate data into ${count} trackpoints.`
        );
        
    } catch (error) {
        console.error('Merge error:', error);
        showResult(false, error.message || 'Failed to merge files. Please try again.');
    } finally {
        setLoading(false);
    }
}

// Event listeners
hrFileInput.addEventListener('change', () => {
    const validation = validateFile(hrFileInput.files[0]);
    updateFileInfo(hrFileInfo, validation);
    updateFormState();
    hideResult();
});

mainFileInput.addEventListener('change', () => {
    const validation = validateFile(mainFileInput.files[0]);
    updateFileInfo(mainFileInfo, validation);
    updateFormState();
    hideResult();
});

form.addEventListener('submit', handleSubmit);
downloadBtn.addEventListener('click', downloadMergedFile);

// Initialize
updateFormState();
