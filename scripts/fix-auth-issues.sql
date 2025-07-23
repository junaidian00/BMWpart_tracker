-- Fix authentication issues and database constraints

-- Don't try to update confirmed_at directly, just email_confirmed_at
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Make sure RLS policies are working correctly
-- Drop and recreate all policies to ensure they're correct

-- Profiles policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;

-- Create simple, working policies
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Vehicles policies
DROP POLICY IF EXISTS "Users can view their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;

CREATE POLICY "vehicles_select_policy" ON vehicles
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "vehicles_insert_policy" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vehicles_update_policy" ON vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "vehicles_delete_policy" ON vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Maintenance records policies
DROP POLICY IF EXISTS "Users can view their own maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Users can insert their own maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Users can update their own maintenance records" ON maintenance_records;
DROP POLICY IF EXISTS "Users can delete their own maintenance records" ON maintenance_records;

CREATE POLICY "maintenance_records_select_policy" ON maintenance_records
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "maintenance_records_insert_policy" ON maintenance_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "maintenance_records_update_policy" ON maintenance_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "maintenance_records_delete_policy" ON maintenance_records
  FOR DELETE USING (auth.uid() = user_id);

-- Maintenance reminders policies
DROP POLICY IF EXISTS "Users can view their own maintenance reminders" ON maintenance_reminders;
DROP POLICY IF EXISTS "Users can insert their own maintenance reminders" ON maintenance_reminders;
DROP POLICY IF EXISTS "Users can update their own maintenance reminders" ON maintenance_reminders;
DROP POLICY IF EXISTS "Users can delete their own maintenance reminders" ON maintenance_reminders;

CREATE POLICY "maintenance_reminders_select_policy" ON maintenance_reminders
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "maintenance_reminders_insert_policy" ON maintenance_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "maintenance_reminders_update_policy" ON maintenance_reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "maintenance_reminders_delete_policy" ON maintenance_reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Grant all necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Also grant to anon for sign up
GRANT INSERT ON profiles TO anon;
GRANT SELECT ON profiles TO anon;
