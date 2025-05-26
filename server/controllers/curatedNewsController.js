const axios = require('axios');
const CuratedNews = require('../models/CuratedNews');
const { classifyTextZeroShot, extractEntitiesNER, summarizeText, isNlpServiceAvailable } = require('../services/nlpService');

// IMPORTANT: API Key should be in environment variables in a real application
const NEWSAPI_API_KEY = '1e9f220784994bbe924bbb41a672d03d'; // User provided API Key for NewsAPI.org

const categoriesKeywords = {
  'New AI Tools/Products': ['new AI tool', 'AI product launch', 'AI platform release', 'AI software', 'AI hardware'],
  'AI Model Updates': ['AI model update', 'GPT update', 'LLM new version', 'diffusion model update', 'model architecture'],
  'AI Companies': ['OpenAI', 'Google AI', 'DeepMind', 'Nvidia AI', 'Microsoft AI', 'Anthropic', 'AI company funding', 'AI acquisition'],
  'AI Research': ['AI research paper', 'machine learning study', 'AI breakthrough', 'deep learning research', 'neurips', 'icml'],
  'AI Ethics & Governance': ['AI ethics', 'AI regulation', 'responsible AI', 'AI safety', 'AI bias', 'AI policy'],
  'AI Applications': ['AI in healthcare', 'AI in finance', 'AI in education', 'AI art', 'AI drug discovery', 'AI logistics']
};

const broadSearchQueries = ['artificial intelligence', 'AI ML', 'AI innovation'];

// Internal function for core logic
async function _internalFetchAndProcessNews() {
  let articlesAdded = 0;
  let articlesFound = 0;
  const errorsEncountered = []; // Renamed for clarity in return object
  const candidateCategoryLabels = Object.keys(categoriesKeywords);

  try {
    for (const query of broadSearchQueries) {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWSAPI_API_KEY}`;
      
      try {
        const response = await axios.get(url);
        articlesFound += response.data.articles.length;

        for (const article of response.data.articles) {
          if (!article.title || !article.url) {
            console.warn(`Skipping article with missing title or URL: ${JSON.stringify(article)}`);
            continue;
          }

          const existingArticle = await CuratedNews.findOne({ originalUrl: article.url });
          if (existingArticle) {
            continue;
          }

          const articleTextForNlp = (article.title || '') + ' ' + (article.description || '');
          let finalCategory = null;
          let articleProcessedByAI = false;

          if (isNlpServiceAvailable() && articleTextForNlp.trim() !== '') {
            try {
              const classificationResult = await classifyTextZeroShot(articleTextForNlp, candidateCategoryLabels);
              if (classificationResult && classificationResult.labels && classificationResult.scores) {
                if (classificationResult.scores[0] > 0.5) { // Confidence threshold
                  finalCategory = classificationResult.labels[0];
                  articleProcessedByAI = true;
                  console.log(`NLP Classification for "${article.title}": ${finalCategory} (Score: ${classificationResult.scores[0]})`);
                } else {
                  console.log(`NLP Classification for "${article.title}" below threshold. Score: ${classificationResult.scores[0]}`);
                }
              }
            } catch (nlpError) {
              console.error('Error during NLP classification for article "' + article.title + '":', nlpError);
            }
          }

          if (!finalCategory) { // Fallback to keyword classification
            let bestCategoryFromKeywords = null;
            let maxMatches = 0;
            const articleTextLowercase = articleTextForNlp.toLowerCase(); // Use the same combined text, lowercased

            for (const [categoryName, keywordsArray] of Object.entries(categoriesKeywords)) {
              let currentMatches = 0;
              for (const keyword of keywordsArray) {
                if (articleTextLowercase.includes(keyword.toLowerCase())) {
                  currentMatches++;
                }
              }
              if (currentMatches > maxMatches) {
                maxMatches = currentMatches;
                bestCategoryFromKeywords = categoryName;
              }
            }
            if (maxMatches > 0 && bestCategoryFromKeywords) {
              finalCategory = bestCategoryFromKeywords;
            }
          }

          if (finalCategory) { // Only save if a category was determined
            let generatedTags = [];
            const articleTextLowercaseForTags = articleTextForNlp.toLowerCase(); // Ensure it's lowercase for fallback

            if (isNlpServiceAvailable() && articleTextForNlp.trim() !== '') {
              try {
                const nerResult = await extractEntitiesNER(articleTextForNlp); // Pass original case for NER if model prefers
                if (nerResult && nerResult.length > 0) {
                  generatedTags = nerResult;
                  console.log(`NER Tags for "${article.title}": ${generatedTags.join(', ')}`);
                } else {
                  console.log(`NER for "${article.title}" yielded no tags or failed, falling back to keyword tags.`);
                }
              } catch (nerError) {
                console.error(`Error during NER tagging for article "${article.title}":`, nerError);
                // Fallback will be triggered as generatedTags remains empty
              }
            }

            let articleAiSummary = null;
            if (isNlpServiceAvailable()) {
              const textToSummarize = article.description || article.content || ''; // Prefer description, fallback to content
              if (textToSummarize.trim().length > 75) { // Summarize if text is reasonably long
                console.log(`Attempting to summarize for: ${article.title}`);
                try {
                  articleAiSummary = await summarizeText(textToSummarize); // Default model and length params from nlpService
                  if (articleAiSummary) {
                    console.log(`AI Summary for "${article.title.substring(0,30)}...": ${articleAiSummary.substring(0, 100)}...`);
                  } else {
                    console.log(`Summarization for "${article.title.substring(0,30)}..." returned null or empty.`);
                  }
                } catch (summaryError) {
                  console.error(`Error during summarization for article "${article.title}":`, summaryError);
                }
              } else {
                console.log(`Text for "${article.title.substring(0,30)}..." too short, skipping summarization.`);
              }
            }

            if (generatedTags.length === 0) { // Fallback to keyword-based tags
              const foundKeywordsForTags = new Set();
              for (const kwArray of Object.values(categoriesKeywords)) {
                for (const keyword of kwArray) {
                  if (articleTextLowercaseForTags.includes(keyword.toLowerCase())) {
                    foundKeywordsForTags.add(keyword.toLowerCase().replace(/ /g, '-'));
                  }
                }
              }
              generatedTags = Array.from(foundKeywordsForTags);
              if (generatedTags.length > 0) {
                console.log(`Fallback Keyword Tags for "${article.title}": ${generatedTags.join(', ')}`);
              }
            }

            const newArticleEntry = new CuratedNews({
              title: article.title,
              originalUrl: article.url,
              sourceName: article.source.name,
              publishedAt: new Date(article.publishedAt),
              description: article.description,
              content: article.content,
              imageUrl: article.urlToImage,
              category: finalCategory,
              processedByAI: articleProcessedByAI, // This flag should now primarily reflect classification
              keywordsUsed: [query],
              tags: generatedTags,
              aiSummary: articleAiSummary // Add the new AI summary
            });
            await newArticleEntry.save();
            articlesAdded++;
          } else {
            console.log(`Article "${article.title}" skipped as no category could be determined.`);
          }
        }
      } catch (apiError) {
        const errorMessage = apiError.response?.data?.message || apiError.message;
        console.error(`Error fetching/processing news for broad query '${query}':`, errorMessage);
        errorsEncountered.push(`Query '${query}': ${errorMessage}`);
      }
    }
    // If we reach here, the overall process is considered successful, even with minor errors.
    return { success: true, articlesFound, articlesAdded, errorsEncountered };

  } catch (error) {
    // This catch is for more catastrophic errors in the _internalFetchAndProcessNews function itself
    console.error('Major error in _internalFetchAndProcessNews:', error);
    errorsEncountered.push(`Overall process failed: ${error.message}`);
    return { success: false, articlesFound, articlesAdded, errorsEncountered };
  }
}

// @desc    Fetch and store news articles from NewsAPI.org
// @route   POST /api/curated-news/fetch
// @access  Private/Admin (to be enforced by route)
exports.fetchAndStoreNews = async (req, res) => {
  try {
    const result = await _internalFetchAndProcessNews();

    if (result.success) {
      // Determine appropriate message based on articles added/found
      let message;
      if (result.articlesAdded > 0 || result.articlesFound > 0) {
        message = `News fetching process completed. Found: ${result.articlesFound} articles, Added: ${result.articlesAdded} new articles.`;
      } else {
        message = 'No new articles found or added based on current criteria and queries.';
      }
      
      res.status(200).json({
        success: true,
        message: message,
        articlesFound: result.articlesFound,
        articlesAdded: result.articlesAdded,
        errors: result.errorsEncountered.length > 0 ? result.errorsEncountered : undefined
      });
    } else {
      // This case handles if _internalFetchAndProcessNews itself had a major failure
      res.status(500).json({
        success: false,
        message: 'Major error in news fetching process.',
        articlesFound: result.articlesFound,
        articlesAdded: result.articlesAdded,
        detailed_errors: result.errorsEncountered
      });
    }
  } catch (error) { 
    // Catch unexpected errors from calling _internalFetchAndProcessNews or within this handler
    console.error('Error in fetchAndStoreNews controller:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menjalankan proses pengambilan berita',
      error: error.message
    });
  }
};

// @desc    Get curated news articles
// @route   GET /api/curated-news
// @access  Public
exports.getCuratedNews = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10, sortBy: sortByQuery = 'publishedAt_desc' } = req.query;
    const query = {};

    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag.toLowerCase()] };

    // Default sort: newest publishedAt first
    let sortOption = { publishedAt: -1 }; 
    
    if (sortByQuery) {
      const parts = sortByQuery.split('_');
      const field = parts[0];
      const orderString = parts[1];
      
      // Whitelist valid sortable fields
      const validSortFields = ['publishedAt', 'sourceName', 'title', 'category', 'fetchedAt']; 
      if (validSortFields.includes(field)) {
        const order = orderString === 'asc' ? 1 : -1; // Default to desc if not 'asc'
        sortOption = { [field]: order };
      } else {
        // If field is invalid, or format is wrong, it defaults to publishedAt: -1
        // Optionally, log a warning or error if an invalid sort field is provided
        console.warn(`Invalid sort field provided: ${field}. Defaulting to publishedAt_desc.`);
      }
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOption, // Use the dynamically constructed sortOption
      // lean: true, // For slightly faster queries if not modifying docs
    };

    const result = await CuratedNews.paginate(query, options); // Assumes mongoose-paginate-v2

    res.status(200).json({
      success: true,
      data: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      totalDocs: result.totalDocs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mendapatkan berita terkurasi',
      error: error.message,
    });
  }
};
