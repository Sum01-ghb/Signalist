"use client";
import { useState } from "react";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";
import Link from "next/link";

export default function WatchlistTable({ watchlist }: WatchlistTableProps) {
  const [stocks, setStocks] = useState(watchlist);

  const handleRemoveStock = async (symbol: string) => {
    const result = await removeFromWatchlist(symbol);
    
    if (result.success) {
      setStocks(stocks.filter(stock => stock.symbol !== symbol));
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  if (stocks.length === 0) {
    return null;
  }

  return (
    <div className="watchlist-table">
      <table className="w-full">
        <thead>
          <tr className="table-header-row">
            <th className="table-header text-left py-3 px-4">Symbol</th>
            <th className="table-header text-left py-3 px-4">Company</th>
            <th className="table-header text-left py-3 px-4">Added</th>
            <th className="table-header text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol} className="table-row">
              <td className="py-3 px-4">
                <Link 
                  href={`/stocks/${stock.symbol}`}
                  className="font-semibold text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  {stock.symbol}
                </Link>
              </td>
              <td className="py-3 px-4 text-gray-300">{stock.company}</td>
              <td className="py-3 px-4 text-gray-400">
                {new Date(stock.addedAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => handleRemoveStock(stock.symbol)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title={`Remove ${stock.symbol} from watchlist`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
