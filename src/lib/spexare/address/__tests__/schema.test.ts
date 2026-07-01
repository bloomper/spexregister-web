import {describe, expect, it} from 'vitest';
import {addressFormSchema} from '@/lib/spexare/address/schema';

describe('addressFormSchema', () => {
    it('requires typeId', () => {
        const result = addressFormSchema.safeParse({});
        expect(result.success).toBe(false);
        const paths = result.success ? [] : result.error.issues.map((i) => i.path[0]);
        expect(paths).toContain('typeId');
    });

    it('accepts a valid email address and keeps it', () => {
        const result = addressFormSchema.safeParse({typeId: 't1', emailAddress: 'a@b.se'});
        expect(result.success && result.data.emailAddress).toBe('a@b.se');
    });

    it('normalises an empty email address to undefined', () => {
        const result = addressFormSchema.safeParse({typeId: 't1', emailAddress: ''});
        expect(result.success).toBe(true);
        expect(result.success && result.data.emailAddress).toBeUndefined();
    });

    it('rejects a malformed email address', () => {
        const result = addressFormSchema.safeParse({typeId: 't1', emailAddress: 'not-an-email'});
        expect(result.success).toBe(false);
        const issue = result.success ? undefined : result.error.issues.find((i) => i.path[0] === 'emailAddress');
        expect(issue?.message).toBe('Spexare.Address.invalidEmailAddress');
    });
});
