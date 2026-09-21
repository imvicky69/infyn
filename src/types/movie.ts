export interface Episode {
  episodeNumber: number;
  title: string;
  duration: string;
  size: string;
  downloadUrl?: string;
  synopsis: string;
  thumbnail?: string;
}

export interface Movie {
  id: string;
  slug: string;
  imdbId?: string;
  title: string;
  tagline: string;
  synopsis: string;
  year: number;
  releaseDate: string;
  duration: string;
  rating: number;
  votes: string;
  contentRating: string;
  genres: string[];
  director: string;
  cast: string[];
  poster: string;
  localTrailerUrl?: string;
  language: string;
  languages?: string[];
  quality: string;
  seasonDownloadUrl?: string;
  seasonSize?: string;
  episodes: Episode[];
  featured?: boolean;
  trending?: boolean;
}
