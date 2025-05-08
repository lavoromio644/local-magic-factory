
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import ProjectForm from "@/components/ProjectForm";
import ProjectPreview from "@/components/ProjectPreview";
import ProjectsGallery from "@/components/ProjectsGallery";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container px-4 mx-auto pt-24 pb-20 space-y-20">
        <Hero />
        
        <FeatureSection />
        
        <div className="space-y-10">
          <h2 className="text-3xl font-bold text-center">Crea il tuo progetto</h2>
          <div className="flex flex-col items-center">
            <ProjectForm />
          </div>
        </div>
        
        <div className="space-y-10">
          <h2 className="text-3xl font-bold text-center">Anteprima progetti</h2>
          <ProjectPreview />
        </div>
        
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
