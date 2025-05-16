// page.js - Main dashboard page
"use client";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6 text-center">
          Weather Dashboard
        </h1>
        <Dashboard />
      </div>
    </div>
  );
}
