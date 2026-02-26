import { createClient } from "@/lib/supabase/server";
import type { ScheduleItem } from "@/lib/types";
import { getCurrentStudent } from "./student";

function mapRow(row: Record<string, unknown>): ScheduleItem {
  return {
    id: row.id as string,
    classId: row.class_id as string,
    period: row.period as number,
    startTime: (row.start_time as string).slice(0, 5),
    endTime: (row.end_time as string).slice(0, 5),
    dayOfWeek: row.day_of_week as number,
  };
}

export async function getMyScheduleForDay(dayOfWeek: number): Promise<ScheduleItem[]> {
  const student = await getCurrentStudent();
  if (!student || student.classIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedule_items")
    .select("*")
    .in("class_id", student.classIds)
    .eq("day_of_week", dayOfWeek)
    .order("period");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getMyTodaySchedule(): Promise<ScheduleItem[]> {
  const today = new Date().getDay();
  return getMyScheduleForDay(today);
}

export async function getMyWeekSchedule(): Promise<ScheduleItem[]> {
  const student = await getCurrentStudent();
  if (!student || student.classIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedule_items")
    .select("*")
    .in("class_id", student.classIds)
    .order("day_of_week")
    .order("period");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
