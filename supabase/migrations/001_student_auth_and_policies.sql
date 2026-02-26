-- ================================================
-- Add auth_id to students table for student login
-- ================================================

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_students_auth_id ON students(auth_id);

-- ================================================
-- Helper functions (SECURITY DEFINER bypasses RLS
-- to avoid infinite recursion between policies)
-- ================================================

CREATE OR REPLACE FUNCTION get_my_student_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT id FROM students WHERE auth_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION get_my_class_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT cs.class_id FROM class_students cs
  WHERE cs.student_id = (SELECT id FROM students WHERE auth_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION get_my_teacher_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT DISTINCT c.teacher_id
  FROM classes c
  JOIN class_students cs ON cs.class_id = c.id
  WHERE cs.student_id = (SELECT id FROM students WHERE auth_id = auth.uid())
$$;

-- ================================================
-- Signup helper functions (callable without auth)
-- ================================================

-- Check if an email was invited (safe: only returns exists + has_account)
CREATE OR REPLACE FUNCTION check_student_invitation(lookup_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'exists', true,
    'has_account', (auth_id IS NOT NULL)
  ) INTO result
  FROM students
  WHERE email = lower(lookup_email);

  IF result IS NULL THEN
    RETURN json_build_object('exists', false, 'has_account', false);
  END IF;

  RETURN result;
END;
$$;

-- Link auth account to student record after signup
CREATE OR REPLACE FUNCTION claim_student_record(student_email TEXT, user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE students
  SET auth_id = user_id
  WHERE email = lower(student_email)
    AND auth_id IS NULL;

  RETURN FOUND;
END;
$$;

-- ================================================
-- RLS policies for student access
-- ================================================

-- Students can read their own record (linked via auth_id)
CREATE POLICY "Students see own record"
  ON students FOR SELECT
  USING (auth_id = auth.uid());

-- Students can read their record by email during signup (before auth_id is set)
CREATE POLICY "Students can lookup own email"
  ON students FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Students can claim their record (set auth_id) during signup
CREATE POLICY "Students can claim own record"
  ON students FOR UPDATE
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) AND auth_id IS NULL)
  WITH CHECK (auth_id = auth.uid());

-- Class enrollments
CREATE POLICY "Students see own class enrollments"
  ON class_students FOR SELECT
  USING (student_id = get_my_student_id());

-- Classes
CREATE POLICY "Students see enrolled classes"
  ON classes FOR SELECT
  USING (id IN (SELECT get_my_class_ids()));

-- Teachers
CREATE POLICY "Students see teachers of their classes"
  ON teachers FOR SELECT
  USING (id IN (SELECT get_my_teacher_ids()));

-- Schedule
CREATE POLICY "Students see own schedule"
  ON schedule_items FOR SELECT
  USING (class_id IN (SELECT get_my_class_ids()));

-- Attendance
CREATE POLICY "Students see own attendance"
  ON attendance_records FOR SELECT
  USING (student_id = get_my_student_id());

-- Exams
CREATE POLICY "Students see exams for enrolled classes"
  ON exams FOR SELECT
  USING (class_id IN (SELECT get_my_class_ids()));

-- Grades (published only)
CREATE POLICY "Students see own published grades"
  ON grade_entries FOR SELECT
  USING (
    student_id = get_my_student_id()
    AND is_published = true
  );
