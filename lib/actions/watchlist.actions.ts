"use server";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db
      .collection("user")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

export async function addToWatchlist(
  symbol: string,
  company: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, message: "User not authenticated" };
    }

    await connectToDatabase();

    const existing = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (existing) {
      return { success: false, message: "Stock already in watchlist" };
    }

    await Watchlist.create({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company: company,
      addedAt: new Date(),
    });

    return { success: true, message: "Stock added to watchlist" };
  } catch (error) {
    console.error("addToWatchlist error:", error);
    return { success: false, message: "Failed to add stock to watchlist" };
  }
}

export async function removeFromWatchlist(
  symbol: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, message: "User not authenticated" };
    }

    await connectToDatabase();

    const result = await Watchlist.deleteOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (result.deletedCount === 0) {
      return { success: false, message: "Stock not found in watchlist" };
    }

    return { success: true, message: "Stock removed from watchlist" };
  } catch (error) {
    console.error("removeFromWatchlist error:", error);
    return { success: false, message: "Failed to remove stock from watchlist" };
  }
}

export async function getUserWatchlist(): Promise<StockWithData[]> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return [];
    }

    await connectToDatabase();

    const watchlistItems = await Watchlist.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();

    return watchlistItems.map((item) => ({
      userId: item.userId,
      symbol: item.symbol,
      company: item.company,
      addedAt: item.addedAt,
      currentPrice: undefined,
      changePercent: undefined,
      priceFormatted: undefined,
      changeFormatted: undefined,
      marketCap: undefined,
      peRatio: undefined,
    }));
  } catch (error) {
    console.error("getUserWatchlist error:", error);
    return [];
  }
}

export async function isStockInWatchlist(symbol: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return false;
    }

    await connectToDatabase();

    const item = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    return !!item;
  } catch (error) {
    console.error("isStockInWatchlist error:", error);
    return false;
  }
}
