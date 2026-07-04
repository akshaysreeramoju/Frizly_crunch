const fs = require('fs');

const benefitsMap = {
  'apple': "['Rich in Fiber', 'Supports Heart Health', 'Helps Weight Management']",
  'banana': "['Rich in Potassium', 'Supports Muscles & Heart', 'Supports Gut Health']",
  'amla': "['Rich in Vitamin C', 'Supports Immunity', 'Supports Hair & Skin Health']",
  'pineapple': "['Supports Immunity', 'Anti-inflammatory Properties', 'Contains Bromelain Enzyme']",
  'jackfruit': "['High in Fiber', 'Supports Digestion']",
  'chikoo': "['Rich in Fiber', 'Supports Digestion', 'Natural Energy Source']",
  'custard-apple': "['Rich in Vitamin B6', 'Naturally Energy Dense', 'Supports Healthy Weight Gain']",
  'mango': "['Rich in Vitamin A', 'Supports Immunity', 'Supports Skin Health']",
  'papaya': "['Contains Papain Enzyme', 'Supports Digestion', 'Supports Gut & Skin Health']",
  'guava': "['Very High in Vitamin C', 'Rich in Fiber', 'Supports Immunity']",
  'beetroot': "['Supports Blood Circulation', 'Supports Hemoglobin', 'Supports Stamina']",
  'carrot': "['Rich in Beta-Carotene', 'Supports Eye Health', 'Supports Skin Health']",
  'sweetcorn': "['Contains Fiber', 'Supports Digestion']"
};

let content = fs.readFileSync('src/lib/products.ts', 'utf8');

for (const [id, benefitsStr] of Object.entries(benefitsMap)) {
  const regex = new RegExp(`(id: '${id}',[\\s\\S]*?benefits: )\\[.*?\\]`, 'g');
  content = content.replace(regex, `$1${benefitsStr}`);
}

fs.writeFileSync('src/lib/products.ts', content);
console.log('Updated benefits in products.ts');
