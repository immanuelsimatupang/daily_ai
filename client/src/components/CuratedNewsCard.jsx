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
        
        {article.aiSummary ? (
          <>
            <p className="text-gray-700 font-semibold text-sm mb-1">AI Summary:</p>
            <p className="text-gray-600 mb-4 line-clamp-3">{article.aiSummary}</p>
          </>
        ) : article.description ? (
          <>
            <p className="text-gray-700 font-semibold text-sm mb-1">Description:</p>
            <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
          </>
        ) : null}
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3"> {/* Added mb-3 for spacing before tags */}
          <span>Source: {article.sourceName || 'N/A'}</span>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Tags:</p>
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 5).map((tag, index) => ( // Show up to 5 tags
                <span key={index} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CuratedNewsCard;
