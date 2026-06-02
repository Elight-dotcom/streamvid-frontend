// hooks/useSpatialNav.js
import { useEffect, useRef, type RefObject } from "react";

type Dir = "l" | "r" | "u" | "d";

type SpatialItem = HTMLElement & {
  dataset: DOMStringMap & {
    row?: string;
    col?: string;
  };
};

/**
 * useSpatialNav
 *
 * Pasang hook ini di root container halaman kamu.
 * Semua elemen yang punya atribut [data-row] dan [data-col]
 * akan bisa dinavigasi dengan tombol panah keyboard / remote TV.
 *
 * Cara pakai:
 *   const rootRef = useRef(null);
 *   useSpatialNav(rootRef);
 *   return <div ref={rootRef}> ... </div>
 *
 * Setiap item yang ingin bisa difokus harus punya:
 *   tabIndex={0}
 *   data-row={angka}   ← baris (urut dari atas, mulai 0)
 *   data-col={angka}   ← kolom (urut dari kiri, mulai 0)
 *
 * Perilaku:
 *   ← →  pindah antar item dalam row yang sama
 *   ↑ ↓  pindah ke row atas/bawah, mendekati kolom terakhir yang dikunjungi
 *   Input <input> tidak diambil alih saat ← → (bisa mengetik normal)
 */
export default function useSpatialNav(rootRef: RefObject<HTMLElement | null>) {
  const lastColInRow = useRef<Record<number, number>>({});

  useEffect(() => {
    function allItems(): SpatialItem[] {
      return [
        ...(rootRef.current?.querySelectorAll<SpatialItem>("[data-row][data-col]") ?? []),
      ];
    }

    function focusEl(el: HTMLElement) {
      el.focus({ preventScroll: true });
      el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    }

    function onKey(e: KeyboardEvent) {
      const dir = {
        ArrowLeft: "l",
        ArrowRight: "r",
        ArrowUp: "u",
        ArrowDown: "d",
      } as const;
      const move: Dir | undefined = dir[e.key as keyof typeof dir];
      if (!move) return;

      // Biarkan input text menangani ← → sendiri
      if (
        document.activeElement?.tagName === "INPUT" &&
        (move === "l" || move === "r")
      ) return;

      const items = allItems();
      if (!items.length) return;

      const focused = document.activeElement as SpatialItem | null;
      const curRow = parseInt(focused?.dataset?.row ?? "-1");
      const curCol = parseInt(focused?.dataset?.col ?? "-1");

      // Belum ada yang terfokus → fokus item pertama
      if (curRow === -1) {
        focusEl(items[0]);
        e.preventDefault();
        return;
      }

      e.preventDefault();

      if (move === "l" || move === "r") {
        // Kiri / kanan — dalam row yang sama
        const siblings = items
          .filter((el) => parseInt(el.dataset.row ?? "-1") === curRow)
          .sort((a, b) => parseInt(a.dataset.col ?? "0") - parseInt(b.dataset.col ?? "0"));
        const idx = siblings.findIndex((el) => parseInt(el.dataset.col ?? "-1") === curCol);
        const next = move === "r" ? siblings[idx + 1] : siblings[idx - 1];
        if (next) {
          lastColInRow.current[curRow] = parseInt(next.dataset.col ?? "0");
          focusEl(next);
        }
      } else {
        // Atas / bawah — pindah row
        const rows = [
          ...new Set(items.map((el) => parseInt(el.dataset.row ?? "-1"))),
        ].sort((a, b) => a - b);

        const ri = rows.indexOf(curRow);
        const targetRow = move === "d" ? rows[ri + 1] : rows[ri - 1];
        if (targetRow === undefined) return;

        const targetItems = items
          .filter((el) => parseInt(el.dataset.row ?? "-1") === targetRow)
          .sort((a, b) => parseInt(a.dataset.col ?? "0") - parseInt(b.dataset.col ?? "0"));
        if (!targetItems.length) return;

        // Pilih kolom terdekat dari posisi sekarang (atau dari memori terakhir)
        const preferred = lastColInRow.current[targetRow] ?? curCol;
        const best = targetItems.reduce((prev, cur) =>
          Math.abs(parseInt(cur.dataset.col ?? "0") - preferred) <
          Math.abs(parseInt(prev.dataset.col ?? "0") - preferred)
            ? cur
            : prev
        );

        lastColInRow.current[curRow] = curCol;
        lastColInRow.current[targetRow] = parseInt(best.dataset.col ?? "0");
        focusEl(best);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rootRef]);
}