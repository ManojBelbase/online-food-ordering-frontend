"use client";

import { useEffect, useRef, useState } from "react";
import NearbyRestaurants from "@/components/location/NearbyRestaurants";
import FeaturedRestaurant from "@/sections/home/FeaturedRestaurant";
import FoodShowcase from "@/sections/home/FoodShowcase";
import HeroSection from "@/sections/home/HeroSection";
import SearchResults from "@/sections/search/SearchResults";
import { searchFoodItems } from "@/api/search";

const App = () => {
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestQueryRef = useRef<string>("");

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<Search.Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSearch, setHasActiveSearch] = useState(false);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const clearDebounce = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  };

  const resetSearchState = () => {
    clearDebounce();
    latestQueryRef.current = "";
    setResults([]);
    setSubmittedQuery("");
    setIsLoading(false);
    setHasActiveSearch(false);
    setError(null);
  };

  const performSearch = async (term: string) => {
    latestQueryRef.current = term;

    try {
      const data = await searchFoodItems({ query: term });

      if (latestQueryRef.current !== term) {
        return;
      }

      setResults(data);
      setError(null);
    } catch (err) {
      if (latestQueryRef.current !== term) {
        return;
      }
      console.error("Global search failed:", err);
      setResults([]);
      setError("Unable to fetch search results right now. Please try again.");
    } finally {
      if (latestQueryRef.current === term) {
        setIsLoading(false);
      }
    }
  };

  const startSearch = (term: string, immediate: boolean) => {
    clearDebounce();

    if (!term) {
      resetSearchState();
      return;
    }

    latestQueryRef.current = term;

    setHasActiveSearch(true);
    setSubmittedQuery(term);
    setResults([]);
    setError(null);
    setIsLoading(true);

    const run = () => performSearch(term);

    if (immediate) {
      run();
    } else {
      debounceTimeoutRef.current = setTimeout(run, 400);
    }
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      handleClear();
      return;
    }

    startSearch(trimmedQuery, true);
  };

  const handleClear = () => {
    resetSearchState();
    setQuery("");
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      handleClear();
      return;
    }

    startSearch(trimmedValue, false);
  };

  return (
    <div>
      <HeroSection
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
        onClear={handleClear}
        isSearching={isLoading}
        hasActiveSearch={hasActiveSearch}
      />

      {hasActiveSearch ? (
        <SearchResults
          query={submittedQuery}
          results={results}
          isLoading={isLoading}
          error={error}
          onClear={handleClear}
        />
      ) : (
        <>
          <NearbyRestaurants />
          <FoodShowcase />
          <div className="container mx-auto px-4">
            <FeaturedRestaurant />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
