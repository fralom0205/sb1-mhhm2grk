import { calculateDirectoryHashes } from '../utils/hash';

async function main() {
  try {
    // List of files to hash
    const files = [
      'src/App.tsx',
      'src/main.tsx',
      'src/index.css',
      // Add more files as needed
    ];

    const hashes = await calculateDirectoryHashes(files);
    
    // Sort by file path for consistent output
    const sortedHashes = Object.entries(hashes)
      .sort(([a], [b]) => a.localeCompare(b));

    // Print hashes in a readable format
    console.log('\nFile SHA-1 Hashes:\n');
    for (const [file, hash] of sortedHashes) {
      console.log(`${hash}  ${file}`);
    }
  } catch (error) {
    console.error('Error calculating hashes:', error);
  }
}

main();