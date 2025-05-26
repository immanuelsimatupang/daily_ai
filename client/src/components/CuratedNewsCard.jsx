import React from 'react';

const CuratedNewsCard = ({ article }) => {
  if (!article) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails to load
        />
      )}
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
            {article.category || 'General AI'}
          </span>
          <span className="text-xs text-gray-500 ml-2">
            {new Date(article.publishedAt).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
          <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
            {article.title}
          </a>
        </h3>
        
        {article.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.description}
          </p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Source: {article.sourceName || 'N/A'}</span>
          {/* Future: Add tags or other info here */}
        </div>
         {article.keywordsUsed && article.keywordsUsed.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-gray-400">Keywords: {article.keywordsUsed.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuratedNewsCard;
