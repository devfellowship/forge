import type { SkillFile } from "@/data/types";

export interface FileTreeRow {
  name: string;
  isFile: boolean;
  depth: number;
  size: string;
}

interface TreeNode {
  name: string;
  isFile: boolean;
  bytes: number;
  children: Record<string, TreeNode>;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function buildTree(files: SkillFile[]): FileTreeRow[] {
  const root: TreeNode = { name: "", isFile: false, bytes: 0, children: {} };

  for (const f of files) {
    const parts = f.path.split("/");
    let node = root;
    parts.forEach((p, i) => {
      const isFile = i === parts.length - 1;
      const existing = node.children[p];
      const next: TreeNode =
        existing ?? { name: p, isFile, bytes: 0, children: {} };
      if (isFile) next.bytes = new TextEncoder().encode(f.contents).length;
      node.children[p] = next;
      node = next;
    });
  }

  const rows: FileTreeRow[] = [];

  const walk = (node: TreeNode, depth: number): void => {
    const keys = Object.keys(node.children).sort((a, b) => {
      const A = node.children[a];
      const B = node.children[b];
      if (!A || !B) return 0;
      if (A.isFile !== B.isFile) return A.isFile ? 1 : -1;
      return a.localeCompare(b);
    });
    for (const k of keys) {
      const c = node.children[k];
      if (!c) continue;
      rows.push({
        name: c.isFile ? k : `${k}/`,
        isFile: c.isFile,
        depth,
        size: c.isFile ? formatBytes(c.bytes) : "",
      });
      walk(c, depth + 1);
    }
  };

  walk(root, 0);
  return rows;
}
