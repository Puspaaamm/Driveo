const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML UI)
app.use(express.static('public'));

// 1. Fetch Video Metadata (Thumbnail, Title, Duration)
app.post('/api/fetch-info', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL आवश्यक है' });

    // yt-dlp का उपयोग करके फ़ास्ट मेटाडेटा लाएं
    const command = `yt-dlp --dump-json --no-warnings "${url}"`;

    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
            console.error(stderr);
            return res.status(500).json({ error: 'लिंक प्रोसेस करने में समस्या आई।' });
        }
        try {
            const info = JSON.parse(stdout);
            res.json({
                title: info.title,
                thumbnail: info.thumbnail,
                duration: info.duration_string || 'N/A'
            });
        } catch (e) {
            res.status(500).json({ error: 'डेटा रिस्पॉन्स पढ़ने में त्रुटि' });
        }
    });
});

// 2. Snaptube/Seal Multi-Format Download Link Generator
app.post('/api/download', (req, res) => {
    const { url, quality } = req.body; // quality = 'best', '1080p', 'mp3', etc.
    
    let formatOption = 'bestvideo+bestaudio/best';
    if (quality === 'mp3') {
        formatOption = 'bestaudio';
    } else if (quality === '1080p') {
        formatOption = 'bestvideo[height<=1080]+bestaudio/best[height<=1080]';
    } else if (quality === '720p') {
        formatOption = 'bestvideo[height<=720]+bestaudio/best[height<=720]';
    }

    // Direct stream link generation using FFmpeg merging logic
    const command = `yt-dlp -g -f "${formatOption}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'डाउनलोड लिंक तैयार नहीं हो सका।' });
        }
        const links = stdout.trim().split('\n');
        res.json({ downloadUrl: links[0] });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Driveo Downloader Server online on port ${PORT}`);
});
