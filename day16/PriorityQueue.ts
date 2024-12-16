import type Node from "./Node";

type Item = {
  node: Node;
  priority: number;
};

export default class PriorityQueue {
  items: Item[];

  constructor(initial?: Item[]) {
    this.items = initial ?? [];
  }

  get length(): number {
    return this.items.length;
  }

  public contains(node: Node): boolean {
    return this.items.some((item) => item.node.id === node.id);
  }

  public enqueue(node: Node, priority: number): void {
    let item: Item = { node, priority };
    let inserted = false;

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > item.priority) {
        this.items.splice(i, 0, item);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      this.items.push(item);
    }
  }

  public dequeue(): Node | undefined {
    return this.items.shift()?.node;
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }

  public print(loggingDisabled?: boolean): void {
    if (loggingDisabled) return;
    this.items.forEach((item) =>
      console.log("priority", item.priority, "node", item.node.id),
    );
  }
}
