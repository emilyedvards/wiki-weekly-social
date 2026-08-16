export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function firstSentence(value: string, maxLength = 230) {
  const normalized = normalizeWhitespace(value);
  const match = normalized.match(/^.*?[.!?](?:\s|$)/);
  const sentence = match ? match[0].trim() : normalized;

  if (sentence.length <= maxLength) return sentence;
  const shortened = sentence.slice(0, maxLength - 1).trimEnd();
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, Math.max(80, lastSpace)).replace(/[,.!?;:]$/, '')}...`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
