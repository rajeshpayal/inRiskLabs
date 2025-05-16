'use client'

import { useState, useEffect } from 'react'

function UserLocation() {
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
      },
      (err) => {
        setError(err.message)
      }
    )
  }, [])

  return (
    <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '0.5rem' }}>
      <h2>User Location</h2>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : latitude && longitude ? (
        <p>
          Latitude: {latitude} <br />
          Longitude: {longitude}
        </p>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  )
}

export default UserLocation
