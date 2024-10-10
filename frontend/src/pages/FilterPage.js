import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StickyNavbar from '../components/StickyNavbar';
import ProductCard from '../components/ProductCard';
import axiosInstance from '../components/UserAxios';
import SERVERURL from '../Serverurl';
import UserLogout from '../components/UserLogout';
function FilterPage() {
    const nav = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [showOutOfStock, setShowOutOfStock] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        // Fetch products
        axiosInstance.get(`http://${SERVERURL}/user/productall/`).then((res) => {
            const mockProducts = res.data.products;
            setProducts(mockProducts);
            setFilteredProducts(mockProducts);
        });

        // Fetch categories
        axiosInstance.get(`http://${SERVERURL}/user/categories/all/`).then((res) => {
            setCategories(res.data.categories);
        });
    }, []);

    // Handle sorting
    useEffect(() => {
        let sortedProducts = [...filteredProducts];

        switch (sortOption) {
            case 'popularity':
                sortedProducts.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'price-low-high':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'new-arrivals':
                sortedProducts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                break;
            case 'a-z':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'z-a':
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        setFilteredProducts(sortedProducts);
    }, [sortOption]);

    // Handle stock filter
    useEffect(() => {
        let updatedProducts = products.filter(product => {
            // Adjust condition to consider quantity for out-of-stock
            const isOutOfStock = product.quantity < 250;
            return showOutOfStock || !isOutOfStock;
        });

        // Filter based on selected categories
        if (selectedCategories.length > 0) {
            updatedProducts = updatedProducts.filter(product =>
                selectedCategories.includes(product.category__name)
            );
        }

        setFilteredProducts(updatedProducts);
    }, [showOutOfStock, products, selectedCategories]);

    // Handle category checkbox change
    const handleCategoryChange = (categoryName) => {
        setSelectedCategories(prevSelectedCategories =>
            prevSelectedCategories.includes(categoryName)
                ? prevSelectedCategories.filter(name => name !== categoryName)
                : [...prevSelectedCategories, categoryName]
        );
    };

    return (
        <>
            <nav className="bg-gray-800 text-white fixed w-full top-0 z-50">
                <StickyNavbar name={localStorage.getItem('username')} signout={<UserLogout/>}/>
            </nav>

            <div>
                {/* Sidebar */}
                <aside id="logo-sidebar" className="fixed top-20 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                    <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showOutOfStock}
                                        onChange={() => setShowOutOfStock(!showOutOfStock)}
                                        className="mr-2"
                                    />
                                    Show out-of-stock products
                                </label>
                            </li>
                            <li>
                                <select
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="block w-full mt-2 p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Sort by</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                    <option value="rating">Average Ratings</option>
                                    <option value="new-arrivals">New Arrivals</option>
                                    <option value="a-z">A - Z</option>
                                    <option value="z-a">Z - A</option>
                                </select>
                            </li>
                        </ul>
                        <div className='p-4'/>
                        <h1>Categories</h1>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.category_id}>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.name)}
                                            onChange={() => handleCategoryChange(category.name)}
                                            className="mr-2"
                                        />
                                        {category.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main content */}
                <div className="p-4 sm:ml-64 mt-16">
                    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {/* Display filtered and sorted products */}
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div key={product.id} className="mb-4 p-4 border-b">
                                        <ProductCard
                                            id={product.product_id}
                                            imageUrl={`http://${SERVERURL}/media/` + product.img[0].image}
                                            title={product.name}
                                            rating={product.rating}
                                            price={product.price}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No products available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FilterPage;
