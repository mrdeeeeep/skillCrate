
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 skill-crate-gradient rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillCrate</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="skill-crate-gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
            All Your Academic Resources in One Place
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover videos, papers, e-books, courses, and repositories tailored to your learning goals. 
            No more scattered searches across different platforms.
          </p>
          <Link to="/signup">
            <Button size="lg" className="skill-crate-gradient">
              Start Learning Today <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkillCrate?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="glass-card p-8 text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">AI-Powered Recommendations</h3>
            <p className="text-muted-foreground">
              Get personalized resource suggestions based on your keywords and learning preferences.
            </p>
          </Card>
          
          <Card className="glass-card p-8 text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Curated Quality</h3>
            <p className="text-muted-foreground">
              All resources are rated and reviewed by our community to ensure high-quality content.
            </p>
          </Card>
          
          <Card className="glass-card p-8 text-center">
            <Star className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Project-Based Learning</h3>
            <p className="text-muted-foreground">
              Organize your learning around projects and track your progress effectively.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2024 SkillCrate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
