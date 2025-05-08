
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, Code, Database, Download, FileDown, Play, Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CodeBlock = ({ code, language }: { code: string; language: string }) => (
  <pre className="relative rounded-md bg-muted p-4 overflow-x-auto">
    <code className="text-xs font-mono">{code}</code>
  </pre>
);

const ProjectPreview = () => {
  const [activeTab, setActiveTab] = useState("code");
  
  const handleDownload = () => {
    toast.success("Progetto scaricato con successo!");
  };
  
  const handleRunProject = () => {
    toast.info("Avvio del progetto nell'ambiente di simulazione...");
  };
  
  // Simulazioni di codice per il preview
  const frontendCode = `import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!session ? <AuthForm /> : <Dashboard session={session} />}
    </div>
  );
}

export default App;`;

  const backendCode = `// Supabase RLS policy
CREATE POLICY "Enable read access for authenticated users only"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

// Order API endpoint
export async function getOrders(req, res) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}`;

  const databaseSchema = `-- Create users table extension
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;`;
  
  return (
    <Card className="w-full glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">
            Preview progetto
            <Badge className="ml-2 bg-secondary">Generato</Badge>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="code" className="gap-2">
                <Code size={14} />
                Codice
              </TabsTrigger>
              <TabsTrigger value="structure" className="gap-2">
                <Database size={14} />
                Database
              </TabsTrigger>
              <TabsTrigger value="console" className="gap-2">
                <Terminal size={14} />
                Console
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="code" className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">src/App.jsx</h3>
                <Button variant="ghost" size="icon">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-56 border rounded-md">
                <CodeBlock code={frontendCode} language="jsx" />
              </ScrollArea>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <h3 className="font-medium">src/api/orders.js</h3>
                <Button variant="ghost" size="icon">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-56 border rounded-md">
                <CodeBlock code={backendCode} language="js" />
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="structure" className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">schema.sql</h3>
                <Button variant="ghost" size="icon">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-64 border rounded-md">
                <CodeBlock code={databaseSchema} language="sql" />
              </ScrollArea>
              
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <Database size={16} />
                    <span className="font-medium text-sm">profiles</span>
                  </div>
                  <Badge variant="outline">4 colonne</Badge>
                </div>
                <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <Database size={16} />
                    <span className="font-medium text-sm">orders</span>
                  </div>
                  <Badge variant="outline">7 colonne</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="console" className="p-6">
            <ScrollArea className="h-64 border rounded-md bg-black text-green-400 p-4">
              <div className="font-mono text-xs">
                <p>$ npm install</p>
                <p className="opacity-70">+ react@18.2.0</p>
                <p className="opacity-70">+ tailwindcss@3.3.0</p>
                <p className="opacity-70">+ @supabase/supabase-js@2.21.0</p>
                <p className="opacity-70">added 267 packages in 12s</p>
                <p>$ npm run build</p>
                <p className="opacity-70">&gt; build</p>
                <p className="opacity-70">&gt; vite build</p>
                <p className="opacity-70">vite v5.0.0 building for production...</p>
                <p className="opacity-70">✓ 321 modules transformed.</p>
                <p className="text-yellow-400">√ Build completed. The dist directory is ready to be deployed.</p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectPreview;
