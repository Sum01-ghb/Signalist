"use client";
import Link from "next/link";

export default function WatchlistNews({ news }: WatchlistNewsProps) {
  if (!news || news.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Market News</h3>
        <p className="text-gray-400">No news available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Market News</h3>
      <div className="space-y-4">
        {news.slice(0, 5).map((article) => (
          <div key={article.id} className="border-b border-gray-700 pb-4 last:border-b-0">
            <h4 className="font-medium text-gray-100 mb-2 line-clamp-2">
              {article.headline}
            </h4>
            <p className="text-sm text-gray-400 mb-2 line-clamp-2">
              {article.summary}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{article.source}</span>
              <span>
                {new Date(article.datetime * 1000).toLocaleDateString()}
              </span>
            </div>
            {article.url && (
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-500 hover:text-yellow-400 text-sm mt-2 inline-block"
              >
                Read more →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
