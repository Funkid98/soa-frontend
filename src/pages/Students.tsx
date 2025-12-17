import { Search, Filter, Mail, MoreVertical } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const students = [
  { id: 1, name: "Ahmed Benali", email: "ahmed.benali@univ.ma", year: "M1", field: "Informatique", average: 15.6 },
  { id: 2, name: "Fatima Zahra", email: "fatima.zahra@univ.ma", year: "M1", field: "Informatique", average: 16.2 },
  { id: 3, name: "Youssef Alami", email: "youssef.alami@univ.ma", year: "M1", field: "Informatique", average: 14.8 },
  { id: 4, name: "Sara Bennani", email: "sara.bennani@univ.ma", year: "M1", field: "Informatique", average: 17.1 },
  { id: 5, name: "Mohamed Rifai", email: "mohamed.rifai@univ.ma", year: "M1", field: "Informatique", average: 13.5 },
  { id: 6, name: "Nadia Tazi", email: "nadia.tazi@univ.ma", year: "M1", field: "Informatique", average: 15.0 },
  { id: 7, name: "Omar Idrissi", email: "omar.idrissi@univ.ma", year: "M1", field: "Informatique", average: 12.8 },
  { id: 8, name: "Khadija Moussaoui", email: "khadija.m@univ.ma", year: "M1", field: "Informatique", average: 16.5 },
];

const getAverageColor = (avg: number) => {
  if (avg >= 16) return "text-green-600 bg-green-100";
  if (avg >= 14) return "text-primary bg-primary/10";
  if (avg >= 10) return "text-secondary-foreground bg-secondary";
  return "text-red-600 bg-red-100";
};

const Students = () => {
  return (
    <DashboardLayout userType="teacher" userName="Dr. Karim Mansouri">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Liste des étudiants
            </h1>
            <p className="text-muted-foreground">
              {students.length} étudiants dans le cours Architecture SOA
            </p>
          </div>
          <Button variant="hero">
            Exporter la liste
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un étudiant..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtrer
          </Button>
        </div>

        {/* Students table */}
        <div className="bg-card rounded-xl shadow-soft border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Étudiant
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                    Année
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                    Moyenne
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/30 transition-colors animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-muted-foreground">{student.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-sm rounded-md">
                        {student.year}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getAverageColor(student.average)}`}>
                        {student.average.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Students;
