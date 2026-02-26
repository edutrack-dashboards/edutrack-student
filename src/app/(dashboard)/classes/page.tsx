import { getStudentClasses } from "@/lib/db";
import { BookOpen, Users, MapPin } from "lucide-react";
import Link from "next/link";

export default async function ClassesPage() {
  const classes = await getStudentClasses();

  if (classes.length === 0) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
          <BookOpen className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">No classes enrolled</p>
          <p className="mt-1 text-sm text-gray-400">
            You haven&apos;t been enrolled in any classes yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Link
            key={cls.id}
            href={`/grades?class=${cls.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {cls.grade}
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600">
              {cls.name}
            </h3>
            <p className="mt-0.5 text-sm text-gray-500">{cls.subject}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {cls.studentCount} students
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Room {cls.room}
              </span>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500">
                Teacher: <span className="font-medium text-gray-700">{cls.teacherName}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
