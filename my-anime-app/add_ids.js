import fs from 'fs';
import path from 'path';

// Define the path to your JSON file
const filePath = path.join(process.cwd(), 'src', 'assets', 'anime_data.json');

try {
  // Read the file
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const animeData = JSON.parse(fileContent);

  // Add a unique ID to each anime object
  const dataWithIds = animeData.map((anime, index) => {
    return {
      id: index + 1, // Start IDs from 1
      ...anime
    };
  });

  // Write the updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(dataWithIds, null, 2));

  console.log(`✅ Successfully added unique IDs to ${dataWithIds.length} items in anime_data.json`);

} catch (error) {
  console.error('❌ Error processing file:', error);
}