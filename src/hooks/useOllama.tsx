
import { useState, useEffect } from "react";
import { 
  checkOllamaAvailability, 
  getAvailableModels 
} from "@/services/ollamaService";
import { toast } from "sonner";

export interface OllamaState {
  isAvailable: boolean;
  isChecking: boolean;
  availableModels: string[];
  selectedModel: string;
  error: string | null;
}

export const useOllama = () => {
  const [state, setState] = useState<OllamaState>({
    isAvailable: false,
    isChecking: true,
    availableModels: [],
    selectedModel: "llama3",
    error: null
  });

  const checkAvailability = async () => {
    setState(prev => ({ ...prev, isChecking: true }));
    try {
      const isAvailable = await checkOllamaAvailability();
      
      if (isAvailable) {
        const models = await getAvailableModels();
        setState({
          isAvailable: true,
          isChecking: false,
          availableModels: models,
          selectedModel: models.includes("llama3") ? "llama3" : (models[0] || "llama3"),
          error: null
        });

        toast.success("Connessione con Ollama stabilita", {
          description: `${models.length} modelli disponibili`,
        });
      } else {
        setState({
          isAvailable: false,
          isChecking: false,
          availableModels: [],
          selectedModel: "llama3",
          error: "Ollama non è disponibile. Assicurati che sia in esecuzione sul tuo sistema."
        });

        toast.error("Impossibile connettersi a Ollama", {
          description: "Verifica che Ollama sia in esecuzione",
        });
      }
    } catch (error) {
      setState({
        isAvailable: false,
        isChecking: false,
        availableModels: [],
        selectedModel: "llama3",
        error: "Errore durante il controllo di Ollama"
      });
      
      toast.error("Errore durante la connessione a Ollama", {
        description: "Verifica la tua configurazione di rete",
      });
    }
  };

  const setSelectedModel = (model: string) => {
    setState(prev => ({ ...prev, selectedModel: model }));
    toast.info(`Modello ${model} selezionato`);
  };

  useEffect(() => {
    checkAvailability();
  }, []);

  return {
    ...state,
    checkAvailability,
    setSelectedModel
  };
};

export default useOllama;
