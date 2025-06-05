
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ResourceTile } from "@/components/ResourceTile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Video, FileText, Book, GraduationCap, Github } from "lucide-react";

const mockResources = {
  videos: [
    {
      title: "React Hooks Deep Dive",
      description: "Complete guide to React Hooks including useState, useEffect, and custom hooks. Perfect for intermediate developers.",
      rating: 9.2,
      metadata: { author: "Tech Academy", duration: "2h 30m", difficulty: "Intermediate" },
      url: "https://example.com"
    },
    {
      title: "Advanced JavaScript Concepts",
      description: "Master closures, prototypes, and async programming in JavaScript with practical examples.",
      rating: 8.8,
      metadata: { author: "Code Master", duration: "3h 15m", difficulty: "Advanced" },
      url: "https://example.com"
    }
  ],
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
  videos: <Video className="w-6 h-6 text-white" />,
  papers: <FileText className="w-6 h-6 text-white" />,
  ebooks: <Book className="w-6 h-6 text-white" />,
  courses: <GraduationCap className="w-6 h-6 text-white" />,
  repositories: <Github className="w-6 h-6 text-white" />
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSection, setCurrentSection] = useState("videos");

  useEffect(() => {
    const section = searchParams.get("section");
    if (section && section in mockResources) {
      setCurrentSection(section);
    }
  }, [searchParams]);

  const currentResources = mockResources[currentSection as keyof typeof mockResources] || [];
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
              <h1 className="text-2xl font-bold mb-2 capitalize">{currentSection}</h1>
              <p className="text-muted-foreground">
                Discover curated {currentSection} for your learning journey
              </p>
            </div>

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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
