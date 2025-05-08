
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, Code, Database, Download, FileDown, Play, Terminal, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => (
  <pre className="relative rounded-md bg-muted p-4 overflow-x-auto">
    <code className="text-xs font-mono">{code}</code>
  </pre>
);

interface ProjectPreviewProps {
  generatedCode: any;
  hasError: boolean;
}

const ProjectPreview = ({ generatedCode, hasError }: ProjectPreviewProps) => {
  const [activeTab, setActiveTab] = useState("code");
  
  const handleDownload = () => {
    // Crea un blob con il contenuto del progetto
    const projectString = JSON.stringify(generatedCode, null, 2);
    const blob = new Blob([projectString], { type: "application/json" });
    
    // Crea un URL per il blob
    const url = URL.createObjectURL(blob);
    
    // Crea un elemento <a> nascosto per scaricare il file
    const a = document.createElement("a");
    a.href = url;
    a.download = "progetto-generato.json";
    document.body.appendChild(a);
    a.click();
    
    // Pulisci
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success("Progetto scaricato con successo!");
  };
  
  const handleRunProject = () => {
    toast.info("Avvio del progetto nell'ambiente di simulazione...");
  };
  
  // Se non c'è codice generato, mostra un messaggio
  if (!generatedCode) {
    return (
      <Card className="w-full glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Anteprima progetto</CardTitle>
          <CardDescription>
            Nessun progetto generato
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">
            Chiedi all'assistente di generare un progetto
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Estrai i file dal codice generato
  const files = generatedCode.structure?.files || [];
  
  // Raggruppa i file per tipo (frontend, backend, database)
  const frontendFiles = files.filter(file => 
    file.path.includes('.jsx') || 
    file.path.includes('.tsx') || 
    file.path.includes('.js') || 
    file.path.includes('.ts') ||
    file.path.includes('.css') ||
    file.path.includes('.html')
  );
  
  const backendFiles = files.filter(file => 
    file.path.includes('api/') || 
    file.path.includes('server/') || 
    file.path.includes('backend/')
  );
  
  const databaseFiles = files.filter(file => 
    file.path.includes('.sql') || 
    file.path.includes('schema') || 
    file.path.includes('migration') ||
    file.path.includes('database')
  );
  
  return (
    <Card className="w-full glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">
            Preview progetto
            <Badge className="ml-2 bg-secondary">Generato</Badge>
            {hasError && (
              <Badge className="ml-2 bg-destructive">Errori</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Anteprima del codice e della struttura del progetto
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRunProject} className="gap-2">
            <Play size={14} />
            Esegui
          </Button>
          <Button variant="default" size="sm" onClick={handleDownload} className="gap-2">
            <FileDown size={14} />
            Scarica .zip
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {hasError && (
          <Alert variant="destructive" className="mx-6 my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sono stati rilevati errori nel codice generato. Usa il pulsante "Correggi Errori" per tentare di risolverli.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="code" className="gap-2">
                <Code size={14} />
                Codice
              </TabsTrigger>
              <TabsTrigger value="structure" className="gap-2">
                <Database size={14} />
                Struttura
              </TabsTrigger>
              <TabsTrigger value="console" className="gap-2">
                <Terminal size={14} />
                Console
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="code" className="p-6">
            <div className="space-y-4">
              {frontendFiles.length > 0 ? (
                frontendFiles.slice(0, 2).map((file, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{file.path}</h3>
                      <Button variant="ghost" size="icon">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="h-56 border rounded-md">
                      <CodeBlock 
                        code={file.content} 
                        language={file.path.split('.').pop() || "jsx"} 
                      />
                    </ScrollArea>
                    {index < frontendFiles.length - 1 && <Separator className="my-4" />}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Nessun file frontend trovato</p>
              )}
              
              {frontendFiles.length > 2 && (
                <div className="mt-2 text-center">
                  <Button variant="outline" size="sm">
                    Vedi altri {frontendFiles.length - 2} file
                  </Button>
                </div>
              )}
              
              {backendFiles.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <h3 className="text-lg font-medium mb-4">Backend</h3>
                  
                  {backendFiles.slice(0, 1).map((file, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{file.path}</h3>
                        <Button variant="ghost" size="icon">
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <ScrollArea className="h-56 border rounded-md">
                        <CodeBlock 
                          code={file.content} 
                          language={file.path.split('.').pop() || "js"} 
                        />
                      </ScrollArea>
                    </div>
                  ))}
                  
                  {backendFiles.length > 1 && (
                    <div className="mt-2 text-center">
                      <Button variant="outline" size="sm">
                        Vedi altri {backendFiles.length - 1} file
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="structure" className="p-6">
            <div className="space-y-4">
              {databaseFiles.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{databaseFiles[0].path}</h3>
                    <Button variant="ghost" size="icon">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <ScrollArea className="h-64 border rounded-md">
                    <CodeBlock 
                      code={databaseFiles[0].content} 
                      language="sql" 
                    />
                  </ScrollArea>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nessuno schema database trovato</p>
              )}
              
              <div className="flex flex-col gap-2 mt-4">
                <h3 className="text-md font-medium mb-2">Struttura del progetto</h3>
                {files.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Nessun file nel progetto</p>
                ) : (
                  files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                      <div className="flex items-center gap-2">
                        <Code size={16} />
                        <span className="font-medium text-sm">{file.path}</span>
                      </div>
                      <Badge variant="outline">
                        {file.content.length < 1000 
                          ? `${file.content.length} caratteri`
                          : `${Math.round(file.content.length / 1000)} KB`}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="console" className="p-6">
            <ScrollArea className="h-64 border rounded-md bg-black text-green-400 p-4">
              <div className="font-mono text-xs">
                <p>$ Inizializzazione ambiente locale</p>
                <p className="opacity-70">Creazione struttura progetto...</p>
                <p className="opacity-70">Installazione dipendenze...</p>
                <p className="opacity-70">+ react@18.2.0</p>
                <p className="opacity-70">+ tailwindcss@3.3.0</p>
                <p className="opacity-70">+ @supabase/supabase-js@2.21.0</p>
                <p className="opacity-70">added 267 packages in 12s</p>
                <p className="opacity-70">Generazione codice...</p>
                <p className="opacity-70">Creati {files.length} file</p>
                {hasError ? (
                  <>
                    <p className="text-yellow-400">⚠ Attenzione: rilevati errori nel codice</p>
                    <p className="text-yellow-400">Utilizzare il pulsante 'Correggi Errori' per risolverli</p>
                  </>
                ) : (
                  <p className="text-green-400">√ Build completato con successo!</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectPreview;
