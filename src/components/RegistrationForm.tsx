import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Users, Calendar, BookOpen, Building2, Briefcase, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserRole = "student" | "teacher" | null;

// Configuration des suggestions intelligentes par département et année
const fieldSuggestions: Record<string, Record<string, string[]>> = {
  Electronique: {
    "2ème année": ["Systèmes Embarqués", "Électronique Industrielle"],
    "3ème année": ["Systèmes Embarqués", "Électronique Industrielle", "Microélectronique"],
    "Master 1": ["Systèmes Embarqués Avancés", "Électronique de Puissance", "IoT et Capteurs"],
    "Master 2": ["Systèmes Embarqués Avancés", "Électronique de Puissance", "IoT et Capteurs"],
  },
  Informatique: {
    "2ème année": ["Développement Web", "Réseaux Informatiques"],
    "3ème année": ["Génie Logiciel", "Cybersécurité", "Intelligence Artificielle"],
    "Master 1": ["Intelligence Artificielle", "Data Science", "Cloud Computing"],
    "Master 2": ["Intelligence Artificielle", "Data Science", "Cloud Computing", "Blockchain"],
  },
  Math: {
    "2ème année": ["Mathématiques Appliquées", "Statistiques"],
    "3ème année": ["Mathématiques Appliquées", "Statistiques", "Mathématiques Financières"],
    "Master 1": ["Modélisation Mathématique", "Cryptographie", "Data Science"],
    "Master 2": ["Modélisation Mathématique", "Cryptographie", "Recherche Opérationnelle"],
  },
  Physique: {
    "2ème année": ["Physique Fondamentale", "Physique Appliquée"],
    "3ème année": ["Physique des Matériaux", "Énergies Renouvelables"],
    "Master 1": ["Physique Quantique", "Nanophysique", "Photonique"],
    "Master 2": ["Physique Quantique", "Nanophysique", "Physique Nucléaire"],
  },
  Chimie: {
    "2ème année": ["Chimie Organique", "Chimie Analytique"],
    "3ème année": ["Chimie Industrielle", "Biochimie"],
    "Master 1": ["Chimie Pharmaceutique", "Chimie des Polymères", "Génie Chimique"],
    "Master 2": ["Chimie Pharmaceutique", "Chimie des Polymères", "Catalyse"],
  },
};

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    year: "",
    department: "", // Département principal
    field: "", // Filière/Spécialisation
    // Teacher fields
    teacherDepartment: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(false);
  const [suggestedFields, setSuggestedFields] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { toast } = useToast();

  // Mettre à jour les suggestions quand le département ou l'année change
  useEffect(() => {
    if (role === "student" && formData.department && formData.year) {
      const suggestions = fieldSuggestions[formData.department]?.[formData.year] || [];
      setSuggestedFields(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSuggestedFields([]);
      setShowSuggestions(false);
    }
  }, [formData.department, formData.year, role]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.birthDate) {
      return toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
    }

    if (!role) {
      return toast({
        title: "Erreur",
        description: "Veuillez sélectionner votre rôle.",
        variant: "destructive",
      });
    }

    if (role === "student" && (!formData.year || !formData.department || !formData.field)) {
      return toast({
        title: "Erreur",
        description: "Veuillez remplir l'année d'étude, le département et la filière.",
        variant: "destructive",
      });
    }

    if (role === "teacher" && (!formData.teacherDepartment || !formData.specialty)) {
      return toast({
        title: "Erreur",
        description: "Veuillez remplir le département et la spécialité.",
        variant: "destructive",
      });
    }

    // Prepare payload according to backend schema
    const payload: any = {
      name: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      password: formData.password,
      birth_date: formData.birthDate,
      role: role === "student" ? "Etudiant" : "Enseignant",
    };

    if (role === "student") {
      payload.year_of_stud = formData.year;
      payload.departement = formData.department; // Département principal
      payload.field = formData.field; // Filière/Spécialisation
    }

    if (role === "teacher") {
      payload.departement = formData.teacherDepartment;
      payload.specialization = formData.specialty;
    }

    console.log("Payload sent to backend:", payload);

    setLoading(true);
    try {
      const response = await register(payload); 
      toast({
        title: "Inscription réussie !",
        description: `Bienvenue ${formData.firstName} ${formData.lastName}`,
      });

      console.log("Registered successfully:", response.data);
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Échec de l'inscription",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Je suis *</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole("student")}
            disabled={loading}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-300 ${
              role === "student"
                ? "border-primary bg-primary/5 shadow-card"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${
              role === "student" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className={`font-semibold ${role === "student" ? "text-primary" : ""}`}>
              Étudiant
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("teacher")}
            disabled={loading}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-300 ${
              role === "teacher"
                ? "border-primary bg-primary/5 shadow-card"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${
              role === "teacher" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              <Users className="w-6 h-6" />
            </div>
            <span className={`font-semibold ${role === "teacher" ? "text-primary" : ""}`}>
              Enseignant
            </span>
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            placeholder="Votre prénom"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            placeholder="Votre nom"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre.email@exemple.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe *</Label>
        <Input
          id="password"
          type="password"
          placeholder="Min. 8 caractères avec majuscule, minuscule et chiffre"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Date de naissance *
        </Label>
        <Input
          id="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={(e) => handleInputChange("birthDate", e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Student-specific fields */}
      {role === "student" && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <BookOpen className="w-5 h-5" />
            <span>Informations académiques</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Département */}
            <div className="space-y-2">
              <Label htmlFor="department">Département *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => {
                  handleInputChange("department", value);
                  handleInputChange("field", ""); // Reset field when department changes
                }}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Informatique">Informatique</SelectItem>
                  <SelectItem value="Math">Mathématiques</SelectItem>
                  <SelectItem value="Physique">Physique</SelectItem>
                  <SelectItem value="Electronique">Électronique</SelectItem>
                  <SelectItem value="Chimie">Chimie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Année d'étude */}
            <div className="space-y-2">
              <Label htmlFor="year">Année d'étude *</Label>
              <Select
                value={formData.year}
                onValueChange={(value) => {
                  handleInputChange("year", value);
                  handleInputChange("field", ""); // Reset field when year changes
                }}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1ère année">1ère année</SelectItem>
                  <SelectItem value="2ème année">2ème année</SelectItem>
                  <SelectItem value="3ème année">3ème année</SelectItem>
                  <SelectItem value="Master 1">Master 1</SelectItem>
                  <SelectItem value="Master 2">Master 2</SelectItem>
                  <SelectItem value="Doctorant">Doctorant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Suggestions intelligentes */}
          {showSuggestions && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-slide-up">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                    Filières recommandées pour {formData.department} - {formData.year}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Sélectionnez une filière suggérée ou entrez la vôtre ci-dessous
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {suggestedFields.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleInputChange("field", suggestion)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                      formData.field === suggestion
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filière/Spécialisation */}
          <div className="space-y-2">
            <Label htmlFor="field">Filière / Spécialisation *</Label>
            <Input
              id="field"
              placeholder="Ex: Systèmes Embarqués, Intelligence Artificielle..."
              value={formData.field}
              onChange={(e) => handleInputChange("field", e.target.value)}
              disabled={loading || !formData.department || !formData.year}
            />
            {!formData.department && !formData.year && (
              <p className="text-xs text-muted-foreground">
                Veuillez d'abord sélectionner le département et l'année
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Votre numéro étudiant sera généré automatiquement
          </p>
        </div>
      )}

      {/* Teacher-specific fields */}
      {role === "teacher" && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Briefcase className="w-5 h-5" />
            <span>Informations professionnelles</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacherDepartment" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Département *
              </Label>
              <Select
                value={formData.teacherDepartment}
                onValueChange={(value) => handleInputChange("teacherDepartment", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Informatique">Informatique</SelectItem>
                  <SelectItem value="Math">Mathématiques</SelectItem>
                  <SelectItem value="Physique">Physique</SelectItem>
                  <SelectItem value="Electronique">Électronique</SelectItem>
                  <SelectItem value="Chimie">Chimie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Spécialité *</Label>
              <Input
                id="specialty"
                placeholder="Ex: Intelligence Artificielle"
                value={formData.specialty}
                onChange={(e) => handleInputChange("specialty", e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
        {loading ? "Création en cours..." : "Créer mon compte"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <Link to="/auth" className="text-primary font-semibold hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
};

export default RegistrationForm;