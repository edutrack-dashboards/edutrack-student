import { createClient } from "@/lib/supabase/server";
import type { AttendanceRecord } from "@/lib/types";
import { getCurrentStudent } from "./student";

function mapRow(row: Record<string, unknown>): AttendanceRecord {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    classId: row.class_id as string,
    date: row.date as string,
    status: row.status as AttendanceRecord["status"],
    note: (row.note as string) ?? undefined,
  };
}

export async function getMyAttendance(): Promise<AttendanceRecord[]> {
  const student = await getCurrentStudent();
  if (!student) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", student.id)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getMyAttendanceByClass(classId: string): Promise<AttendanceRecord[]> {
  const student = await getCurrentStudent();
  if (!student) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", student.id)
    .eq("class_id", classId)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getMyAttendanceRate(): Promise<number> {
  const records = await getMyAttendance();
  if (records.length === 0) return 100;
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  return Math.round((present / records.length) * 100);
}

export async function getMyAttendanceRateByClass(classId: string): Promise<number> {
  const records = await getMyAttendanceByClass(classId);
  if (records.length === 0) return 100;
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  return Math.round((present / records.length) * 100);
}
