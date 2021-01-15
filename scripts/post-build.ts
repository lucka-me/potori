import { execSync } from 'child_process';

execSync('sed -i "s/\\"build\\": \\"[[:digit:]]\\+\\",/\\"build\\": \\"__BUILD_NUMBER__\\",/" package.json');
console.log(`Set build to __BUILD_NUMBER__ in package.json.`);