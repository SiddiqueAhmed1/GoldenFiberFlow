export const consignmentId = (id) => {
  const consId = `CN-${parseInt(id?.replace(/\D/g, "")).toString().slice(1, 7)}`;

  return consId;
};
