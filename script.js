function extractFileId(url) {
    let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

function showSuccessAnimation(msg) {
    const successBox = document.getElementById('successBox');
    const successMsg = document.getElementById('successMessage');
    
    successMsg.innerText = msg;
    successBox.classList.add('show');

    setTimeout(() => {
        successBox.classList.remove('show');
    }, 3500);
}

function downloadDirect() {
    const inputUrl = document.getElementById('driveUrl').value.trim();
    const fileId = extractFileId(inputUrl);

    if (!fileId) {
        alert('Kripya sahi Google Drive link daalein!');
        return;
    }

    const directLink = 'https://drive.google.com/uc?export=download&id=' + fileId;
    window.open(directLink, '_blank');
    
    showSuccessAnimation('Download Started Successfully!');
}

function generateLink() {
    const inputUrl = document.getElementById('driveUrl').value.trim();
    const fileId = extractFileId(inputUrl);

    if (!fileId) {
        alert('Kripya sahi Google Drive link daalein!');
        return;
    }

    const directLink = 'https://drive.google.com/uc?export=download&id=' + fileId;
    document.getElementById('directUrl').value = directLink;
    document.getElementById('outputBox').classList.add('active');
    
    showSuccessAnimation('Direct Link Generated!');
}

function copyToClipboard() {
    const directUrlInput = document.getElementById('directUrl');
    directUrlInput.select();
    document.execCommand('copy');
    
    showSuccessAnimation('Link Copied To Clipboard!');
}

