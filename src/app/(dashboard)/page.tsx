import { DashboardGreeting } from "@/components/dashboard/greeting";
import { StatCards } from "@/components/dashboard/stat-cards";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { UpcomingExams } from "@/components/dashboard/upcoming-exams";
import { RecentGrades } from "@/components/dashboard/recent-grades";
import {
  getCurrentStudent,
  getStudentClasses,
  getMyAverageGrade,
  getMyAttendanceRate,
  getUpcomingExams,
  getMyTodaySchedule,
  getMyGrades,
  getClassById,
} from "@/lib/db";
import { getStudentFullName } from "@/lib/utils";

export default async function DashboardPage() {
  const [student, classes, gpa, attendanceRate, upcomingExams, todaySchedule, allGrades] =
    await Promise.all([
      getCurrentStudent(),
      getStudentClasses(),
      getMyAverageGrade(),
      getMyAttendanceRate(),
      getUpcomingExams(),
      getMyTodaySchedule(),
      getMyGrades(),
    ]);

  // Resolve class info for schedule items
  const scheduleWithClasses = await Promise.all(
    todaySchedule.map(async (item) => {
      const cls = await getClassById(item.classId);
      return {
        ...item,
        className: cls?.name ?? "",
        classRoom: cls?.room ?? "",
        subject: cls?.subject ?? "",
      };
    })
  );

  // Resolve class info for upcoming exams
  const upcomingExamsDisplay = await Promise.all(
    upcomingExams.slice(0, 5).map(async (exam) => {
      const cls = await getClassById(exam.classId);
      return {
        id: exam.id,
        name: exam.name,
        date: exam.date,
        type: exam.type,
        className: cls?.name ?? "",
      };
    })
  );

  // Build recent grades display (get exam info)
  const recentGradesDisplay = await Promise.all(
    allGrades
      .filter((g) => g.score !== null && g.letterGrade !== null)
      .slice(0, 5)
      .map(async (grade) => {
        const cls = await getClassById(grade.classId);
        // We need the exam info - fetch it
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { data: exam } = await supabase
          .from("exams")
          .select("name, date, max_score")
          .eq("id", grade.examId)
          .single();

        return {
          id: grade.id,
          examName: exam?.name ?? "Exam",
          className: cls?.name ?? "",
          score: grade.score!,
          maxScore: (exam?.max_score as number) ?? 100,
          letterGrade: grade.letterGrade!,
          date: (exam?.date as string) ?? "",
        };
      })
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <DashboardGreeting
        studentName={getStudentFullName(student.firstName, student.lastName)}
      />
      <StatCards
        gpa={gpa}
        attendanceRate={attendanceRate}
        classCount={classes.length}
        upcomingExams={upcomingExams.length}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <TodaySchedule items={scheduleWithClasses} />
        <UpcomingExams exams={upcomingExamsDisplay} />
      </div>
      <RecentGrades grades={recentGradesDisplay} />
    </div>
  );
}
