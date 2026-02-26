import {
  getMyAttendance,
  getMyAttendanceRate,
  getStudentClasses,
  getClassById,
} from "@/lib/db";
import { AttendanceView } from "@/components/attendance/attendance-view";

export default async function AttendancePage() {
  const [records, overallRate, classes] = await Promise.all([
    getMyAttendance(),
    getMyAttendanceRate(),
    getStudentClasses(),
  ]);

  // Attach class names to records
  const recordsWithClass = await Promise.all(
    records.map(async (record) => {
      const cls = await getClassById(record.classId);
      return {
        ...record,
        className: cls?.name ?? "Unknown",
      };
    })
  );

  // Calculate per-class rates
  const classRates = classes.map((cls) => {
    const classRecords = records.filter((r) => r.classId === cls.id);
    const total = classRecords.length;
    const present = classRecords.filter(
      (r) => r.status === "present" || r.status === "late"
    ).length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 100;
    return {
      classId: cls.id,
      className: cls.name,
      rate,
      total,
      present: classRecords.filter((r) => r.status === "present").length,
      absent: classRecords.filter((r) => r.status === "absent").length,
      late: classRecords.filter((r) => r.status === "late").length,
      excused: classRecords.filter((r) => r.status === "excused").length,
    };
  });

  // Attendance summary
  const summary = {
    total: records.length,
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    excused: records.filter((r) => r.status === "excused").length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AttendanceView
        records={recordsWithClass}
        overallRate={overallRate}
        classRates={classRates}
        summary={summary}
      />
    </div>
  );
}
