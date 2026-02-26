import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentStudent } from "@/lib/db";
import { getStudentFullName } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const student = await getCurrentStudent();

  return (
    <DashboardShell studentName={getStudentFullName(student.firstName, student.lastName)}>
      {children}
    </DashboardShell>
  );
}
