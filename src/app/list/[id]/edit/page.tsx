'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface GiftItem {
  id: string;
  name: string;
  description: string;
  price: string;
  link: string;
  claimedBy: string | null;
  claimedAt: string | null;
}

interface GiftList {
  id: string;
  name: string;
  creator: string;
  birthday: string;
  items: GiftItem[];
  createdAt: string;
}

export default function EditList() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;
  
  const [list, setList] = useState<GiftList | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    link: ''
  });

  useEffect(() => {
    const loadList = async () => {
      try {
        const response = await fetch(`/api/lists/${listId}`);
        if (response.ok) {
          const listData = await response.json();
          setList(listData);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading list:', error);
        router.push('/');
      }
      setLoading(false);
    };

    loadList();
  }, [listId, router]);

  const saveList = async (updatedList: GiftList) => {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedList)
      });

      if (response.ok) {
        const savedList = await response.json();
        setList(savedList);
      } else {
        alert('Error saving changes. Please try again.');
      }
    } catch (error) {
      console.error('Error saving list:', error);
      alert('Error saving changes. Please try again.');
    }
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;
    
    const item: GiftItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ...newItem,
      claimedBy: null,
      claimedAt: null
    };

    const updatedList = {
      ...list!,
      items: [...list!.items, item]
    };

    saveList(updatedList);
    setNewItem({ name: '', description: '', price: '', link: '' });
    setShowAddForm(false);
  };

  const deleteItem = (itemId: string) => {
    if (!list) return;
    
    const updatedList = {
      ...list,
      items: list.items.filter(item => item.id !== itemId)
    };

    saveList(updatedList);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/list/${listId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gift list...</p>
        </div>
      </div>
    );
  }

  if (!list) {
    return null;
  }

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/list/${listId}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">GiftSync</Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={copyShareLink}
                className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-300"
              >
                Copy Share Link
              </button>
              <Link
                href={`/list/${listId}`}
                className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                Preview
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* List Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">{list.name}</h1>
          <p className="text-gray-600 mb-4">
            Created by {list.creator} • Birthday: {new Date(list.birthday).toLocaleDateString()}
          </p>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-700 mb-2">Share this link with friends and family:</p>
            <div className="flex items-center space-x-2">
              <code className="bg-white border border-gray-300 px-3 py-1 rounded-md text-sm flex-1 text-gray-900">
                {shareUrl}
              </code>
              <button
                onClick={copyShareLink}
                className="bg-black text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Add Item Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Gift Items</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              {showAddForm ? 'Cancel' : 'Add Item'}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-black mb-4">Add New Item</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="e.g., Wireless Headphones"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <input
                    type="text"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="e.g., $50-100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Describe the item, preferred brands, colors, etc."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link (optional)
                  </label>
                  <input
                    type="url"
                    value={newItem.link}
                    onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                    placeholder="https://example.com/product"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={addItem}
                  disabled={!newItem.name.trim()}
                  className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Item
                </button>
              </div>
            </div>
          )}

          {/* Items List */}
          {list.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">+</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">No items yet</h3>
              <p className="text-gray-600 mb-4">Add your first gift item to get started!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {list.items.map((item) => (
                                 <div key={item.id} className="border border-gray-200 rounded-md p-4">
                   <div className="flex items-start justify-between">
                     <div className="flex-1">
                       <h4 className="font-semibold text-black mb-1">{item.name}</h4>
                       {item.price && (
                         <p className="text-black font-medium mb-2">{item.price}</p>
                       )}
                       {item.description && (
                         <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                       )}
                       {item.link && (
                         <a
                           href={item.link}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-black text-sm hover:underline"
                         >
                           View Item →
                         </a>
                       )}
                       {item.claimedBy && (
                         <div className="mt-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm inline-block">
                           Claimed by {item.claimedBy}
                         </div>
                       )}
                     </div>
                     <button
                       onClick={() => deleteItem(item.id)}
                       className="text-gray-400 hover:text-red-600 p-1"
                       title="Delete item"
                     >
                       ×
                     </button>
                   </div>
                 </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-black mb-4">Tips for a Great Gift List</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Be specific about brands, colors, or sizes you prefer</li>
            <li>• Include a variety of price ranges to suit different budgets</li>
            <li>• Add direct links to make it easy for friends to find items</li>
            <li>• Update your list regularly as your preferences change</li>
            <li>• Share your link early so friends have time to plan</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-300 space-y-3">
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