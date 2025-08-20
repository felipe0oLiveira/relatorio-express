"use client";

import { useState } from "react";
import Link from "next/link";

export default function HeaderSimple() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors">
              AutoReport
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-white hover:text-yellow-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Entrar
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-slate-900/90 backdrop-blur-sm rounded-lg mt-2">
            <nav className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2 pt-4">
                <button className="justify-start text-white hover:text-yellow-300 w-full text-left px-4 py-2">
                  Entrar
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
