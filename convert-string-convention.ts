type Conventions =
  | 'camelCase'
  | 'kebab-case'
  | 'snake_case'
  | 'PascalCase'
  | 'Space Case';

function splitToWords(text: string) {
  // separators: everything that is not a small letter or a number
  const separators = /([^a-z0-9])/g;
  return text
    .replace(separators, (_match, sep) => {
      const charCode = sep.charCodeAt(0);
      if (charCode >= 65 && charCode <= 90) {
        return ' ' + sep;
      }

      return ' ';
    })
    .split(' ')
    .filter((val) => val.length > 0);
}

function upperCaseEachWord(words: string[], alsoFirst: boolean = false) {
  return words.map((word, index) => {
    if (alsoFirst || index > 0) {
      // only the first letter should be upper case
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });
}

export default function convertStringConvention(
  text: string,
  toConvention: Conventions,
) {
  if (typeof text !== 'string')
    throw new Error('convertConvention: text must be a string');

  const words = splitToWords(text).map((w) => w.toLowerCase());

  if (toConvention === 'camelCase') {
    return upperCaseEachWord(words, false).join('');
  } else if (toConvention === 'kebab-case') {
    return words.join('-');
  } else if (toConvention === 'snake_case') {
    return words.join('_');
  } else if (toConvention === 'PascalCase') {
    return upperCaseEachWord(words, true).join('');
  } else if (toConvention === 'Space Case') {
    return upperCaseEachWord(words, true).join(' ');
  }

  throw new Error(
    'convertStringConvention: toConvention must be one of camelCase, kebab-case, snake_case, PascalCase, Space Case',
  );
}
