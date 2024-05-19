/**
 * Return the Vim command to open a new window based on the given mods.
 * @param mods The modifiers (see <mods> in Vim help) to determine the window type.
 * @returns The Vim command to open a new window.
 */
export default function opener(mods: string): string {
  for (const mod of mods.split(/\s+/).reverse()) {
    switch (mod) {
      case "vert":
        return "vnew";
      case "verti":
        return "vnew";
      case "vertic":
        return "vnew";
      case "vertica":
        return "vnew";
      case "vertical":
        return "vnew";
      case "hor":
        return "new";
      case "hori":
        return "new";
      case "horiz":
        return "new";
      case "horizo":
        return "new";
      case "horizon":
        return "new";
      case "horizont":
        return "new";
      case "horizonta":
        return "new";
      case "horizontal":
        return "new";
      case "tab":
        return "tabnew";
    }
  }
  return "edit";
}
