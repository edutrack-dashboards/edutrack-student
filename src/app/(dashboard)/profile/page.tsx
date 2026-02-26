import {
  getCurrentStudent,
  getStudentClasses,
  getMyAverageGrade,
  getMyAttendanceRate,
} from "@/lib/db";
import {
  getStudentFullName,
  getInitials,
  formatDate,
  calculateLetterGrade,
  getGradeColor,
} from "@/lib/utils";
import { signOut } from "@/app/actions/auth";
import {
  Mail,
  Phone,
  User,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  Calendar,
} from "lucide-react";

export default async function ProfilePage() {
  const student = await getCurrentStudent();

  if (!student) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-blue-900">Profile Not Available Yet</h2>
          <p className="mt-2 text-sm text-blue-700">
            Your student profile will be available once your school administrator completes your enrollment.
          </p>
        </div>
        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </form>
      </div>
    );
  }

  const [classes, gpa, attendanceRate] = await Promise.all([
    getStudentClasses(),
    getMyAverageGrade(),
    getMyAttendanceRate(),
  ]);

  const fullName = getStudentFullName(student.firstName, student.lastName);
  const initials = getInitials(student.firstName, student.lastName || student.firstName);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500">Grade {student.grade}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-gray-400" />
                {student.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gray-400" />
                Enrolled {formatDate(student.enrollmentDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
              <p className="text-sm text-gray-500">Enrolled Classes</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {gpa !== null ? (
                  <span>
                    {gpa}%{" "}
                    <span className={`text-base ${getGradeColor(calculateLetterGrade(gpa, 100))}`}>
                      ({calculateLetterGrade(gpa, 100)})
                    </span>
                  </span>
                ) : (
                  "N/A"
                )}
              </p>
              <p className="text-sm text-gray-500">Average Grade</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2">
              <ClipboardCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
              <p className="text-sm text-gray-500">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Parent/Guardian Info */}
      {student.parentName && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Parent/Guardian Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <User className="h-4 w-4 text-gray-400" />
              <span>{student.parentName}</span>
            </div>
            {student.parentEmail && (
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{student.parentEmail}</span>
              </div>
            )}
            {student.parentPhone && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{student.parentPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Classes */}
      {classes.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">My Classes</h3>
          <div className="divide-y divide-gray-100">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                  <p className="text-xs text-gray-500">
                    {cls.subject} &middot; {cls.teacherName}
                  </p>
                </div>
                <span className="text-xs text-gray-400">Room {cls.room}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign Out */}
      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
