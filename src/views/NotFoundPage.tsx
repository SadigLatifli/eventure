// NotFoundPage.tsx

import { Link } from "@tanstack/react-router";


export default function NotFoundPage() {

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
      <p className="mt-4 text-2xl text-gray-600">Page Not Found</p>
      <Link
        href="/"
        className="mt-8 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to Home
      </Link>
    </div>
  );
}
