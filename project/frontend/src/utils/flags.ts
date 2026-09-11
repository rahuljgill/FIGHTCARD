// Automatically picks up any *.png or *.svg in src/assets/flags whose filename
// matches a country code (e.g. "usa.png", "mex.svg", "gbr.png").
const flagModules = import.meta.glob("../assets/flags/*.{png,svg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function getFlagUrl(countryCode: string): string | undefined {
  const code = countryCode.toLowerCase();
  const match = Object.keys(flagModules).find((path) => {
    const filename = path.toLowerCase();
    return (
      filename.endsWith(`/${code}.png`) || filename.endsWith(`/${code}.svg`)
    );
  });
  return match ? flagModules[match] : undefined;
}
