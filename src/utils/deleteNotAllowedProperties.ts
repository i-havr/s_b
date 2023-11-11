export const deleteNotAllowedProperties = (
  allowedProperties: string[],
  body: unknown,
): void => {
  const updatedProperties = Object.keys(body);
  const notAllowedPropertiesForUpdating = updatedProperties.filter(
    (property) => !allowedProperties.includes(property),
  );

  notAllowedPropertiesForUpdating.forEach((property) => {
    delete body[property];
  });
};
