import type { GetMovieDetail } from "../services/MovieService";

// components/FilmCard.jsx
type FilmCardProps = {
  film: GetMovieDetail;
  row: number;
  col: number;
};

const css = `
  .nv-card {
    flex: 0 0 180px; height: 270px; border-radius: 14px; overflow: hidden; position: relative;
    cursor: pointer; scroll-snap-align: start; transition: transform .2s, box-shadow .2s;
    outline: none; background: var(--sf);
  }
  .nv-card:hover, .nv-card:focus {
    transform: scale(1.07);
    box-shadow: 0 8px 32px rgba(0,0,0,.6), 0 0 0 3px var(--ac);
    z-index: 2;
  }
  .nv-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .nv-cov {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,10,15,.92) 0%, transparent 55%);
    opacity: 0; transition: opacity .2s;
  }
  .nv-card:hover .nv-cov, .nv-card:focus .nv-cov { opacity: 1; }
  .nv-ci {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 14px; transform: translateY(4px); transition: transform .2s;
  }
  .nv-card:hover .nv-ci, .nv-card:focus .nv-ci { transform: translateY(0); }
  .nv-ct { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .nv-cy { font-size: 12px; color: var(--mt); margin-top: 2px; }
  .nv-cr {
    position: absolute; top: 10px; right: 10px;
    background: rgba(10,10,15,.75); border-radius: 6px; padding: 3px 8px;
    font-size: 12px; font-weight: 500; color: var(--ac);
    display: flex; align-items: center; gap: 3px;
  }
  .nv-cg {
    position: absolute; top: 10px; left: 10px;
    background: var(--ac2); border-radius: 6px;
    padding: 3px 8px; font-size: 11px; font-weight: 500; color: #fff;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .nv-fade { animation: fadeUp .3s ease both; }
`;

/**
 * FilmCard
 *
 * Props:
 *   film  — { id, title, year, rating, genre, img, isFiled }
 *   row   — number, untuk spatial navigation (data-row)
 *   col   — number, untuk spatial navigation (data-col)
 */
export default function FilmCard({ film, row, col }: FilmCardProps) {
  return (
    <>
      <style>{css}</style>
      <a 
        href={`/movies/${film.id}`}
        className="nv-card nv-fade"
        tabIndex={0}
        role="button"
        aria-label={film.title}
        data-row={row}
        data-col={col}
      >
        <img src={film.img} alt={film.title} loading="lazy" />
        <div className="nv-cov" />
        <div className={film.isFiled ? 'nv-cg filed' : 'nv-cg'}>{film.genre}</div>
        <div className="nv-cr">★ {film.rating}</div>
        <div className="nv-ci">
          <div className="nv-ct">{film.title}</div>
          <div className="nv-cy">{film.year}</div>
        </div>
      </a>
    </>
  );
}