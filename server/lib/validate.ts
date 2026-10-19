import { z } from 'zod';
import { badRequest } from './errors';

export function parse<S extends z.ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const where = issue.path.length ? `${issue.path.join('.')}: ` : '';
    throw badRequest(`${where}${issue.message}`, result.error.issues);
  }
  return result.data;
}

/** Trimmed, length-bounded string. */
export const str = (min = 1, max = 500) =>
  z
    .string({ error: 'must be text' })
    .trim()
    .min(min, min === 1 ? 'is required' : `must be at least ${min} characters`)
    .max(max, `must be at most ${max} characters`);

export const optStr = (max = 500) => z.string().trim().max(max).optional();

export const roles = ['Victim', 'Volunteer', 'NGO', 'Government Official'] as const;
export const urgencies = ['Critical', 'High', 'Medium', 'Low'] as const;
export const categories = ['Medical', 'Rescue', 'Food & Water', 'Shelter', 'Supplies'] as const;
export const disasterTypes = ['Flood', 'Fire', 'Earthquake', 'Cyclone', 'Landslide', 'Other'] as const;

/** Lenient email check (accepts addresses such as "name@org"). */
export const email = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .regex(/^[^\s@]+@[^\s@]+$/, 'must be a valid email address');
