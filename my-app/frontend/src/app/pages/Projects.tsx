import { useState } from "react";
import { Link } from "react-router";
import { Search, Filter, Users, Clock, ArrowUpDown } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// Mock data for all projects
const allProjects = [
  {
    id: 1,
    title: "AI Study Buddy App",
    description: "Building an AI-powered study companion for college students using machine learning and natural language processing",
    author: "Sarah Chen",
    college: "Georgia Tech",
    tags: ["AI/ML", "Mobile", "React Native", "Python"],
    members: 3,
    seeking: 2,
    posted: "2 hours ago",
    category: "ai",
  },
  {
    id: 2,
    title: "Campus Food Delivery",
    description: "Local food delivery platform connecting students with nearby restaurants and campus dining options",
    author: "Marcus Johnson",
    college: "Emory University",
    tags: ["Web Dev", "MERN Stack", "Business"],
    members: 4,
    seeking: 1,
    posted: "5 hours ago",
    category: "web",
  },
  {
    id: 3,
    title: "Sustainability Tracker",
    description: "Track and reduce your carbon footprint with gamification elements and community challenges",
    author: "Alex Rivera",
    college: "Georgia State",
    tags: ["Frontend", "React", "Design", "Sustainability"],
    members: 2,
    seeking: 3,
    posted: "1 day ago",
    category: "web",
  },
  {
    id: 4,
    title: "Mental Health Chat Bot",
    description: "AI chatbot providing mental health support and resources for college students",
    author: "Jordan Lee",
    college: "Spelman College",
    tags: ["AI/ML", "Python", "NLP", "Healthcare"],
    members: 3,
    seeking: 2,
    posted: "2 days ago",
    category: "ai",
  },
  {
    id: 5,
    title: "College Event Finder",
    description: "Discover and manage campus events, club meetings, and social gatherings in one place",
    author: "Taylor Smith",
    college: "Clark Atlanta",
    tags: ["Mobile", "React Native", "Firebase"],
    members: 2,
    seeking: 2,
    posted: "3 days ago",
    category: "mobile",
  },
  {
    id: 6,
    title: "Student Freelance Marketplace",
    description: "Platform connecting student freelancers with local businesses and startups",
    author: "Chris Anderson",
    college: "Georgia Tech",
    tags: ["Web Dev", "Next.js", "Business", "Payment Integration"],
    members: 5,
    seeking: 1,
    posted: "4 days ago",
    category: "business",
  },
  {
    id: 7,
    title: "AR Campus Navigation",
    description: "Augmented reality app to help new students navigate campus buildings and facilities",
    author: "Morgan Davis",
    college: "Kennesaw State",
    tags: ["AR/VR", "Unity", "Mobile", "3D Modeling"],
    members: 3,
    seeking: 3,
    posted: "5 days ago",
    category: "mobile",
  },
  {
    id: 8,
    title: "Code Learning Platform",
    description: "Interactive platform for students to learn programming through peer-to-peer teaching",
    author: "Jamie Wilson",
    college: "Georgia State",
    tags: ["Web Dev", "Education", "React", "Node.js"],
    members: 4,
    seeking: 2,
    posted: "1 week ago",
    category: "web",
  },
];

export function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredProjects = allProjects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return 0; // Keep original order
      if (sortBy === "members") return b.members - a.members;
      if (sortBy === "seeking") return b.seeking - a.seeking;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Browse Projects
          </h1>
          <p className="text-slate-600">
            Discover projects looking for talented collaborators
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search projects, skills, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="md:col-span-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="ai">AI/Machine Learning</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business/Startup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div className="md:col-span-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="members">Most Members</SelectItem>
                    <SelectItem value="seeking">Most Seeking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <div className="md:col-span-1">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSortBy("recent");
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-slate-600">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600 mb-4">No projects found matching your criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link to={`/projects/${project.id}`}>
                        <CardTitle className="hover:text-blue-600 transition-colors text-xl">
                          {project.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="mt-2 text-base">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Badge className="whitespace-nowrap bg-blue-600 hover:bg-blue-700">
                      Seeking {project.seeking}
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
                  <div className="flex items-center justify-between text-sm text-slate-600 flex-wrap gap-3">
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
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Link to={`/projects/${project.id}`}>
                      <Button variant="outline" className="w-full sm:w-auto">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
