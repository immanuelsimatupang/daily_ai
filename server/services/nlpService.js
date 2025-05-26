const { InferenceClient } = require('@huggingface/inference');

// Ensure HF_TOKEN is loaded from .env by the time this module is initialized,
// or by the time the client is first used.
// dotenv should be configured in server.js already.
const HF_TOKEN = process.env.HF_TOKEN;

let inferenceClient;

if (HF_TOKEN) {
  inferenceClient = new InferenceClient(HF_TOKEN);
  console.log('Hugging Face Inference Client initialized.');
} else {
  console.warn('HF_TOKEN not found in environment variables. NLP service will not be functional.');
  // Optionally, create a mock client or ensure functions handle the undefined client gracefully.
  inferenceClient = null; 
}

/**
 * Classifies a given text using a zero-shot classification model.
 * @param {string} text The input text to classify.
 * @param {string[]} candidateLabels An array of candidate labels for classification.
 * @param {string} model Optional: The model to use (defaults to facebook/bart-large-mnli).
 * @returns {Promise<object|null>} The classification result from Hugging Face API, or null if service is not available or error.
 */
async function classifyTextZeroShot(text, candidateLabels, model = 'facebook/bart-large-mnli') {
  if (!inferenceClient) {
    console.error('Hugging Face client not initialized. Cannot perform zero-shot classification.');
    return null;
  }

  if (!text || !candidateLabels || candidateLabels.length === 0) {
    console.error('Invalid input for zero-shot classification: Text and candidateLabels are required.');
    return null;
  }

  try {
    const result = await inferenceClient.zeroShotClassification({
      model: model,
      inputs: [text], // API expects an array of inputs
      parameters: { candidate_labels: candidateLabels }
    });
    // The result structure is typically an array of objects, one for each input.
    // Since we send one input, we expect one result.
    // Each result object contains: sequence, labels, scores
    return result[0]; 
  } catch (error) {
    console.error(`Error during zero-shot classification with model ${model}:`, error.message);
    if (error.response) { // Axios-like error structure from HF client
        console.error('HF API Error Details:', error.response.data);
    }
    return null;
  }
}

/**
 * Extracts named entities from a given text using a token classification model.
 * @param {string} text The input text from which to extract entities.
 * @param {string} model Optional: The NER model to use (defaults to dbmdz/bert-large-cased-finetuned-conll03-english).
 * @returns {Promise<string[]|null>} An array of unique entity strings, or null if service not available or error.
 */
async function extractEntitiesNER(text, model = 'dbmdz/bert-large-cased-finetuned-conll03-english') {
  if (!inferenceClient) {
    console.error('Hugging Face client not initialized. Cannot perform NER.');
    return null;
  }
  if (!text || text.trim() === '') {
    console.error('Invalid input for NER: Text is required.');
    return null;
  }

  try {
    const results = await inferenceClient.tokenClassification({
      model: model,
      inputs: text
    });

    // Results is an array of entities, e.g.:
    // [ { entity_group: 'ORG', score: 0.99, word: 'Hugging Face', start: 0, end: 12 }, ... ]
    
    const entities = new Set();
    const minConfidence = 0.85; // Confidence threshold

    for (const entity of results) {
      if (entity.score >= minConfidence) {
        // Simple tag: use the entity word. Replace spaces for consistency if desired.
        // Avoid single characters or very short tags if they are noisy.
        // The 'word' from HF tokenClassification is usually the recognized entity string.
        if (entity.word.length > 2 && !entity.word.startsWith('##')) {
           entities.add(entity.word.trim().toLowerCase().replace(/ /g, '-'));
        }
      }
    }
    return Array.from(entities);
  } catch (error) {
    console.error(`Error during NER with model ${model}:`, error.message);
    if (error.response) {
        console.error('HF API Error Details:', error.response.data);
    }
    return null;
  }
}

}

/**
 * Summarizes a given text using a summarization model.
 * @param {string} textToSummarize The input text to summarize.
 * @param {string} model Optional: The summarization model to use (defaults to facebook/bart-large-cnn).
 * @param {number} minLength Optional: Minimum length of the summary.
 * @param {number} maxLength Optional: Maximum length of the summary.
 * @returns {Promise<string|null>} The summary text, or null if service not available or error.
 */
async function summarizeText(textToSummarize, model = 'facebook/bart-large-cnn', minLength = 30, maxLength = 150) {
  if (!inferenceClient) {
    console.error('Hugging Face client not initialized. Cannot perform summarization.');
    return null;
  }
  if (!textToSummarize || textToSummarize.trim().length < minLength * 0.8) { // Ensure text is substantial enough
    console.warn('Input text too short for summarization or invalid.');
    return null; 
  }

  // Truncate text to avoid exceeding model token limits (e.g., 1024 tokens for bart-large-cnn)
  // A simple character limit for now, tokenization is more accurate but complex here.
  const MAX_INPUT_CHAR_LENGTH = 3000; // Roughly 750-1000 tokens
  let effectiveText = textToSummarize;
  if (effectiveText.length > MAX_INPUT_CHAR_LENGTH) {
    effectiveText = effectiveText.substring(0, MAX_INPUT_CHAR_LENGTH);
    console.log(`Input text truncated to ${MAX_INPUT_CHAR_LENGTH} characters for summarization.`);
  }

  try {
    const result = await inferenceClient.summarization({
      model: model,
      inputs: effectiveText,
      parameters: {
        min_length: minLength,
        max_length: maxLength,
      }
    });
    // Result is typically { summary_text: "..." }
    return result.summary_text;
  } catch (error) {
    console.error(`Error during summarization with model ${model}:`, error.message);
    if (error.response) {
        console.error('HF API Error Details:', error.response.data);
    }
    return null;
  }
}

module.exports = {
  classifyTextZeroShot,
  extractEntitiesNER,
  summarizeText, // New export
  isNlpServiceAvailable: () => !!inferenceClient
};
