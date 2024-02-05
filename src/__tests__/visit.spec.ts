import { describe, expect, it } from "vitest";
import {
  visit,
  CONTINUE,
  STEP_OVER,
  REPLACE,
  EXIT,
  BREAK,
  DELETE,
  DELETE_EXIT,
  DELETE_BREAK,
} from "../visit.js";

describe("visit", () => {
  it("REPLACE", () => {
    const parentInfos: unknown[] = [];
    const tree = {
      type: "root",
      children: [
        {
          type: "child",
          children: [],
        },
      ],
    };
    visit(tree, (node, parentInfo) => {
      parentInfos.push(structuredClone(parentInfo));
      if (node.type === "child") {
        return REPLACE(
          {
            type: "replaced",
            children: [],
          },
          CONTINUE,
        );
      }
      return CONTINUE;
    });
    expect(tree).toStrictEqual({
      type: "root",
      children: [
        {
          type: "replaced",
          children: [],
        },
      ],
    });
    expect(parentInfos).toStrictEqual([
      [],
      [
        {
          node: {
            type: "root",
            children: [
              {
                type: "child",
                children: [],
              },
            ],
          },
          index: 0,
        },
      ],
    ]);
  });

  it("DELETE", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "child",
          children: [],
        },
        {
          type: "child",
          children: [],
        },
        {
          type: "child2",
          children: [],
        },
      ],
    };
    visit(tree, (node) => {
      if (node.type === "child") {
        return DELETE;
      }
      return CONTINUE;
    });
    expect(tree).toStrictEqual({
      type: "root",
      children: [
        {
          type: "child2",
          children: [],
        },
      ],
    });
  });

  it("DELETE_EXIT", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "child",
          children: [],
        },
        {
          type: "child",
          children: [],
        },
        {
          type: "child2",
          children: [],
        },
      ],
    };
    visit(tree, (node) => {
      if (node.type === "child") {
        return DELETE_EXIT;
      }
      return CONTINUE;
    });
    expect(tree).toStrictEqual({
      type: "root",
      children: [
        {
          type: "child",
          children: [],
        },
        {
          type: "child2",
          children: [],
        },
      ],
    });
  });

  it("DELETE_BREAK", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "child",
          children: [
            {
              type: "grandchild",
              children: [],
            },
            {
              type: "grandchild",
              children: [],
            },
          ],
        },
        {
          type: "child",
          children: [
            {
              type: "grandchild",
              children: [],
            },
            {
              type: "grandchild",
              children: [],
            },
          ],
        },
      ],
    };
    visit(tree, (node) => {
      if (node.type === "grandchild") {
        return DELETE_BREAK;
      }
      return CONTINUE;
    });
    expect(tree).toStrictEqual({
      type: "root",
      children: [
        {
          type: "child",
          children: [
            {
              type: "grandchild",
              children: [],
            },
          ],
        },
        {
          type: "child",
          children: [
            {
              type: "grandchild",
              children: [],
            },
          ],
        },
      ],
    });
  });

  it("STEP_OVER", () => {
    let grandChildrenStep = 0;
    visit(
      {
        type: "root",
        children: [
          {
            type: "child",
            children: [
              {
                type: "grandchild",
                children: [],
              },
            ],
          },
        ],
      },
      (node) => {
        if (node.type === "child") {
          return STEP_OVER;
        }
        if (node.type === "grandchild") {
          grandChildrenStep++;
        }
        return;
      },
    );
    expect(grandChildrenStep).toBe(0);
  });

  it("BREAK 1", () => {
    let childrenStep = 0;
    visit(
      {
        type: "root",
        children: [
          {
            type: "child",
            children: [
              {
                type: "grandchild",
                children: [],
              },
            ],
          },
          {
            type: "child",
            children: [
              {
                type: "grandchild",
                children: [],
              },
            ],
          },
        ],
      },
      (node) => {
        if (node.type === "child") {
          childrenStep++;
          return BREAK;
        }
        return;
      },
    );
    expect(childrenStep).toBe(1);
  });

  it("BREAK 2", () => {
    let childrenStep = 0;
    visit(
      {
        type: "root",
        children: [
          {
            type: "child",
            children: [
              {
                type: "grandchild",
                children: [],
              },
            ],
          },
          {
            type: "child",
            children: [
              {
                type: "grandchild",
                children: [],
              },
            ],
          },
        ],
      },
      (node) => {
        if (node.type === "child") {
          childrenStep++;
        }
        if (node.type === "grandchild") {
          return BREAK;
        }
        return;
      },
    );
    expect(childrenStep).toBe(2);
  });

  it("EXIT", () => {
    let childrenStep = 0;
    visit(
      {
        type: "root",
        children: [
          {
            type: "child",
            children: [
              {
                type: "grandchild",
                children: [],
              },
            ],
          },
          {
            type: "child",
            children: [
              {
                type: "grandchild",
                children: [],
              },
            ],
          },
        ],
      },
      (node) => {
        if (node.type === "child") {
          childrenStep++;
        }
        if (node.type === "grandchild") {
          return EXIT;
        }
        return;
      },
    );
    expect(childrenStep).toBe(1);
  });
});
