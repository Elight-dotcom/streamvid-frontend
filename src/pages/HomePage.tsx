import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "../App.css";
import FilmCard from "../components/FilmCard";
import useSpatialNav from "../hooks/Usespatialnav";
import { getMovies, type GetMovieDetail } from "../services/MovieService";

export default function HomePage() {
  const [movies, setMovies] = useState<GetMovieDetail[]>([]);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useSpatialNav(rootRef);

  useEffect(() => {
    const loadData = async () => {
      try {
        const moviesData = await getMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="nv" ref={rootRef}>
      <h2 className="sr-only">Halaman utama StreamVid</h2>

      {/* ── header ───────────────── */}
      <header className="nv-hdr">
        <div className="nv-logo">Stream<span>Vid</span></div>
      </header>

      {/* ── konten utama ─────────── */}
      <section className="nv-sec">
        <div className="nv-sh">
          <h2 className="nv-st">DAFTAR FILM</h2>
          <a 
            className="nv-play"
            data-row = {2}
            data-col = {1}
            tabIndex={0}
            href="/add"
            onClick={() => navigate(`/add`)}
          >
            <div className="">+</div>
            TAMBAH FILM
          </a>
        </div>

        {movies.length > 0 ? (
          <div className="nv-grid">
            {movies.map((movie, i) => (
              <FilmCard
                key={movie.id}
                film={movie}
                row={3}
                col={i}
              />
            ))}
          </div>
        ) : (
          <p className="nv-empty">Memuat data film...</p>
        )}
      </section>

      <p className="nv-hint">
        ↑ ↓ ← → navigasi remote · Enter untuk memilih
      </p>
    </div>
  );
}