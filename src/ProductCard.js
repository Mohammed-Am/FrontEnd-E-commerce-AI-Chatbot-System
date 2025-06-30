import React from 'react';

function ProductCard({ product }) {
  console.log('ProductCard received product:', product);
  return (
    <div className="  gap-x-8 bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img 
        src={product.image_url} 
        alt={product.name}
        className="w-full  h-48  object-cover"
      />
      <div className="p-4 flex-grow flex flex-col">
            <h3 className=" font-semibold text-gray-800 mb-2">Type:{product.type}</h3>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{product.description}</p>
        {product.price && (
          <p className="text-lg font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</p>
        )}
      
      </div>
    </div>
  );
}

export default ProductCard;