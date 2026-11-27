import type { ActiveCourseId, NavRouteId, UiLanguage } from '../types';

export interface ParsedAppLocation {
  route: NavRouteId;
  /** Explicit course segment from URL (/a1/... or /a2/...), or null when omitted */
  explicitCourse: ActiveCourseId | null;
  /** Effective course resolved from URL or fallback activeCourse */
  course: ActiveCourseId;
  /** Optional deep-link topic/scenario/track identifier */
  targetId?: string;
  /** True when the incoming URL was unrecognized or non-canonical and should be normalized */
  needsCanonicalReplace: boolean;
}

export const COURSE_SCOPED_ROUTES: ReadonlySet<NavRouteId> = new Set<NavRouteId>([
  'kelime',
  'dinleme',
  'okuma',
  'yazma',
  'konusma',
  'karaoke',
  'sessiz-sinema',
  'arena',
  'quiz-merkezi',
  'sinav-modu',
]);

export const COURSE_AGNOSTIC_ROUTES: ReadonlySet<NavRouteId> = new Set<NavRouteId>([
  'siniflarim',
  'odevler',
  'ogretmen-studyosu',
  'ogrenme-yolum',
  'profil',
  'ayarlar',
]);

const ALL_VALID_ROUTES: ReadonlySet<string> = new Set<NavRouteId>([
  'home',
  ...COURSE_SCOPED_ROUTES,
  ...COURSE_AGNOSTIC_ROUTES,
]);

const ROUTE_TITLES: Record<NavRouteId, { tr: string; en: string }> = {
  home: { tr: 'Ana Sayfa', en: 'Home' },
  kelime: { tr: 'Kelime', en: 'Vocabulary' },
  dinleme: { tr: 'Dinleme', en: 'Listening' },
  okuma: { tr: 'Okuma', en: 'Reading' },
  yazma: { tr: 'Yazma', en: 'Writing' },
  konusma: { tr: 'Konuşma', en: 'Speaking' },
  karaoke: { tr: 'Karaoke Stüdyosu', en: 'Karaoke Studio' },
  'sessiz-sinema': { tr: 'Sessiz Sinema', en: 'Charades' },
  arena: { tr: 'Arena', en: 'Arena' },
  'quiz-merkezi': { tr: 'Quiz Merkezi', en: 'Quiz Center' },
  'sinav-modu': { tr: 'Sınav Modu', en: 'Exam Mode' },
  siniflarim: { tr: 'Sınıflarım', en: 'My Classes' },
  odevler: { tr: 'Ödevler', en: 'Assignments' },
  'ogretmen-studyosu': { tr: 'Öğretmen Stüdyosu', en: 'Teacher Studio' },
  'ogrenme-yolum': { tr: 'Öğrenme Yolum', en: 'Learning Path' },
  profil: { tr: 'Profil', en: 'Profile' },
  ayarlar: { tr: 'Ayarlar', en: 'Settings' },
};

function courseToSegment(course: ActiveCourseId): 'a1' | 'a2' {
  return course === 'de-A2' ? 'a2' : 'a1';
}

function segmentToCourse(segment: string): ActiveCourseId | null {
  const lower = segment.toLowerCase();
  if (lower === 'a1' || lower === 'de-a1') return 'de-A1';
  if (lower === 'a2' || lower === 'de-a2') return 'de-A2';
  return null;
}

function sanitizeTargetParam(raw: string | null): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim().slice(0, 80);
  if (!trimmed || !/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

/**
 * Builds the canonical shareable URL path (+ optional query string) for any module route.
 */
export function buildAppUrl(
  route: NavRouteId,
  course: ActiveCourseId,
  targetId?: string
): string {
  const cleanTarget = sanitizeTargetParam(targetId ?? null);

  if (route === 'home') {
    return course === 'de-A2' ? '/a2' : '/';
  }

  let pathname: string;
  if (COURSE_SCOPED_ROUTES.has(route)) {
    pathname = `/${courseToSegment(course)}/${route}`;
  } else {
    pathname = `/${route}`;
  }

  if (cleanTarget && COURSE_SCOPED_ROUTES.has(route)) {
    return `${pathname}?target=${encodeURIComponent(cleanTarget)}`;
  }

  return pathname;
}

/**
 * Parses window.location pathname + search into a strictly validated app route,
 * CEFR level, and optional deep-link target identifier.
 */
export function parseAppLocation(
  pathname: string,
  search: string,
  fallbackCourse: ActiveCourseId
): ParsedAppLocation {
  const rawSegments = pathname
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);

  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const targetId =
    sanitizeTargetParam(params.get('target')) ??
    sanitizeTargetParam(params.get('topic')) ??
    sanitizeTargetParam(params.get('scenario')) ??
    sanitizeTargetParam(params.get('track'));

  // Root path "/"
  if (rawSegments.length === 0) {
    return {
      route: 'home',
      explicitCourse: null,
      course: fallbackCourse,
      needsCanonicalReplace: false,
    };
  }

  let explicitCourse: ActiveCourseId | null = null;
  let routeSegment: string | undefined;

  const firstAsCourse = segmentToCourse(rawSegments[0]);
  if (firstAsCourse) {
    explicitCourse = firstAsCourse;
    routeSegment = rawSegments[1]?.toLowerCase();
  } else {
    routeSegment = rawSegments[0]?.toLowerCase();
  }

  const course: ActiveCourseId = explicitCourse ?? fallbackCourse;

  // "/a1" or "/a2" or "/home"
  if (!routeSegment || routeSegment === 'home') {
    const canonical = buildAppUrl('home', course);
    const currentNormalized = `${pathname.replace(/\/+$/, '') || '/'}`;
    return {
      route: 'home',
      explicitCourse,
      course,
      needsCanonicalReplace: currentNormalized !== canonical || Boolean(search),
    };
  }

  if (ALL_VALID_ROUTES.has(routeSegment)) {
    const route = routeSegment as NavRouteId;
    const canonical = buildAppUrl(route, course, targetId);
    const currentFull = `${pathname.replace(/\/+$/, '') || '/'}${search}`;
    return {
      route,
      explicitCourse,
      course,
      targetId: COURSE_SCOPED_ROUTES.has(route) ? targetId : undefined,
      needsCanonicalReplace: currentFull !== canonical,
    };
  }

  // Unknown path safely falls back to home
  return {
    route: 'home',
    explicitCourse: null,
    course: fallbackCourse,
    needsCanonicalReplace: true,
  };
}

/**
 * Formats the browser document title for the current module, CEFR level, and UI language.
 */
export function buildDocumentTitle(
  route: NavRouteId,
  course: ActiveCourseId,
  uiLanguage: UiLanguage
): string {
  const brand = 'Teachers Kingdom';
  if (route === 'home') {
    return uiLanguage === 'en'
      ? `${brand} — German A1 & A2 Learning Platform`
      : `${brand} — Almanca A1 & A2 Dil Öğrenme Platformu`;
  }
  const label = uiLanguage === 'en' ? ROUTE_TITLES[route].en : ROUTE_TITLES[route].tr;
  if (COURSE_SCOPED_ROUTES.has(route)) {
    const levelTag = course === 'de-A2' ? 'A2' : 'A1';
    return `${label} (${levelTag}) — ${brand}`;
  }
  return `${label} — ${brand}`;
}
