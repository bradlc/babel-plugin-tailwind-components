export default function replaceWithLocation(path, replacement) {
  let loc = path.node.loc
  let newPaths = path.replaceWith(replacement)
  if (Array.isArray(newPaths)) {
    newPaths.forEach(p => {
      p.node.loc = loc
    })
  }
  return newPaths
}
