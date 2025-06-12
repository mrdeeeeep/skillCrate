import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  BookOpen, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  FileText,
  Video,
  Github
} from "lucide-react";

const mockUserData = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinDate: "January 2024",
  avatar: "AJ",
  totalProjects: 3,
  totalResources: 47,
  hoursLearned: 124,
  completionRate: 78,
  currentStreak: 15,
  longestStreak: 23,
  level: "Advanced Learner",
  badges: ["Early Adopter", "Resource Hunter", "Consistent Learner"],
  recentActivity: [
    { type: "video", title: "Machine Learning Basics", date: "2 hours ago" },
    { type: "paper", title: "Neural Networks Research", date: "1 day ago" },
    { type: "project", title: "Created Data Science Project", date: "3 days ago" },
    { type: "repository", title: "Forked TensorFlow Guide", date: "1 week ago" }
  ],
  resourceBreakdown: {
    videos: 18,
    papers: 12,
    ebooks: 8,
    courses: 6,
    repositories: 3
  }
};

const StatCard = ({ icon: Icon, title, value, subtitle, color = "primary" }: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}) => (
  <Card className="rounded-xl">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
);

const ActivityItem = ({ activity }: { activity: any }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'paper': return FileText;
      case 'repository': return Github;
      case 'project': return BookOpen;
      default: return FileText;
    }
  };

  const Icon = getIcon(activity.type);

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
      <div className="skill-crate-gradient p-2 rounded-lg">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{activity.title}</p>
        <p className="text-xs text-muted-foreground">{activity.date}</p>
      </div>
    </div>
  );
};

export default function Profile() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account and view your learning progress</p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* User Info Section */}
              <Card className="rounded-xl">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="skill-crate-gradient w-16 h-16 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{mockUserData.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{mockUserData.name}</CardTitle>
                      <p className="text-muted-foreground">{mockUserData.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="rounded-lg">{mockUserData.level}</Badge>
                        <p className="text-sm text-muted-foreground">Member since {mockUserData.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockUserData.badges.map((badge, index) => (
                      <Badge key={index} variant="outline" className="rounded-lg">
                        <Award className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={BookOpen}
                  title="Total Projects"
                  value={mockUserData.totalProjects}
                  subtitle="Active learning projects"
                />
                <StatCard
                  icon={FileText}
                  title="Resources Saved"
                  value={mockUserData.totalResources}
                  subtitle="Across all projects"
                />
                <StatCard
                  icon={Clock}
                  title="Learning Hours"
                  value={mockUserData.hoursLearned}
                  subtitle="Time invested"
                />
                <StatCard
                  icon={Target}
                  title="Completion Rate"
                  value={`${mockUserData.completionRate}%`}
                  subtitle="Project progress"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Learning Progress */}
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Completion</span>
                        <span>{mockUserData.completionRate}%</span>
                      </div>
                      <Progress value={mockUserData.completionRate} className="rounded-lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-accent/20">
                        <div className="text-2xl font-bold text-primary">{mockUserData.currentStreak}</div>
                        <div className="text-sm text-muted-foreground">Current Streak</div>
                      </div>
                      <div className="p-3 rounded-lg bg-accent/20">
                        <div className="text-2xl font-bold text-primary">{mockUserData.longestStreak}</div>
                        <div className="text-sm text-muted-foreground">Longest Streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resource Breakdown */}
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Resource Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(mockUserData.resourceBreakdown).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="capitalize text-sm">{type}</span>
                          <Badge variant="secondary" className="rounded-lg">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockUserData.recentActivity.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
