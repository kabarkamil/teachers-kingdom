# Teachers Kingdom

**Öğren. Öğret. Üret.** — *You can do it*

Almanca CEFR **A1** ve **A2** dil öğrenme platformu (Vite + React + TypeScript + Tailwind CSS + Supabase Cloud Sync).

## Özellikler
- **5 Temel Beceri (A1 & A2):** Kelime (Wortschatz), Dinleme (Hören), Okuma (Lesen), Yazma (Schreiben), Konuşma (Sprechen)
- **Etkileşimli Etkinlikler (A1 & A2):** Karaoke Stüdyosu, Sessiz Sinema, Arena, Quiz Merkezi, Sınav Bankası
- **Öğretim Araçları:** Sınıflarım, Ödevler, Öğretmen Stüdyosu
- **Çevrimdışı Öncelikli (Offline-First) Yerel + Bulut Senkronizasyonu:**
  - `localStorage` (`tk_stage1_progress_v1`, `tk_course_de_a2_progress_v1`) ve JSON yedekleme/içe aktarma her zaman çalışır.
  - Supabase ortam değişkenleri tanımlandığında e-posta oturumuyla cihazlar arası otomatik `pull` / `push` ve `updatedAt` + çift XP korumalı çakışma çözümü devreye girer.

## Yerel Geliştirme ve Derleme

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Bulut Senkronizasyonu Kurulumu (Supabase + Netlify)

1. [Supabase](https://supabase.com/) üzerinde ücretsiz bir proje oluşturun.
2. Supabase Dashboard → **SQL Editor** ekranında `supabase/schema.sql` dosyasını çalıştırarak `public.user_cloud_states` tablosunu ve Row Level Security (RLS) kurallarını oluşturun.
3. Supabase Dashboard → **Project Settings → API** bölümünden Project URL ve `anon public` anahtarını alın.
4. Yerel geliştirme için `.env.example` dosyasını `.env` olarak kopyalayıp değerleri doldurun; Netlify yayını için **Site Configuration → Environment Variables** altına şu iki değişkeni ekleyin:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
5. Ortam değişkenleri boş bırakılırsa uygulama hiçbir hata vermeden yerel (`localStorage`) modda çalışmaya devam eder.
