import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Tag, Calendar, BookOpen } from "lucide-react";

interface ProjectDetails {
  _id: string;
  title: string;
  keywords: string[];
  createdAt: string;
  // Add these fields when implementing the related features
  videosCount?: number;
  papersCount?: number;
  ebooksCount?: number;
  coursesCount?: number;
  reposCount?: number;
}

export function ProjectOverview({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch project details');
        
        const data = await response.json();
        setProject(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;
  if (!project) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{project.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Learning Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Videos</span>
                <span>{project.videosCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Papers</span>
                <span>{project.papersCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>E-Books</span>
                <span>{project.ebooksCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Courses</span>
                <span>{project.coursesCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Repositories</span>
                <span>{project.reposCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
