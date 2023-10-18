export const convertNumber = (number) => {
  const numberConverted = new Number(number).toLocaleString("fa-ir");
  return numberConverted;
};
