import { useEffect, useState } from "react";
import { User, Mail, Building, Calendar, GraduationCap, BookOpen, Award, Hash } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { getUserProfile, isAuthenticated } from "@/services/api";
import { useNavigate } from "react-router-dom";

interface StudentProfile {
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
  createdAt?: string;
  updatedAt?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          navigate("/login");
          return;
        }

        const res = await getUserProfile();
        
        // Check if response has success and user properties
        if (res.data.success && res.data.user) {
          setProfile(res.data.user);
        } else {
          setError("Format de réponse invalide");
        }
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.response?.data?.message || "Échec du chargement du profil");
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
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Chargement du profil...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout userType="student" userName="Error">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">❌</span>
            </div>
            <p className="text-red-600 font-medium">{error || "Profil non trouvé"}</p>
            <Button onClick={() => navigate("/login")}>
              Se reconnecter
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Map user roles to dashboard types
  const getUserType = (role: string): "student" | "teacher" => {
    if (role === "Enseignant") return "teacher";
    if (role === "Admin") return "teacher"; // Admin uses teacher layout
    return "student"; // Etudiant uses student layout
  };

  return (
    <DashboardLayout 
      userType={getUserType(profile.role)} 
      userName={`${profile.name} ${profile.lastname}`}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-2xl p-8 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center text-4xl font-bold border-4 border-primary-foreground/30">
              {profile.name.charAt(0)}{profile.lastname.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="font-display text-3xl font-bold">
                {profile.name} {profile.lastname}
              </h1>
              <p className="text-primary-foreground/80 text-lg mt-1">
                {profile.field || profile.departement} {profile.year_of_stud && `- ${profile.year_of_stud}`}
              </p>
              <p className="text-primary-foreground/60 text-sm mt-1">
                {profile.num_etud || profile.specialization} • {profile.role}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Hash className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {profile.role === 'Etudiant' ? 'Numéro étudiant' : 'Rôle'}
                </p>
                <p className="text-xl font-bold text-foreground">
                  {profile.num_etud || profile.role}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {profile.role === 'Etudiant' ? 'Filière' : 'Département'}
                </p>
                <p className="text-xl font-bold text-foreground">
                  {profile.field || profile.departement || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <GraduationCap className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {profile.role === 'Etudiant' ? 'Année d\'études' : 'Spécialisation'}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {profile.year_of_stud || profile.specialization || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Informations personnelles
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium text-foreground">
                    {profile.name} {profile.lastname}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{profile.email}</p>
                </div>
              </div>

              {profile.role === 'Etudiant' && profile.num_etud && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <Hash className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Numéro étudiant</p>
                    <p className="font-medium text-foreground">{profile.num_etud}</p>
                  </div>
                </div>
              )}

              {profile.role === 'Etudiant' && profile.field && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Filière</p>
                    <p className="font-medium text-foreground">{profile.field}</p>
                  </div>
                </div>
              )}

              {profile.role === 'Etudiant' && profile.year_of_stud && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Année d'études</p>
                    <p className="font-medium text-foreground">{profile.year_of_stud}</p>
                  </div>
                </div>
              )}

              {profile.role === 'Enseignant' && profile.departement && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Département</p>
                    <p className="font-medium text-foreground">{profile.departement}</p>
                  </div>
                </div>
              )}

              {profile.role === 'Enseignant' && profile.specialization && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Spécialisation</p>
                    <p className="font-medium text-foreground">{profile.specialization}</p>
                  </div>
                </div>
              )}

              {profile.birth_date && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date de naissance</p>
                    <p className="font-medium text-foreground">
                      {new Date(profile.birth_date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {profile.createdAt && (
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Membre depuis</p>
                    <p className="font-medium text-foreground">
                      {new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <Button variant="outline" className="w-full sm:w-auto">
              Modifier le profil
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;