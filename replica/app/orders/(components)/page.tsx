// {/* Right Sidebar Filter Drawer */}
// <div className={`fixed inset-0 z-50 ${filterOpen ? 'visible' : 'invisible'}`}>
//   {/* Backdrop */}
//   <div 
//     onClick={() => setFilterOpen(false)}
//     className={`absolute inset-0 bg-black transition-opacity ${filterOpen ? 'opacity-50' : 'opacity-0'}`}
//   />
  
//   {/* Sidebar */}
//   <div className={`absolute right-0 top-0 h-full w-96 bg-white shadow-2xl transition-transform ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//     <div className="flex items-center justify-between p-6 border-b">
//       <h2 className="text-xl font-semibold">Filters</h2>
//       <button 
//         onClick={() => setFilterOpen(false)}
//         className="text-gray-500 hover:text-gray-700">
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//         </svg>
//       </button>
//     </div>

//     <div className="p-6 space-y-6 overflow-y-auto h-full pb-32">
//       {/* Date Range */}
//       <div>
//         <label className="block text-sm font-medium mb-3">Date Range</label>
//         <div className="grid grid-cols-2 gap-3">
//           <input
//             type="date"
//             value={filters.startDate}
//             onChange={(e) => setFilters({...filters, startDate: e.target.value})}
//             className="border rounded-lg px-3 py-2"
//           />
//           <input
//             type="date"
//             value={filters.endDate}
//             onChange={(e) => setFilters({...filters, endDate: e.target.value})}
//             className="border rounded-lg px-3 py-2"
//           />
//         </div>
//       </div>

//       {/* HSN */}
//       <div>
//         <label className="block text-sm font-medium mb-2">HSN</label>
//         <input
//           type="text"
//           placeholder="Enter HSN"
//           value={filters.hsn}
//           onChange={(e) => setFilters({...filters, hsn: e.target.value})}
//           className="w-full border rounded-lg px-3 py-2"
//         />
//       </div>

//       {/* SKU */}
//       <div>
//         <label className="block text-sm font-medium mb-2">SKU</label>
//         <input
//           type="text"
//           placeholder="Enter SKU"
//           value={filters.sku}
//           onChange={(e) => setFilters({...filters, sku: e.target.value})}
//           className="w-full border rounded-lg px-3 py-2"
//         />
//       </div>

//       {/* Address Tag */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Address Tag</label>
//         <input
//           type="text"
//           placeholder="e.g. Home, Office, Gift"
//           value={filters.addressTag}
//           onChange={(e) => setFilters({...filters, addressTag: e.target.value})}
//           className="w-full border rounded-lg px-3 py-2"
//         />
//       </div>
//     </div>

//     {/* Bottom Buttons */}
//     <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
//       <button
//         onClick={() => {
//           setFilters({ startDate: '', endDate: '', hsn: '', sku: '', addressTag: '' });
//           fetchOrders(); // your existing fetch function with no filters
//           setFilterOpen(false);
//         }}
//         className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
//       >
//         Clear All
//       </button>
//       <button
//         onClick={() => {
//           fetchOrders(filters); // pass filters to your API call
//           setFilterOpen(false);
//         }}
//         className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//       >
//         Apply Filters
//       </button>
//     </div>
//   </div>
// </div>