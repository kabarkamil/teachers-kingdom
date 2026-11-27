import type { ProgressState } from '../types';
import {
  TK_BACKUP_SCHEMA_VERSION,
  sanitizeProgressState,
} from '../utils/dataPortability';

export const PROGRESS_SCHEMA_VERSION = TK_BACKUP_SCHEMA_VERSION;

export interface RawMigrationResult {
  ok: boolean;
  progress: ProgressState;
  sourceStageHint: 'legacy-stage1-6' | 'current-v1' | 'recovered-default';
  warningTr: string | null;
}

/**
 * Pure, backward-compatible migration gate for any raw `tk_stage1_progress_v1` record.
 * Never resets valid historical user progress and never inflates XP.
 */
export function migrateRawProgressRecord(
  parsed: unknown,
  initialFallback: ProgressState
): RawMigrationResult {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      ok: false,
      progress: initialFallback,
      sourceStageHint: 'recovered-default',
      warningTr:
        'Tarayıcıdaki yerel ilerleme kaydı beklenmeyen bir biçimdeydi; güvenli başlangıç durumuna geçildi. Eski bir JSON yedeğiniz varsa Ayarlar ekranından içe aktarabilirsiniz.',
    };
  }

  const record = parsed as Record<string, unknown>;
  const isLegacyStage1To6 =
    !Array.isArray(record.teachingAssignments) || !Array.isArray(record.teachingClasses);

  const normalized = sanitizeProgressState(record, true);

  return {
    ok: true,
    progress: normalized,
    sourceStageHint: isLegacyStage1To6 ? 'legacy-stage1-6' : 'current-v1',
    warningTr: null,
  };
}
