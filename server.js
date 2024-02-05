const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;

        if (!ytdl.validateURL(URL)) {
            res.status(400).send("Invalid YouTube URL");
            return;
        }

        const info = await ytdl.getInfo(URL);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

        res.header('Content-Disposition', `attachment; filename="${info.title}.mp4"`);
        ytdl(URL, {
            format: format
        }).pipe(res);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
