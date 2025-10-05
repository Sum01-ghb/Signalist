import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import WatchlistTable from "@/components/WatchlistTable";
import WatchlistNews from "@/components/WatchlistNews";
import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const watchlist = await getUserWatchlist();
  const news = await getNews();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="watchlist-container">
        <div className="watchlist">
          <h1 className="watchlist-title">My Watchlist</h1>
          {watchlist.length === 0 ? (
            <div className="watchlist-empty-container">
              <div className="watchlist-empty">
                <svg
                  className="watchlist-star"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                  />
                </svg>
                <h2 className="empty-title">Your watchlist is empty</h2>
                <p className="empty-description">
                  Start building your watchlist by searching for stocks and
                  adding them to track their performance.
                </p>
              </div>
            </div>
          ) : (
            <WatchlistTable watchlist={watchlist} />
          )}
        </div>

        <div className="watchlist-alerts">
          <WatchlistNews news={news} />
        </div>
      </div>
    </div>
  );
}
