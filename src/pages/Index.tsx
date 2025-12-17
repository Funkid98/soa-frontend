import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import RegistrationForm from "@/components/RegistrationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Side - Branding */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-primary rounded-xl shadow-card">
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                  UniGest
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-md">
                Système de gestion universitaire intelligent
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Bienvenue dans votre
                <span className="block text-primary">espace académique</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                Gérez vos cours, suivez vos notes et connectez-vous avec la communauté universitaire en toute simplicité.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-soft">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <BookOpen className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Cours</h3>
                  <p className="text-sm text-muted-foreground">Accédez à vos matières</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-soft">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Award className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Notes</h3>
                  <p className="text-sm text-muted-foreground">Consultez vos résultats</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-soft">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <Users className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Étudiants</h3>
                  <p className="text-sm text-muted-foreground">Gérez les profils</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-soft">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <GraduationCap className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Authentification</h3>
                  <p className="text-sm text-muted-foreground">Connexion sécurisée</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto animate-scale-in">
            <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border/50">
              <div className="space-y-2 mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Créer un compte
                </h2>
                <p className="text-muted-foreground">
                  Rejoignez notre communauté universitaire
                </p>
              </div>

              <RegistrationForm />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 UniGest - Projet SOA - Gestion de Faculté</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
