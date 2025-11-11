import React, { useState } from "react";
import "./style.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState("");

  const detectPlatform = (url) => {
    if (url.includes("tiktok")) return "tiktok";
    if (url.includes("youtube") || url.includes("youtu.be")) return "youtube";
    if (url.includes("instagram")) return "instagram";
    if (url.includes("facebook")) return "facebook";
    if (url.includes("twitter") || url.includes("x.com")) return "twitter";
    if (url.includes("pinterest")) return "pinterest";
    return null;
  };

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

    setPlatform(platformDetected);
    setLoading(true);
    setError("");
    setVideo(null);

    try {
      const res = await fetch(
        `https://universal-dl-one.vercel.app/api/${platformDetected}?url=${encodeURIComponent(
          url
        )}`
      );
      const data = await res.json();

      // Handle different response formats
      let videoUrl =
        data?.result?.video?.noWatermark ||
        data?.result?.url ||
        data?.download_links?.c ||
        data?.video?.url ||
        null;

      if (videoUrl) {
        setVideo(videoUrl);
      } else {
        setError("Failed to extract video. Try another link!");
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
        Paste any <b>TikTok</b>, <b>YouTube</b>, <b>Instagram</b>, <b>Facebook</b>,
        <b> Twitter</b>, or <b>Pinterest</b> link below 👇
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
