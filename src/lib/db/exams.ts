import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/lib/types";
import { getCurrentStudent } from "./student";

function mapRow(row: Record<string, unknown>): Exam {
  return {
    id: row.id as string,
    classId: row.class_id as string,
    name: row.name as string,
    date: row.date as string,
    maxScore: row.max_score as number,
    type: row.type as Exam["type"],
    isPublished: row.is_published as boolean,
  };
}

export async function getMyExams(): Promise<Exam[]> {
  const student = await getCurrentStudent();
  if (!student || student.classIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .in("class_id", student.classIds)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getMyExamsByClass(classId: string): Promise<Exam[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("class_id", classId)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getUpcomingExams(): Promise<Exam[]> {
  const student = await getCurrentStudent();
  if (!student || student.classIds.length === 0) return [];

  const today = new Date().toISOString().split("T")[0];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .in("class_id", student.classIds)
    .gte("date", today)
    .order("date");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
