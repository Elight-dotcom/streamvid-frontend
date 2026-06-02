import React, { useCallback, useRef, useState } from "react";
import useSpatialNav from "../hooks/Usespatialnav";
import { addMovie, type AddMovieData } from "../services/addMovieService";

const TMDB_API_KEY = `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`;
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w185"; // Ukuran sedikit lebih besar agar tajam

interface TmdbMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  original_title: string;
  overview: string;
}

export default function AddMoviePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  useSpatialNav(rootRef);

  // States
  const [titleQuery, setTitleQuery] = useState("");
  const [magnetLink, setMagnetLink] = useState("");
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchTmdbMovies = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setSearching(true);
    setShowDropdown(true);

    try {
      const response = await fetch(
        `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&language=id-ID&page=1`,
        {
          headers: { accept: "application/json", Authorization: TMDB_API_KEY },
        },
      );
      if (!response.ok) throw new Error("TMDB Error");
      const data = await response.json();
      setResults(data.results ?? []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleQuery(val);
    if (selectedMovie) setSelectedMovie(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchTmdbMovies(val.trim()), 400);
  };

  const handleSelect = (movie: TmdbMovie) => {
    setSelectedMovie(movie);
    setTitleQuery(movie.title);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie) return;

    try {
      setError(null);
      setLoading(true);
      const payload: AddMovieData = {
        tmdbId: selectedMovie.id,
        magnetLink: magnetLink.trim() || undefined,
      };
      await addMovie(payload);
      alert("Movie added to library!");
      // Reset
      setTitleQuery("");
      setMagnetLink("");
      setSelectedMovie(null);
    } catch (error) {
      setError(
        "Gagal menyimpan ke database." +
          (error instanceof Error ? error.message : ""),
      );
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nv" ref={rootRef}>
      <div style={{ padding: "60px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Breadcrumb Header */}
        <header style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: 0.8,
              marginBottom: 8,
            }}
          >
            <span
              style={{ fontSize: 13, letterSpacing: 1.5, color: "var(--ac)" }}
            >
              DATABASE MANAGEMENT
            </span>
          </div>
          <h1
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 48,
              letterSpacing: 2,
              margin: 0,
            }}
          >
            ADD NEW <span style={{ color: "var(--ac)" }}>ENTRY</span>
          </h1>
        </header>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 40 }}
        >
          {/* Left Side: Form */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: 40,
              }}
            >
              {/* Search Input */}
              <div style={{ marginBottom: 32, position: "relative" }}>
                <label style={labelStyle}>Cari di TMDB</label>
                <input
                  className="nv-s"
                  type="text"
                  placeholder="Masukkan judul film..."
                  value={titleQuery}
                  onChange={handleTitleChange}
                  onFocus={() => titleQuery.length > 1 && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  style={{ width: "100%", fontSize: 18, padding: "16px 20px" }}
                  data-row={1}
                  data-col={1}
                />

                {/* Dropdown Results */}
                {showDropdown && (
                  <div style={dropdownContainerStyle}>
                    {searching ? (
                      <div
                        style={{
                          padding: 20,
                          textAlign: "center",
                          color: "var(--mt)",
                        }}
                      >
                        Mencari film...
                      </div>
                    ) : results.length > 0 ? (
                      results.slice(0, 6).map((m) => (
                        <div
                          key={m.id}
                          onMouseDown={() => handleSelect(m)}
                          style={dropdownItemStyle}
                          className="dropdown-item"
                        >
                          <img
                            src={m.poster_path ? TMDB_IMG + m.poster_path : ""}
                            style={miniPosterStyle}
                            alt=""
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>
                              {m.title}
                            </div>
                            <div style={{ fontSize: 12, opacity: 0.5 }}>
                              {m.release_date?.split("-")[0]}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: 20, textAlign: "center" }}>
                        Tidak ditemukan.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Magnet Link */}
              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>Link Magnet</label>
                <input
                  className="nv-s"
                  type="text"
                  placeholder="Masukkan link magnet..."
                  value={magnetLink}
                  onChange={(e) => setMagnetLink(e.target.value)}
                  style={{ width: "100%", fontSize: 18, padding: "16px 20px" }}
                  data-row={2}
                  data-col={1}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", gap: 16 }}>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="nv-nb"
                  style={{ flex: 1 }}
                  data-row={3}
                  data-col={1}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!selectedMovie || loading}
                  className="nv-play"
                  style={{ flex: 2 }}
                  data-row={3}
                  data-col={2}
                >
                  {loading ? "Menyimpan..." : "Tambahkan Film"}
                </button>
              </div>

              {error && (
                <div
                  style={{
                    marginTop: 16,
                    color: "#ff6b6b",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          </form>

          {/* Right Side: Preview Card */}
          <aside>
            <div style={{ position: "sticky", top: 40 }}>
              <label style={labelStyle}>Preview</label>
              {selectedMovie ? (
                <div style={previewCardStyle}>
                  <img
                    src={
                      selectedMovie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                        : ""
                    }
                    style={largePosterStyle}
                  />
                  <div style={{ padding: 20 }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>
                      {selectedMovie.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--mt)",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {selectedMovie.overview}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={emptyPreviewStyle}>
                  Pilih film untuk melihat preview
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// Styles
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: "var(--ac)",
  marginBottom: 12,
  opacity: 0.7,
};

const dropdownContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: "105%",
  left: 0,
  right: 0,
  background: "#161621",
  border: "1px solid #2a2a3a",
  borderRadius: 16,
  overflow: "hidden",
  zIndex: 100,
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const miniPosterStyle: React.CSSProperties = {
  width: 40,
  height: 60,
  borderRadius: 4,
  objectFit: "cover",
  background: "#000",
};

const previewCardStyle: React.CSSProperties = {
  background: "var(--sf)",
  borderRadius: 24,
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.05)",
};

const largePosterStyle: React.CSSProperties = {
  width: "100%",
  height: "350px",
  objectFit: "cover",
};

const emptyPreviewStyle: React.CSSProperties = {
  height: 400,
  border: "2px dashed rgba(255,255,255,0.05)",
  borderRadius: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--mt)",
  fontSize: 14,
};
