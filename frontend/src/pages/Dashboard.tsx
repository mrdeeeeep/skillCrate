import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ResourceTile } from "@/components/ResourceTile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Video, FileText, Book, GraduationCap, Github } from "lucide-react";

// Remove videos from mockResources
const mockResources = {
  papers: [
    {
      title: "Machine Learning in Healthcare",
      description: "Research paper on the applications of ML algorithms in medical diagnosis and treatment optimization.",
      rating: 9.5,
      metadata: { author: "Dr. Smith et al.", pages: 15, language: "English" },
      url: "https://example.com"
    }
  ],
  ebooks: [
    {
      title: "Clean Code Principles",
      description: "Essential guide to writing maintainable and readable code. A must-read for every developer.",
      rating: 9.7,
      metadata: { author: "Robert Martin", pages: 464, language: "English" },
      url: "https://example.com"
    }
  ],
  courses: [
    {
      title: "Full Stack Web Development",
      description: "Complete course covering frontend, backend, and deployment. Build real-world projects.",
      rating: 9.1,
      metadata: { author: "University Online", duration: "40 hours", difficulty: "Beginner to Advanced" },
      url: "https://example.com"
    }
  ],
    repositories: [
      {
        title: "React UI Component Library",
        description: "Open-source collection of beautiful, accessible React components with TypeScript support.",
        rating: 8.9,
        metadata: { author: "OpenSource Team", language: "TypeScript" },
        url: "https://github.com/example"
      }
    ]
  };

const sectionIcons = {
  videos: <Video className="w-12 h-12 text-white" />,  // Increased icon size
  papers: <FileText className="w-12 h-12 text-white" />,
  ebooks: <Book className="w-12 h-12 text-white" />,
  courses: <GraduationCap className="w-12 h-12 text-white" />,
  repositories: <Github className="w-12 h-12 text-white" />
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSection, setCurrentSection] = useState("videos");

  // Sync currentSection with 'section' param in URL
  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam && sectionParam !== currentSection) {
      setCurrentSection(sectionParam);
    }
  }, [searchParams, currentSection]);
  const [projectData, setProjectData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [papers, setPapers] = useState<any[]>([]);
  const [ebooks, setEBooks] = useState<any[]>([]);
  const [repositories, setRepositories] = useState<any[]>([]);

  // Fetch academic papers when section or project changes
  useEffect(() => {
    const fetchPapers = async () => {
      if (currentSection !== 'papers') return;
      const projectId = searchParams.get("project");
      if (!projectId) return;
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/academic-papers/project/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch academic papers');
        const data = await response.json();
        setPapers(data.papers || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch academic papers');
        setPapers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPapers();
  }, [currentSection, searchParams]);

  // Fetch e-books when section or project changes
  useEffect(() => {
    const fetchEBooks = async () => {
      if (currentSection !== 'ebooks') return;
      const projectId = searchParams.get("project");
      if (!projectId) return;
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/ebooks/project/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch e-books');
        const data = await response.json();
        setEBooks(data.ebooks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch e-books');
        setEBooks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEBooks();
  }, [currentSection, searchParams]);

  // Fetch repositories when section or project changes
  useEffect(() => {
    const fetchRepositories = async () => {
      if (currentSection !== 'repositories') return;
      const projectId = searchParams.get("project");
      if (!projectId) return;
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/repositories/project/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
        setRepositories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepositories();
  }, [currentSection, searchParams]);

  useEffect(() => {
    const fetchProjectData = async () => {
      const projectId = searchParams.get("project");
      if (!projectId) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }

        const data = await response.json();
        console.log('Project data:', data);
        setProjectData(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch project');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [searchParams]);

  const getCurrentResources = () => {
    if (currentSection === 'videos' && projectData?.videos) {
      return projectData.videos.map((video: any) => ({
        title: video.title,
        description: video.description,
        rating: video.userInteractions?.length ? 
          video.userInteractions.reduce((acc: number, curr: any) => acc + curr.rating, 0) / video.userInteractions.length 
          : 0,
        metadata: {
          author: video.channel_title,
          duration: video.duration,
          views: video.view_count,
          likes: video.like_count
        },
        url: video.url
      }));
    }
    if (currentSection === 'papers') {
      return papers.map((paper: any) => ({
        title: paper.title,
        description: paper.abstract,
        rating: paper.userInteractions?.length ?
          paper.userInteractions.reduce((acc: number, curr: any) => acc + curr.rating, 0) / paper.userInteractions.length
          : 0,
        metadata: {
          author: paper.authors?.join(', '),
          year: paper.yearPublished,
          publisher: paper.publisher,
          subjects: paper.subjects?.join(', '),
          language: paper.language
        },
        url: paper.downloadUrl || paper.sourceUrl || paper.url
      }));
    }
    if (currentSection === 'ebooks') {
      return ebooks.map((ebook: any) => ({
        title: ebook.title,
        description: ebook.description,
        rating: ebook.userInteractions?.length ?
          ebook.userInteractions.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ebook.userInteractions.length
          : 0,
        metadata: {
          author: ebook.authors?.join(', '),
          publisher: ebook.publisher,
          publishedDate: ebook.publishedDate,
          categories: ebook.categories?.join(', '),
          language: ebook.language,
          pages: ebook.pageCount
        },
        url: ebook.previewLink || ebook.infoLink || ebook.thumbnail
      }));
    }
    if (currentSection === 'repositories') {
      return repositories.map((repo: any) => ({
        title: repo.name,
        description: repo.description,
        rating: repo.userInteractions?.length ?
          repo.userInteractions.reduce((acc: number, curr: any) => acc + curr.rating, 0) / repo.userInteractions.length
          : 0,
        metadata: {
          full_name: repo.full_name,
          stars: repo.stars,
          language: repo.language,
          topics: repo.topics?.join(', '),
        },
        url: repo.url
      }));
    }
    // For all other sections, only use mockResources for that section
    return mockResources[currentSection as keyof typeof mockResources] || [];
  };

  const currentResources = getCurrentResources();
  const filteredResources = currentResources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="border-b border-border/40 p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredResources.length} results
              </div>
            </div>
          </header>

          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2 capitalize">
                {projectData?.title || currentSection}
              </h1>
              <p className="text-muted-foreground">
                {currentSection === 'videos' 
                  ? `Videos related to ${projectData?.title || 'your project'}`
                  : `Discover curated ${currentSection} for your learning journey`}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading resources...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
              <div className="space-y-4">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource, index) => (
                    <ResourceTile
                      key={index}
                      title={resource.title}
                      description={resource.description}
                      rating={resource.rating}
                      icon={sectionIcons[currentSection as keyof typeof sectionIcons]}
                      metadata={resource.metadata}
                      url={resource.url}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">No resources found</div>
                    <Button variant="outline" className="rounded-lg">Browse All Categories</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;


