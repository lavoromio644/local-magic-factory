
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, User, Loader, Bug, Code, Monitor } from "lucide-react";
import { toast } from "sonner";
import ProjectPreview from "@/components/ProjectPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      content: "Ciao! Sono l'assistente di Local Magic Factory. Descrivi il progetto che vuoi creare e ti aiuterò a generarlo.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"chat" | "preview">("chat");
  const [projectGenerated, setProjectGenerated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
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

    // Simulate AI processing with local models
    setTimeout(() => {
      let aiResponse: Message;

      if (isGenerationRequest) {
        // Project generation response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: "Sto generando il progetto in base alla tua descrizione. Utilizzo modelli di AI locali per creare l'applicazione completa. Puoi vedere un'anteprima nella tab 'Preview' quando sarà pronto.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        // After a short delay, simulate project generation completion
        setTimeout(() => {
          setProjectGenerated(true);
          // Simulate occasional errors in the generated project
          const randomError = Math.random() > 0.7;
          setHasError(randomError);
          
          if (randomError) {
            toast.error("Errore rilevato nel progetto generato", {
              description: "Puoi cliccare sul pulsante 'Correggi' per risolvere automaticamente.",
              duration: 5000,
            });
          } else {
            toast.success("Progetto generato con successo!", {
              description: "Puoi visualizzare l'anteprima nella tab 'Preview'.",
              duration: 3000,
            });
          }
        }, 3000);
      } else if (isFixRequest || input.toLowerCase().includes("errore")) {
        // Fix errors response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: "Sto analizzando e correggendo gli errori nel progetto. Utilizzo modelli di AI locali per identificare e risolvere i problemi in modo automatico.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        // After a short delay, simulate error fixing
        setTimeout(() => {
          setHasError(false);
          toast.success("Errori corretti con successo!", {
            duration: 3000,
          });
        }, 2500);
      } else if (input.toLowerCase().includes("supabase") || input.toLowerCase().includes("database")) {
        // Supabase connection response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: "Sto configurando la connessione con Supabase per il tuo progetto. Questo ci permetterà di avere un database PostgreSQL, autenticazione, storage e funzioni edge direttamente nel tuo ambiente locale.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        toast.info("Connessione con Supabase in corso...", {
          duration: 2000,
        });
        
        setTimeout(() => {
          toast.success("Connessione con Supabase stabilita", {
            duration: 3000,
          });
        }, 2000);
      } else {
        // Default response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(input),
          role: "assistant",
          timestamp: new Date(),
        };
      }
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (prompt: string): string => {
    // Responses based on specific keywords to simulate local AI model responses
    if (prompt.toLowerCase().includes("modifica") || prompt.toLowerCase().includes("aggiorna")) {
      return "Posso modificare il codice del progetto. Dimmi cosa vuoi cambiare e utilizzerò i modelli locali per aggiornare il codice mantenendo la coerenza dell'applicazione.";
    } else if (prompt.toLowerCase().includes("autenticazione") || prompt.toLowerCase().includes("login")) {
      return "Posso implementare un sistema di autenticazione completo con login, registrazione e gestione profili nel tuo progetto locale. Utilizzerò Supabase Auth per la gestione delle credenziali.";
    } else if (prompt.toLowerCase().includes("stile") || prompt.toLowerCase().includes("design")) {
      return "Posso migliorare il design dell'applicazione utilizzando Tailwind CSS e Shadcn UI. Fammi sapere quali sono le tue preferenze di stile e implementerò le modifiche necessarie.";
    } else {
      return "Grazie per le informazioni! I modelli di AI locali stanno elaborando la tua richiesta. Posso aiutarti a sviluppare, modificare o migliorare qualsiasi aspetto del progetto. Hai domande specifiche o funzionalità che vorresti aggiungere?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFixErrors = () => {
    // Add user message asking to fix errors
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "Per favore, correggi gli errori nel progetto.",
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI fixing errors
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Ho identificato e corretto gli errori nel progetto. Il problema principale era legato a incompatibilità di tipi TypeScript e alcuni componenti mancanti. Ora il progetto dovrebbe funzionare correttamente.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
      setHasError(false);
      
      toast.success("Errori corretti con successo!", {
        duration: 3000,
      });
    }, 2500);
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
              variant="outline" 
              size="sm" 
              className="gap-2 border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => toast.info("Connessione a Supabase...")}
            >
              Connetti Supabase
            </Button>
          </div>
        </div>
        
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
                <p className="text-xs text-muted-foreground">100% locale e gratuito</p>
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
                    className="flex-1"
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <Send size={18} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Premi Invio per inviare, Shift+Invio per andare a capo
                </p>
              </div>
            </div>
          </div>
          
          <div className={`w-full lg:w-1/2 ${activeView === "preview" ? "block" : "hidden lg:block"}`}>
            {projectGenerated ? (
              <ProjectPreview />
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
