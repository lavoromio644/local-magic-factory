
import { Button } from "@/components/ui/button";
import { Code, Database, Plus } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b bg-white/50 backdrop-blur-sm fixed top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-magic flex items-center justify-center">
          <Code className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">
            <span className="gradient-text">Local Magic Factory</span>
          </h1>
          <p className="text-xs text-muted-foreground">Generator di progetti software</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Database size={16} />
          I miei progetti
        </Button>
        <Button className="gap-2">
          <Plus size={16} />
          Nuovo progetto
        </Button>
      </div>
    </header>
  );
};

export default Header;
