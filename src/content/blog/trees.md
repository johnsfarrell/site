---
title: "Tree Algorithms"
description: "A review of popular tree algorithms and problem solving tree traversals."
pubDate: "July 16, 2024"
---

This is a review of popular tree algorithms and problem solving tree traversals. Below includes: **Least Common Ancestor**, **Back Tracking**, and **Binary Search Tree Traversal**.

<hr>

## Least Common Ancestor

The **Least Common Ancestor** (LCA) is the first node reached by two connected nodes of a tree. The LCA algorithm I will share is a recursive **Depth First Search** (DFS) algorithm. Assume $A$ is the first node and $B$ is the second node. We want $LCA$ to be the least common ancestor between them. The intuition is that $LCA$ has one of the following criteria.

- The $LCA$'s left and right branch each have either $A$ or $B$, therefore $LCA$ is the first node connecting those two branches.
- The $LCA$ is either $A$ or $B$ and the other is in either the left or right branch.

We will use a DFS function to recursively check left and right nodes for either $A$ or $B$. In the case we find one, the DFS function will return true. In the case we meet one of the conditions above, we will set a global variable to equal the LCA node. Below is a Python excerpt.

```python
# ... initialize an A, B, and LCA
def dfs(node):
    if not node:
        return False
    in_left = dfs(node.left)
    in_right = dfs(node.right)
    is_node = node == A or node == B
    if in_left and in_right or (is_node and (in_left or in_right)):
        LCA = node
    return in_left or in_right or is_node
```

### Time Complexity of LCA

- Let $N$ equal the number of nodes in tree we are searching the LCA for.
- The time complexity of our search will equal O($N$) in worst case, as we would check every node.

## Back Tracking

The goal of back tracking is to find a solution to a problem by solving all subproblems. The subproblems primary follow a tree structure. The algorithm will backtrack to the previous node if the current node does not have a solution.

A great example of backtracking is for LeetCode [39. Combination Sum](https://leetcode.com/problems/combination-sum/). The problem asks us to find all unique combinations of numbers that sum to a target number. We can use backtracking to solve this problem, as we can recursively check all possible combinations. We will keep track of the current sum and current combination. We will also track the index of the current number, which will make sense in the solution below. We want to track the index, because the problem statement allows us to use any number multiple times. Therefore, our tree solution will have branches, either using the current number or not using the current number. If we use the current number, it is possible we will want to use it again, so we do not increment the current number index. If we do not use the current number, we increment the index. As for any DFS function we need base cases. The base cases in this problem have to do with the current sum. If the current sum equals the target sum, we found a valid combination and add it to our output. If the current sum exceeds the target sum, we backtrack to the previous node (return without saving). Below is a Python solution.

```python
def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
    self.output = []
    def dfs(i, cur_candidates, cur_sum):
        if cur_sum == target: # base case 1
            self.output.append(cur_candidates)
            return
        if cur_sum < target and i < len(candidates):
            # use current number
            dfs(i, cur_candidates + [candidates[i]], cur_sum + candidates[i])
            # do not use current number
            dfs(i + 1, cur_candidates, cur_sum)
    dfs(0, [], 0)
    return self.output
```

### Back Tracking Big-O Analysis

- Let $N$ equal the number of elements in the `candidates` list.
- The time complexity of our backtracking solution will be O($2^N$) in the worst case, as we will check all possible combinations.
- The space complexity of our backtracking solution will be O($2^N$) in the worst case, as we will store all possible combinations.

## Binary Search Tree Traversal

A [Binary Search Tree](https://en.wikipedia.org/wiki/Binary_search_tree) (BST) is a tree where each node has at most two children, the left and right child. The left child is always less than the parent node and the right child is always greater than the parent node. Furthermore, every subtree of the left child is less than the parent node and every subtree of the right child is greater than the parent node. Know this, we can search a Binary Search Tree in $O(\log N)$ time.

An example of where we have to traverse a BST is LeetCode [98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/). The problem statement asks us to determine if a given tree _is_ a valid BST. We will solve this problem by traversing the tree, and determining whether nodes of the subtrees fall within a valid range. The left child's acceptance range is from the current minimum (starting at $-\inf$) to the parent node value. We must define both a current minimum and current maximum in the case that we have traversed both left and right in a tree. Ofcourse, if we go all the way left, there will never be a minimum threshold value greater than $-\inf$ and if we go all the way right, there will never be a maximum threshold value less that $\inf$. But if we fall somewhere inbetween, there will be both a minimum and maximum threshold. For example, if we go right from `5` and left from `8`, our valid range for the left subtree from `8` will be `(5, ..., 8)` inclusive or non-inclusive depending on the implementation. For the solution to this problem, we will assume we do not allow duplicates in our BST, and therefore will return an invalid tree if a node value _is equal_ to the minimum or maximum. In conclusion, when we traverse to a left child subtree, we update the maximum value to be the parent value, and when we traverse to a right child subtree, we update the minimum value to be the parent value. The base case for our DFS traversal will be when the node is `None`. When the node is `None`, we know we have reached the leaf node of the tree and have reached the end of a valid branch. We return the backtracking of both the left and right subtrees. If both left and right child subtrees are valid, the tree from the parent is valid.

```python
def isValidBST(self, root: Optional[TreeNode]) -> bool:
    def dfs(node, minimum, maximum):
        if not node: return True
        if node.val <= minimum or node.val >= maximum:
            return False
        return dfs(node.left, minimum, node.val) and dfs(node.right, node.val, maximum)
    return dfs(root, float("-inf"), float("inf"))
```

### Binary Search Tree Big-O Analysis

- Let $N$ equal the number of nodes in the tree.
- The time complexity of our BST traversal will be O($N$) in the worst case, as we will check every node.
- The space complexity of our BST traversal will be O($N$) in the worst case, as we will store every node in the call stack.

### Related Topics

- [Tree Traversals](/writing/tree-traversals)
- [Graph Algorithms](/writing/graphs)
- [A\*](/writing/a-star)
