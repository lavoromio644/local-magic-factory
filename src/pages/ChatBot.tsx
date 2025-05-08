
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, User, Loader } from "lucide-react";
import { toast } from "sonner";

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

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(input),
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Check for Supabase connection attempt
      if (input.toLowerCase().includes("supabase") || input.toLowerCase().includes("database")) {
        toast.info("Connessione con Supabase in corso...", {
          duration: 2000,
        });
        
        setTimeout(() => {
          toast.success("Connessione con Supabase stabilita", {
            duration: 3000,
          });
        }, 2000);
      }
    }, 1500);
  };

  const generateAIResponse = (prompt: string): string => {
    // Very simplified response generation
    if (prompt.toLowerCase().includes("crea") || prompt.toLowerCase().includes("genera")) {
      return "Posso aiutarti a creare questo progetto. Inizierò generando la struttura del progetto in base alla tua descrizione. Hai preferenze specifiche per il frontend (React, Vue) o il backend?";
    } else if (prompt.toLowerCase().includes("supabase") || prompt.toLowerCase().includes("database")) {
      return "Perfetto! Posso integrare Supabase come backend per il tuo progetto. Questo ci permetterà di avere un database PostgreSQL, autenticazione, storage e funzioni edge, tutto rimanendo locali e gratuiti.";
    } else if (prompt.toLowerCase().includes("autenticazione") || prompt.toLowerCase().includes("login")) {
      return "Posso implementare un sistema di autenticazione completo con login, registrazione e gestione profili utilizzando Supabase Auth, che funziona completamente in locale.";
    } else {
      return "Grazie per le informazioni! Sto elaborando la tua richiesta per creare un progetto su misura. C'è qualche funzionalità specifica che vorresti includere?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => toast.info("Connessione a Supabase...")}
          >
            Connetti Supabase
          </Button>
        </div>
        
        <div className="flex-1 bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col">
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
      </main>
    </div>
  );
};

export default ChatBot;
