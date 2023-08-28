import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check the user's authentication status on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    });

    return () => unsubscribe(); // Clean up on unmount
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 border-b border-gray-400 py-8">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="text-3xl font-semibold whitespace-nowrap text-white hover:text-yellow-300">
          Word-Mind
        </a>
        <nav>
          <section className="lg:hidden">
            {/* ... (rest of your code) */}
            {isNavOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-white z-10 flex flex-col justify-evenly items-center">
                {/* ... (rest of your code) */}
              </div>
            )}
          </section>

          <ul className="hidden space-x-8 lg:flex">
            <li>
              <a href="/" className="text-xl text-white hover:text-yellow-300">
                Home
              </a>
            </li>
            <li>
              <a href="/decks" className="text-xl text-white hover:text-yellow-300">
                Decks
              </a>
            </li>
            <li>
              <a
                href="/createdecks"
                className="text-xl text-white hover:text-yellow-300"
              >
                Create Deck
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className="text-xl text-white hover:text-yellow-300"
              >
                DashBoard
              </a>
            </li>
            {/* Conditionally show login or logout link */}
            {isLoggedIn ? (
              <li>
                <Link
                  to="/logout"
                  className="text-xl text-white hover:text-yellow-300"
                >
                  Logout
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="text-xl text-white hover:text-yellow-300"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
