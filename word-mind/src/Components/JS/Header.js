import { useState } from "react";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 border-b border-gray-400 py-8 ">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className="text-2xl font-semibold whitespace-nowrap text-white hover:text-yellow-300">
          Word-Mind
        </a>
        <nav>
          <section className="MOBILE-MENU flex lg:hidden">
            <div
              className="HAMBURGER-ICON space-y-2"
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
              <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            </div>

            <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
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
                  <a href="/" className="text-gray-700 hover:text-yellow-300">Home</a>
                </li>
                <li>
                  <a href="/decks" className="text-gray-700 hover:text-yellow-300">Decks</a>
                </li>
                <li>
                  <a href="/createdecks" className="text-gray-700 hover:text-yellow-300">Create Deck</a>
                </li>
              </ul>
            </div>
          </section>

          <ul className="DESKTOP-MENU hidden space-x-8 lg:flex">
            <li>
              <a href="/" className="text-white hover:text-yellow-300">Home</a>
            </li>
            <li>
              <a href="/decks" className="text-white hover:text-yellow-300">Decks</a>
            </li>
            <li>
              <a href="/createdecks" className="text-white hover:text-yellow-300">Create Deck</a>
            </li>
          </ul>
        </nav>
      </div>
      <style>{`
        .hideMenuNav {
          display: none;
        }
        .showMenuNav {
          display: block;
          position: fixed;
          width: 100%;
          height: 100vh;
          top: 0;
          left: 0;
          background: white;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        }
      `}</style>
    </div>
  );
}
