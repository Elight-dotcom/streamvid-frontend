import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StreamPage() {
  const { id, tmdbId } = useParams<{ id: string; tmdbId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);

  // URL Streaming
  const videoUrl = `${import.meta.env.VITE_API_URL}/movie/${id}/stream`;
  
  // URL Subtitle (Gunakan ID dari params atau tmdbId jika id di sini adalah tmdbId)
  const subIndoUrl = `http://192.168.100.18:4000/subtitle?tmdbId=${tmdbId}&lang=id`;
  const subEngUrl = `http://192.168.100.18:4000/subtitle?tmdbId=${tmdbId}&lang=en`;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.focus();
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="nv-stream-container">
      {error ? (
        <div className="nv-empty">
          <p>Gagal memuat video.</p>
          <button className="nv-play" onClick={() => navigate(-1)}>KEMBALI</button>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="nv-video-player"
          controls
          autoPlay
          // WAJIB ADA untuk Subtitle dari Port Berbeda
          crossOrigin="anonymous" 
          onError={() => setError(true)}
        >
          <source src={videoUrl} type="video/mp4" />
          
          <track 
            label="Indonesia" 
            kind="subtitles" 
            srcLang="id" 
            src={subIndoUrl} 
            default 
          />
          
          <track 
            label="English" 
            kind="subtitles" 
            srcLang="en" 
            src={subEngUrl} 
          />
        </video>
      )}
    </div>
  );
}