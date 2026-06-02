import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";
import { getMovieById, type GetMovieDetail } from "../services/MovieService";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<GetMovieDetail | null>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const movieData = await getMovieById(Number(id));
        setMovie(movieData);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    loadData();
  }, [id]);

  // Efek fokus otomatis ke tombol putar agar bisa langsung diklik remote
  useEffect(() => {
    if (movie) {
      playButtonRef.current?.focus();
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="nv">
        <p className="nv-empty">Memuat detail film...</p>
      </div>
    );
  }

  return (
    <div className="nv nv-fade">
      <header className="nv-hdr">
        <div className="nv-logo">Stream<span>Vid</span></div>
        <button className="nv-nb" onClick={() => navigate(-1)}>
          ← KEMBALI
        </button>
      </header>

      <main className="nv-sec">
        {/* Kita gunakan struktur hero untuk tampilan detail yang mewah */}
        <section className="nv-hero" style={{ height: '500px', cursor: 'default' }}>
          <div 
            className="nv-hbg" 
            style={{ backgroundImage: `url(${movie.img})`, opacity: 0.2, filter: 'blur(20px)' }}
          ></div>
          <div className="nv-hgr"></div>
          
          <div className="nv-hc" style={{ display: 'flex', gap: '40px', maxWidth: '100%', alignItems: 'center' }}>
            {/* Poster Samping */}
            <div className="nv-card" style={{ flex: '0 0 240px', height: '360px', transform: 'none', cursor: 'default' }}>
              <img src={movie.img} alt={movie.title} />
              <div className="nv-cr">★ {movie.rating.toFixed(1)}</div>
            </div>

            {/* Info Text */}
            <div className="nv-info-text">
              <span className="nv-badge">{movie.genre}</span>
              <h1 className="nv-htitle">{movie.title}</h1>
              
              <div className="nv-hmeta">
                <span>{movie.year}</span>
                <div className="nv-dot"></div>
                <span>Ultra HD</span>
                <div className="nv-dot"></div>
                <span>Bebas Iklan</span>
              </div>

              <p className="nv-hdesc">
                Nikmati pengalaman menonton terbaik dengan kualitas visual maksimal. 
                Film ini tersedia dalam koleksi pustaka lokal kamu.
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  className="nv-play" 
                  ref={playButtonRef}
                  onClick={() => navigate(`/stream/${movie.tmdbId}/${movie.id}`)}
                >
                  <div className="nv-tri"></div>
                  TONTON SEKARANG
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <p className="nv-hint">
        Gunakan tombol OK/Enter pada remote untuk mulai menonton
      </p>
    </div>
  );
}