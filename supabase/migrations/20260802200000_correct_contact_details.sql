-- Correct the temple's contact details to match gokuldham.org.
-- The seed data in the initial migration used placeholder values.

UPDATE public.site_settings SET value = '2397 Satellite Blvd NE, Buford, GA 30518' WHERE key = 'address';
UPDATE public.site_settings SET value = '(770) 492-4346'                            WHERE key = 'phone';
UPDATE public.site_settings SET value = 'shrinathjihaveliatlanta@gmail.com'         WHERE key = 'email';

-- Insert them if the rows are missing entirely.
INSERT INTO public.site_settings (key, value)
VALUES
  ('address', '2397 Satellite Blvd NE, Buford, GA 30518'),
  ('phone', '(770) 492-4346'),
  ('email', 'shrinathjihaveliatlanta@gmail.com')
ON CONFLICT (key) DO NOTHING;
