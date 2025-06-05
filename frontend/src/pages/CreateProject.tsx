
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project title",
        variant: "destructive"
      });
      return;
    }

    if (keywords.length === 0) {
      toast({
        title: "Error", 
        description: "Please add at least one keyword",
        variant: "destructive"
      });
      return;
    }

    // Mock project creation
    toast({
      title: "Success",
      description: "Project created successfully!",
    });

    // Navigate to dashboard
    navigate("/dashboard");
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-border/40 p-4 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Create New Project</h1>
            </div>
          </header>

          <div className="flex-1 p-6">
            <div className="max-w-2xl mx-auto">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Create a new learning project and define keywords to get personalized resource recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Learn React Development, Master Machine Learning..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <div className="flex gap-2">
                        <Input
                          id="keywords"
                          value={currentKeyword}
                          onChange={(e) => setCurrentKeyword(e.target.value)}
                          onKeyPress={handleKeywordKeyPress}
                          placeholder="Add a keyword and press Enter"
                        />
                        <Button type="button" onClick={addKeyword} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {keyword}
                              <button
                                type="button"
                                onClick={() => removeKeyword(keyword)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Keywords help us find the most relevant resources for your project.
                      </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="skill-crate-gradient">
                        Create Project
                      </Button>
                      <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CreateProject;
