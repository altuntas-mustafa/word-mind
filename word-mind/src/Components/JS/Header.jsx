import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <div
              className="space-y-2"
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            </div>

            {isNavOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-white z-10 flex flex-col justify-evenly items-center">
                <div
                  className="absolute top-0 right-0 px-8 py-8"
                  onClick={() => setIsNavOpen(false)}
                >
                  <svg
                    className="h-8 w-8 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <ul className="flex flex-col items-center justify-between min-h-[250px] bg-white backdrop-blur-md rounded-lg p-6 space-y-4">
                  <li>
                    <a href="/" className="text-lg text-gray-700 hover:text-yellow-300">Home</a>
                  </li>
                  <li>
                    <a href="/decks" className="text-lg text-gray-700 hover:text-yellow-300">Decks</a>
                  </li>
                  <li>
                    <a href="/createdecks" className="text-lg text-gray-700 hover:text-yellow-300">Create Deck</a>
                  </li>
                  <li>
                    <a href="/dashboard" className="text-lg text-gray-700 hover:text-yellow-300">DashBoard</a>
                  </li>
                  {/* Conditionally show login or logout link */}
                  {isLoggedIn ? (
                    <li>
                      <Link
                        to="/logout"
                        className="text-lg text-gray-700 hover:text-yellow-300"
                      >
                        Logout
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link
                        to="/login"
                        className="text-lg text-gray-700 hover:text-yellow-300"
                      >
                        Login
                      </Link>
                    </li>
                  )}
                </ul>
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
