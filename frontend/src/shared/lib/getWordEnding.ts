export function getWordEnding(number: number, word: string): string {
  if (number % 10 === 1 && number % 100 !== 11) {
    return word;
  } else if (
    (number % 10 === 2 || number % 10 === 3 || number % 10 === 4) &&
    (number % 100 < 10 || number % 100 >= 20)
  ) {
    return `${word}а`;
  } else {
    return `${word}ев`;
  }
}
