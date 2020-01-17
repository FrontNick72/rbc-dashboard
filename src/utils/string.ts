export function removeAllSpaces(str: any): string | undefined {
  try {
    return str.replace(/\ /g, '');
  } catch (e) {
    return undefined;
  }
}

export function capitilize(str: string): string {
  return str
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export const RU_TO_EN: any = {
  // Объект описания стандарта
  ['\u0449']: 'sth', // 'щ'
  ['\u044F']: 'ya', // 'я'
  ['\u0451']: 'e', // 'ё'
  ['\u044E']: 'yu', // 'ю'
  ['\u0436']: 'zh', // 'ж'
  ['\u0447']: 'ch', // 'ч'
  ['\u0448']: 'sh', // 'ш'
  ['\u044D']: 'e', // 'э'
  ['\u044A']: 'a`', // 'ъ'
  ['\u044B']: 'y', // 'ы'
  ['\u0446']: 'cz', // 'ц'
  ['\u0430']: 'a', // 'а'
  ['\u0431']: 'b', // 'б'
  ['\u0432']: 'v', // 'в'
  ['\u0433']: 'g', // 'г'
  ['\u0434']: 'd', // 'д'
  ['\u0435']: 'e', // 'е'
  ['\u0437']: 'z', // 'з'
  ['\u0438']: 'i', // 'и'
  ['\u0439']: 'j', // 'й'
  ['\u043A']: 'k', // 'к'
  ['\u043B']: 'l', // 'л'
  ['\u043C']: 'm', // 'м'
  ['\u043D']: 'n', // 'н'
  ['\u043E']: 'o', // 'о'
  ['\u043F']: 'p', // 'п'
  ['\u0440']: 'r', // 'р'
  ['\u0441']: 's', // 'с'
  ['\u0442']: 't', // 'т'
  ['\u0443']: 'u', // 'у'
  ['\u0444']: 'f', // 'ф'
  ['\u0445']: 'x', // 'х'
  ['\u044C']: '', // 'ь'
};

export function translate(str: string) {
  return str
    ? Array.from(str.toLowerCase())
        .map((s) => (RU_TO_EN[s] !== undefined ? RU_TO_EN[s] : s))
        .join('')
    : '';
}
