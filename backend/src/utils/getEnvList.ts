export function getEnvList(envKey: string): string[] {
  const value = process.env[envKey];
  
  if (!value) return [];
  
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}