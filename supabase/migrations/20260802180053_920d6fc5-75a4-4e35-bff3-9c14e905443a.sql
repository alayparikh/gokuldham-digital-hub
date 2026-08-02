-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Site settings
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Hero slides
CREATE TABLE public.hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_slides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hero public read" ON public.hero_slides FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "hero admin write" ON public.hero_slides FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Darshan timings
CREATE TABLE public.darshan_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  time_text TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'sun',
  note TEXT,
  days INT[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.darshan_times TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.darshan_times TO authenticated;
GRANT ALL ON public.darshan_times TO service_role;
ALTER TABLE public.darshan_times ENABLE ROW LEVEL SECURITY;
CREATE POLICY "darshan public read" ON public.darshan_times FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "darshan admin write" ON public.darshan_times FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Sponsor days
CREATE TABLE public.sponsor_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  vikram_samvat TEXT,
  gujarati_month TEXT,
  gujarati_paksh TEXT,
  gujarati_tithi TEXT,
  utsav TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sponsor_days TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sponsor_days TO authenticated;
GRANT ALL ON public.sponsor_days TO service_role;
ALTER TABLE public.sponsor_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sponsor_days public read" ON public.sponsor_days FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "sponsor_days admin write" ON public.sponsor_days FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.sponsor_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES public.sponsor_days(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  sponsor_name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.sponsor_entries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.sponsor_entries TO authenticated;
GRANT ALL ON public.sponsor_entries TO service_role;
ALTER TABLE public.sponsor_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sponsor_entries public read" ON public.sponsor_entries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "sponsor_entries admin write" ON public.sponsor_entries FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT,
  image_url TEXT,
  location TEXT DEFAULT 'Gokuldham Atlanta',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read" ON public.events FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "events admin read" ON public.events FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "events admin write" ON public.events FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  image_url TEXT,
  author TEXT DEFAULT 'Gokuldham Atlanta',
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog public read" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "blog admin read" ON public.blog_posts FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "blog admin write" ON public.blog_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER blog_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Media (bhajans, videos, live)
CREATE TABLE public.media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'video',
  youtube_id TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'Bhajan',
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_items TO authenticated;
GRANT ALL ON public.media_items TO service_role;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media public read" ON public.media_items FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "media admin write" ON public.media_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Gallery
CREATE TABLE public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  event_date DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_albums TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_albums TO authenticated;
GRANT ALL ON public.gallery_albums TO service_role;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "albums public read" ON public.gallery_albums FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "albums admin write" ON public.gallery_albums FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.gallery_photos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_photos TO authenticated;
GRANT ALL ON public.gallery_photos TO service_role;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photos public read" ON public.gallery_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "photos admin write" ON public.gallery_photos FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Donation categories
CREATE TABLE public.donation_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tab TEXT NOT NULL DEFAULT 'donation',
  description TEXT,
  image_url TEXT,
  suggested_amounts INT[] NOT NULL DEFAULT '{51,101,251,501,1101}',
  allow_recurring BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.donation_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.donation_categories TO authenticated;
GRANT ALL ON public.donation_categories TO service_role;
ALTER TABLE public.donation_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.donation_categories FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "categories admin write" ON public.donation_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Donations
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT,
  category_name TEXT,
  amount_cents INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  donor_name TEXT,
  donor_email TEXT,
  dedication TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_session_id TEXT,
  provider_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "donations admin read" ON public.donations FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "donations admin write" ON public.donations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER donations_updated BEFORE UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Contact messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact admin read" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "contact admin manage" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "contact admin delete" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- ===== Seed content =====
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'Gokuldham Haveli'),
  ('tagline_gu', 'મારું ગોકુલધામ, તારું ગોકુલધામ આપણું ગોકુલધામ'),
  ('location_label', 'ATLANTA, GA'),
  ('address', '3350 Bells Ferry Road, Marietta, GA 30066'),
  ('phone', '(770) 555-0143'),
  ('email', 'info@gokuldham.org'),
  ('youtube_channel_url', 'https://www.youtube.com/@gokuldhamatlanta'),
  ('youtube_live_video_id', ''),
  ('about_intro', 'Gokuldham Haveli is a Pushtimarg Vaishnav temple in Atlanta, Georgia, dedicated to the seva of Shri Gokulnathji. Founded by devotees who wished to carry the traditions of Shrimad Vallabhacharya Mahaprabhuji to the American South, the Haveli is a home for daily darshan, utsav celebration, satsang and community service.'),
  ('donation_intro', 'Every contribution, large or small, keeps our traditions alive and thriving. Donate today to be part of this sacred journey.');

INSERT INTO public.hero_slides (image_url, sort_order) VALUES
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/Mangala_Darshan_43a9f0457c.jpg', 1),
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/a9b54552_5a4a_4049_a1c0_0762c457c018_4d5084663b.jpeg', 2),
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/Whats_App_Image_2026_05_02_at_23_10_52_35833b8d26.jpeg', 3),
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/3ae7d83f_5c79_4e63_a318_93239cdc2117_ac2f616083.jpeg', 4),
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/fda640ae_314c_4621_a421_3fdc58aea1eb_5addc67cf8.jpeg', 5);

INSERT INTO public.darshan_times (label, time_text, icon, days, sort_order) VALUES
  ('Mangla', '7.30am - 8.30am', 'sun', '{0,1,2,3,4,5,6}', 1),
  ('Mangla Aarti', '8.15am', 'pray', '{0,1,2,3,4,5,6}', 2),
  ('Shringar (Sat-Sun)', '10.30am - 10.50am', 'crown', '{0,6}', 3),
  ('Rajbhog Darshan', '11.30am - 1.00pm', 'food', '{0,1,2,3,4,5,6}', 4),
  ('Rajbhog Aarti', '12.00pm', 'pray', '{0,1,2,3,4,5,6}', 5),
  ('MahaRaas', '5.00pm - 8.30pm', 'crown', '{0,1,2,3,4,5,6}', 6),
  ('Sandhya/Shayan', '5.30pm - 7.30pm', 'moon', '{0,1,2,3,4,5,6}', 7),
  ('Sandhya/Shayan Aarti', '7.30pm', 'pray', '{0,1,2,3,4,5,6}', 8),
  ('Yamunaji Aarti (Sunday Only)', '6.35pm', 'moon', '{0}', 9);

INSERT INTO public.sponsor_days (date, vikram_samvat, gujarati_month, gujarati_paksh, gujarati_tithi, utsav)
VALUES (CURRENT_DATE, '2083', 'અષાઢ', 'વદ', 'ચૌથ', 'Shri Gokulnathji Patotsav');

INSERT INTO public.sponsor_entries (day_id, category, sponsor_name, sort_order)
SELECT id, c.category, c.sponsor_name, c.sort_order FROM public.sponsor_days,
LATERAL (VALUES
  ('Mangal Bhog', 'Sanjanwala Family', 1),
  ('Pan Ni Seva', 'Sanjanwala Family', 2),
  ('Doodh Ni Seva', 'Chandraprabha Singh', 3),
  ('Rajbhog', 'Hansabahen Mansukhbhai Patel', 4),
  ('Rajbhog', 'Drashti Rajeshbhai Dodiya', 5),
  ('Shree Yamunaji Aarti Manorathi', 'Prakash Jivanlal Shah', 6),
  ('Shree Yamunaji Aarti Manorathi', 'Vipul & Latta Pankhaniya', 7),
  ('Shree Yamunaji Aarti Manorathi', 'Shah Sharmilya Pranay & Ganesh Rai Family', 8)
) AS c(category, sponsor_name, sort_order)
WHERE public.sponsor_days.date = CURRENT_DATE;

INSERT INTO public.events (slug, title, summary, body, image_url, starts_at) VALUES
  ('gokuldham-utsav', 'Gokuldham Haveli - List of Utsav''s / Events in the year 2026',
   'The full calendar of utsavs celebrated at Gokuldham Haveli through 2026.',
   'Gokuldham Haveli celebrates the complete Pushtimarg utsav calendar. Highlights through the year include Shri Gokulnathji Patotsav, Hindola, Janmashtami, Nandmahotsav, Annakut, Diwali, Holi and Shri Vallabhacharya Mahaprabhuji Prakatya Utsav. Contact the Haveli for the printed schedule and seva opportunities for each utsav.',
   'https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/PHOTO_2026_05_12_08_21_17_de1bc4dc28.jpg',
   now() + interval '10 days'),
  ('janmashtami', 'Shri Krishna Janmashtami', 'Midnight darshan, jhulan and mahaprasad celebrating the birth of Shri Krishna.',
   'Join the Haveli for Janmashtami with special shringar, bhajan and kirtan through the evening, midnight aarti and mahaprasad. Seva and manorath opportunities are available for the utsav.',
   'https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/Whats_App_Image_2026_05_02_at_23_10_50_34d31df8bd.jpeg',
   now() + interval '30 days'),
  ('annakut', 'Annakut Mahotsav', 'The grand offering of mountains of prasad to Shri Gokulnathji.',
   'Annakut is celebrated the day after Diwali with an elaborate offering of hundreds of prepared items to Shri Gokulnathji, followed by darshan and mahaprasad for the entire community.',
   'https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/Whats_App_Image_2026_05_02_at_23_10_52_1_27bef4c701.jpeg',
   now() + interval '90 days');

INSERT INTO public.blog_posts (slug, title, excerpt, body, image_url) VALUES
  ('philosophy', 'શ્રીમદ્ વલ્લભાચાર્યજીનો દાર્શનિક સિદ્ધાંત – શુદ્ધાદ્વૈત બ્રહ્મવાદ',
   'શ્રીમદ્ વલ્લભાચાર્ય મહાપ્રભુજી દ્વારા પ્રતિપાદિત દાર્શનિક સિદ્ધાંત “શુદ્ધાદ્વૈત બ્રહ્મવાદ” તરીકે પ્રસિદ્ધ છે.',
   'શ્રીમદ્ વલ્લભાચાર્ય મહાપ્રભુજી દ્વારા પ્રતિપાદિત દાર્શનિક સિદ્ધાંત “શુદ્ધાદ્વૈત બ્રહ્મવાદ” તરીકે પ્રસિદ્ધ છે. આ સિદ્ધાંત શ્રી શંકરાચાર્યના કેવલાદ્વૈત અને શ્રી રામાનુજાચાર્યના વિશિષ્ટાદ્વૈતથી અલગ અને અનોખો છે.

“શુદ્ધાદ્વૈત”નો અર્થ છે: બ્રહ્મ શુદ્ધ છે, જીવ શુદ્ધ છે, જગત પણ શુદ્ધ છે, અને આ બધું બ્રહ્મથી અભિન્ન છે.

શ્રી મહાપ્રભુજીના મત અનુસાર બ્રહ્મ, જીવ અને જગત માયિક કે મિથ્યા નથી, પરંતુ સત્ય અને પરમાત્મારૂપ છે. તેમણે વેદ, ભગવદ્ ગીતા, બ્રહ્મસૂત્ર અને શ્રીમદ્ ભાગવત — આ ચાર પ્રમાણોને સ્વીકાર્યા છે.

ભગવાન શ્રીકૃષ્ણ જ પૂર્ણ પુરુષોત્તમ પરબ્રહ્મ છે. જગત સત્ય છે, જીવ ભગવાનનો અંશ છે, અને ભક્તિ તથા સેવા જીવનનું પરમ લક્ષ્ય છે.',
   'https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/images_1_4149836192.jpg'),
  ('shree-yamunaji', 'શ્રી યમુનાજી – ભક્તિની પ્રવાહિની',
   'પુષ્ટિમાર્ગમાં શ્રી યમુનાજીનું સ્થાન અને તેમની કૃપાનું મહત્વ.',
   'પુષ્ટિમાર્ગમાં શ્રી યમુનાજી ભગવાન શ્રીકૃષ્ણની ચોથી પટરાણી અને ભક્તિની અધિષ્ઠાત્રી દેવી માનવામાં આવે છે. શ્રી મહાપ્રભુજીએ “શ્રી યમુનાષ્ટક” રચીને તેમની કૃપાનું વર્ણન કર્યું છે. ગોકુલધામમાં દર રવિવારે સાંજે શ્રી યમુનાજી આરતી કરવામાં આવે છે.',
   'https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/Mangala_Darshan_43a9f0457c.jpg'),
  ('shrivallabhmahaprabhuji', 'શ્રી વલ્લભાચાર્ય મહાપ્રભુજી',
   'પુષ્ટિમાર્ગના સંસ્થાપક શ્રી વલ્લભાચાર્યજીનું જીવન અને સંદેશ.',
   'શ્રી વલ્લભાચાર્ય મહાપ્રભુજીનું પ્રાગટ્ય વિ.સં. ૧૫૩૫માં ચંપારણ્યમાં થયું. તેમણે ભારતભરમાં ત્રણ પૃથ્વી પરિક્રમા કરી અને શ્રીમદ્ ભાગવતનો પ્રચાર કર્યો. તેમણે પુષ્ટિમાર્ગની સ્થાપના કરી, જેમાં સેવા અને ભગવદ્ કૃપાને મુક્તિનું સાધન માનવામાં આવે છે.',
   'https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/a9b54552_5a4a_4049_a1c0_0762c457c018_4d5084663b.jpeg');

INSERT INTO public.donation_categories (slug, name, tab, description, image_url, suggested_amounts, sort_order) VALUES
  ('general-donation', 'General Donation', 'donation', 'Your contribution helps preserve the spiritual and community mission of Gokuldham Temple.', 'https://gokuldham.org/asset/Hero/1.avif', '{51,101,251,501,1101}', 1),
  ('whole-day-seva', 'Whole Day Seva + Sevaki', 'seva', 'Contribute to Nitya Seva and Annakoot celebrations, ensuring daily offerings are performed with devotion.', 'https://gokuldham.org/asset/Hero/2.avif', '{251,501,1001,2101}', 2),
  ('support-programs', 'Support Programs', 'donation', 'Help fund educational, youth, and social initiatives that carry our values forward.', 'https://gokuldham.org/asset/Hero/3.avif', '{51,101,251,501}', 3),
  ('haveli-building', 'Haveli Building', 'donation', 'Support the construction of essential spaces like the Haveli, Prasad Ghar, and ritual areas.', 'https://gokuldham.org/asset/Hero/4.avif', '{501,1001,2501,5100}', 4),
  ('mangal-bhog', 'Mangal Bhog Seva', 'seva', 'Sponsor the morning bhog offered to Shri Gokulnathji.', NULL, '{51,101,251}', 5),
  ('rajbhog', 'Rajbhog Seva', 'seva', 'Sponsor the midday Rajbhog offering and aarti.', NULL, '{101,251,501}', 6),
  ('yamunaji-aarti', 'Shree Yamunaji Aarti Manorath', 'seva', 'Become a manorathi for the Sunday evening Shree Yamunaji Aarti.', NULL, '{51,101,251}', 7);

INSERT INTO public.media_items (title, media_type, youtube_id, category, sort_order) VALUES
  ('Shri Yamunashtak', 'video', 'M7lc1UVf-VE', 'Bhajan', 1),
  ('Mangla Aarti Darshan', 'video', 'M7lc1UVf-VE', 'Darshan', 2),
  ('Vallabhakhyan Kirtan', 'video', 'M7lc1UVf-VE', 'Kirtan', 3);

INSERT INTO public.gallery_albums (slug, title, description, cover_url, event_date) VALUES
  ('mangala-darshan', 'Mangala Darshan', 'Morning darshan of Shri Gokulnathji.', 'https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/Mangala_Darshan_43a9f0457c.jpg', CURRENT_DATE),
  ('haveli-utsav', 'Haveli Utsav', 'Moments from recent utsav celebrations at the Haveli.', 'https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/PHOTO_2026_05_12_08_21_17_de1bc4dc28.jpg', CURRENT_DATE);

INSERT INTO public.gallery_photos (album_id, image_url, sort_order)
SELECT a.id, p.url, p.sort FROM public.gallery_albums a,
LATERAL (VALUES
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/Mangala_Darshan_43a9f0457c.jpg', 1),
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/a9b54552_5a4a_4049_a1c0_0762c457c018_4d5084663b.jpeg', 2),
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/Whats_App_Image_2026_05_02_at_23_10_52_35833b8d26.jpeg', 3),
  ('https://gdhpvsstrapiuploads.blob.core.windows.net/gd-strapi-uploads/assets/3ae7d83f_5c79_4e63_a318_93239cdc2117_ac2f616083.jpeg', 4)
) AS p(url, sort)
WHERE a.slug = 'mangala-darshan';