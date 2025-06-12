'use client';

import { useState } from "react";

export default function Home() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [listName, setListName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleCreateList = async () => {
    if (!listName.trim() || !creatorName.trim() || !birthday) return;
    
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName,
          creator: creatorName,
          birthday: birthday
        })
      });

      if (response.ok) {
        const list = await response.json();
        // Redirect to the list management page
        window.location.href = `/list/${list.id}/edit`;
      } else {
        alert('Error creating list. Please try again.');
      }
    } catch (error) {
      console.error('Error creating list:', error);
      alert('Error creating list. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">GiftSync</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-white">How it works</a>
              <a href="#features" className="text-gray-300 hover:text-white">Features</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-black mb-6">
            Share Your Perfect
            <span className="text-black"> Birthday Wishlist</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Create a list of things you actually want for your birthday. Share it with friends and family. 
            They can claim items to avoid duplicate gifts. Everyone wins!
          </p>
          
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Create Your Gift List
            </button>
          ) : (
            <div className="bg-white p-8 rounded-lg border border-gray-200 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-black mb-6">Create Your List</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-2">
                    List Name
                  </label>
                  <input
                    type="text"
                    id="listName"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="e.g., Sarah&apos;s 25th Birthday Wishlist"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
                <div>
                  <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="creatorName"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
                <div>
                  <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
                    Birthday Date
                  </label>
                  <input
                    type="date"
                    id="birthday"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleCreateList}
                    disabled={!listName.trim() || !creatorName.trim() || !birthday}
                    className="flex-1 bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Create List
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How it Works */}
        <section id="how-it-works" className="mt-32">
          <h3 className="text-3xl font-bold text-center text-black mb-16">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-md flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Create Your List</h4>
              <p className="text-gray-600">Add items you actually want for your birthday with descriptions and links.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-md flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Share Your Link</h4>
              <p className="text-gray-600">Put the link in your bio or share it directly with friends and family.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-black text-white rounded-md flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-black mb-3">Friends Claim Items</h4>
              <p className="text-gray-600">Friends can claim items they want to buy, preventing duplicates.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-32">
          <h3 className="text-3xl font-bold text-center text-black mb-16">Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-md border border-gray-200">
              <h4 className="font-semibold text-black mb-2">No Duplicates</h4>
              <p className="text-gray-600 text-sm">Friends can see what&apos;s already claimed</p>
            </div>
            <div className="bg-white p-6 rounded-md border border-gray-200">
              <h4 className="font-semibold text-black mb-2">Price Ranges</h4>
              <p className="text-gray-600 text-sm">Add price ranges to help gift-givers</p>
            </div>
            <div className="bg-white p-6 rounded-md border border-gray-200">
              <h4 className="font-semibold text-black mb-2">Direct Links</h4>
              <p className="text-gray-600 text-sm">Link directly to where items can be bought</p>
            </div>
            <div className="bg-white p-6 rounded-md border border-gray-200">
              <h4 className="font-semibold text-black mb-2">Mobile Friendly</h4>
              <p className="text-gray-600 text-sm">Works perfectly on all devices</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-300 space-y-4">
            
            <div className="flex justify-center space-x-6">
              <a 
                href="https://github.com/Shayan5422" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/shayan-hashemi-5308081b1/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://buymeacoffee.com/shayanhshm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                title="Buy me a coffee"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4v-2z"/>
                </svg>
              </a>
            </div>
            <p className="text-xs text-gray-400">
            © 2025 GiftSync. Making birthdays better, one list at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
