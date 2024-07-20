---
title: "Tree Traversals"
description: "The main tree traversal algorithms: Inorder, Preorder, and Postorder."
pubDate: "July 17, 2024"
---

This is a review of popular tree traversals: **Preorder Traversal**, **Postorder Traversal**, and **Inorder Traversal**.

<hr>

## Preorder Traversal

The **Preorder Traversal** is a **Depth First Search** of the tree, first visiting the current node before its children. The algorithm is simple, and generally what we are most familiar with. Below is a Python excerpt where we visit the current node, print its value, and then recursively visit the left and right children.

```python
def preorder(node):
    if not node:
        return
    print(node.val)
    preorder(node.left)
    preorder(node.right)
```

It is important to notice that we will first print the root, then the left children all the way to the leaf on the left, and then the adjacent right children. Remember that we always visit the parent node, then the left child (which becomes the new recursive parent node), and then the right child. Below is a visualized example of the Preorder Traversal.

```
     1
    / \
   2   3
  / \
 4   5
```

The Preorder Traversal would print: `1, 2, 4, 5, 3`.

## Postorder Traversal

The **Postorder Traversal** is a **Depth First Search** of the tree, first visiting the children before the current node. The algorithm is very similar to Preorder, but we instead visit the current node after visiting both children. Below is a Python excerpt where we recursively visit the left and right children before printing the current node.

```python
def postorder(node):
    if not node:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.val)
```

We notice here that the first thing printed will be the value in the bottom left leaf, then the adjacent right leaf. In both preorder and postorder, the left child is visited before the right child, leading to this pattern. A parent node will be visited after _both_ its children have been visited. Below is a visualized example of the Postorder Traversal.

```
     1
    / \
   2   3
  / \
 4   5
```

The ordering will be `4, 5, 2, 3, 1`.

A great example of when we use a postorder traversal is when we want to delete within a tree. It is common to want to delete a node after we have visited both its children. This is because we do not want to delete a node before we have visited its children, as we may need to reference them. [1110. Delete Nodes And Return Forest](https://leetcode.com/problems/delete-nodes-and-return-forest/) is a great example of this. The problem statement asks us to delete a list of nodes from a tree and return the forest of trees that remain. To do this, we can use a postorder traversal to first visit the children of a node before choosing whether to delete the node. The algorithm for solving this problem involves creating a recursive function that will return a node if it isn't deleted, or `None` if deleted. We then use this function to update both the left and right children of a parent node before choosing whether to delete the parent node. If we delete the parent node, we must add its children to the output list, if they exist. Below is the recursive function in Python.

```python
def postorder(node):
    if not node: return None # base case
    node.left = postorder(node.left)
    node.right = postorder(node.right)
    if node.val in delete:
        if node.left: output.append(node.left)
        if node.right: output.append(node.right)
        return None
    return node
```

It should be noted that a special case for the root node. When we call the function on the root node inside our parent function, we should check if the function return value is the node or `None`. That will determine whether we add the root node to our output list or not.

```python
def delNodes(self, root: Optional[TreeNode], to_delete: List[int]) -> List[TreeNode]:
    to_delete = set(to_delete)
    output = [] # assume output is accessible by postorder function
    if postorder(root): output.append(root)
    return output
```

### Postorder Traversal Big-O Analysis

- Let $N$ equal the number of nodes in the tree.
- The time complexity of our Postorder Traversal will be O($N$) in the worst case, as we will check every node.
- The space complexity of our Postorder Traversal will be O($N$) in the worst case, as we will store every node in the **call stack**.

> The **call stack** is a stack data structure that stores information about the active subroutines of a computer program. The call stack is used for storing the return address of the active subroutines, and the local variables of the active subroutines. The number of subroutines in our function could be equal to the number of nodes in the tree.

## Inorder Traversal

The **Inorder Traversal** is a **Depth First Search** of the tree, visiting the left child, then the current node, and finally the right child. Below is a Python excerpt where we recursively visit the left child, print the current node, and then visit the right child.

```python
def inorder(node):
    if not node:
        return
    inorder(node.left)
    print(node.val)
    inorder(node.right)
```

A good way to keep track of the ordering in this one is to think of the Inorder Traversal as visiting a tree in ascending order. We always visit the left child before ever visiting the parent node. We never visit a right child before the parent node. Below is a visualized example of the Inorder Traversal.

```
     1
    / \
   2   3
  / \
 4   5
```

The ordering will be `4, 2, 5, 1, 3`.

### Related Topics

- [Tree Algorithms](/writing/trees)
- [Graph Algorithms](/writing/graphs)
- [A\*](/writing/a-star)
