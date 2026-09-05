function extractFileId(url) {
    let match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

function showSuccessAnimation(msg) {
    const successBox = document.getElementById('successBox');
    const successMsg = document.getElementById('successMessage');
    
    if (successBox && successMsg) {
        successMsg.innerText = msg;
        successBox.classList.add('show');

        setTimeout(() => {
            successBox.classList.remove('show');
        }, 3500);
    }
}

function downloadDirect() {
    const inputUrl = document.getElementById('driveUrl').value.trim();
    const fileId = extractFileId(inputUrl);

    if (!fileId) {
        alert('Kripya sahi Google Drive link daalein!');
        return;
    }

    // Drive App ko bypass karne ke liye direct usercontent domain
    const directLink = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
    
    // Browser force download trigger
    const a = document.createElement('a');
    a.href = directLink;
    a.rel = 'noopener noreferrer';
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showSuccessAnimation('Download Started!');
}

function generateLink() {
    const inputUrl = document.getElementById('driveUrl').value.trim();
    const fileId = extractFileId(inputUrl);

    if (!fileId) {
        alert('Kripya sahi Google Drive link daalein!');
        return;
    }

    const directLink = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
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
