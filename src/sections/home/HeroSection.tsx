"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, XCircle } from "lucide-react";
import React from "react";

interface HeroSectionProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching: boolean;
  hasActiveSearch: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  query,
  onQueryChange,
  onSearch,
  onClear,
  isSearching,
  hasActiveSearch,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(event.target.value);
  };

  return (
    <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 sm:py-16"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="text-center"> <h1 className="text-2xl sm:text-5xl font-bold mb-4 leading-snug sm:leading-tight">
      Order food from your favorite restaurants </h1> <p className="text-sm sm:text-lg mb-6 sm:mb-8 opacity-90">
        Fast delivery • Wide selection • Best prices </p>


      <div className="max-w-md sm:max-w-2xl mx-auto">
        <form
          className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          onSubmit={handleSubmit}
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for food items..."
              value={query}
              onChange={handleChange}
              className="pl-10 h-12 bg-white text-gray-900 w-full"
              aria-label="Search for food items..."
              data-testid="global-search-input"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              type="submit"
              size="lg"
              className="bg-white font-medium text-orange-600 hover:bg-gray-100 h-12 px-8 w-full sm:w-auto flex justify-center items-center gap-2"
              data-testid="global-search-submit"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching
                </>
              ) : (
                "Search"
              )}
            </Button>

            {(query.trim() || hasActiveSearch) && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 px-6 bg-transparent text-white border-white/60 hover:bg-white/10 w-full sm:w-auto flex justify-center items-center gap-2"
                onClick={onClear}
                data-testid="global-search-clear"
              >
                <XCircle className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
    </div>
    </section>

  );
};

export default HeroSection;
