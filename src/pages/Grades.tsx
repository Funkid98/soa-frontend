import { useEffect, useState } from "react";
import { Award, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getUserProfile, isAuthenticated, getStudentGrades, getStudentAverage } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Grade {
  _id: string;
  studentId: string;
  course: string;
  note: number;
  coefficient: number;
  semestre: string;
}

interface CourseGrades {
  course: string;
  code: string;
  grades: { type: string; grade: number; coef: number }[];
  average: number;
  credits: number;
}

interface UserProfile {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  num_etud?: string;
}

const getGradeColor = (grade: number) => {
  if (grade >= 16) return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
  if (grade >= 14) return "text-primary bg-primary/10";
  if (grade >= 10) return "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400";
  return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
};

const getStatusBadge = (average: number) => {
  if (average >= 10) {
    return <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">Validé</span>;
  }
  return <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">Non validé</span>;
};

const Grades = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [grades, setGrades] = useState<CourseGrades[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallAverage, setOverallAverage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isAuthenticated()) {
          navigate("/auth");
          return;
        }

        // Fetch user profile
        const profileRes = await getUserProfile();
        if (profileRes.data.success && profileRes.data.user) {
          const userProfile = profileRes.data.user;
          setProfile(userProfile);

          // Fetch grades for the student
          const gradesRes = await getStudentGrades(userProfile._id);
          if (gradesRes.success && gradesRes.data) {
            // Group grades by course
            const groupedGrades = groupGradesByCourse(gradesRes.data);
            setGrades(groupedGrades);
          }

          // Fetch overall average
          const avgRes = await getStudentAverage(userProfile._id);
          if (avgRes.success && avgRes.data) {
            setOverallAverage(avgRes.data.average);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Erreur lors du chargement des notes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Helper function to group grades by course
  const groupGradesByCourse = (gradesData: Grade[]): CourseGrades[] => {
    const grouped: { [key: string]: Grade[] } = {};
    
    gradesData.forEach((grade) => {
      const courseKey = grade.course;
      if (!grouped[courseKey]) {
        grouped[courseKey] = [];
      }
      grouped[courseKey].push(grade);
    });

    // Convert to CourseGrades format
    return Object.entries(grouped).map(([courseName, courseGrades]) => {
      const gradeItems = courseGrades.map((g, index) => ({
        type: `Note ${index + 1}`, // Generate note number since type isn't in the model
        grade: g.note,
        coef: g.coefficient,
      }));

      // Calculate average
      const totalWeighted = courseGrades.reduce((acc, g) => acc + g.note * g.coefficient, 0);
      const totalCoef = courseGrades.reduce((acc, g) => acc + g.coefficient, 0);
      const average = totalCoef > 0 ? totalWeighted / totalCoef : 0;

      // Extract course code from course name (e.g., "Architecture SOA" -> "SOA")
      const courseCode = courseName.split(' ').pop() || courseName;

      return {
        course: courseName,
        code: courseCode,
        grades: gradeItems,
        average,
        credits: average >= 10 ? 6 : 0, // 6 credits if validated (average >= 10), 0 otherwise
      };
    });
  };

  if (loading) {
    return (
      <DashboardLayout userType="student" userName="Chargement...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  const userName = `${profile.name} ${profile.lastname}`;
  
  // Calculate totals
  const totalCreditsPossible = 20; // Fixed total credits possible
  const validatedCredits = grades
    .filter((g) => g.average >= 10)
    .reduce((acc, g) => acc + g.credits, 0);
  const validatedCount = grades.filter((g) => g.average >= 10).length;
  
  // If overall average >= 13.5, all credits are validated
  const creditsToDisplay = overallAverage >= 13.5 ? totalCreditsPossible : validatedCredits;

  return (
    <DashboardLayout userType="student" userName={userName}>
      <div className="space-y-6 animate-fade-in">
        {/* Header with stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl p-6 text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center gap-4">
              <div className="p-4 bg-primary-foreground/20 rounded-xl backdrop-blur-sm">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Moyenne générale</p>
                <p className="text-4xl font-bold">{overallAverage.toFixed(2)}<span className="text-2xl">/20</span></p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <BookOpen className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Matières validées</p>
                <p className="text-2xl font-bold text-foreground">{validatedCount}/{grades.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Award className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crédits validés</p>
                <p className="text-2xl font-bold text-foreground">{creditsToDisplay}/20</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grades cards */}
        {grades.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {grades.map((item, index) => (
              <div
                key={item.code}
                className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-mono rounded">
                          {item.code}
                        </span>
                        {getStatusBadge(item.average)}
                      </div>
                      <h3 className="font-semibold text-foreground">{item.course}</h3>
                      <p className="text-xs text-muted-foreground">{item.credits} crédits</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl font-bold text-lg ${getGradeColor(item.average)}`}>
                      {item.average.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.grades.map((g, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center p-2 bg-muted/50 rounded-lg min-w-[60px]"
                      >
                        <span className="text-xs text-muted-foreground mb-1">{g.type}</span>
                        <span className={`px-2 py-0.5 rounded text-sm font-medium ${getGradeColor(g.grade)}`}>
                          {g.grade}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">coef {g.coef}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border/50">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune note disponible</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Grades;