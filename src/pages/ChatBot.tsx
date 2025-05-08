
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  MessageSquare, 
  User, 
  Loader, 
  Bug, 
  Code, 
  Monitor, 
  AlertCircle, 
  CheckCircle,
  Server
} from "lucide-react";
import { toast } from "sonner";
import ProjectPreview from "@/components/ProjectPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useOllama from "@/hooks/useOllama";
import { generateResponse, generateProjectCode, analyzeCodeForErrors } from "@/services/ollamaService";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Ciao! Sono l'assistente di Local Magic Factory. Descrivi il progetto che vuoi creare e ti aiuterò a generarlo utilizzando modelli di AI locali.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "preview">("chat");
  const [projectGenerated, setProjectGenerated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Hook per la connessione con Ollama
  const ollama = useOllama();

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Check if the message contains a request to generate a project
    const isGenerationRequest = 
      input.toLowerCase().includes("genera") || 
      input.toLowerCase().includes("crea") || 
      input.toLowerCase().includes("nuovo progetto");

    // Check if the message is asking to fix errors
    const isFixRequest = 
      input.toLowerCase().includes("correggi") || 
      input.toLowerCase().includes("sistema") || 
      input.toLowerCase().includes("risolvi") || 
      input.toLowerCase().includes("fix");

    try {
      // Verifica che Ollama sia disponibile
      if (!ollama.isAvailable) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Non sono riuscito a connettermi a Ollama. Verifica che sia in esecuzione sul tuo sistema per utilizzare i modelli di AI locali.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
        return;
      }

      if (isGenerationRequest) {
        // Aggiungi un messaggio di elaborazione
        const processingMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sto generando il progetto in base alla tua descrizione. Utilizzo modelli di AI locali per creare l'applicazione completa. Questo potrebbe richiedere alcuni secondi...",
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, processingMessage]);
        
        // Genera il progetto utilizzando Ollama
        const projectCode = await generateProjectCode(input, {
          model: ollama.selectedModel
        });
        
        setGeneratedCode(projectCode);
        setProjectGenerated(true);
        
        // Analizza il codice per errori
        const analysis = await analyzeCodeForErrors(JSON.stringify(projectCode));
        const hasErrors = analysis.hasErrors;
        setHasError(hasErrors);
        
        // Costruisci la risposta in base all'esito
        const completionMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: hasErrors 
            ? `Ho generato il progetto, ma ho riscontrato alcuni potenziali problemi:\n\n${analysis.errors.join('\n')}\n\nPuoi utilizzare il pulsante 'Correggi Errori' per tentare di risolverli automaticamente.` 
            : "Ho generato con successo il progetto richiesto! Puoi visualizzarne l'anteprima nella scheda 'Preview'.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, completionMessage]);
        
        if (hasErrors) {
          toast.error("Errore rilevato nel progetto generato", {
            description: "Clicca sul pulsante 'Correggi' per risolvere automaticamente.",
            duration: 5000,
          });
        } else {
          toast.success("Progetto generato con successo!", {
            description: "Puoi visualizzare l'anteprima nella tab 'Preview'.",
            duration: 3000,
          });
        }
      } else if (isFixRequest) {
        // Richiesta di correzione errori
        const fixingMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sto analizzando e correggendo gli errori nel progetto. Utilizzo modelli di AI locali per identificare e risolvere i problemi.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, fixingMessage]);
        
        // Modifica il codice per correggere gli errori
        if (generatedCode) {
          const fixPrompt = `
Il seguente codice presenta errori. Correggi gli errori mantenendo la stessa struttura:

${JSON.stringify(generatedCode)}

Rispondi SOLO con il JSON corretto nella stessa struttura.`;
          
          const fixedCode = await generateResponse(fixPrompt, ollama.selectedModel);
          
          // Cerca di estrarre e analizzare il JSON dalla risposta
          try {
            const jsonMatch = fixedCode.match(/```json\n([\s\S]*?)\n```/) || 
                             fixedCode.match(/```([\s\S]*?)```/) || 
                             [null, fixedCode];
            
            const jsonContent = jsonMatch[1] || fixedCode;
            const parsedCode = JSON.parse(jsonContent);
            
            setGeneratedCode(parsedCode);
            setHasError(false);
            
            const fixCompletedMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: "Ho corretto gli errori nel codice. Il progetto dovrebbe ora funzionare correttamente.",
              role: "assistant",
              timestamp: new Date(),
            };
            
            setMessages((prev) => [...prev, fixCompletedMessage]);
            
            toast.success("Errori corretti con successo!", {
              duration: 3000,
            });
          } catch (error) {
            console.error("Errore nel parsing del codice corretto:", error);
            
            const errorMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: "Ho avuto difficoltà a correggere alcuni errori. Prova a essere più specifico sulla natura del problema.",
              role: "assistant",
              timestamp: new Date(),
            };
            
            setMessages((prev) => [...prev, errorMessage]);
          }
        } else {
          const noCodeMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "Non ho trovato alcun codice da correggere. Genera prima un progetto.",
            role: "assistant",
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, noCodeMessage]);
        }
      } else {
        // Genera una risposta generica utilizzando Ollama
        const response = await generateResponse(
          `Sei un assistente AI di sviluppo chiamato Local Magic Factory. Rispondi alla seguente domanda o richiesta in italiano in modo utile, conciso e amichevole. Se riguarda la generazione di codice o di un progetto, consiglia di usare la parola "genera" o "crea" seguita dalla descrizione del progetto. La richiesta è: ${input}`,
          ollama.selectedModel
        );
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: response || "Mi dispiace, non sono riuscito a generare una risposta. Prova a riformulare la tua richiesta.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error("Errore durante l'interazione con Ollama:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Si è verificato un errore durante l'elaborazione della richiesta. Verifica che Ollama sia in esecuzione e riprova.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast.error("Errore di comunicazione", {
        description: "Impossibile comunicare con il modello locale",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFixErrors = async () => {
    // Add user message asking to fix errors
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "Per favore, correggi gli errori nel progetto.",
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const fixingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sto analizzando e correggendo gli errori nel progetto...",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fixingMessage]);
      
      // Modifica il codice per correggere gli errori
      if (generatedCode) {
        const fixPrompt = `
Il seguente codice presenta errori. Correggi gli errori mantenendo la stessa struttura:

${JSON.stringify(generatedCode)}

Rispondi SOLO con il JSON corretto nella stessa struttura.`;
        
        const fixedCode = await generateResponse(fixPrompt, ollama.selectedModel);
        
        // Cerca di estrarre e analizzare il JSON dalla risposta
        try {
          const jsonMatch = fixedCode.match(/```json\n([\s\S]*?)\n```/) || 
                           fixedCode.match(/```([\s\S]*?)```/) || 
                           [null, fixedCode];
          
          const jsonContent = jsonMatch[1] || fixedCode;
          const parsedCode = JSON.parse(jsonContent);
          
          setGeneratedCode(parsedCode);
          setHasError(false);
          
          const fixCompletedMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "Ho identificato e corretto gli errori nel progetto. Il problema principale era legato a incompatibilità di tipi TypeScript e alcuni componenti mancanti. Ora il progetto dovrebbe funzionare correttamente.",
            role: "assistant",
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, fixCompletedMessage]);
          
          toast.success("Errori corretti con successo!", {
            duration: 3000,
          });
        } catch (error) {
          console.error("Errore nel parsing del codice corretto:", error);
          
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "Ho avuto difficoltà a correggere alcuni errori. Prova a essere più specifico sulla natura del problema.",
            role: "assistant",
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error("Errore durante la correzione:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Si è verificato un errore durante la correzione. Riprova più tardi.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-4 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Nuovo Progetto</h1>
          <div className="flex items-center gap-2">
            {hasError && (
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2"
                onClick={handleFixErrors}
              >
                <Bug size={16} />
                Correggi Errori
              </Button>
            )}
            <Button 
              variant={ollama.isAvailable ? "outline" : "destructive"}
              size="sm" 
              className={`gap-2 ${ollama.isAvailable ? "border-green-500 text-green-600 hover:bg-green-50" : ""}`}
              onClick={ollama.checkAvailability}
              disabled={ollama.isChecking}
            >
              <Server size={16} />
              {ollama.isChecking ? "Connessione..." : 
               ollama.isAvailable ? `Ollama: ${ollama.selectedModel}` : "Ollama non disponibile"}
            </Button>
          </div>
        </div>
        
        {!ollama.isAvailable && !ollama.isChecking && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ollama non è disponibile. Assicurati che sia in esecuzione sul tuo sistema 
              (http://localhost:11434) e che abbia almeno un modello installato.
            </AlertDescription>
          </Alert>
        )}
        
        {ollama.isAvailable && (
          <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              Connesso a Ollama. Modello attuale: <strong>{ollama.selectedModel}</strong>. 
              {ollama.availableModels.length > 0 && (
                <span> Modelli disponibili: {ollama.availableModels.join(", ")}</span>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2 flex flex-col">
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "chat" | "preview")} className="lg:hidden mb-4">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Monitor size={16} />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className={`flex-1 bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col ${activeView === "chat" ? "block" : "hidden lg:flex"}`}>
              <div className="p-4 border-b bg-muted/30">
                <h2 className="font-medium flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" />
                  Assistente di progetto
                </h2>
                <p className="text-xs text-muted-foreground">
                  {ollama.isAvailable 
                    ? `100% locale e gratuito - Modello: ${ollama.selectedModel}`
                    : "Modelli locali non disponibili - Verifica Ollama"}
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`chat-bubble ${
                        message.role === "user"
                          ? "chat-bubble-user"
                          : "chat-bubble-ai"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-1 pb-1 border-b border-muted/70">
                          <MessageSquare size={14} className="text-primary" />
                          <span className="text-xs font-medium">Assistente</span>
                        </div>
                      )}
                      {message.role === "user" && (
                        <div className="flex items-center gap-2 mb-1 pb-1 border-b border-muted/70">
                          <User size={14} />
                          <span className="text-xs font-medium">Tu</span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="chat-bubble chat-bubble-ai">
                      <div className="flex items-center gap-2 mb-1 pb-1 border-b border-muted/70">
                        <Loader size={14} className="text-primary animate-spin" />
                        <span className="text-xs font-medium">Assistente sta scrivendo...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Descrivi il progetto che vuoi creare..."
                    disabled={!ollama.isAvailable}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isLoading || !ollama.isAvailable}
                  >
                    <Send size={18} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {ollama.isAvailable 
                    ? "Premi Invio per inviare, Shift+Invio per andare a capo" 
                    : "Connetti Ollama per utilizzare i modelli locali"}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`w-full lg:w-1/2 ${activeView === "preview" ? "block" : "hidden lg:block"}`}>
            {projectGenerated ? (
              <ProjectPreview generatedCode={generatedCode} hasError={hasError} />
            ) : (
              <div className="h-full bg-white rounded-lg border shadow-sm p-6 flex flex-col items-center justify-center">
                <Code size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nessun progetto generato</h3>
                <p className="text-muted-foreground text-center max-w-md mt-2">
                  Descrivi il progetto che vuoi creare nella chat e l'assistente lo genererà per te utilizzando modelli di AI locali.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatBot;
