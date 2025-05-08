
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Code, Database, FileCode, Lock, Server } from "lucide-react";

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: <Code />,
      title: "Generazione di codice",
      description: "Genera codice frontend e backend completo basato sulle tue descrizioni."
    },
    {
      icon: <Database />,
      title: "Struttura database",
      description: "Crea automaticamente schemi di database appropriati per il tuo progetto."
    },
    {
      icon: <Lock />,
      title: "Autenticazione",
      description: "Integra facilmente sistemi di autenticazione sicuri per i tuoi progetti."
    },
    {
      icon: <CheckCircle />,
      title: "Correzione errori",
      description: "Identifica e risolvi automaticamente gli errori nel codice generato."
    },
    {
      icon: <FileCode />,
      title: "Download completo",
      description: "Scarica l'intero progetto con tutti i file necessari in formato ZIP."
    },
    {
      icon: <Server />,
      title: "100% locale",
      description: "Tutto funziona completamente offline sul tuo dispositivo, senza dipendenze esterne."
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Funzionalità principali</h2>
        <p className="text-muted-foreground">Scopri cosa può fare Local Magic Factory</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
