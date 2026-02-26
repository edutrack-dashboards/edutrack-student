import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentStudent } from "@/lib/db";
import { getStudentFullName } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await getCurrentStudent();
  const studentName = student
    ? getStudentFullName(student.firstName, student.lastName)
    : "Student";

  return (
    <DashboardShell studentName={studentName}>
      {children}
    </DashboardShell>
  );
}
