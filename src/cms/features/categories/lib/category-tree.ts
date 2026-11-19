import type { Category, CategoryStatus, CategoryTreeNode } from "../types";

export const CATEGORY_TREE_PAGE_SIZE = 100;
export const CATEGORY_TREE_MAX_ITEMS = 1_000;

export type CategoryTreeResult = {
  forest: CategoryTreeNode[];
  byId: Map<string, CategoryTreeNode>;
  issues: string[];
  complete: boolean;
};

const compare = (a: Category, b: Category) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "vi") || a.id.localeCompare(b.id);

export function buildCategoryForest(items: Category[]): CategoryTreeResult {
  const byId = new Map<string, CategoryTreeNode>();
  const issues: string[] = [];
  for (const item of items) {
    if (byId.has(item.id)) {
      issues.push(`Trùng mã danh mục: ${item.id}`);
      continue;
    }
    byId.set(item.id, { ...item, children: [] });
  }

  const invalid = new Set<string>();
  for (const node of byId.values()) {
    const seen = new Set([node.id]);
    let parentId = node.parentId;
    while (parentId) {
      if (seen.has(parentId)) {
        invalid.add(node.id);
        issues.push(`Phát hiện chu trình tại danh mục ${node.name}.`);
        break;
      }
      seen.add(parentId);
      parentId = byId.get(parentId)?.parentId ?? null;
    }
  }

  const forest: CategoryTreeNode[] = [];
  for (const node of byId.values()) {
    if (invalid.has(node.id)) continue;
    if (!node.parentId) forest.push(node);
    else {
      const parent = byId.get(node.parentId);
      if (!parent || invalid.has(parent.id)) {
        issues.push(`Không tìm thấy danh mục cha của ${node.name}.`);
        forest.push(node);
      } else parent.children.push(node);
    }
  }

  const sortNodes = (nodes: CategoryTreeNode[]) => {
    nodes.sort(compare);
    nodes.forEach((node) => sortNodes(node.children));
  };
  sortNodes(forest);
  return { forest, byId, issues, complete: issues.length === 0 };
}

export function descendantIds(tree: CategoryTreeResult, categoryId: string) {
  const excluded = new Set([categoryId]);
  const visit = (node?: CategoryTreeNode) => {
    node?.children.forEach((child) => { excluded.add(child.id); visit(child); });
  };
  visit(tree.byId.get(categoryId));
  return excluded;
}

export function filterCategoryForest(forest: CategoryTreeNode[], search: string, status?: CategoryStatus): CategoryTreeNode[] {
  const term = search.trim().toLocaleLowerCase("vi");
  const visit = (node: CategoryTreeNode): CategoryTreeNode | null => {
    const children = node.children.map(visit).filter((child): child is CategoryTreeNode => child !== null);
    const matches = (!term || `${node.name} ${node.slug}`.toLocaleLowerCase("vi").includes(term)) && (!status || node.status === status);
    return matches || children.length ? { ...node, children, contextOnly: !matches } : null;
  };
  return forest.map(visit).filter((node): node is CategoryTreeNode => node !== null);
}

export function flattenTreeOptions(forest: CategoryTreeNode[], excluded = new Set<string>()) {
  const result: Array<{ id: string; label: string }> = [];
  const visit = (nodes: CategoryTreeNode[], depth: number) => nodes.forEach((node) => {
    if (!excluded.has(node.id)) result.push({ id: node.id, label: `${"— ".repeat(depth)}${node.name}` });
    visit(node.children, depth + 1);
  });
  visit(forest, 0);
  return result;
}

export function evaluateTreeLoad(total: number, loaded: number, maxItems = CATEGORY_TREE_MAX_ITEMS) {
  if (total > maxItems) return { complete: false, reason: `Có ${total} danh mục, vượt giới hạn tải cây an toàn ${maxItems}.` };
  if (loaded < total) return { complete: false, reason: `Chỉ tải được ${loaded}/${total} danh mục.` };
  return { complete: true, reason: null };
}
