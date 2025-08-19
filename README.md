# JannSŦream(Stream)
<h4>#VibeCode<h4>

A Node.js application designed to **download MP4 videos from a URL** and stream them in chunks for smooth playback.  
This app is primarily designed to run in **terminal-based environments** like the **Google Cloud Console**.

---

## Features

- Downloads MP4 from any direct URL **once** and saves locally.
- Streams video using **HTTP range requests** for instant playback.
- Single-page web interface to **paste URL and play** videos.
- Optimized for **terminal and cloud environments**.
- Supports **large video files** without long initial load.

---

## Installation

1. Clone or download this repository to your Terminal/Google Cloud Console:

```bash
git clone https://github.com/azkhanmhd/VibeCode-v1-JannStream.git
cd VibeCode-v1-JannStream
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm install
```

4. Open the web interface in your browser:
```cpp
http://<your-cloud-ip>:3000

Example:-  http://localhost:3000
```

---

## Usage

1. Paste the MP4 video URL in the input field.
2. Click **Download & Play**.
3. The video will download once, then stream in chunks.
4. Subsequent plays of the same video are instant from the local copy.

---

## Notes

- **Designed for cloud environments**: Works best on terminal-based servers (Google Cloud Console, AWS EC2, etc.).
- **Disk space**: Ensure your environment has enough space for large video files.
- **Persistence**: On serverless platforms (like Google Cloud Run), local storage may be ephemeral. For permanent storage, consider integrating with **Google Cloud Storage**.

---

## Dependencies

- [Express](https://www.npmjs.com/package/express)
- [Request](https://www.npmjs.com/package/request)

---

> Made With ❤️&☕ By Azk 💗
