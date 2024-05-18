export function generateCPFNumbers(): string {
  const getRandomDigit = () => Math.floor(Math.random() * 10);

  const calculateDigit = (cpfArray: number[], factor: number): number => {
    const total = cpfArray.reduce((sum, num, index) => sum + num * (factor - index), 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const cpfArray = Array.from({ length: 9 }, getRandomDigit);

  const firstDigit = calculateDigit(cpfArray, 10);
  cpfArray.push(firstDigit);

  const secondDigit = calculateDigit(cpfArray, 11);
  cpfArray.push(secondDigit);

  return cpfArray.join("");
}

export function generateCPF(): string {
  return generateCPFNumbers().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
