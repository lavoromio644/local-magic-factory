
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Database } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden pb-16 pt-10">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-magic-100 to-transparent -z-10" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-factory-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 -left-20 w-96 h-96 bg-magic-200/30 rounded-full blur-3xl -z-10" />
      
      <div className="container px-4 mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-muted rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
          <span className="text-sm font-medium">100% locale e gratuito</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
          La tua <span className="gradient-text">fabbrica magica</span> per progetti software
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Genera progetti software completi, con frontend, backend, database e autenticazione, direttamente dal tuo computer e senza connessione internet.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="gap-2">
            <Code size={18} />
            Crea nuovo progetto
            <ArrowRight size={16} />
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Database size={18} />
            Esplora esempi
          </Button>
        </div>
        
        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {["React", "Vue.js", "Autenticazione", "Database PostgreSQL", "API REST", "100% offline"].map((feature) => (
            <div 
              key={feature}
              className="py-1.5 px-3 bg-background border rounded-full text-sm"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
