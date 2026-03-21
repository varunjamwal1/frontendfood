// components/PaginationFooter.jsx
import React, { useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationFooter = React.memo(
  ({
    page = 1,
    totalPages = 1,
    totalOrders = 0,
    itemsPerPage = 10,
    onPageChange = () => {},
  }) => {
    // ✅ SAFE VALUES
    const safeTotalOrders = Number(totalOrders) || 0;
    const safeItemsPerPage = Number(itemsPerPage) || 1;
    const safeTotalPages = Math.max(1, Number(totalPages) || 1);
    const safePage = Math.min(Math.max(1, page), safeTotalPages);

    // ✅ PAGE RANGE TEXT
    const start = (safePage - 1) * safeItemsPerPage + 1;
    const end = Math.min(safePage * safeItemsPerPage, safeTotalOrders);

    // ✅ SAFE PAGE CHANGE
    const handlePageChange = useCallback(
      (newPage) => {
        if (newPage < 1 || newPage > safeTotalPages || newPage === safePage) return;
        onPageChange(newPage);
      },
      [safePage, safeTotalPages, onPageChange]
    );

    // ✅ VISIBLE PAGES
    const visiblePages = useMemo(() => {
      const delta = 2;
      const range = [];

      for (
        let i = Math.max(2, safePage - delta);
        i <= Math.min(safeTotalPages - 1, safePage + delta);
        i++
      ) {
        range.push(i);
      }

      if (safePage - delta > 2) range.unshift("...");
      if (safePage + delta < safeTotalPages - 1) range.push("...");

      const pages = [1, ...range, safeTotalPages];

      return pages.filter(
        (p, i, arr) => p !== "..." || arr[i - 1] !== "..."
      );
    }, [safePage, safeTotalPages]);

    return (
      <div className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 px-6 py-5 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* 📊 INFO */}
          <div className="text-sm text-gray-400">
            {safeTotalOrders > 0 ? (
              <>
                Showing <span className="text-white font-semibold">{start}</span> to{" "}
                <span className="text-white font-semibold">{end}</span> of{" "}
                <span className="text-white font-semibold">
                  {safeTotalOrders.toLocaleString()}
                </span>{" "}
                orders
              </>
            ) : (
              "No orders found"
            )}
          </div>

          {/* 🔢 CONTROLS */}
          <div className="flex items-center gap-2">
            
            {/* ⬅ PREV */}
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition"
            >
              <ChevronLeft size={18} />
            </button>

            {/* 🔢 PAGE NUMBERS */}
            <div className="flex items-center gap-1">
              {visiblePages.map((p) => (
                <button
                  key={typeof p === "number" ? `page-${p}` : `dots-${Math.random()}`}
                  onClick={() => typeof p === "number" && handlePageChange(p)}
                  disabled={p === "..."}
                  aria-current={p === safePage ? "page" : undefined}
                  className={`px-3 py-2 text-sm font-semibold rounded-xl min-w-[2.5rem] transition
                    ${
                      p === safePage
                        ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }
                    ${p === "..." ? "cursor-default px-2" : ""}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* ➡ NEXT */}
            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === safeTotalPages}
              aria-label="Next page"
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PaginationFooter.displayName = "PaginationFooter";

export default PaginationFooter;