export type VisitFlowControlContinue = {
  readonly type: "continue";
};
export type VisitFlowControlStepOver = {
  readonly type: "step_over";
};
export type VisitFlowControlBreak = {
  readonly type: "break";
};
export type VisitFlowControlExit = {
  readonly type: "exit";
};
export type VisitFlowControlReplace = {
  readonly type: "replace";
  readonly value: unknown;
  readonly then: VisitFlowControlThen;
};
export type VisitFlowControlDelete = {
  readonly type: "delete";
  readonly then: VisitFlowControlThen;
};
export type VisitFlowControlThen =
  | VisitFlowControlContinue
  | VisitFlowControlStepOver
  | VisitFlowControlBreak
  | VisitFlowControlExit;
export type VisitFlowControlUpdator =
  | VisitFlowControlReplace
  | VisitFlowControlDelete;
export type VisitFlowControl = VisitFlowControlThen | VisitFlowControlUpdator;

export type ParentInfo = {
  readonly node: unknown;
  readonly index: number;
};

export const CONTINUE: VisitFlowControlContinue = Object.freeze({
  type: "continue",
});
export const STEP_OVER: VisitFlowControlStepOver = Object.freeze({
  type: "step_over",
});
export const REPLACE = (
  value: unknown,
  then: VisitFlowControlThen,
): VisitFlowControlReplace => Object.freeze({ type: "replace", value, then });
export const BREAK: VisitFlowControlBreak = Object.freeze({ type: "break" });
export const EXIT: VisitFlowControlExit = Object.freeze({ type: "exit" });
export const DELETE: VisitFlowControlDelete = Object.freeze({
  type: "delete",
  then: CONTINUE,
});
export const DELETE_BREAK: VisitFlowControlDelete = Object.freeze({
  type: "delete",
  then: BREAK,
});
export const DELETE_EXIT: VisitFlowControlDelete = Object.freeze({
  type: "delete",
  then: EXIT,
});

type NonAny<T> = 0 extends 1 & T ? unknown : T;
type RecursiveChildren<T, depth = "....."> = depth extends `.${infer nextDepth}`
  ? T extends { children: (infer U)[] }
    ? NonAny<T> | NonAny<U> | RecursiveChildren<U, nextDepth>
  : never
  : never;

export const visit = <T>(
  node: T,
  visitor: (
    node: RecursiveChildren<T>,
    parents: readonly ParentInfo[],
  ) => VisitFlowControl | void,
) => {
  const parents: ParentInfo[] = [];
  const control = visitor(node as any, parents) ?? { type: "continue" };
  switch (control.type) {
    case "continue":
      break;
    case "step_over":
      return;
    case "break":
      return;
    case "exit":
      return;
    case "replace":
      throw new Error(`Root node cannot be replaced`);
    case "delete":
      throw new Error(`Root node cannot be deleted`);
    default:
      throw new Error(
        `Unknown control type: ${
          (control satisfies never as { type: 0 }).type
        }`,
      );
  }
  let exitting = false;
  const dfs = (node: unknown) => {
    if (
      typeof node === "object" &&
      node !== null &&
      "children" in node &&
      Array.isArray(node.children)
    ) {
      for (let index = 0; index < node.children.length; index++) {
        const child: unknown = node.children[index];
        parents.push({ node, index });
        let control = visitor(child as any, parents) ?? { type: "continue" };
        if (control.type === "replace") {
          node.children[index] = control.value;
          control = control.then;
        } else if (control.type === "delete") {
          node.children.splice(index, 1);
          index--;
          if (
            control.then.type === "continue" ||
            control.then.type === "step_over"
          ) {
            continue;
          } else if (control.then.type === "break") {
            return;
          } else if (control.then.type === "exit") {
            exitting = true;
            return;
          } else {
            throw new Error(
              `Unknown control type: ${
                (control.then satisfies never as { type: 0 }).type
              }`,
            );
          }
        }
        if (control.type === "continue") {
          dfs(child);
          if (exitting) return;
        } else if (control.type === "step_over") {
          continue;
        } else if (control.type === "break") {
          return;
        } else if (control.type === "exit") {
          exitting = true;
          return;
        } else {
          throw new Error(
            `Unknown control type: ${
              (control satisfies never as { type: 0 }).type
            }`,
          );
        }
        parents.pop();
      }
    }
  };
  dfs(node);
};

export const visitAsync = async <T>(
  node: T,
  visitor: (
    node: RecursiveChildren<T>,
    parents: readonly ParentInfo[],
  ) => VisitFlowControl | void | Promise<VisitFlowControl | void>,
) => {
  const parents: ParentInfo[] = [];
  const control = await visitor(node as any, parents) ?? { type: "continue" };
  switch (control.type) {
    case "continue":
      break;
    case "step_over":
      return;
    case "break":
      return;
    case "exit":
      return;
    case "replace":
      throw new Error(`Root node cannot be replaced`);
    case "delete":
      throw new Error(`Root node cannot be deleted`);
    default:
      throw new Error(
        `Unknown control type: ${
          (control satisfies never as { type: 0 }).type
        }`,
      );
  }
  let exitting = false;
  const dfs = async (node: unknown) => {
    if (
      typeof node === "object" &&
      node !== null &&
      "children" in node &&
      Array.isArray(node.children)
    ) {
      for (let index = 0; index < node.children.length; index++) {
        const child: unknown = node.children[index];
        parents.push({ node, index });
        let control = await visitor(child as any, parents) ??
          { type: "continue" };
        if (control.type === "replace") {
          node.children[index] = control.value;
          control = control.then;
        } else if (control.type === "delete") {
          node.children.splice(index, 1);
          index--;
          if (
            control.then.type === "continue" ||
            control.then.type === "step_over"
          ) {
            continue;
          } else if (control.then.type === "break") {
            return;
          } else if (control.then.type === "exit") {
            exitting = true;
            return;
          } else {
            throw new Error(
              `Unknown control type: ${
                (control.then satisfies never as { type: 0 }).type
              }`,
            );
          }
        }
        if (control.type === "continue") {
          dfs(child);
          if (exitting) return;
        } else if (control.type === "step_over") {
          continue;
        } else if (control.type === "break") {
          return;
        } else if (control.type === "exit") {
          exitting = true;
          return;
        } else {
          throw new Error(
            `Unknown control type: ${
              (control satisfies never as { type: 0 }).type
            }`,
          );
        }
        parents.pop();
      }
    }
  };
  await dfs(node);
};
