/**
 * Calculate SHA-1 hash of a string using Web Crypto API
 */
export async function calculateSHA1(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculate SHA-1 hash of multiple files
 */
export async function calculateDirectoryHashes(files: string[]): Promise<Record<string, string>> {
  const hashes: Record<string, string> = {};

  for (const file of files) {
    try {
      const response = await fetch(file);
      const content = await response.text();
      const hash = await calculateSHA1(content);
      hashes[file] = hash;
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  return hashes;
}