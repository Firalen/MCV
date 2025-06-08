import React, { useState } from 'react'

const Store = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'jerseys', name: 'Jerseys' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'equipment', name: 'Equipment' }
  ]

  const products = [
    {
      id: 1,
      name: "Home Jersey 2024",
      price: 2500,
      category: "jerseys",
      image: "https://images.unsplash.com/photo-1508098682722-e99c643e5e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Official home jersey for the 2024 season",
      sizes: ["S", "M", "L", "XL"],
      inStock: true
    },
    {
      id: 2,
      name: "Away Jersey 2024",
      price: 2500,
      category: "jerseys",
      image: "https://images.unsplash.com/photo-1577223194256-6c9364293b43?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Official away jersey for the 2024 season",
      sizes: ["S", "M", "L", "XL"],
      inStock: true
    },
    {
      id: 3,
      name: "Volleyball Ball",
      price: 1200,
      category: "equipment",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Official match ball",
      inStock: true
    },
    {
      id: 4,
      name: "Team Cap",
      price: 800,
      category: "accessories",
      image: "https://images.unsplash.com/photo-1508098682722-e99c643e5e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      description: "Official team cap with embroidered logo",
      inStock: true
    }
  ]

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Official Store</h1>
          <p className="text-lg text-gray-600">Get your hands on official Mugher Volleyball Club merchandise</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.inStock ? (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                {product.sizes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Sizes:</p>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-blue-600">ETB {product.price}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Info */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Shipping Information</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over ETB 5000</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">2-3 business days</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Store

