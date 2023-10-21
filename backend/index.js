const express = require('express');
const spawn = require('child_process').spawn;
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = require('./upload');

app.post('/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    const ls = spawn('python3', ['detectronlayoutparser.py', "uploads/" + req.file.filename]);
    
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

    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
      
    ls.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
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

app.listen(3000, () => {console.log("listening...")})