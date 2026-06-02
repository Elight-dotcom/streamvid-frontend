export interface AddMovieData {
    tmdbId: number;
    magnetLink?: string;
}

export async function addMovie(data: AddMovieData) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/movie`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to add movie');
    }
}