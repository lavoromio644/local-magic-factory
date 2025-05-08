
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Database, Edit, Lock, Server, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Project = {
  id: number;
  name: string;
  description: string;
  date: string;
  technologies: string[];
  hasFrontend: boolean;
  hasBackend: boolean;
  hasAuthentication: boolean;
};

const ProjectCard = ({ project }: { project: Project }) => {
  const handleEdit = () => {
    toast.info(`Modifica del progetto: ${project.name}`);
  };
  
  const handleDelete = () => {
    toast.error(`Progetto eliminato: ${project.name}`);
  };

  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md hover:border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{project.name}</CardTitle>
          <Badge variant={project.id === 1 ? "default" : "secondary"}>
            {project.id === 1 ? "Nuovo" : "Completato"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline">{tech}</Badge>
          ))}
        </div>
        
        <div className="flex gap-3 text-sm text-muted-foreground">
          {project.hasFrontend && (
            <div className="flex items-center gap-1">
              <Code size={14} />
              <span>Frontend</span>
            </div>
          )}
          {project.hasBackend && (
            <div className="flex items-center gap-1">
              <Server size={14} />
              <span>Backend</span>
            </div>
          )}
          {project.hasAuthentication && (
            <div className="flex items-center gap-1">
              <Lock size={14} />
              <span>Auth</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">Creato il {project.date}</div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const ProjectsGallery = () => {
  const projects: Project[] = [
    {
      id: 1,
      name: "Sistema di gestione ordini",
      description: "App per ristoranti con dashboard, gestione clienti e ordini",
      date: "08/05/2025",
      technologies: ["React", "Supabase", "Tailwind"],
      hasFrontend: true,
      hasBackend: true,
      hasAuthentication: true,
    },
    {
      id: 2,
      name: "Prenotazione hotel",
      description: "Sistema di prenotazione camere con gestione disponibilità",
      date: "05/05/2025",
      technologies: ["Vue", "Supabase", "Node.js"],
      hasFrontend: true,
      hasBackend: true,
      hasAuthentication: true,
    },
    {
      id: 3,
      name: "Todo App",
      description: "Semplice app per la gestione delle attività da svolgere",
      date: "01/05/2025",
      technologies: ["React", "LocalStorage"],
      hasFrontend: true,
      hasBackend: false,
      hasAuthentication: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">I miei progetti</h2>
        <Button variant="outline" className="gap-2">
          <Database size={16} />
          Mostra tutti
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsGallery;
