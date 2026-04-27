# CLAUDE.md — Focus Flow Project Brief

> 


## 🎯 Kontekst projektu

Buduję **Work Focus Flow** — aplikację webową generującą spersonalizowane playlisty do pracy/nauki/relaksu, inspirowaną Brain.fm, ale z własnym twistem: **AI dobiera ścieżki na podstawie krótkiej ankiety o samopoczuciu, rodzaju pracy i preferencjach użytkownika**.

**Co to jest dla mnie:** projekt portfolio dla juniora frontendowego (React + TypeScript). Miesiąc pracy. Cel — pokazać w portfolio zaawansowane UI, animacje, dopracowany design i integrację z AI API.

**Co NIE jest celem:**
- Nie buduję produkcyjnego SaaS — to projekt portfolio
- Nie piszę backendu od zera (MVP: localStorage + ewentualnie proste API routes w Next.js)
- Nie wspieram płatności, nie zarządzam kontami użytkowników

**Muzyka:** będę ją generował w **Suno AI** — własna biblioteka MP3 (bez copyrightów), każda ścieżka otagowana moodem/tempem/kategorią, hostowana statycznie (lub w Supabase Storage / Cloudinary).

---

## 🎨 Design direction (TO JEST KLUCZOWE)

**Estetyka:** *dark, focusowa, kinowa* — czerń jako tło, glow/neon jako akcent, subtelna gradacja i depth zamiast flat design. Inspiracje:
- Brain.fm (dark theme — pierwsza grafika w moim briefie)
- Linear.app (precyzja, płynność)
- Arc Browser (glow, mikrointerakcje)
- Apple Music „Now Playing" na macOS

**Paleta (propozycja — zweryfikuj ze mną zanim zaczniesz kodować):**
```
--bg-void:        #0A0A0F    (dominujące tło)
--bg-elevated:    #14141C    (karty, kontenery)
--glow-primary:   #7C5CFF    (focus mode — fiolet)
--glow-relax:     #5CFFD4    (relax mode — mint)
--glow-sleep:     #5C8BFF    (sleep mode — blue)
--glow-meditate:  #FF8F5C    (meditate mode — warm orange)
--text-primary:   #F0F0F5
--text-muted:     #7A7A8C
--border-subtle:  rgba(255,255,255,0.06)
```

Glow = `box-shadow` z kolorowym blur + `filter: drop-shadow` na kluczowych elementach. Nie wszystko ma świecić — glow używamy OSZCZĘDNIE, na elementach aktywnych/hover/focus.

**Typografia:**
- Display (nagłówki, branding): **Instrument Serif** lub **Fraunces** (serif, kinowy feel)
- Body/UI: **Geist** lub **Satoshi** (nie używamy Inter — jest zbyt generyczny)
- Mono (timery, metadane): **JetBrains Mono** lub **Geist Mono**

**Ruch / animacje:**
- Wszystkie tranzycje przez **Framer Motion** (aliased as `motion/react`)
- `Lenis` dla smooth scroll
- Audio visualizer: Canvas API + `requestAnimationFrame` (reaguje na Web Audio API `AnalyserNode`)
- Page transitions między sekcjami (ankieta → generacja → player)
- Mikrointerakcje na KAŻDYM przycisku — hover zmiana glow, tap scale 0.97

---

## 🧱 Stack techniczny

```
Framework:      Next.js 15 (App Router) + TypeScript (strict mode)
Styling:        Tailwind CSS 4 + CSS variables
Animacje:       Framer Motion (motion/react)
Smooth scroll:  Lenis
Audio:          Web Audio API (natywne, bez bibliotek)
Visualizer:     Canvas 2D API
State:          Zustand (globalny stan playera i preferencji)
UI prymity:     shadcn/ui (tylko jako baza — wszystko re-stylujemy)
Icons:          lucide-react
Fonts:          next/font/google + next/font/local
AI:             Anthropic API (Claude) — do doboru playlisty
Storage MP3:    Supabase Storage lub Cloudinary (zdecyduję w trakcie)
Persistencja:   localStorage (ankieta, preferencje, ostatnie sesje)
Deploy:         Vercel
```

**Czego NIE używamy:**
- Redux (zbyt ciężki dla tego projektu)
- Material UI / Ant Design (zabijają autorski design)
- Bootstrap (jw.)
- jQuery (lol)
- CSS-in-JS w stylu styled-components (Tailwind + CSS vars wystarczy)

---

## 📱 Struktura aplikacji (user flow)

```
1. LANDING            → hero z animowanym visualizerem w tle, CTA "Start session"
2. ONBOARDING ANKIETA → 4-6 pytań, jedno na ekran, z płynnymi tranzycjami
                        - Jak się dzisiaj czujesz? (slider: exhausted ←→ energetic)
                        - Co chcesz robić? (Focus / Relax / Sleep / Meditate)
                        - Typ pracy (deep work / creative / admin / learning)
                        - Preferowany klimat (ambient / electronic / acoustic / nature)
                        - Czas sesji (25 / 50 / 90 min / własny)
3. GENERACJA          → loading screen z animacją, Claude API dobiera playlistę
                        z bazy otagowanych MP3-ek
4. PLAYER             → głównym widokiem jest AUDIO VISUALIZER
                        - duży, centralny, reaktywny
                        - pod spodem: nazwa ścieżki, czas, kontrolki
                        - boczny panel: nadchodzące utwory z playlisty
                        - ambient glow w kolorze moodu
5. HISTORIA/SESJE     → lista poprzednich sesji z localStorage (nice-to-have)
```

---

## 🗂️ Proponowana struktura folderów

```
focus-flow/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # landing
│   ├── onboarding/
│   │   └── page.tsx              # ankieta
│   ├── session/
│   │   └── page.tsx              # player
│   ├── api/
│   │   └── generate-playlist/
│   │       └── route.ts          # endpoint dla Claude API
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn bazowe
│   ├── visualizer/
│   │   ├── AudioVisualizer.tsx   # canvas + Web Audio
│   │   └── visualizerPresets.ts  # różne style per mood
│   ├── player/
│   │   ├── Player.tsx
│   │   ├── PlayerControls.tsx
│   │   ├── PlayerProgress.tsx
│   │   └── PlaylistQueue.tsx
│   ├── onboarding/
│   │   ├── SurveyQuestion.tsx
│   │   ├── MoodSlider.tsx
│   │   └── PreferenceCards.tsx
│   └── shared/
│       ├── GlowButton.tsx
│       ├── GlowCard.tsx
│       └── AnimatedBackground.tsx
├── lib/
│   ├── audio/
│   │   ├── useAudioPlayer.ts     # custom hook
│   │   └── useAudioAnalyser.ts   # hook dla Web Audio API
│   ├── ai/
│   │   └── generatePlaylist.ts   # logika wywołania Claude
│   ├── tracks/
│   │   ├── database.ts           # lista ścieżek + metadane
│   │   └── types.ts
│   └── utils.ts
├── store/
│   └── usePlayerStore.ts         # Zustand
├── types/
│   └── index.ts
├── public/
│   └── tracks/                   # MP3-ki z Suno (lub URLe do hostingu)
└── CLAUDE.md                     # ten plik
```

---

## 🎵 Model danych — ścieżka muzyczna

```typescript
type Track = {
  id: string;
  title: string;
  url: string;              // URL do MP3 (Supabase/Cloudinary/static)
  duration: number;         // sekundy
  tags: {
    mood: ('focus' | 'relax' | 'sleep' | 'meditate')[];
    tempo: 'slow' | 'medium' | 'fast';
    intensity: 1 | 2 | 3 | 4 | 5;
    vibe: ('ambient' | 'electronic' | 'acoustic' | 'nature' | 'lofi')[];
    workType?: ('deep' | 'creative' | 'admin' | 'learning')[];
  };
  colorHint?: string;       // dominujący kolor dla visualizera
};
```

Planuję ~40-60 ścieżek w MVP, generowanych w Suno, otagowanych ręcznie.

---

## 🤖 Rola Claude (AI) w aplikacji

Po wypełnieniu ankiety, wysyłam do Claude:
1. Odpowiedzi użytkownika z ankiety
2. Całą bibliotekę ścieżek (tylko metadane — id + tags, bez URLi)
3. Prompt: "Wybierz 8-12 ścieżek w kolejności tworzącej dobrą krzywą energii dla tej sesji. Zwróć JSON z id-kami i uzasadnieniem."

Claude zwraca listę ID-ków + krótki opis ("Zacząłem spokojnie, żeby wejść w flow, stopniowo rośnie intensywność..."). To pokazuję użytkownikowi na ekranie generacji.

**Ważne:** endpoint do Claude robię w `app/api/generate-playlist/route.ts`, klucz API w `.env.local`, NIE wystawiam klucza w kliencie.

---

## 📋 Roadmapa (4 tygodnie)

### Tydzień 1 — Fundament + Landing
- [ ] Setup Next.js + TS strict + Tailwind + ESLint + Prettier
- [ ] Konfiguracja fontów, design tokenów (CSS vars), globalnych styli
- [ ] Zbudowanie 3-4 reusable komponentów: GlowButton, GlowCard, AnimatedBackground
- [ ] Landing page z hero, animowanym tłem, CTA
- [ ] Responsywność (mobile first, ale player będzie głównie desktop)
- [ ] Deploy na Vercel

### Tydzień 2 — Ankieta + Flow
- [ ] Zbudowanie komponentów ankiety (slider moodu, karty wyboru)
- [ ] Animowane tranzycje między pytaniami (Framer Motion `AnimatePresence`)
- [ ] Zustand store dla danych ankiety
- [ ] Walidacja, progress indicator
- [ ] Ekran "generowania" z efektownym loadingiem

### Tydzień 3 — Player + Visualizer (SERCE APLIKACJI)
- [ ] Custom hook `useAudioPlayer` (play/pause/skip/progress)
- [ ] Custom hook `useAudioAnalyser` (FFT z Web Audio API)
- [ ] Canvas-owy visualizer — zacznę od 1 stylu, dodam kolejne jak zdążę
- [ ] Komponenty playera (kontrolki, progress, kolejka)
- [ ] Integracja z bazą ścieżek
- [ ] Zarządzanie stanem audio przez Zustand

### Tydzień 4 — AI + polerowanie
- [ ] Integracja Anthropic API w route handler
- [ ] Prompt engineering — testowanie różnych scenariuszy
- [ ] Upload ścieżek z Suno do Supabase Storage
- [ ] Historia sesji w localStorage
- [ ] Polish: loading states, error boundaries, 404, empty states
- [ ] Accessibility audit (Lighthouse, keyboard nav, aria)
- [ ] README na GitHub (z gif-ami!) + case study na portfolio
- [ ] Video demo na LinkedIn

---

## ✅ Definition of Done dla projektu portfolio

Projekt uznaję za "ready to show" gdy:
- [ ] Działa na produkcji (Vercel) bez błędów w konsoli
- [ ] Lighthouse score: Performance 90+, Accessibility 95+, Best Practices 95+
- [ ] Zero ostrzeżeń TypeScript w `tsc --noEmit` (strict mode)
- [ ] Żadnych `any` w kodzie (chyba że z komentarzem dlaczego)
- [ ] Działa i wygląda dobrze na: Chrome desktop, Safari desktop, iOS Safari, Chrome Android
- [ ] README zawiera: opis, tech stack, decyzje projektowe, screenshots/gify, link do live, "co bym zrobił inaczej"
- [ ] Commity są atomowe, wiadomości po angielsku, conventional commits (feat/fix/chore)
- [ ] Jest video demo (30-60s) pokazujące kluczowe flow

---

## 🙋 Zasady współpracy ze mną

1. **Zanim zaczniesz pisać dużo kodu** — potwierdź plan w 2-3 zdaniach i zapytaj o ewentualne niejasności. Nie lubię jak AI wali 500 linii kodu bez uzgodnienia kierunku.

2. **Małe kroki** — preferuję pracować sekcja po sekcji. Nie generuj całej aplikacji naraz. Skończ jeden komponent, pokażmy go, zanim przejdziemy dalej.

3. **TypeScript strict, żadnych skrótów** — jak coś jest niejasne typowo, to pytaj. Nie stawiaj `any` ani `@ts-ignore`.

4. **Tłumacz decyzje** — jeśli wybierasz konkretną bibliotekę / pattern / strukturę, napisz w 1 zdaniu DLACZEGO. Uczę się na tym projekcie.

5. **Komentarze — minimum, ale tam gdzie potrzebne** — komentuj TYLKO rzeczy nieoczywiste ("dlaczego", nie "co"). Czysty kod dokumentuje się sam.

6. **Nie przesadzaj z abstrakcjami** — to projekt portfolio, nie enterprise. Nie buduj fabryk ani adapterów dla 3-liniowego kodu.

7. **Gdy piszę "zrób krok X"** — pracuj tylko nad tym krokiem. Nie rozrastaj się na sąsiednie.

8. **Jak coś nie wiem, to pytaj mnie** — nie zgaduj np. jakie mam upodobania muzyczne, jakie kolory lubię, czy chcę daną funkcję. Zadaj 1-2 pytania i poczekaj na odpowiedź.

---

## 🚀 Pierwsze kroki — co chcę usłyszeć od Ciebie TERAZ

Na start proszę o:

1. **Krótkie (5-10 zdań) podsumowanie**, czy rozumiesz projekt i wizję, oraz czy masz jakieś wątpliwości/pytania zanim zaczniemy.

2. **Zaproponuj 2-3 konkretne "design tokeny"** (kolory glow, font pair) które rekomendujesz — z krótkim uzasadnieniem. Moja paleta powyżej to propozycja, ale jestem otwarty.

3. **Zaproponuj plan pierwszego dnia pracy** (maksymalnie 3-4 taski na pierwszą sesję, którą zrobimy wspólnie).

**NIE pisz jeszcze żadnego kodu.** Najpierw uzgodnijmy wizję.

---

*Wersja briefu: 1.0 — utworzono na starcie projektu*
