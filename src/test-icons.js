import * as icons from 'lucide-react';

console.log('=== All Lucide React Icons ===');
const allIcons = Object.keys(icons).sort();
console.log('Total icons:', allIcons.length);
console.log('First 20:', allIcons.slice(0, 20));

console.log('\n=== Progress/Chart/Loading Related ===');
const progressIcons = allIcons.filter(icon => 
  icon.toLowerCase().includes('prog') ||
  icon.toLowerCase().includes('chart') ||
  icon.toLowerCase().includes('load') ||
  icon.toLowerCase().includes('bar') ||
  icon.toLowerCase().includes('activity')
);
console.log(progressIcons);

// Check specifically
console.log('\n=== Checking for Progress ===');
console.log('Progress exists?', 'Progress' in icons);
console.log('Loader2 exists?', 'Loader2' in icons);
console.log('BarChart3 exists?', 'BarChart3' in icons);
