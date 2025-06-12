'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function ViewList() {
  const params = useParams();
  const listId = params.id as string;
  
  const [list, setList] = useState<GiftList | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);
  const [claimerName, setClaimerName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const loadList = async () => {
      try {
        const response = await fetch(`/api/lists/${listId}`);
        if (response.ok) {
          const listData = await response.json();
          setList(listData);
        }
      } catch (error) {
        console.error('Error loading list:', error);
      }
      setLoading(false);
    };

    loadList();
  }, [listId]);

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
        console.error('Error saving changes');
      }
    } catch (error) {
      console.error('Error saving list:', error);
    }
  };

  const claimItem = () => {
    if (!selectedItem || !list) return;
    if (!isAnonymous && !claimerName.trim()) return;

    const displayName = isAnonymous ? 'Anonymous' : claimerName.trim();

    const updatedItems = list.items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, claimedBy: displayName, claimedAt: new Date().toISOString() }
        : item
    );

    const updatedList = { ...list, items: updatedItems };
    saveList(updatedList);
    
    setShowClaimModal(false);
    setSelectedItem(null);
    setClaimerName('');
    setIsAnonymous(false);
  };

  const unclaimItem = (item: GiftItem) => {
    if (!list) return;

    const updatedItems = list.items.map(listItem => 
      listItem.id === item.id 
        ? { ...listItem, claimedBy: null, claimedAt: null }
        : listItem
    );

    const updatedList = { ...list, items: updatedItems };
    saveList(updatedList);
  };

  const handleClaimClick = (item: GiftItem) => {
    setSelectedItem(item);
    setShowClaimModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gift list...</p>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gift List Not Found</h2>
          <p className="text-gray-600 mb-4">This gift list doesn't exist or may have been deleted.</p>
          <Link 
            href="/"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Create Your Own List
          </Link>
        </div>
      </div>
    );
  }

  const birthdayDate = new Date(list.birthday);
  const today = new Date();
  const daysUntilBirthday = Math.ceil((birthdayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const totalItems = list.items.length;
  const claimedItems = list.items.filter(item => item.claimedBy).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">GiftSync</Link>
            <div className="text-sm text-gray-300">
              Share your own gift list
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* List Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">{list.name}</h1>
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{birthdayDate.toLocaleDateString()}</div>
                <div className="text-sm text-gray-600">Birthday</div>
              </div>
              {daysUntilBirthday > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{daysUntilBirthday}</div>
                  <div className="text-sm text-gray-600">Days to go</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{claimedItems}/{totalItems}</div>
                <div className="text-sm text-gray-600">Items claimed</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-gray-700">
                Help make {list.creator}'s birthday special by choosing a gift they actually want!
              </p>
            </div>
          </div>
        </div>

                 {/* Progress Bar */}
         {totalItems > 0 && (
           <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
             <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium text-gray-700">Gift claiming progress</span>
               <span className="text-sm text-gray-600">{claimedItems} of {totalItems} items claimed</span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-2">
               <div 
                 className="bg-black h-2 rounded-full transition-all duration-300"
                 style={{ width: `${totalItems > 0 ? (claimedItems / totalItems) * 100 : 0}%` }}
               ></div>
             </div>
           </div>
         )}

                 {/* Items List */}
         <div className="bg-white rounded-lg border border-gray-200 p-8">
           <h2 className="text-2xl font-bold text-black mb-6">Gift Ideas</h2>
          
          {list.items.length === 0 ? (
                         <div className="text-center py-12">
               <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl text-gray-400">?</span>
               </div>
               <h3 className="text-xl font-semibold text-black mb-2">No items yet</h3>
               <p className="text-gray-600">
                 {list.creator} hasn't added any items to their list yet. Check back soon!
               </p>
             </div>
          ) : (
                           <div className="grid gap-6">
                 {list.items.map((item) => (
                   <div key={item.id} className="border border-gray-200 rounded-md p-6 hover:border-gray-300 transition-colors">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <h4 className="text-xl font-semibold text-black mb-2">{item.name}</h4>
                         {item.price && (
                           <p className="text-lg text-black font-medium mb-3">{item.price}</p>
                         )}
                         {item.description && (
                           <p className="text-gray-600 mb-4">{item.description}</p>
                         )}
                         <div className="flex items-center space-x-4">
                           {item.link && (
                             <a
                               href={item.link}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-black hover:text-gray-600 font-medium"
                             >
                               View Item →
                             </a>
                           )}
                           {item.claimedBy && (
                             <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
                               Claimed by {item.claimedBy}
                               {item.claimedAt && (
                                 <span className="ml-2 text-gray-600">
                                   on {new Date(item.claimedAt).toLocaleDateString()}
                                 </span>
                               )}
                             </div>
                           )}
                         </div>
                       </div>
                       <div className="ml-4">
                         {item.claimedBy ? (
                           <button
                             onClick={() => unclaimItem(item)}
                             className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                           >
                             Remove Claim
                           </button>
                         ) : (
                           <button
                             onClick={() => handleClaimClick(item)}
                             className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
                           >
                             I'll Buy This
                           </button>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
          )}
        </div>

                 {/* How it Works */}
         <div className="bg-white rounded-lg border border-gray-200 p-8 mt-8">
           <h3 className="text-xl font-bold text-black mb-4">How This Works</h3>
           <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
             <div>
               <h4 className="font-semibold text-black mb-2">Claim an Item</h4>
               <p>Click "I'll Buy This" to let others know you're planning to buy that item. This prevents duplicates!</p>
             </div>
             <div>
               <h4 className="font-semibold text-black mb-2">Change Your Mind</h4>
               <p>If you change your mind, you can remove your claim and let someone else buy it instead.</p>
             </div>
             <div>
               <h4 className="font-semibold text-black mb-2">Direct Links</h4>
               <p>Use the provided links to find the exact items {list.creator} wants.</p>
             </div>
             <div>
               <h4 className="font-semibold text-black mb-2">Surprise Factor</h4>
               <p>{list.creator} can see what's claimed but not who claimed what - it's still a surprise!</p>
             </div>
           </div>
         </div>
      </main>

             {/* Claim Modal */}
       {showClaimModal && selectedItem && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
           <div className="bg-white rounded-lg p-8 max-w-md w-full">
             <h3 className="text-2xl font-bold text-black mb-4">Claim This Gift</h3>
             <p className="text-gray-600 mb-6">
               You're about to claim "<strong>{selectedItem.name}</strong>". 
               Other people will see this item as taken. You can choose to claim it anonymously or with your name.
             </p>
             <div className="mb-6">
               <div className="mb-4">
                 <label className="flex items-center">
                   <input
                     type="checkbox"
                     checked={isAnonymous}
                     onChange={(e) => setIsAnonymous(e.target.checked)}
                     className="mr-2 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                   />
                   <span className="text-sm text-gray-700">Claim anonymously</span>
                 </label>
               </div>
               
               {!isAnonymous && (
                 <div>
                   <label htmlFor="claimerName" className="block text-sm font-medium text-gray-700 mb-2">
                     Your Name
                   </label>
                   <input
                     type="text"
                     id="claimerName"
                     value={claimerName}
                     onChange={(e) => setClaimerName(e.target.value)}
                     placeholder="Enter your name"
                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black text-black"
                   />
                 </div>
               )}
             </div>
             <div className="flex space-x-3">
               <button
                 onClick={claimItem}
                 disabled={!isAnonymous && !claimerName.trim()}
                 className="flex-1 bg-black text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
               >
                 Claim Item
               </button>
               <button
                 onClick={() => {
                   setShowClaimModal(false);
                   setSelectedItem(null);
                   setClaimerName('');
                   setIsAnonymous(false);
                 }}
                 className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       )}

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
            
          </div>
        </div>
      </footer>
    </div>
  );
} 