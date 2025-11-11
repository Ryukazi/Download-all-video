import React, { useState } from "react";
import "./style.css";

// Detect platform from URL
const detectPlatform = (url) => {
  if (url.includes("tiktok.com") || url.includes("vt.tiktok.com")) return "tiktok";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "facebook";
  if (url.includes("pinterest.com")) return "pinterest";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  return null;
};

// Parse video URL from API response
const extractVideoUrl = (hostname, data) => {
  if (hostname.includes("tiktok")) return data?.result?.data?.video_url || data?.result?.video || data?.result?.url;
  if (hostname.includes("youtube") || hostname.includes("youtu.be")) return data?.result?.mp4 || data?.result?.url;
  if (hostname.includes("instagram")) return data?.result?.url || data?.result?.downloads?.slice(-1)[0];
  if (hostname.includes("facebook") || hostname.includes("fb.watch")) return data?.result?.data?.[0]?.hd_link || data?.result?.data?.[0]?.sd_link;
  if (hostname.includes("pinterest")) return data?.result?.url;
  if (hostname.includes("twitter") || hostname.includes("x.com")) return data?.result?.url;
  return null;
};

const App = () => {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Please enter a video URL.");
      return;
    }

    const platformDetected = detectPlatform(url);
    if (!platformDetected) {
      setError("Unsupported URL! Try TikTok, YouTube, Instagram, etc.");
      return;
    }

    setLoading(true);
    setError("");
    setVideo(null);

    try {
      const apiUrl = `https://universal-dl-one.vercel.app/api/${platformDetected}?url=${encodeURIComponent(url)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      const hostname = new URL(url).hostname;
      const videoUrl = extractVideoUrl(hostname, data);

      if (videoUrl) {
        setVideo(videoUrl);
      } else {
        setError("⚠️ Couldn't parse video link for this platform.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🌐 Universal Video Downloader</h1>
      <p className="subtitle">
        Paste any <b>TikTok</b>, <b>YouTube</b>, <b>Instagram</b>, <b>Facebook</b>, <b>Twitter</b>, or <b>Pinterest</b> link below 👇
      </p>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter video URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleDownload} disabled={loading}>
          {loading ? "Fetching..." : "Get Video"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {video && (
        <div className="video-card">
          <video src={video} controls autoPlay loop></video>
          <a href={video} download className="download-btn">
            ⬇️ Download Video
          </a>
        </div>
      )}

      <footer className="footer">
        <p>
          Made with ❤️ by <b>Denish Tharu</b> <br />
          Powered by <a href="https://universal-dl-one.vercel.app" target="_blank">Universal Downloader API</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
