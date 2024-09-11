export function isInteger(s: string) {
  return parseInt(s).toString() === s;
}

export function sortNodes(nodes: string[]) {
  const ints = nodes.filter((s: string) => isInteger(s));
  const notInts = nodes.filter((s: string) => !isInteger(s));

  ints.sort((x: string, y: string) => parseInt(x) - parseInt(y));
  notInts.sort();

  return [...ints, ...notInts];
}

export function generateRandomGraph(
  numNodes: number,
  numEdges: number,
  directed: boolean
): ParsedGraph {
  const nodes = Array.from({ length: numNodes }, (_, i) => `${i + 1}`);
  const edges: string[][] = [];
  const adj = new Map<string, string[]>();

  nodes.forEach((node) => {
    adj.set(node, []);
  });

  const edgeSet = new Set<string>();

  while (edges.length < numEdges) {
    const u = nodes[Math.floor(Math.random() * numNodes)];
    const v = nodes[Math.floor(Math.random() * numNodes)];

    if (u !== v && !edgeSet.has(`${u},${v}`) && !edgeSet.has(`${v},${u}`)) {
      edges.push([u, v]);
      edgeSet.add(`${u},${v}`);
      adj.get(u)!.push(v);

      if (!directed) {
        adj.get(v)!.push(u);
      }
    }
  }

  return {
    status: "ok",
    graph: { nodes, edges, adj },
  };
}

