import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StickyNavbar from '../components/StickyNavbar';
import ProductCard from '../components/ProductCard';
import axiosInstance from '../components/UserAxios';
import SERVERURL from '../Serverurl';
import UserLogout from '../components/UserLogout';
import { FiFilter, FiX } from 'react-icons/fi';
import { BiSort } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

function FilterPage() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get(`https://${SERVERURL}/user/productall/`),
          axiosInstance.get(`https://${SERVERURL}/user/categories/all/`)
        ]);
        
        setProducts(productsRes.data.products);
        setFilteredProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.category__name)
      );
    }

    // Apply stock filter
    if (!showOutOfStock) {
      result = result.filter(product => product.quantity >= 250);
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'new-arrivals':
        result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      case 'a-z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategories, showOutOfStock, sortOption, searchQuery]);

  const handleCategoryChange = (categoryName) => {
    setSelectedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortOption('');
    setShowOutOfStock(true);
    setSearchQuery('');
  };

  // Sidebar Component
  const Sidebar = () => (
    <div className="h-full px-4 py-6 overflow-y-auto bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BiSort className="text-gray-600" />
          Sort By
        </h3>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Default</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="new-arrivals">New Arrivals</option>
          <option value="a-z">Name: A to Z</option>
          <option value="z-a">Name: Z to A</option>
        </select>
      </div>

      {/* Stock Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={showOutOfStock}
            onChange={() => setShowOutOfStock(!showOutOfStock)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          Show Out of Stock
        </label>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.category_id}
              className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.name)}
                onChange={() => handleCategoryChange(category.name)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyNavbar name={localStorage.getItem('username')} signout={<UserLogout />} />

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed bottom-6 right-6 z-50 lg:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Open Filters"
      >
        <FiFilter className="w-6 h-6" />
      </button>

      <div className="pt-20 lg:grid lg:grid-cols-[320px,1fr]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block border-r border-gray-200 h-[calc(100vh-5rem)] sticky top-20">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="fixed right-0 top-0 h-full w-80 bg-white z-50 lg:hidden"
              >
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX className="w-6 h-6" />
                </button>
                <Sidebar />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="p-4 lg:p-6">
          {/* Active Filters */}
          {(selectedCategories.length > 0 || sortOption || !showOutOfStock || searchQuery) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedCategories.map(category => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {category}
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              {sortOption && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Sorted by: {sortOption}
                  <button
                    onClick={() => setSortOption('')}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {isLoading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.product_id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <ProductCard
                    id={product.product_id}
                    imageUrl={`https://${SERVERURL}/media/${product.img[0].image}`}
                    title={product.name}
                    rating={product.rating}
                    price={product.price}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src="/empty-state.svg"
                alt="No products found"
                className="w-48 h-48 mb-4 opacity-50"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default FilterPage;