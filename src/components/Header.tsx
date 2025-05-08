
import { Button } from "@/components/ui/button";
import { Code, Database, Plus, GitBranch, User, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [projectName, setProjectName] = useState("Local Magic Factory");
  const navigate = useNavigate();
  
  const handleNewProject = () => {
    navigate("/chatbot");
  };
  
  const handleMyProjects = () => {
    toast.info("Visualizzazione dei tuoi progetti...");
  };
  
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b bg-white/50 backdrop-blur-sm fixed top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-magic flex items-center justify-center">
          <Code className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              <span className="gradient-text">{projectName}</span>
            </h1>
            <button 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              onClick={() => toast.info("Rinomina progetto")}
            >
              Rinomina
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Generator di progetti software</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" title="Impostazioni">
          <Settings size={16} />
        </Button>
        <Button variant="ghost" size="icon" title="Profilo utente">
          <User size={16} />
        </Button>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleMyProjects}>
          <Database size={16} />
          I miei progetti
        </Button>
        <Button className="gap-2" onClick={handleNewProject}>
          <Plus size={16} />
          Nuovo progetto
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-green-500 text-green-600 hover:bg-green-50"
          onClick={() => toast.info("Connessione a Supabase...")}
        >
          <GitBranch size={16} className="text-green-600" />
          Supabase
        </Button>
      </div>
    </header>
  );
};

export default Header;
