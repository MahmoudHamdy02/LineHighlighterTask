const express = require('express');
const spawn = require('child_process').spawn;
const fs = require("fs");

const app = express();

const upload = require('./upload');

app.post('/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    const ls = spawn('python', ['lines.py', "uploads/" + req.file.filename]);
    
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
            var data = fs.readFileSync(`./output.pdf`);
            fs.unlink(`./uploads/${req.file.filename}`, () => {
                res.contentType("application/pdf");
                res.send(data);
            })
        }
        else {
            res.send("Error occured")
        }
    });
    
});

app.get("/", (req, res) => {
    res.send(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>File Upload</title>
        </head>
        <body>
          <h1>File Upload</h1>
          <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" required>
            <button type="submit">Upload</button>
          </form>
        </body>
        </html>
        `
    )
})

app.listen(3000)