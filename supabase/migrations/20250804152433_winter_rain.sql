@@ .. @@
 -- Verify tables were created successfully
 SELECT 'Database setup completed successfully!' as status;
+
+-- Note: To disable email confirmation in Supabase:
+-- 1. Go to Authentication > Settings in your Supabase dashboard
+-- 2. Turn OFF "Enable email confirmations" 
+-- 3. Users can then sign up and login immediately without email verification