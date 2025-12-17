import { useEffect, useState } from "react";
import { BookOpen, Users, Award, TrendingUp, Calendar, Clock, Plus, Edit, Trash2, Eye } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getUserProfile, isAuthenticated } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface UserProfile {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  birth_date?: string;
  num_etud?: string;
  year_of_stud?: string;
  field?: string;
  departement?: string;
  specialization?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!isAuthenticated()) {
          navigate("/auth");
          return;
        }

        const res = await getUserProfile();
        if (res.data.success && res.data.user) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  const isStudent = profile.role === "Etudiant";
  const userName = `${profile.name} ${profile.lastname}`;
  const userType = isStudent ? "student" : "teacher";

  return (
    <DashboardLayout userType={userType as "student" | "teacher"} userName={userName}>
      {isStudent ? <StudentDashboard profile={profile} /> : <TeacherDashboard profile={profile} />}
    </DashboardLayout>
  );
};

// ==================== STUDENT DASHBOARD ====================
const StudentDashboard = ({ profile }: { profile: UserProfile }) => {
  const navigate = useNavigate();

  const statsStudent = [
    { label: "Cours inscrits", value: "6", icon: BookOpen, color: "bg-primary" },
    { label: "Moyenne générale", value: "14.5", icon: Award, color: "bg-secondary" },
    { label: "Crédits validés", value: "42", icon: TrendingUp, color: "bg-accent" },
  ];

  const upcomingCourses = [
    { name: "Architecture SOA", time: "08:30 - 10:00", room: "Salle A101", teacher: "Dr. Mansouri" },
    { name: "Base de données", time: "10:15 - 11:45", room: "Salle B205", teacher: "Dr. Benali" },
    { name: "Programmation Web", time: "14:00 - 15:30", room: "Labo Info 3", teacher: "Dr. Khadri" },
  ];

  const recentGrades = [
    { course: "Architecture SOA", grade: "16/20", date: "12 Dec 2024", coefficient: 3 },
    { course: "Base de données", grade: "14/20", date: "10 Dec 2024", coefficient: 2 },
    { course: "Algorithmique", grade: "15/20", date: "08 Dec 2024", coefficient: 3 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome message with Profile Card */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 lg:p-8 text-primary-foreground">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold mb-2">
              Bonjour, {profile.name} 👋
            </h1>
            <p className="text-primary-foreground/80 mb-3">
              Voici un aperçu de votre parcours académique
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full">
                📚 {profile.field}
              </span>
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full">
                🎓 {profile.year_of_stud}
              </span>
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full">
                🆔 {profile.num_etud}
              </span>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => navigate("/student/profile")}
            className="self-start lg:self-center"
          >
            Voir mon profil
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {statsStudent.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-6 shadow-soft border border-border/50 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming courses */}
        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Cours du jour
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/courses")}>
                Voir tout
              </Button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {upcomingCourses.map((course, index) => (
              <div
                key={index}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate("/student/courses")}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.teacher}</p>
                    <p className="text-xs text-muted-foreground mt-1">{course.room}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {course.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent grades */}
        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/30 rounded-lg">
                  <Award className="w-5 h-5 text-secondary-foreground" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Notes récentes
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/grades")}>
                Voir tout
              </Button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {recentGrades.map((item, index) => (
              <div
                key={index}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.course}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      <span className="text-xs text-muted-foreground">Coef. {item.coefficient}</span>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-bold text-lg">
                    {item.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl shadow-soft border border-border/50 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/student/courses")}>
            <BookOpen className="w-6 h-6" />
            <span>Mes cours</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/student/grades")}>
            <Award className="w-6 h-6" />
            <span>Mes notes</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/student/schedule")}>
            <Calendar className="w-6 h-6" />
            <span>Emploi du temps</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/student/profile")}>
            <Users className="w-6 h-6" />
            <span>Mon profil</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==================== TEACHER DASHBOARD ====================
const TeacherDashboard = ({ profile }: { profile: UserProfile }) => {
  const navigate = useNavigate();

  const statsTeacher = [
    { label: "Cours enseignés", value: "4", icon: BookOpen, color: "bg-primary" },
    { label: "Étudiants", value: "128", icon: Users, color: "bg-secondary" },
    { label: "Notes à saisir", value: "24", icon: Award, color: "bg-accent" },
  ];

  const myCourses = [
    { name: "Architecture SOA", students: 45, schedule: "Lun-Mer 08:30", room: "A101" },
    { name: "Base de données", students: 38, schedule: "Mar-Jeu 10:15", room: "B205" },
    { name: "Systèmes distribués", students: 25, schedule: "Mer-Ven 14:00", room: "C302" },
    { name: "Cloud Computing", students: 20, schedule: "Jeu 16:00", room: "Labo 5" },
  ];

  const recentStudents = [
    { name: "Ahmed Ben Ali", num: "24-1234", field: "Informatique", year: "Master 1" },
    { name: "Fatima Khadri", num: "24-5678", field: "Génie Logiciel", year: "Master 2" },
    { name: "Mohamed Trabelsi", num: "24-9012", field: "IA", year: "Master 1" },
    { name: "Sarah Mansouri", num: "24-3456", field: "Cybersécurité", year: "Master 2" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome message */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 lg:p-8 text-primary-foreground">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold mb-2">
              Bonjour, {profile.name} 👋
            </h1>
            <p className="text-primary-foreground/80 mb-3">
              Gérez vos cours et suivez la progression de vos étudiants
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full">
                🏛️ {profile.departement}
              </span>
              <span className="bg-primary-foreground/20 px-3 py-1 rounded-full">
                🎯 {profile.specialization}
              </span>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => navigate("/teacher/profile")}
            className="self-start lg:self-center"
          >
            Voir mon profil
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {statsTeacher.map((stat, index) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-6 shadow-soft border border-border/50 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Mes cours
                </h2>
              </div>
              <Button size="sm" onClick={() => navigate("/teacher/courses/new")}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau
              </Button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {myCourses.map((course, index) => (
              <div
                key={index}
                className="p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{course.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students} étudiants
                      </span>
                      <span>{course.room}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{course.schedule}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/teacher/courses/${index}/edit`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/teacher/courses/${index}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/30 rounded-lg">
                  <Users className="w-5 h-5 text-secondary-foreground" />
                </div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Étudiants récents
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/students")}>
                Voir tout
              </Button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {recentStudents.map((student, index) => (
              <div
                key={index}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/teacher/students/${student.num}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{student.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-muted-foreground">{student.num}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{student.field}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {student.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl shadow-soft border border-border/50 p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/teacher/courses")}>
            <BookOpen className="w-6 h-6" />
            <span>Gérer les cours</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/teacher/students")}>
            <Users className="w-6 h-6" />
            <span>Voir étudiants</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/teacher/grades")}>
            <Award className="w-6 h-6" />
            <span>Saisir notes</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/teacher/schedule")}>
            <Calendar className="w-6 h-6" />
            <span>Mon emploi du temps</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;