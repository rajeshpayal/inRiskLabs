// layout.js - Root layout
import './globals.css';

export const metadata = {
  title: 'Weather Dashboard',
  description: 'Interactive dashboard for historical weather data visualization',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}