export interface GetMovie {
    id : number;
    tmdbId : number;
    isFiled : boolean;
}

export interface GetMovieDetail {
    id : number;
    title : string;
    tmdbId : number;
    year : string;
    rating : number;
    genre : string;
    img : string;
    isFiled : boolean;
}

const apiUrl = import.meta.env.VITE_API_URL;
const tmdbProxyUrl = `${apiUrl}/tmdb`;
const ngrokHeaders = {
    'ngrok-skip-browser-warning': 'true'
};

// search movies
export async function searchMovies(query: string): Promise<GetMovieDetail[]> {
    const response = await fetch(
        `${tmdbProxyUrl}/search/movie?query=${encodeURIComponent(query)}&language=id-ID&page=1`,
        { headers: ngrokHeaders }
    );
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    const rawMovies: GetMovie[] = await response.json();

    const movieDetails = await Promise.all(
        rawMovies.map(async (movie) => {
            const detail = await getMovieDetail(movie.tmdbId);

            return {
                id: movie.id,
                isFiled: movie.isFiled,
                ...detail
            };
        })
    );

    return movieDetails;
}

// get movies
export async function getMovies(): Promise<GetMovieDetail[]> {
    const response = await fetch(`${apiUrl}/movie`, {
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    const rawMovies: GetMovie[] = await response.json();

    const movieDetails = await Promise.all(
        rawMovies.map(async (movie) => {
            const detail = await getMovieDetail(movie.tmdbId);

            return {
                id: movie.id,
                isFiled: movie.isFiled,
                ...detail
            };
        })
    );

    return movieDetails;
}

// get movie by id
export async function getMovieById(id: number): Promise<GetMovieDetail> {
    const response = await fetch(`${apiUrl}/movie/${id}`, {
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch movie');
    }

    const movie: GetMovie = await response.json();
    const detail = await getMovieDetail(movie.tmdbId);

    return {
        id: movie.id,
        isFiled: movie.isFiled,
        ...detail
    };
}

// get video stream path
export async function getMovieStreamUrl(id: number): Promise<string> {
    const response = await fetch(`${apiUrl}/stream/${id}`, {
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch movie');
    }

    const movie: GetMovie = await response.json();

    return `${import.meta.env.VITE_API_URL}/movie/stream/${movie.id}`;
}

// get movie from Tmdb
export async function getMovieDetail(tmdbId: number) {
    const response = await fetch(`${tmdbProxyUrl}/movie/${tmdbId}?language=id-ID`, {
        headers: ngrokHeaders
    });

    if (!response.ok) {
        throw new Error('Failed to fetch movie detail from TMDB');
    }

    const data = await response.json();

    return {
        title: data.title,
        tmdbId: data.id,
        year: data.release_date ? data.release_date.split('-')[0] : "N/A",
        rating: data.vote_average,
        genre: data.genres?.[0]?.name || "Unknown",
        img: `https://image.tmdb.org/t/p/w500${data.poster_path}`
    };
}