import { NextResponse } from "next/server";

// Rate limiting variables
const MAX_REQUESTS_PER_MINUTE = 10;
const requestCounts = new Map();

// Cache for API responses
const apiCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate required parameters
    if (!latitude || !longitude || !startDate || !endDate) {
      return NextResponse.json(
        { error: true, message: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate latitude and longitude
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return NextResponse.json(
        { error: true, message: "Invalid latitude value" },
        { status: 400 }
      );
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
      return NextResponse.json(
        { error: true, message: "Invalid longitude value" },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const minuteKey = `${clientIp}:${Math.floor(now / 60000)}`;

    const requestCount = requestCounts.get(minuteKey) || 0;
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        { error: true, message: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    requestCounts.set(minuteKey, requestCount + 1);

    // Clean up old rate limit entries every few requests
    if (Math.random() < 0.1) {
      const fiveMinutesAgo = now - 5 * 60000;
      for (const [key, timestamp] of requestCounts.entries()) {
        if (parseInt(key.split(":")[1]) * 60000 < fiveMinutesAgo) {
          requestCounts.delete(key);
        }
      }
    }

    // Create cache key
    const cacheKey = `${latitude}-${longitude}-${startDate}-${endDate}`;

    // Check if we have a cached response
    const cachedResponse = apiCache.get(cacheKey);
    if (cachedResponse && cachedResponse.timestamp > now - CACHE_TTL) {
      return NextResponse.json(cachedResponse.data);
    }

    // Construct Open-Meteo API URL
    const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean&timezone=auto`;

    // Fetch data from Open-Meteo
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: true,
          message: `API request failed with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Cache the response
    apiCache.set(cacheKey, {
      timestamp: now,
      data,
    });

    // Clean up old cache entries occasionally
    if (Math.random() < 0.05) {
      const expired = now - CACHE_TTL;
      for (const [key, value] of apiCache.entries()) {
        if (value.timestamp < expired) {
          apiCache.delete(key);
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in weather API route:", error);
    return NextResponse.json(
      { error: true, message: "Internal server error" },
      { status: 500 }
    );
  }
}
