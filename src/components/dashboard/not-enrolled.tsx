import { BookOpen, Clock, UserCheck } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export function NotEnrolled() {
  return (
    <div className="mx-auto max-w-lg py-12">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <BookOpen className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-blue-900">
          Welcome to EduTrack!
        </h2>
        <p className="mt-2 text-sm text-blue-700">
          Your account has been created, but you haven&apos;t been enrolled in
          any classes yet. Your school administrator will set up your profile
          and assign you to classes.
        </p>

        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-start gap-3 rounded-lg bg-white/60 p-3">
            <UserCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-900">Account verified</p>
              <p className="text-xs text-blue-600">You&apos;re signed in successfully</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-white/60 p-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-blue-900">Awaiting enrollment</p>
              <p className="text-xs text-blue-600">
                Contact your school administrator if this takes too long
              </p>
            </div>
          </div>
        </div>
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
