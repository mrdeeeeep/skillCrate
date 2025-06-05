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
  ChevronRight
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const menuItems = [
  {
    title: "Create New Project",
    url: "/create-project",
    icon: Plus,
  },
];

const mockProjects = [
  {
    id: 1,
    name: "Machine Learning Project",
    sections: [
      { name: "Videos", icon: Video, url: "/dashboard?project=1&section=videos" },
      { name: "Academic Papers", icon: FileText, url: "/dashboard?project=1&section=papers" },
      { name: "E-Books", icon: Book, url: "/dashboard?project=1&section=ebooks" },
      { name: "Courses", icon: GraduationCap, url: "/dashboard?project=1&section=courses" },
      { name: "Repositories", icon: Github, url: "/dashboard?project=1&section=repositories" },
    ]
  },
  {
    id: 2,
    name: "Web Development Study",
    sections: [
      { name: "Videos", icon: Video, url: "/dashboard?project=2&section=videos" },
      { name: "Academic Papers", icon: FileText, url: "/dashboard?project=2&section=papers" },
      { name: "E-Books", icon: Book, url: "/dashboard?project=2&section=ebooks" },
      { name: "Courses", icon: GraduationCap, url: "/dashboard?project=2&section=courses" },
      { name: "Repositories", icon: Github, url: "/dashboard?project=2&section=repositories" },
    ]
  },
  {
    id: 3,
    name: "Data Science Research",
    sections: [
      { name: "Videos", icon: Video, url: "/dashboard?project=3&section=videos" },
      { name: "Academic Papers", icon: FileText, url: "/dashboard?project=3&section=papers" },
      { name: "E-Books", icon: Book, url: "/dashboard?project=3&section=ebooks" },
      { name: "Courses", icon: GraduationCap, url: "/dashboard?project=3&section=courses" },
      { name: "Repositories", icon: Github, url: "/dashboard?project=3&section=repositories" },
    ]
  }
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
  const [openProjects, setOpenProjects] = useState<{ [key: number]: boolean }>({});

  const currentProject = searchParams.get("project");
  const currentSection = searchParams.get("section");

  const toggleProject = (projectId: number) => {
    setOpenProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const isActiveSection = (projectId: number, sectionUrl: string) => {
    const urlParams = new URLSearchParams(sectionUrl.split('?')[1]);
    return urlParams.get('project') === currentProject && 
           urlParams.get('section') === currentSection;
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
              {mockProjects.map((project) => (
                <Collapsible key={project.id} open={openProjects[project.id]} onOpenChange={() => toggleProject(project.id)}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="hover:bg-accent/50 w-full rounded-lg">
                        <FolderOpen className="w-5 h-5" />
                        <span className="flex-1 text-left">{project.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${openProjects[project.id] ? 'rotate-90' : ''}`} />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {project.sections.map((section) => (
                          <SidebarMenuSubItem key={section.name}>
                            <SidebarMenuSubButton 
                              asChild
                              className={`rounded-lg ${isActiveSection(project.id, section.url) ? 'bg-accent text-accent-foreground' : ''}`}
                            >
                              <Link to={section.url} className="flex items-center gap-3">
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
