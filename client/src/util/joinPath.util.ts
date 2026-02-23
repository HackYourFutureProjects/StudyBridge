export function joinPath(base: string, child: string) {
  const b = base.replace(/\/+$/, "");
  const c = child.replace(/^\/+/, "");
  return c ? `${b}/${c}` : b;
}
