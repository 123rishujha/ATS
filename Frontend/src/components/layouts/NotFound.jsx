import React from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-library-light px-4 text-center">
      <Book className="h-16 w-16 text-library-primary mb-6" />
      <h1 className="text-4xl font-serif font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-library-dark/70 mb-8 max-w-md">
        Sorry, we couldn't find the page you were looking for. It might have
        been moved or doesn't exist.
      </p>
      <Link to="/" className="btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
