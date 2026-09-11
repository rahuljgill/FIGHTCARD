// Picks up any *.png in src/assets/fighterSprites whose filename matches
// a fighter id (e.g. "tyson-fury.png", "oleksandr-usyk.png").
// it must be a fighter id!
const spriteModules = import.meta.glob("../assets/fighterSprites/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function getFighterSprite(fighterId: string): string | undefined {
  const target = `/${fighterId.toLowerCase()}.png`;
  const match = Object.keys(spriteModules).find((path) =>
    path.toLowerCase().endsWith(target),
  );
  return match ? spriteModules[match] : undefined;
}
