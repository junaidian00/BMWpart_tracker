-- Disable email confirmation requirement
-- This allows users to sign up and immediately access the app

-- Update auth settings to disable email confirmation
-- Note: This would typically be done in the Supabase dashboard under Authentication > Settings
-- But we can handle it in the application code instead

-- For existing users who might be stuck in unconfirmed state, we can update them
-- (This is just for development/testing purposes)
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- The main changes will be in the application code to handle signup differently
