import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, Database, Layout, Lock, Server } from "lucide-react";
import { toast } from "sonner";

const ProjectForm = () => {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = () => {
    if (description.length < 20) {
      toast.error("Per favore, fornisci una descrizione più dettagliata");
      return;
    }
    
    setIsGenerating(true);
    
    // Utilizziamo una Promise per simulare il processo di generazione
    new Promise((resolve) => setTimeout(resolve, 3000))
      .then(() => {
        toast.success("Progetto generato con successo!");
      })
      .catch(() => {
        toast.error("Si è verificato un errore durante la generazione");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };
  
  return (
    <Card className="w-full max-w-4xl glass-card">
      <CardHeader>
        <CardTitle className="text-2xl">Genera un nuovo progetto</CardTitle>
        <CardDescription>
          Descrivi il progetto che desideri creare e lo genereremo automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="description" className="mt-2">
          <TabsList className="mb-4">
            <TabsTrigger value="description">Descrizione</TabsTrigger>
            <TabsTrigger value="options">Opzioni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-description">Descrizione del progetto</Label>
              <Textarea 
                id="project-description"
                placeholder="Descrivi dettagliatamente il tuo progetto (es. un'app di gestione ordini per un ristorante con sistema di autenticazione e database)"
                className="h-56 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {description.length < 20 ? 
                  `Aggiungi almeno ${20 - description.length} caratteri in più` : 
                  "Descrizione sufficientemente dettagliata"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="text-sm font-medium">Frontend</div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="react" defaultChecked />
                  <label htmlFor="react" className="text-sm">React</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="vue" />
                  <label htmlFor="vue" className="text-sm">Vue.js</label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm font-medium">Backend</div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="supabase" defaultChecked />
                  <label htmlFor="supabase" className="text-sm">Supabase</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="nodejs" />
                  <label htmlFor="nodejs" className="text-sm">Node.js</label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="options">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="block mb-1">Sistema di autenticazione</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="auth" defaultChecked />
                      <label htmlFor="auth" className="text-sm">Includi autenticazione</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="block mb-1">Database</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="db" defaultChecked />
                      <label htmlFor="db" className="text-sm">Includi struttura DB</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Layout className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="block mb-1">Design responsive</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="responsive" defaultChecked />
                      <label htmlFor="responsive" className="text-sm">Ottimizza per dispositivi mobili</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Server className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="block mb-1">API REST</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="api" defaultChecked />
                      <label htmlFor="api" className="text-sm">Genera API endpoints</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Annulla</Button>
        <Button 
          onClick={handleGenerate} 
          disabled={description.length < 20 || isGenerating}
          className="gap-2"
        >
          Genera progetto
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectForm;
