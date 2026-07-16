/**
 * Configuration object for centralizing API endpoints and search criteria
 */
const CONFIG = {
  // Usando uma API alternativa estável que retorna frases em português (via MyAllies ou similar)
  // ou uma API de citações que funcione bem sem bloqueio de CORS.
  QUOTE_API_BASE: 'https://api.allorigins.win/raw?url=https://zenquotes.io/api/quotes',
  
  // Lista de fallback local em português. Se as APIs de fora falharem, seu app continua lindo.
  FALLBACK_QUOTES: [
    { text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", author: "Robert Collier" },
    { text: "A única maneira de fazer um excelente trabalho é amar o que você faz.", author: "Steve Jobs" },
    { text: "Controle suas finanças ou elas controlarão você.", author: "Provérbio" },
    { text: "A persistência é o caminho do êxito.", author: "Charles Chaplin" },
    { text: "O maior risco de todos é não correr risco nenhum.", author: "Mark Zuckerberg" },
    { text: "Não encontre defeitos, encontre soluções.", author: "Henry Ford" },
    { text: "Tempo é dinheiro.", author: "Benjamin Franklin" }
  ]
};

/**
 * Fetches a random quote from the public API
 */
export const fetchRawQuote = async () => {
  try {
    // Usando o proxy allorigins para evitar problemas de CORS comuns em requisições de front-end
    const response = await fetch(CONFIG.QUOTE_API_BASE);
    
    if (!response.ok) throw new Error('Erro na requisição da API');
    
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      return {
        text: data[randomIndex].q, // 'q' é o texto na ZenQuotes
        author: data[randomIndex].a  // 'a' é o autor na ZenQuotes
      };
    }
    throw new Error('Nenhuma frase retornada pela API');
  } catch (error) {
    console.warn("API externa falhou. Usando fallback local em português.", error);
    // Retorna uma frase aleatória do nosso banco local em português
    const localRandom = CONFIG.FALLBACK_QUOTES[Math.floor(Math.random() * CONFIG.FALLBACK_QUOTES.length)];
    return {
      text: localRandom.text,
      author: localRandom.author,
      isLocal: true // Flag para sabermos que já veio em português
    };
  }
};

/**
 * Translates a given string.
 * Se a frase já veio do fallback local em português, ela apenas retorna o texto.
 * Caso contrário, usa um tradutor público gratuito e rápido (MyMemory API).
 */
export const translateText = async (text, isLocal = false) => {
  if (isLocal) return `"${text}"`;

  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`);
    const data = await response.json();

    if (data && data.responseData && data.responseData.translatedText) {
      return `"${data.responseData.translatedText}"`;
    }
    return `"${text}"`;
  } catch (error) {
    console.error("Erro na tradução automática:", error);
    return `"${text}"`; // Fallback para inglês se falhar
  }
};

/**
 * Orchestrates the full process: fetching the quote, translating it (if needed), and returning the final object
 */
export const getTranslatedQuote = async () => {
  const rawQuote = await fetchRawQuote();

  if (!rawQuote) {
    return {
      content: "Gerencie suas finanças hoje para garantir o seu amanhã.",
      author: "Arvum"
    };
  }

  // Passamos a flag se é local para evitar requisições de tradução desnecessárias
  const translatedText = await translateText(rawQuote.text, rawQuote.isLocal);

  return {
    content: translatedText,
    author: rawQuote.author || "Autor Desconhecido"
  };
};
