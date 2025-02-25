"use client";

import Link from "next/link";

const CancelPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">Payment Canceled ❌</h1>
      <p className="mt-2 text-lg">Your payment was not completed.</p>
      <Link href="/billing">
        <button className="mt-5 px-6 py-2 bg-blue-500 text-white rounded-md shadow-md">
          Try Again
        </button>
      </Link>
    </div>
  );
};

export default CancelPage;
