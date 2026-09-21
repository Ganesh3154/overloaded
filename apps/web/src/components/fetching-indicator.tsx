"use client";

import { useIsFetching } from "@tanstack/react-query";

/**
 * Renders a thin scanning bar just below the header whenever any React Query
 * fetch is in-flight. Lives in the layout once — covers every page globally.
 */
export function FetchingIndicator() {
  const count = useIsFetching();

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-50 h-0.5 overflow-hidden transition-opacity duration-500 ${
        count > 0 ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-y-0 w-1/3 bg-lime-cs animate-loader-scan" />
    </div>
  );
}
