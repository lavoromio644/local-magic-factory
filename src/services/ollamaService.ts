
/**
 * Service per l'integrazione con Ollama
 * Questo servizio gestisce la comunicazione con i modelli locali di Ollama
 */

// Configurazione base per Ollama
const OLLAMA_BASE_URL = "http://localhost:11434"; // URL di default per Ollama
const DEFAULT_MODEL = "llama3"; // Modello di default

interface GenerateOptions {
  model?: string;
  prompt: string;
  stream?: boolean;
  options?: Record<string, any>;
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

/**
 * Genera una risposta utilizzando un modello locale di Ollama
 */
export const generateResponse = async (
  prompt: string, 
  model: string = DEFAULT_MODEL
): Promise<string> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Errore nella risposta: ${response.status}`);
    }

    const data = await response.json() as OllamaResponse;
    return data.response;
  } catch (error) {
    console.error("Errore nella comunicazione con Ollama:", error);
    return "Mi dispiace, si è verificato un errore nella comunicazione con il modello locale. Verifica che Ollama sia in esecuzione sul tuo sistema.";
  }
};

/**
 * Verifica la disponibilità di Ollama
 */
export const checkOllamaAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
    });
    return response.ok;
  } catch (error) {
    console.error("Ollama non disponibile:", error);
    return false;
  }
};

/**
 * Ottiene la lista dei modelli disponibili su Ollama
 */
export const getAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
    });
    
    if (!response.ok) {
      throw new Error(`Errore nella risposta: ${response.status}`);
    }
    
    const data = await response.json();
    return data.models?.map((model: any) => model.name) || [];
  } catch (error) {
    console.error("Errore nel recupero dei modelli:", error);
    return [];
  }
};

/**
 * Genera codice applicativo completo basato su una descrizione
 */
export const generateProjectCode = async (
  description: string,
  options = {}
): Promise<string> => {
  const prompt = `
Sei un generatore esperto di applicazioni React. Genera un'applicazione completa basata sulla seguente descrizione:

${description}

Rispondi SOLO con il codice JSON strutturato come segue senza spiegazioni aggiuntive:
{
  "structure": {
    "files": [
      {
        "path": "percorso/al/file.js",
        "content": "// contenuto del file"
      }
    ]
  },
  "summary": "Breve descrizione dell'app generata"
}
`;

  try {
    const response = await generateResponse(prompt, "codellama");
    // Estrai il JSON dalla risposta
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                      response.match(/```([\s\S]*?)```/) || 
                      [null, response];
    
    const jsonContent = jsonMatch[1] || response;
    
    try {
      return JSON.parse(jsonContent);
    } catch (jsonError) {
      console.error("Errore nel parsing JSON:", jsonError);
      return response;
    }
  } catch (error) {
    console.error("Errore nella generazione del progetto:", error);
    return "Si è verificato un errore durante la generazione del progetto.";
  }
};

/**
 * Analizza il codice per rilevare errori
 */
export const analyzeCodeForErrors = async (code: string): Promise<{
  hasErrors: boolean;
  errors: string[];
  suggestions: string[];
}> => {
  const prompt = `
Analizza il seguente codice e identifica eventuali errori o problemi:

${code}

Rispondi con un oggetto JSON contenente 'hasErrors', un array di 'errors' e un array di 'suggestions':
`;

  try {
    const response = await generateResponse(prompt);
    // Estrai il JSON dalla risposta
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                      response.match(/```([\s\S]*?)```/) || 
                      [null, response];
    
    const jsonContent = jsonMatch[1] || response;
    
    try {
      return JSON.parse(jsonContent);
    } catch (jsonError) {
      console.error("Errore nel parsing JSON:", jsonError);
      return {
        hasErrors: false,
        errors: [],
        suggestions: ["Non è stato possibile analizzare il codice correttamente."]
      };
    }
  } catch (error) {
    console.error("Errore nell'analisi del codice:", error);
    return {
      hasErrors: false,
      errors: [],
      suggestions: ["Si è verificato un errore durante l'analisi del codice."]
    };
  }
};
