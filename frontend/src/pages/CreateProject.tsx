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
import { useAuth } from "@/contexts/AuthContext";

const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingVideos, setIsFetchingVideos] = useState(false);

  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);
    setIsFetchingVideos(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      console.log('📤 Sending project creation request:', { title, keywords });
      console.log('Authorization token present:', !!token);
      
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          keywords,
        }),
      });

      const data = await response.json();
      console.log('📥 Project creation response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project');
      }

      if (data.warning) {
        toast({
          title: "Warning",
          description: data.warning,
          variant: "default",
        });
      }

      toast({
        title: "Success",
        description: `Project created successfully with ${data.totalVideos} relevant videos!`,
      });

      // Fetch/save academic papers for this project
      try {
        const papersRes = await fetch(`http://localhost:8080/api/academic-papers/${data.project._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ keywords })
        });
        if (!papersRes.ok) {
          const errData = await papersRes.json();
          toast({
            title: "Academic Papers Error",
            description: errData.message || 'Failed to fetch/save academic papers',
            variant: "destructive"
          });
        } else {
          const papersData = await papersRes.json();
          toast({
            title: "Academic Papers",
            description: `Fetched and saved ${papersData.total} academic papers!`,
          });
        }
      } catch (err) {
        toast({
          title: "Academic Papers Error",
          description: err instanceof Error ? err.message : 'Failed to fetch/save academic papers',
          variant: "destructive"
        });
      }

      // Fetch/save e-books for this project
      try {
        const ebooksRes = await fetch(`http://localhost:8080/api/ebooks/${data.project._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ keywords })
        });
        if (!ebooksRes.ok) {
          const errData = await ebooksRes.json();
          toast({
            title: "E-Books Error",
            description: errData.message || 'Failed to fetch/save e-books',
            variant: "destructive"
          });
        } else {
          const ebooksData = await ebooksRes.json();
          toast({
            title: "E-Books",
            description: `Fetched and saved ${ebooksData.ebooks?.length || 0} e-books!`,
          });
        }
      } catch (err) {
        toast({
          title: "E-Books Error",
          description: err instanceof Error ? err.message : 'Failed to fetch/save e-books',
          variant: "destructive"
        });
      }

      // Fetch/save repositories for this project
      try {
        const reposRes = await fetch(`http://localhost:8080/api/repositories/${data.project._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ keywords })
        });
        if (!reposRes.ok) {
          const errData = await reposRes.json();
          toast({
            title: "Repositories Error",
            description: errData.message || 'Failed to fetch/save repositories',
            variant: "destructive"
          });
        } else {
          const reposData = await reposRes.json();
          toast({
            title: "Repositories",
            description: `Fetched and saved ${reposData.repositories?.length || 0} repositories!`,
          });
        }
      } catch (err) {
        toast({
          title: "Repositories Error",
          description: err instanceof Error ? err.message : 'Failed to fetch/save repositories',
          variant: "destructive"
        });
      }

      navigate("/dashboard");
    } catch (error) {
      console.error('❌ Project creation error:', error);
      if (error instanceof Error && error.message === 'Not authenticated') {
        navigate('/login');
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create project',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsFetchingVideos(false);
    }
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
                      <Button 
                        type="submit" 
                        className="skill-crate-gradient"
                        disabled={isLoading}
                      >
                        {isLoading 
                          ? (isFetchingVideos 
                            ? "Fetching Videos..." 
                            : "Creating..."
                          ) 
                          : "Create Project"}
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
