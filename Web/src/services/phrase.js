/**
 * Configuration object for centralizing API endpoints and search criteria
 */
const CONFIG = {
  QUOTE_API_BASE: 'https://api.quotable.io/quotes',
  TRANSLATE_API_BASE: 'https://lingva.ml/api/v1/en/pt/',
  TAGS: ["leadership", "success", "motivation", "inspiration", "knowledge", "strategy", "self-improvement"],
  AUTHORS: ["socrates", "marcus-aurelius", "napoleon-hill", "michelle-obama", "napoleon", 
    "pope-paul-vi", "george-orwell", "pope-john-xxiii", "steve-jobs", "leonardo-da-vinci", "albert-einstein", 
    "winston-churchill", "immanuel-kant", "voltaire", "plato", "bruce-lee", "george-washington", "aristotle", 
    "alexander-the-great", "j-r-r-tolkien"]
};

/**
 * Randomly selects a search parameter (tag or author) to be used in the quote request
 */
const getSearchCriteria = () => {
  const useTag = Math.random() < 0.5;
  if (useTag) {
    const randomTag = CONFIG.TAGS[Math.floor(Math.random() * CONFIG.TAGS.length)];
    return { type: 'query', value: randomTag };
  } else {
    const randomAuthor = CONFIG.AUTHORS[Math.floor(Math.random() * CONFIG.AUTHORS.length)];
    return { type: 'author', value: randomAuthor };
  }
};

/**
 * Fetches a random quote from the public API based on selected criteria
 */
export const fetchRawQuote = async () => {
  const criteria = getSearchCriteria();
  const url = `${CONFIG.QUOTE_API_BASE}?${criteria.type}=${encodeURIComponent(criteria.value)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      return {
        text: data.results[randomIndex].content,
        author: data.results[randomIndex].author
      };
    }
    throw new Error('Nenhuma frase encontrada');
  } catch (error) {
    console.error("Erro ao buscar frase:", error);
    return null;
  }
};

/**
 * Translates a given string using the configured translation service
 */
export const translateText = async (text) => {
  try {
    const response = await fetch(`${CONFIG.TRANSLATE_API_BASE}${encodeURIComponent(text)}`);
    const data = await response.json();

    if (data && data.translation) {
      // Clean up potential formatting issues and wrap in quotes
      const cleanedTranslation = data.translation.replace(/\+/g, ' ');
      return `"${cleanedTranslation}"`;
    }
    return null;
  } catch (error) {
    console.error("Erro na tradução:", error);
    return null;
  }
};

/**
 * Orchestrates the full process: fetching the quote, translating it, and returning the final object
 */
export const getTranslatedQuote = async () => {
  const rawQuote = await fetchRawQuote();

  if (!rawQuote) {
    return {
      content: "Hoje você terá que pensar em uma frase você mesmo",
      author: "Arvum"
    };
  }

  const translatedText = await translateText(rawQuote.text);

  return {
    content: translatedText || rawQuote.text, // Fallback to English if translation fails
    author: rawQuote.author
  };
};