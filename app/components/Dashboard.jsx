import { useState } from "react";

import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { ToastContainer, toast } from "react-toastify";
import WeatherTable from "./WeatherTable";
import WeatherChart from "./WeatherChart";

export default function WeatherDashboard() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestCache = new Map();

  const isValidCoordinates = (lat, lon) => {
    return (
      !isNaN(lat) &&
      !isNaN(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    );
  };
  const getCacheKey = (lat, lon, start, end) => {
    return `${lat}_${lon}_${start}_${end}`;
  };
  const fetchWeather = async () => {
    if (!latitude || !longitude || !startDate || !endDate) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date.");
      return;
    }

    if (new Date(endDate) > new Date()) {
      toast.error("End date cannot be in the future.");
      return;
    }

    if (!isValidCoordinates(+latitude, +longitude)) {
      toast.error("Invalid latitude or longitude.");
      return;
    }

    const cacheKey = getCacheKey(latitude, longitude, startDate, endDate);
    const cached = requestCache.get(cacheKey);

    if (cached) {
      setData(cached);
      return;
    }

    setLoading(true);
    setData(null);

    try {
      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean&timezone=auto`
      );
      const result = await response.json();
      if (!result.daily) throw new Error("No data available");

      requestCache.set(cacheKey, result.daily); // ✅ Cache the result
      setData(result.daily);
    } catch (err) {
      toast.error("Failed to fetch data.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Historical Weather Dashboard</h1>
      <ToastContainer />
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Input
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => {
            if (e.target.value < -90 || e.target.value > 90) {
              toast.error("Latitude must be between -90 and 90.");
              return;
            }
            setLatitude(e.target.value);
          }}
          min={-90}
          max={90}
        />
        <Input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => {
            if (e.target.value < -180 || e.target.value > 180) {
              toast.error("Longitude must be between -180 and 180.");
              return;
            }
            setLongitude(e.target.value);
          }}
          min={-180}
          max={180}
        />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <Button onClick={fetchWeather} disabled={loading}>
        Fetch Weather
      </Button>
      {loading && <p className="mt-4 text-blue-500">Loading...</p>}
      {data && <WeatherChart data={data} />}
      {data && <WeatherTable data={data} />}
    </div>
  );
}
