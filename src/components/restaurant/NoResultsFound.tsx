"use client";

import { Search } from "lucide-react";

export const NoResultsFound = () => {
  return (
    <div className="text-center py-12">
      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">No items found</h3>
      <p className="text-gray-500">Try adjusting your search or filter criteria</p>
    </div>
  );
};
