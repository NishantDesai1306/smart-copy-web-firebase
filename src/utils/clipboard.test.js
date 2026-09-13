import { beforeEach, describe, expect, it, vi } from 'vitest';
import { copyText } from './clipboard';

describe('copyText', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('writes exact text and reports success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    await expect(copyText('preserve\nspacing')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('preserve\nspacing');
  });

  it('surfaces unavailable clipboard access', async () => {
    vi.stubGlobal('navigator', {});
    await expect(copyText('text')).rejects.toThrow(
      'Clipboard access is unavailable',
    );
  });
});
