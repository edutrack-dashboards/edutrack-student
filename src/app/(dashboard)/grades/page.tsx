import {
  getStudentClasses,
  getMyGrades,
  getMyAverageGrade,
  getClassById,
} from "@/lib/db";
import { GradesView } from "@/components/grades/grades-view";

export default async function GradesPage() {
  const [classes, allGrades] = await Promise.all([
    getStudentClasses(),
    getMyGrades(),
  ]);

  // Get exam info for all grades
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const gradesByClass = await Promise.all(
    classes.map(async (cls) => {
      const classGrades = allGrades.filter((g) => g.classId === cls.id);
      const avg = await getMyAverageGrade(cls.id);

      const gradesWithExams = await Promise.all(
        classGrades.map(async (grade) => {
          const { data: exam } = await supabase
            .from("exams")
            .select("name, date, max_score, type")
            .eq("id", grade.examId)
            .single();

          return {
            id: grade.id,
            examName: exam?.name ?? "Exam",
            examDate: (exam?.date as string) ?? "",
            examType: (exam?.type as string) ?? "test",
            score: grade.score,
            maxScore: (exam?.max_score as number) ?? 100,
            letterGrade: grade.letterGrade,
          };
        })
      );

      return {
        classId: cls.id,
        className: cls.name,
        classSubject: cls.subject,
        teacherName: cls.teacherName,
        average: avg,
        grades: gradesWithExams,
      };
    })
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <GradesView gradesByClass={gradesByClass} />
    </div>
  );
}
