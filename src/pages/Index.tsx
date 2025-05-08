
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import ProjectForm from "@/components/ProjectForm";
import ProjectPreview from "@/components/ProjectPreview";
import ProjectsGallery from "@/components/ProjectsGallery";
import { useState } from "react";

const Index = () => {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container px-4 mx-auto pt-24 pb-20 space-y-20">
        <Hero />
        
        <FeatureSection />
        
        <div className="sticky top-20 bg-background/95 backdrop-blur-sm py-4 z-20 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Il tuo progetto</h2>
            <div className="flex border rounded-md overflow-hidden">
              <button 
                onClick={() => setViewMode("edit")} 
                className={`px-4 py-2 text-sm ${viewMode === "edit" ? 'bg-primary text-white' : 'bg-transparent'}`}
              >
                Editor
              </button>
              <button 
                onClick={() => setViewMode("preview")} 
                className={`px-4 py-2 text-sm ${viewMode === "preview" ? 'bg-primary text-white' : 'bg-transparent'}`}
              >
                Anteprima
              </button>
            </div>
          </div>
        </div>
        
        {viewMode === "edit" ? (
          <div className="space-y-10">
            <h2 className="text-3xl font-bold text-center">Crea il tuo progetto</h2>
            <div className="flex flex-col items-center">
              <ProjectForm />
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <h2 className="text-3xl font-bold text-center">Anteprima progetto</h2>
            <ProjectPreview />
          </div>
        )}
        
        <ProjectsGallery />
      </main>
      
      <footer className="bg-muted/30 py-10 border-t">
        <div className="container px-4 mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Local Magic Factory. Tutti i progetti generati sono di tua proprietà. 
            <br />100% locale, offline e gratuito.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
