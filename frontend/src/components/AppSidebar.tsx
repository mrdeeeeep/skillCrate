import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { 
  BookOpen, 
  Plus, 
  Video, 
  FileText, 
  Book, 
  GraduationCap, 
  Github, 
  Settings, 
  User,
  FolderOpen,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Project {
  _id: string;
  title: string;
}

const menuItems = [
  {
    title: "Create New Project",
    url: "/create-project",
    icon: Plus,
  },
];

const sections = [
  { name: "Overview", icon: LayoutDashboard, section: "overview" },
  { name: "Videos", icon: Video, section: "videos" },
  { name: "Academic Papers", icon: FileText, section: "papers" },
  { name: "E-Books", icon: Book, section: "ebooks" },
  { name: "Courses", icon: GraduationCap, section: "courses" },
  { name: "Repositories", icon: Github, section: "repositories" },
];

const bottomItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [searchParams] = useSearchParams();
  const [openProjects, setOpenProjects] = useState<{ [key: string]: boolean }>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const { user } = useAuth();

  const currentProject = searchParams.get("project");
  const currentSection = searchParams.get("section");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const toggleProject = (projectId: string) => {
    setOpenProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 skill-crate-gradient rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">SkillCrate</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-accent/50 rounded-lg">
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <Collapsible 
                  key={project._id} 
                  open={openProjects[project._id]} 
                  onOpenChange={() => toggleProject(project._id)}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="hover:bg-accent/50 w-full rounded-lg">
                        <FolderOpen className="w-5 h-5" />
                        <span className="flex-1 text-left">{project.title}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${openProjects[project._id] ? 'rotate-90' : ''}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {sections.map((section) => (
                          <SidebarMenuSubItem key={section.name}>
                            <SidebarMenuSubButton 
                              asChild
                              className={`rounded-lg ${
                                currentProject === project._id && 
                                currentSection === section.section ? 'bg-accent text-accent-foreground' : ''
                              }`}
                            >
                              <Link 
                                to={`/dashboard?project=${project._id}&section=${section.section}`} 
                                className="flex items-center gap-3"
                              >
                                <section.icon className="w-4 h-4" />
                                <span>{section.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="hover:bg-accent/50 rounded-lg">
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
