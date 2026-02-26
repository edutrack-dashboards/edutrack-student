import { getMyWeekSchedule, getClassById } from "@/lib/db";
import { ScheduleView } from "@/components/schedule/schedule-view";

export default async function SchedulePage() {
  const weekSchedule = await getMyWeekSchedule();

  // Resolve class info
  const scheduleWithClasses = await Promise.all(
    weekSchedule.map(async (item) => {
      const cls = await getClassById(item.classId);
      return {
        ...item,
        className: cls?.name ?? "",
        classRoom: cls?.room ?? "",
        subject: cls?.subject ?? "",
      };
    })
  );

  return (
    <div className="mx-auto max-w-6xl">
      <ScheduleView items={scheduleWithClasses} />
    </div>
  );
}
