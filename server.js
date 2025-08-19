const express = require("express");
const fs = require("fs");
const path = require("path");
const request = require("request");

const app = express();
const PORT = process.env.PORT || 3000;

const VIDEO_DIR = path.join(__dirname, "videos");
if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR);

// Serve HTML player
app.get("/", function(req, res){
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>JannSŦream</title>
<style>
body { background:#111; color:#eee; font-family:sans-serif; text-align:center; }
input { width:60%; padding:8px; border-radius:6px; border:none; }
button { padding:8px 12px; border-radius:6px; border:none; background:#28a745; color:#fff; cursor:pointer; margin-left:5px;}
button:hover { background:#218838; }
video { margin-top:20px; width:80%; max-width:900px; border-radius:10px; background:#000; }
.hidden-ui { opacity:0; transition:opacity 0.3s; }
#library { text-align:left; max-width:800px; margin:30px auto; }
#library ul { list-style:none; padding:0; }
#library li { padding:6px; border-bottom:1px solid #222; cursor:pointer; }
#library li:hover { background:#222; }
</style>
</head>
<body>
<h1>🎬 JannSŦream</h1>
<p>Paste MP4 URL:</p>
<input id="url" type="url" placeholder="https://example.com/video.mp4">
<button onclick="downloadVideo()">Download & Play</button>
<p id="status"></p>
<video id="player" controls></video>

<div id="library">
<h2>📂 Previously Downloaded</h2>
<ul id="videoList"></ul>
</div>

<script>
const statusEl = document.getElementById("status");
const videoEl = document.getElementById("player");
const listEl = document.getElementById("videoList");
let hideUI = false;

function refreshLibrary(){
  fetch("/list").then(r=>r.json()).then(files=>{
    listEl.innerHTML="";
    if(files.length===0){ listEl.innerHTML="<li>No videos yet</li>"; return; }
    files.forEach(f=>{
      const li = document.createElement("li");
      li.textContent = f;
      li.onclick = function(){ 
        statusEl.innerText="▶️ Playing "+f;
        videoEl.src="/stream/"+f;
        videoEl.play();
      };
      listEl.appendChild(li);
    });
  });
}

function downloadVideo(){
  const url = document.getElementById("url").value;
  if(!url){ alert("Enter a URL!"); return; }
  statusEl.innerText="⬇️ Downloading...";
  fetch("/download?url="+encodeURIComponent(url))
    .then(r=>r.json())
    .then(data=>{
      statusEl.innerText="✅ Ready!";
      videoEl.src="/stream/"+data.filename;
      videoEl.play();
      refreshLibrary();
    })
    .catch(e=>{ statusEl.innerText="❌ Download failed"; });
}

// Cinema mode toggle
document.addEventListener("keydown", e=>{
  if(e.key==="h"){
    hideUI = !hideUI;
    if(hideUI){
      videoEl.removeAttribute("controls");
      statusEl.classList.add("hidden-ui");
    } else {
      videoEl.setAttribute("controls","true");
      statusEl.classList.remove("hidden-ui");
    }
  }
});

refreshLibrary();
</script>
</body>
</html>
  `);
});

// Download API
app.get("/download", function(req,res){
  const url = req.query.url;
  if(!url) return res.status(400).json({error:"Missing url"});
  const filename = path.basename(url.split("?")[0]);
  const filepath = path.join(VIDEO_DIR, filename);

  if(fs.existsSync(filepath)){
    return res.json({filename});
  }

  request(url)
    .pipe(fs.createWriteStream(filepath))
    .on("finish", ()=>{ res.json({filename}); })
    .on("error", ()=>{ res.status(500).json({error:"Download failed"}); });
});

// List API
app.get("/list", function(req,res){
  fs.readdir(VIDEO_DIR, (err, files)=>{
    if(err) return res.json([]);
    res.json(files.filter(f=>f.endsWith(".mp4")));
  });
});

// Stream with byte ranges
app.get("/stream/:filename", function(req,res){
  const filepath = path.join(VIDEO_DIR, req.params.filename);
  if(!fs.existsSync(filepath)) return res.status(404).send("File not found");

  const stat = fs.statSync(filepath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if(range){
    const parts = range.replace(/bytes=/,"").split("-");
    const start = parseInt(parts[0],10);
    const end = parts[1] ? parseInt(parts[1],10) : fileSize-1;
    const chunkSize = (end-start)+1;
    const file = fs.createReadStream(filepath,{start,end});
    res.writeHead(206,{
      "Content-Range": "bytes "+start+"-"+end+"/"+fileSize,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    });
    file.pipe(res);
  } else {
    res.writeHead(200,{
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    });
    fs.createReadStream(filepath).pipe(res);
  }
});

app.listen(PORT, ()=>{ console.log("🚀 JannSŦream running at http://localhost:"+PORT); });