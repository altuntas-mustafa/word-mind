import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

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
    <div className="bg-gradient-to-r from-blue-800 via-blue-500 to-green-500 border-b border-gray-400 p-6">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="text-4xl font-eater  whitespace-nowrap text-white hover:text-yellow-300 ">
          Word-Mind
        </a>
        <nav>
          <section className="lg:hidden font-abel">
            <div
              className="space-y-2"
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            </div>

            {isNavOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-white z-10 flex flex-col justify-evenly items-center ">
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
                <ul className="flex flex-col items-center justify-between min-h-[250px] bg-white backdrop-blur-md rounded-lg p-6 space-y-4 ">
                  <li>
                    <a href="/" className="text-lg text-gray-700 hover:text-yellow-300 ">Home</a>
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
                      <a
                        href="/logout"
                        className="text-lg text-gray-700 hover:text-yellow-300"
                      >
                        Logout
                      </a>
                    </li>
                  ) : (
                    <li>
                      <a
                        href="/login"
                        className="text-lg text-gray-700 hover:text-yellow-300"
                      >
                        Login
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </section>

          <ul className="hidden text-2xl  space-x-8 lg:flex font-abel">
            
            <li>
              <a href="/" className=" text-white hover:text-yellow-300 ">
                Home
              </a>
            </li>
            <li>
              <a
                href="/createdecks"
                className=" text-white hover:text-yellow-300 "
              >
                Create Deck
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className="text-white hover:text-yellow-300"
              >
                DashBoard
              </a>
            </li>
            {/* Conditionally show login or logout link */}
            {isLoggedIn ? (
              <li>
                <a
                  href="/logout"
                  className=" text-white hover:text-yellow-300"
                >
                  Logout
                </a>
              </li>
            ) : (
              <li>
                <a
                  href="/login"
                  className="text-white hover:text-yellow-300"
                >
                  Login
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
