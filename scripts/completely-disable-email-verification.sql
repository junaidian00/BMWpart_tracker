-- Completely disable email verification and fix all auth issues

-- First, update all existing users to be confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Make sure all users are properly set up
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW());

-- Create a more robust profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Always create a profile, even if some data is missing
  INSERT INTO public.profiles (id, email, full_name, phone, location, seller_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'location', 'Not specified'),
    COALESCE(NEW.raw_user_meta_data->>'seller_type', 'individual')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    location = COALESCE(EXCLUDED.location, profiles.location),
    seller_type = COALESCE(EXCLUDED.seller_type, profiles.seller_type),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail
    RAISE LOG 'Profile creation error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create trigger for updates (in case user data changes)
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Make RLS policies very permissive for development
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

-- Create permissive policies
CREATE POLICY "profiles_all_access" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Same for vehicles
DROP POLICY IF EXISTS "vehicles_select_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_insert_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_update_policy" ON vehicles;
DROP POLICY IF EXISTS "vehicles_delete_policy" ON vehicles;

CREATE POLICY "vehicles_all_access" ON vehicles FOR ALL USING (true) WITH CHECK (true);

-- Same for maintenance records
DROP POLICY IF EXISTS "maintenance_records_select_policy" ON maintenance_records;
DROP POLICY IF EXISTS "maintenance_records_insert_policy" ON maintenance_records;
DROP POLICY IF EXISTS "maintenance_records_update_policy" ON maintenance_records;
DROP POLICY IF EXISTS "maintenance_records_delete_policy" ON maintenance_records;

CREATE POLICY "maintenance_records_all_access" ON maintenance_records FOR ALL USING (true) WITH CHECK (true);

-- Same for maintenance reminders
DROP POLICY IF EXISTS "maintenance_reminders_select_policy" ON maintenance_reminders;
DROP POLICY IF EXISTS "maintenance_reminders_insert_policy" ON maintenance_reminders;
DROP POLICY IF EXISTS "maintenance_reminders_update_policy" ON maintenance_reminders;
DROP POLICY IF EXISTS "maintenance_reminders_delete_policy" ON maintenance_reminders;

CREATE POLICY "maintenance_reminders_all_access" ON maintenance_reminders FOR ALL USING (true) WITH CHECK (true);

-- Grant all permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Ensure storage permissions
CREATE POLICY "maintenance_receipts_all_access" ON storage.objects FOR ALL USING (bucket_id = 'maintenance-receipts') WITH CHECK (bucket_id = 'maintenance-receipts');
