import { useState } from "react";
import { Link } from "react-router";
import { Plus, TrendingUp, Clock, Users, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// Mock data for recent projects
const recentProjects = [
  {
    id: 1,
    title: "AI Study Buddy App",
    description: "Building an AI-powered study companion for college students",
    author: "Sarah Chen",
    college: "Georgia Tech",
    tags: ["AI/ML", "Mobile", "React Native"],
    members: 3,
    seeking: 2,
    posted: "2 hours ago",
  },
  {
    id: 2,
    title: "Campus Food Delivery",
    description: "Local food delivery platform connecting students with nearby restaurants",
    author: "Marcus Johnson",
    college: "Emory University",
    tags: ["Web Dev", "MERN Stack", "Business"],
    members: 4,
    seeking: 1,
    posted: "5 hours ago",
  },
  {
    id: 3,
    title: "Sustainability Tracker",
    description: "Track and reduce your carbon footprint with gamification",
    author: "Alex Rivera",
    college: "Georgia State",
    tags: ["Frontend", "React", "Design"],
    members: 2,
    seeking: 3,
    posted: "1 day ago",
  },
];

const stats = [
  { label: "Active Projects", value: "127", icon: TrendingUp, color: "text-blue-600" },
  { label: "Students Connected", value: "450+", icon: Users, color: "text-purple-600" },
  { label: "Projects This Week", value: "23", icon: Clock, color: "text-green-600" },
];

export function Home() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "",
    skillsNeeded: "",
    teamSize: "",
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, submit project data here
    setIsCreateDialogOpen(false);
    setProjectForm({
      title: "",
      description: "",
      category: "",
      skillsNeeded: "",
      teamSize: "",
    });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, Student! 👋
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Connect with Atlanta students and build amazing projects together
            </p>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Share your project idea and find collaborators
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., AI Study Buddy App"
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project idea, goals, and what you're trying to build..."
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, description: e.target.value })
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={projectForm.category}
                      onValueChange={(value) =>
                        setProjectForm({ ...projectForm, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Development</SelectItem>
                        <SelectItem value="mobile">Mobile Development</SelectItem>
                        <SelectItem value="ai">AI/Machine Learning</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="business">Business/Startup</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills Needed</Label>
                    <Input
                      id="skills"
                      placeholder="e.g., React, Node.js, UI/UX Design"
                      value={projectForm.skillsNeeded}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, skillsNeeded: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamSize">Looking for (# of members)</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="3"
                      value={projectForm.teamSize}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, teamSize: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Create Project
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link to="/projects">
            <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Browse All Projects
                </CardTitle>
                <CardDescription>
                  Discover projects looking for talented collaborators
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Your Projects
                </CardTitle>
                <CardDescription>
                  Manage your active projects and collaborations
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Projects</h2>
              <p className="text-slate-600">Latest opportunities from the community</p>
            </div>
            <Link to="/projects">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid gap-6">
            {recentProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link to={`/projects/${project.id}`}>
                        <CardTitle className="hover:text-blue-600 transition-colors">
                          {project.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="mt-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="whitespace-nowrap">
                      Seeking {project.seeking} member{project.seeking > 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-4">
                      <span>
                        By <span className="font-medium">{project.author}</span>
                      </span>
                      <span>• {project.college}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {project.posted}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}