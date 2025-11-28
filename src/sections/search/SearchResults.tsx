"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Search, Utensils } from "lucide-react";

interface SearchResultsProps {
  query: string;
  results: Search.Result[];
  isLoading: boolean;
  error: string | null;
  onClear: () => void;
}

const SkeletonCard = () => (
  <Card className="overflow-hidden bg-white animate-pulse">
    <CardContent className="p-5 space-y-4">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ query }: { query: string }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
      <Search className="w-8 h-8 text-orange-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">
      No results for “{query}”
    </h3>
    <p className="text-sm text-gray-600 mt-2">
      Try a different keyword or adjust your spelling.
    </p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <Utensils className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">
      Something went wrong
    </h3>
    <p className="text-sm text-gray-600 mt-2">{message}</p>
  </div>
);

const SearchResults = ({
  query,
  results,
  isLoading,
  error,
  onClear,
}: SearchResultsProps) => {
  const showEmptyState = !isLoading && !error && results.length === 0;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Search results
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {results.length} {results.length === 1 ? "item" : "items"}{" "}
              for “{query}”
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isLoading && (
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching results...
              </div>
            )}
            <Button
              variant="outline"
              onClick={onClear}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
              data-testid="global-search-reset"
            >
              Clear search
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} />
        ) : showEmptyState ? (
          <EmptyState query={query} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item, index) => (
              <Link
                key={`${item.foodId}-${index}`}
                href={`/food/${item.foodId}`}
               
                className="group block"
              >
                <Card className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <CardContent className="p-0">
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.foodName}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                          No image
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 bg-orange-600 text-white">
                        ₹{item.price}
                      </Badge>
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="space-y-1.5">
                        <span className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                          {item.foodName}
                        </span>

                        {item.categoryName ? (
                          <Badge className="w-fit bg-orange-100 text-orange-700 hover:bg-orange-200">
                            {item.categoryName}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400 uppercase tracking-wide">
                            Uncategorised
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-3 min-h-[48px]">
                        {item.description || "No description available."}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <Link
                          href={`/restaurant/${item.restaurantId}`}
                          className="truncate hover:text-orange-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {item.restaurantName}
                        </Link>
                      </div>

                      {item.matchedOn.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.matchedOn.map((token) => (
                            <Badge
                              key={token}
                              variant="outline"
                              className="border-orange-200 text-orange-600 capitalize"
                            >
                              Matched {token}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;

