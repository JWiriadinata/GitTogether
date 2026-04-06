import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Users,
  Clock,
  GraduationCap,
  Mail,
  Calendar,
  Target,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";

// Mock project data
const projectData = {
  1: {
    title: "AI Study Buddy App",
    description:
      "Building an AI-powered study companion for college students using machine learning and natural language processing. The app will help students with personalized study plans, quiz generation, and answering questions on course material.",
    author: {
      name: "Sarah Chen",
      college: "Georgia Tech",
      major: "Computer Science",
      year: "Junior",
      initials: "SC",
    },
    tags: ["AI/ML", "Mobile", "React Native", "Python"],
    members: 3,
    seeking: 2,
    posted: "March 1, 2026",
    status: "Actively Recruiting",
    category: "AI/Machine Learning",
    timeline: "3-4 months",
    commitment: "10-15 hours/week",
    goals: [
      "Create a working MVP with core AI features",
      "Build a mobile-friendly interface",
      "Implement personalized study recommendations",
      "Launch beta version to 100 students",
    ],
    lookingFor: [
      "Backend Developer (Python/Node.js)",
      "Mobile Developer (React Native)",
    ],
    teamMembers: [
      { name: "Sarah Chen", role: "Project Lead & ML Engineer", initials: "SC" },
      { name: "David Park", role: "Frontend Developer", initials: "DP" },
      { name: "Emma Wilson", role: "UI/UX Designer", initials: "EW" },
    ],
  },
};

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectData[id as keyof typeof projectData];

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
            <p className="text-slate-600 mb-4">
              The project you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/projects")}>
              Browse Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="bg-white rounded-lg p-8 mb-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge className="bg-green-600 hover:bg-green-700 text-base px-4 py-2">
              {project.status}
            </Badge>
          </div>

          <p className="text-lg text-slate-700 mb-6">{project.description}</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-5 h-5 text-blue-600" />
              <span>
                {project.members} member{project.members > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Seeking {project.seeking}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>{project.commitment}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-5 h-5 text-green-600" />
              <span>{project.timeline}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Project Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Project Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.goals.map((goal, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Looking For */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  Looking For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.lookingFor.map((role, index) => (
                    <div
                      key={index}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <p className="font-medium text-slate-900">{role}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Current Team ({project.teamMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-600">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Owner */}
            <Card>
              <CardHeader>
                <CardTitle>Project Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {project.author.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">
                      {project.author.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {project.author.year} • {project.author.major}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                  <GraduationCap className="w-4 h-4" />
                  <span>{project.author.college}</span>
                </div>
                <Separator className="my-4" />
                <Button className="w-full" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Category</p>
                  <p className="font-medium text-slate-900">{project.category}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-slate-600 mb-1">Timeline</p>
                  <p className="font-medium text-slate-900">{project.timeline}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-slate-600 mb-1">Time Commitment</p>
                  <p className="font-medium text-slate-900">{project.commitment}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-slate-600 mb-1">Posted</p>
                  <p className="font-medium text-slate-900">{project.posted}</p>
                </div>
              </CardContent>
            </Card>

            {/* Apply Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Interested?</h3>
                <p className="text-blue-100 mb-4">
                  Join this project and start collaborating!
                </p>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                  Apply to Join
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
