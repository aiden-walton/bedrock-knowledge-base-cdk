export const getEnvVariable = (name: string): string => {
  const variable = process.env[name];
  if (variable === undefined)
    throw new Error(`Environment variable not found: ${name}`);

  return variable;
};

export const getEnvVariableOrDefault = (
  name: string,
  defaultValue: string
): string => {
  const variable = process.env[name];
  if (variable === undefined) return defaultValue;

  return variable;
};
