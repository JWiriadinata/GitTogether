import { useState } from "react";
import { Link } from "react-router";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Edit,
  FolderKanban,
  Calendar,
  Users,
  Settings,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";

// Mock user data
const userData = {
  username: "johndoe",
  name: "John Doe",
  email: "john.doe@gatech.edu",
  phone: "(404) 555-0123",
  college: "Georgia Tech",
  major: "Computer Science",
  year: "Junior",
  bio: "Passionate about building products that make a difference. Love working on AI/ML projects and full-stack development.",
  skills: ["React", "Node.js", "Python", "UI/UX Design", "Machine Learning"],
  interests: ["Web Development", "AI/ML", "Startups", "Design"],
  initials: "JD",
};

const myProjects = [
  {
    id: 1,
    title: "Campus Food Delivery",
    role: "Backend Developer",
    status: "Active",
    members: 4,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    title: "Student Freelance Marketplace",
    role: "Full Stack Developer",
    status: "Active",
    members: 5,
    lastActive: "1 day ago",
  },
];

const pastProjects = [
  {
    id: 3,
    title: "Campus Event Finder",
    role: "Frontend Developer",
    status: "Completed",
    completedDate: "February 2026",
  },
];

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-blue-600 text-white text-3xl">
                  {userData.initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">
                      {userData.name}
                    </h1>
                    <p className="text-slate-600">@{userData.username}</p>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span>
                      {userData.college} • {userData.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-5 h-5 text-purple-600" />
                    <span>{userData.major}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-5 h-5 text-green-600" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <span>{userData.phone}</span>
                  </div>
                </div>

                <p className="text-slate-700 mb-4">{userData.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-2">
            <TabsTrigger value="projects">
              <FolderKanban className="w-4 h-4 mr-2" />
              My Projects
            </TabsTrigger>
            <TabsTrigger value="interests">
              <Users className="w-4 h-4 mr-2" />
              Interests
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* My Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            {/* Active Projects */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Active Projects ({myProjects.length})
              </h2>
              <div className="grid gap-4">
                {myProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link to={`/projects/${project.id}`}>
                              <h3 className="text-xl font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                                {project.title}
                              </h3>
                            </Link>
                            <Badge className="bg-green-600 hover:bg-green-700">
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-3">
                            Your role: <span className="font-medium">{project.role}</span>
                          </p>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {project.members} members
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Last active {project.lastActive}
                            </span>
                          </div>
                        </div>
                        <Link to={`/projects/${project.id}`}>
                          <Button variant="outline">View Project</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Past Projects */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Past Projects ({pastProjects.length})
              </h2>
              <div className="grid gap-4">
                {pastProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-900">
                              {project.title}
                            </h3>
                            <Badge variant="outline">{project.status}</Badge>
                          </div>
                          <p className="text-slate-600 mb-2">
                            Your role: <span className="font-medium">{project.role}</span>
                          </p>
                          <p className="text-sm text-slate-600">
                            Completed: {project.completedDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Interests Tab */}
          <TabsContent value="interests">
            <Card>
              <CardHeader>
                <CardTitle>Areas of Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {userData.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-base px-4 py-2">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <Separator className="my-6" />
                <h3 className="font-semibold text-slate-900 mb-3">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Interests & Skills
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Email Notifications</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-slate-700">New project matches</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-slate-700">Project updates</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-slate-700">Weekly digest</span>
                      </label>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Privacy</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-slate-700">Show profile to other students</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-slate-700">Allow project invitations</span>
                      </label>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
