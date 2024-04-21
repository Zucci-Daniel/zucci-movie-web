import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { searchTerms } from "../constants";
import { useDebounce } from "../hooks/useDebounce";
import { Movie, MovieDetails, SearchMoviesResponse } from "./type";

const BASE_URL = `https://www.omdbapi.com/`;
export const API_KEY = `5cbf161f`;
/**
 *
 * @description This SDK is designed to be highly isolated and performant, making it versatile for use in any environment. Whether you prefer Redux, Context, or any other state management tool, you can manipulate the retrieved data using seMovies or setSearchQuery as needed. This hook is plug-and-play - enjoy the flexibility!
 */
export const useSearchSdk = () => {
  const [movies, seMovies] = useState<Array<Movie>>([]);
  const [singleMovie, setSingleMovie] = useState<MovieDetails>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const debouncedSearchQuery = useDebounce(searchQuery, 100);

  const fetchMovies = async (searchTerm: string, page: number = 1) => {
    try {
      setLoading(true);
      const response: AxiosResponse<SearchMoviesResponse> = await axios.get(
        BASE_URL,
        { params: { apikey: API_KEY, s: searchTerm, page } }
      );

      if (response.data.Response === "False") {
        throw new Error(response.data.Error);
      }
      seMovies(response.data.Search);
    } catch (error) {
      console.error("An error occurred while fetching movies:", error);
    } finally {
      setLoading(false);

      // Any cleanup code can go here
    }
  };

  const getRandomListOfMovies = async () => {
    const randomTerm =
      searchTerms[Math.floor(Math.random() * searchTerms.length)];

    return fetchMovies(randomTerm, 1);
  };

  const getListOfMovies = async (searchTerm: string) =>
    fetchMovies(searchTerm, 1);

  const getSingleMovie = async (imdbID: string) => {
    const response = await axios.get(BASE_URL, {
      params: { apikey: API_KEY, i: imdbID },
    });

    if (response.data.Response === "False") {
      throw new Error(response.data.Error);
    }
    setSingleMovie(response.data);
  };

  useEffect(() => {
    getRandomListOfMovies();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.length > 3) {
      getListOfMovies(searchQuery);
    }
  }, [debouncedSearchQuery]);

  return {
    getListOfMovies,
    getRandomListOfMovies,
    getSingleMovie,
    movies,
    seMovies,
    searchQuery,
    setSearchQuery,
    singleMovie,
    loading,
    setLoading,
  };
};
