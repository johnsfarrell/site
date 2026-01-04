---
title: "Graph Algorithms"
description: "A review of popular graphing algorithms and problem solving graph traversals."
pubDate: "July 13, 2024"
---

This is a review of popular graphing algorithms and problem solving graph traversals.

*Revised on Jan 3, 2026*

<hr>

## Dijkstra's Algorithm

Dijksta's algorithm is a Breadth First Search algorithm used to find the **shortest path** between any two nodes in a graph with weighted edges. The main difference between standard BFS and Dijkstra's is Dijkstra's use of a **priority queue** (or **min heap**). BFS uses a **queue** to traverse a graph, finding the shortest path without accounting for edge weights.

> A **Breadth First Search Algorithm** is a graph traversal algorithm that explores all nodes of the current layer before moving to a further layer.

A great LeetCode question to practice Dijkstra's is [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/). The problem statement asks to find the minimum time to reach all nodes, if possible, given a set of directed edges and their times (weights). We use Dijkstra's algorithm to find this minimum time.

First, it is important to understand the **graph representation**. Different problems give different representations of graphs. This problem gives a `list` of tuples, meant to represent edges. Some problems give a 2D array, `list[list]`, meant to represent a grid of values. Others have `Node` and `Edge` classes. Understanding the graph representation is key to solving any graphing problem.

The first step is to create an **adjacency list**. An adjacency list is a map of lists, where the key is the node and the value is a list of neighbors. For this problem, the value will be a tuple of both the neighbor node and weight to reach the neighbor.

```python
def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
    adj = defaultdict(list) # adjacency list
    for u, v, w in times: # u -> v with weight w
        adj[u].append((v, w))
```

In our min heap, we will want to keep track of both the total time to reach a node and the node itself. This will allow us to prioritize searching the shortest path first. We will also want to keep track of the total time to reach each node. We can do this with a `dist` dictionary. Then, we can initialize our min heap to start at the `k` node and have a time of 0.

```python
    distances = [0] * n # n = number of nodes
    min_heap = [(0, k)] # (time, node)
```

At each step of our search, we will:

1. Pop the minimum from the heap.
2. Check if we have already visited this node (common for BFS). We want to check this not only to stop cycles, but also because as soon as we pull a node from the min heap, we know that that distance is the absolute minimum, and therefore have found the minimum distance from the starting node to the current node. There is no need to ever go back to this node.
3. Update the distance to reach this node, as it is the minimum distance from the starting node to this current node.
4. Add the neighbors of this node to the heap as a tuple, including the total time to get to this node's neighbor.

```python
    while min_heap:
        # we know this weight is the min weight from this node
        #   from starting node IF it is not visited
        weight, node = heapq.heappop(min_heap)
        if node in visited: continue
        visited.add(node)
        distance[node - 1] = weight # nodes are 1-indexed in this problem
        for nei_weight, nei_node in adj[node]:
            if nei_node not in visited: # small optimization
                # push total weight to reach this node from starting node
                heapq.heappush((weight + nei_weight, nei_node))
```

Now we have a `distance` list that includes the minimum distance to reach any node from the starting node! For the sake of this problem we want to return the maximum distance in this list, if all nodes were successfully visited. It is possible a node is disconnected and couldn't be visited from the starting edge. In that case, the problem asks us to `return -1`.

```python
    return max(distance) if len(visited) == n else -1
```

This is a complete use of Dijkstra's, although a complete use is not the most efficient for this problem. There is no need for us to store the distance to _every_ node in this problem, as we just want the max. Therefore, we can modify the solution as follows:

```python
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        adj = defaultdict(list)
        for u,v,w in times:
            adj[u].append((w,v))

        max_distance = 0 # this was distance = [0] * n
        min_heap = [(0,k)] # time, node
        visited = set()
        while min_heap:
            time, node = heapq.heappop(min_heap)
            if node in visited:
                continue
            visited.add(node)
            max_distance = max(time, max_distance) # this was distance[node - 1] = time
            for weight, neighbor in adj[node]:
                if neighbor not in visited:
                    heapq.heappush(min_heap, (weight + time, neighbor))
        return max_distance if len(visited) == n else -1
```

#### Big-O analysis of Dijkstra's Algorithm:

- Let $E$ be the number of edges and $V$ be the number of vertices.
- The maximum number of edges we can have is about $V^2$. This is because every node can connect to every other node. So for node 1, it can have $N-1$ edges, node 2 can have $N-1$ edges, and so on. This is $V * (V-1) \approx V^2$.
- The maximum size of our min heap is $V^2$ because we can have $V^2$ edges, and the $V$ nodes can repeat in the heap.
- Because the maximum size of our min heap is $V^2$, the max time complexity to add to the heap is $O(\log V^2) = O(2 \log V) = O(\log V)$.
- We can add at most $V^2$ edges to the heap, so the **worst-case time complexity** is $O(V^2 \log V)$ for a dense graph. On average, the time complexity is $O((V + E) \log V)$, because we are either adding or removing from the heap $V + E$ times.
- The **space complexity** is $O(V)$, because we store the distance to each node.

### Grid Traversal with Dijkstra's

Let's take a look at one more problem that can be solved using Dijkstra's. While the last problem used an adjacency list, this problem involves a grid. We will see how Dijkstra's works the same, just the traversal pattern differs between the two graph representations.

The goal of [778. Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/) is to find the least time to swim from the top left to the bottom right of the grid. The water rises at a rate `t`, and the elevation at every point is given. To swim from on point on the grid to another, we must wait for the water to rise to the given elevation. While this may seem complicated at first (and the LeetCode problem statement gives a better description than I do), the problem is really asking for the cheapest path from start to end. The cost is determined by the elevation and how long we would have to wait for the water to rise to go somewhere. To find the cheapest path, we will use Dijkstra's algorithm.

To start, we will define our min heap and structure to track the cheapest path at each point. While in the last problem we initialized an array to maintain the cheapest paths, we will use a dictionary for this problem. The dictionary will serve as our `visited` set as well! The min heap is a tuple containing both the cost to travel to the coordinate and the coordinate itself on the grid.

```python
def swimInWater(self, grid: List[List[int]]) -> int:
    N = len(grid)
    min_heap = [(grid[0][0], 0, 0)] # cost, i, j
    cheapest = {}
```

Next, we will continue popping from the min heap until it is emptyk. For each point we pop, we will add it to the cheapest dictionary, if not already in `cheapest`. We are guarenteed the popped element, if not in `cheapest`, **will be the cheapest possible path** because the min heap prioritizes minimum path. Therefore, we want to next add all adjacent points and their costs if on the grid and not in `cheapest` already.

```python
    while min_heap:
        cost, i, j = heapq.heappop(min_heap)
        if (i,j) in cheapest: continue
        cheapest[(i,j)] = cost
        if i-1 >= 0 and (i-1,j) not in cheapest:
            heapq.heappush(min_heap, (max(cost, grid[i-1][j]), i-1, j))
        if i+1 < N and (i+1,j) not in cheapest:
            heapq.heappush(min_heap, (max(cost, grid[i+1][j]), i+1, j))
        if j-1 >= 0 and (i,j-1) not in cheapest:
            heapq.heappush(min_heap, (max(cost, grid[i][j-1]), i, j-1))
        if j+1 < N and (i,j+1) not in cheapest:
            heapq.heappush(min_heap, (max(cost, grid[i][j+1]), i, j+1))
```

Finally, now that we have filled `cheapest`, we just want to return the bottom right point's cheapest path!

```python
    return cheapest[(N-1, N-1)]
```

#### Big-O analysis of Dijkstra's Algorithm for Grid Traversal:

- Let $N$ be the number of coordinates in our grid. Then, we know the number of edges we have is $\sim 4 \cdot N$.
- We know our heap will have in the worst case, every edge, and therefore adding an element to the min heap will cost $\sim \log{(4 \cdot N)} \rightarrow \log N$
- Because we can add every possible edge, the **worst-case time complexity** is $O(4N \log N) = O(N \log N)$.
- The sapce complexity is $O(N)$ because we store the cheapest path to each node, and the min heap can have at most $4 \cdot N$ elements.

## Prim's Algorithm

Prim's Algorithm is a **Minimum Spanning Tree** algorithm, connecting all nodes in a graph with a minimum total edge weight. As we will see, the solution is greedy and similar to Dijkstra's in that we use a min heap to prioritize cheapest paths.

The problem [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/) asks us to find the minimum cost to connect all points on a plotted graph. We connect the points using the **manhatten distance** between them: $|X_1 - X_2| + |Y_1 - Y_2|$.

First, we want to create a graph representation of these points by creating an adjacency graph. We will create an edge between every pair of points. Let's let $N$ represent the number of points we have. We will loop through $N$ once, and for every $i$ in $0, ..., N-1$, we will loop through $i+1$ to $N$, giving us a $j$. We will add `points[i]` to `points[j]`'s neighbors and vice versa. Therefore, after $i = 0$ and $j = [1, ... N - 1]$, we will have an edge from `points[0]` to every other point, and do not have to revisit it in our loop.

Now that we have our adjacency list, we can initialize our traversal data structures. We will maintain a visited list, so we don't go back to the same node twice. Similar to Dijkstra's, will use a min heap to prioritize the cheapest path to any node. The min heap will include cost and coordinate tuples.

```python
def minCostConnectPoints(self, points: List[List[int]]) -> int:
    N = len(points)
    if N == 1: return 0
    adj = defaultdict(list) # adjacency list
    for i in range(N):
        for j in range(i+1,N):
            adj[i].append(j)
            adj[j].append(i)
```

Here is the pattern for our traversal:

1. Check if the heap is empty. If empty, we are finished.
2. Pop from the top of the heap. If node is in visited, continue. The popped element is the cheapest **path** from the starting node to the current node. This is important to understand: the path is _not_ the cheapest path from _any_ node to the current element, just the cheapest from a given node. It makes more sense when you consider the starting scenario:
   - Suppose we are starting the algorithm. Our min heap will just have the first coordinate and a cost of 0 (it costs nothing to travel to the first node). We pop this element and add it to the visited list. We do not want to visit it again because that would cause a cycle _and_ we will add every possible outgoing edge to the min heap. On the next iteration, _we have to_ choose an edge to connect our first node to another node, _even_ if it isn't the cheapest way to reach that given node. The other edges stay in the min heap, as it is possible we have two cheapest outgoing edges from the first node.
3. Add the neighbors and the outgoing edge cost (manhattan distance) to the min heap.

In addition, we will maintain a total cost as we go through this loop.

```python
    total = 0
    visited = set()
    min_heap = [(0, 0)]
    while min_heap:
        distance, i = heapq.heappop(min_heap)
        if i in visited: continue
        visited.add(i)
        total += distance
        for j in adj[i]:
            if j in visited: continue
            distance = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
            heapq.heappush(min_heap, (distance, j))
```

Finally we return the total.

```python
    return total
```

#### Big-O analysis of Prim's Algorithm:

- Let $N$ be the number of points in our graph.
- We have $N$ points, and for each point, we have $N-1$ edges. Therefore, the number of edges is $N \cdot (N-1) \approx N^2$.
- The maximum size of our min heap is $N^2$ because we can have $N^2$ edges, and every edge could appear in the heap.
- Because the maximum size of our min heap is $N^2$, the max time complexity to add to the heap is $O(\log N^2) = O(2 \log N) = O(\log N)$.
- We can add at most $N^2$ edges to the heap, so the **worst-case time complexity** is $O(N^2 \log N)$ for a dense graph. In our case, the graph will be dense because every point is connected to every other point.
- The **space complexity** is $O(N)$, because we store the distance to each node.

## Topological Sort (Kahn's Algorithm)

The goal of topological sort is to get a linear ordering of nodes from a graph, such that every directed edge from $u \rightarrow v$, $u$ comes before $v$ in ordering. That is, the start of the ordering is with nodes that have no incoming edges, and next comes nodes that only have incoming edges from the outcoming edges of the starting nodes. Therefore, topological sort cannot have cycles, and will detect cycles. From the [wiki](https://en.wikipedia.org/wiki/Topological_sorting): "Precisely, a topological sort is a graph traversal in which each node v is visited only after all its dependencies are visited." While topological sort can be done with DFS, this will cover **Kahn's Algorithm**, a BFS solution to topological sort.

> A **Directed Acyclic Graph** (DAG) is a directed graph with no directed cycles. Topological Sort only works with DAGs, and even disonnected DAGs with some algorithms.

### DFS Solution Overview

I will quickly cover the depth-first search solution to topological sort, although I believe it is less intuitive. It involves calling a recursive function on each node in a graph. The recursive function has base cases to check if the node has already been visited, or a cycle exists. A node is only marked as visited once all its children are visited. To detect a cycle, a second visited list exists. The node is added to this second visited list before recursively calling the function on all its neighbors. Therefore, if a neighbors' neighbor leads to the original node, we can flag a cycle. After recursively calling the function on all its neighbors, we know all the outgoing edges are visited for this node, and we **prepend** this node to our result list. Prepending also allows us to guarentee a correct order, because we can start at any node. For example, if we start with a node with ingoing and outgoing edges, it will not be prepended until all outgoing edges have been visited - therefore, all the outgoing edges will be prepended before the parent is prepended. If we start with a node that has no ingoing edges, we are guarenteed a correct order because all children of this node will be prepended before it is prepended. Anything else we call the recursive function on will either already be prepended or also not have any ingoing edges.

> **Prepend** means to add to the head (start) of a list.

<details>
<summary>If you are interested, here is the <a>wiki pseudocode</a href="https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search">.</summary>

```
L ← Empty list that will contain the sorted nodes
while exists nodes without a permanent mark do
    select an unmarked node n
    visit(n)

function visit(node n)
if n has a permanent mark then
return
if n has a temporary mark then
stop (graph has at least one cycle)

    mark n with a temporary mark

    for each node m with an edge from n to m do
        visit(m)

    mark n with a permanent mark
    add n to head of L
```

</details>

It should be noted that this algorithm won't work with disonnected DAGs. The time complexity for this algorithm is $O(N)$ because we only visit each node at most once.

### Kahn's Algorithm

Kahn's Algorithm is a BFS solution to topological sort. The algorithm utilizes a set to keep track of all nodes with _no incoming edges_. This set must be initialized with, then is looped through until empty. For each node in the set, add it the result and remove all outgoing edges and add the neighbors who no longer have any incoming edges. If the set is empty and the loop concludes, but the graph still has edges, a cycle has been detected.

A wonderful LeetCode question to practice Kahn's is [207. Course Schedule](https://leetcode.com/problems/course-schedule/). The problem statement asks us to determine if we can take all the courses given the set of prerequisites. If we can create a topological ordering of the courses, we can take all courses. Moreover, we can take all courses as long as there isn't a cycle in the prerequisites, and topological sort can be used to detect cycles.

To start, we will define an adjacency list of courses and their prerequisites. When creating this list, we will keep track of which courses that have no prereqs. This is where we will want to start our topological ordering.

```python
def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
    adj = { course: [] for course in range(numCourses) }
    ingoing = { course: 0 for course in range(numCourses) }
    no_prereqs = set(list(range(numCourses)))
    for course, prereq in prerequisites:
        if course in no_prereqs:
            no_prereqs.remove(course)
        if course not in adj[prereq]:
            adj[prereq].append(course)
            ingoing[course] += 1
```

Then, we can continue with topological sorting, starting with courses that have no prereqs. We will continually update courses by removing the given prereq. By the time we are done, there should be no edges left in our graph. If there are edges left, that means we found a scenario where we couldn't remove all the prereq dependencies, and the is a cycle. In this case we return false.

```python
    while no_prereqs:
        copy = list(no_prereqs)
        no_prereqs = set()
        for course in copy:
            for course_2 in adj[course]:
                ingoing[course_2] -= 1
                if ingoing[course_2] == 0:
                    no_prereqs.add(course_2)
    return sum(list(ingoing.values())) == 0
```

To expand upon this, we can solve [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/), which doesn't just ask us if we _can_ take all the courses, but the order in which we should take them. This is a perfect example where the topological ordering is necessary to solve the problem. In Course Scedule I, we were more interested in the existence of a cycle, and not the order of the courses. Furthermore, a cycle detection specific algorithm will be covered for Course Schedule I in a later section.

We will see that Course Schedule II only requires a small modification of the Course Schedule I solution above. The solution above doesn't track a topological ordering, but does sort topologically. We simple have to add a `list` to track the ordering.

```python
def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    adj = { course: [] for course in range(numCourses) }
    ingoing = { course: 0 for course in range(numCourses) }
    no_prereqs = set(list(range(numCourses)))
    for course, prereq in prerequisites:
        if course in no_prereqs:
            no_prereqs.remove(course)
        if course not in adj[prereq]:
            adj[prereq].append(course)
            ingoing[course] += 1
    output = [] # topological ordering
    while no_prereqs:
        copy = list(no_prereqs)
        output += copy # add all current courses with no prereqs in any order
        no_prereqs = set()
        for course in copy:
            for course_2 in adj[course]:
                ingoing[course_2] -= 1
                if ingoing[course_2] == 0:
                    no_prereqs.add(course_2)
    return output
```

#### Big-O analysis of Kahn's Algorithm:

The time complexity of Kahn's is $O(V + E)$ because we visit each node and edge once. The space complexity is $O(V)$ because we store the result and the set of nodes with no incoming edges.

## Cycle Detection

Going back to [207. Course Schedule](https://leetcode.com/problems/course-schedule/), we can create a more intuitive solution by using a cycle detection specific algorithm instead Kahn's Algorithm. I will cover a DFS graph cycle detection algorithm. We will again create an adjacency list of prerequisites to every course.

```python
def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
    adj = { course: set() for course in range(numCourses) }
    for course, prereq in prerequisites:
        adj[course].add(prereq)
```

Then, we will recursively search through every course until we have reached the final prereq with no other prereqs. If we reach a node we have already visited, we will enter a loop. In this case, we will return false. We will simply define a function `cycle` to check for a cycle and call it on every possible course.

```python
    visited = set()
    def cycle(course):
        if course in visited:
            return True
        visited.add(course)
        for prereq in adj[course]:
            if cycle(prereq):
                return True
        visited.remove(course)
        return False
    for course in range(numCourses):
        if cycle(course):
            return False
    return True
```

### Big-O Analysis of Cycle Detection

- Let $N$ be the number of courses. Let $E$ be the number of edges in our graph (prerequisites).
- Our time complexity is $O(N*E)$ because it is possible we visit every prerequisite for every course. There is repeated work that could be simplified in a later solution. A better solution would involve keeping track of courses without a cycle during a recursive function call, rather than just the root. For example, if we have the prereq graph `A->B->C->D`, when we call `cycle(A)`, we will also find out that `cycle(B)`, ..., `cycle(D)`, and can store those in a set. The appended solution is below, and has a time complexity of $O(E)$ because we only every visit each edge once.
- Our space complexity is $O(E)$ because we store every edge in our adjacency list.

### $O(E)$ Cycle Detection

We simply add a `checked` set to keep track of the solution to inner recursive function calls and avoid repeated work.

```python
def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
    adj = { course: set() for course in range(numCourses) }
    for course, prereq in prerequisites:
        adj[course].add(prereq)
    visited = set()
    checked = set()
    def cycle(course):
        if course in visited:
            return True
        visited.add(course)
        for prereq in adj[course]:
            if course not in checked:
                if cycle(prereq):
                    return True
                else:
                    checked.add(prereq)
        visited.remove(course)
        return False
    for course in range(numCourses):
        if course not in checked:
            if cycle(course):
                return False
            else:
                checked.add(prereq)
    return True
```

<hr>

## Trees

This is a review of popular tree algorithms and problem solving tree traversals. Below includes: **Least Common Ancestor**, **Back Tracking**, and **Binary Search Tree Traversal**. Trees are acyclic graphs. For binary trees, each node has at most two children.


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

<hr>

## Tree Traversals


This is a review of popular tree traversals: **Preorder Traversal**, **Postorder Traversal**, and **Inorder Traversal**.


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

<hr>

## A*

This will be a short introduction to the A* search algorithm. I'll start by introducing breadth first search and dijkstra's algorithm. Having these two algorithms mastered will make A*'s implementation far more intuitive.


## Breadth First Search (BFS)

BFS is a graph traversal algorithm that explores all the vertices at a current depth before moving to the next depth.

> A **vertex** is a node in a graph.

> An **edge** is a connection between two vertices.

> The **depth** of a vertex is the number of edges from the root vertex.

For the sake of explaining BFS as a concept, we will ignore the implementation details, which would include queues and checking for cycles.

**Example**: Consider the following graph:

```
A -> B -> C -> J
|    |    |    |
v    v    v    v
D -> E -> F -> K
|    |    |    |
v    v    v    v
G -> H -> I -> L
```

A use of BFS would be to find the distance between two vertices. For example, the distance between `A` and `L` is 5.

1. Depth 0: `A`
2. Depth 1: `B`, `D`
3. Depth 2: `C`, `E`, `G`
4. Depth 3: `J`, `F`, `H`
5. Depth 4: `K`, `I`
6. Depth 5: `L`

Here, we have explored all the vertices at a current depth before moving to the next depth. We find it takes 5 steps to get from `A` to `L`.

The pseudocode for BFS:

```python
# graph: { vertex: [neighbors] }
# start_vertex: vertex
# end_vertex: vertex

def BFS(graph, start_vertex, end_vertex):
  queue = []
  visited = set()
  queue.append(start_vertex)
  visited.add(start_vertex)

  while queue:
    vertex = queue.pop()
    if vertex == end_vertex:
      return True
    for neighbor in graph[vertex]:
      if neighbor not in visited:
        queue.append(neighbor)
        visited.add(neighbor)
  return False
```

## Dijkstra's Algorithm

Dijkstra's algorithm is also a graph traversal algorithm. It's general purpose is to find the cheapest path from one vertex to any other.

> The **cheapest path** is the path with the lowest cost.

> The **cost** of a given path is the sum of the weights of the edges.

> Each edge has an associated **weight**.

Here is the basic idea of Dijkstra's algorithm:

1. Choose a starting vertex in the graph.

2. A data structure stores the distance to each vertex from the starting vertex.

   - Initially, the distance is $\infty$ for all vertices except the starting vertex, which is $0$.

3. Define a `current vertex` as the starting vertex.

   - This vertex is an unvisited vertex with the smallest distance from the starting vertex.
   - Initially, this is the starting vertex as that vertex is the only unvisited vertex with a distance of 0.

4. For each `neighbor vertex` of the `current vertex`, calculate a new `distance` from the starting vertex.

   - `distance = current vertex distance + weight of edge from current vertex to neighbor vertex`
   - If `distance` is less than the neighbor's current stored distance, update the neighbor's distance

5. Mark the `current vertex` as visited.

6. Repeat steps 3-5 until all vertices are visited.

The pseudocode for Dijkstra's algorithm:

```python
# graph: { vertex: {neighbor: weight} }
# start_vertex: vertex
# end_vertex: vertex

def dijkstra(graph, start_vertex):
  queue = [], visited = []

  distances = { vertex: infinity for vertex in graph }
  distances[start_vertex] = 0
  queue.add( { distance: 0, vertex: start_vertex } )

  while queue is not empty:
    current_distance, current_vertex = queue.pop()

    if current_vertex in visited: continue

    visited.add(current_vertex)
    for neighbor, weight in graph[current_vertex].items():
      distance = current_distance + weight

      # distance[neighbor] is neighbor's stored distance
      if distance < distance[neighbor]:
        distances[neighbor] = distance
        queue.add( { distance, vertex: neighbor } )

  return distances
```

I'd like to point out that we only add `neighbor` to the queue when we find a shorter path to that neighbor. This is important for a few reasons:

- If we don't add to queue under a condition, we may cycle forever through the graph.
- The condition prevents doing unnecessary work, as the neighbors of `neighbor` only need their shortest distance calculated if we find a shorter path to `neighbor`.
- This condition makes Dijkstra's algorithm greedy, as we prioritize the checking the shortest path _so far_. We don't know yet whether this is the absolute shortest path, or just a local shortest path. Furthermore, the queue management (which I didn't really cover in the pseudocode) is also greedy, as the smallest tentative distance currently given by vertices in the queue.

It is important to point out we don't visit each vertex only once under this condition, but rather only once whenever a shorter path is found.

## A\* Search Algorithm

The goal of the A\* search algorithm is to find the shortest path from a starting to an ending vertex. A\* encorporates concepts of both BFS and Dijkstra's algorithm. What differientiates A\* from other path finding algorithms is that it is smarter, which we will learn about below. A\* is a popular method for efficiently finding the shortest path in a graph.

The A\* algorithm uses a heuristic to estimate the cost of the cheapest path from the starting to the ending vertex. This heuristic is similar to the `distance` calculation above in Dijkstra's algorithm. At each step, A\* chooses the vertex with the smallest `f` value, where:

$$
f = g + h
$$

> $g$ is the cost to get to the current vertex from the starting vertex.

> $h$ is the heuristic. It estimates the cost from the current vertex to the ending vertex.

> So, $f$ is the estimated cost of the cheapest path from the starting vertex, through the current vertex, to the ending vertex.

> A **heuristic** is an estimated cost to reach the goal from the current vertex.

The A\* algorithm works as follows:

1. Initialize an open set and closed set. These sets will store vertices and their `f` values. The open set has vertices we want to explore, while the closed set has vertices fully explored.

   - This is similar to the `queue` and `visited` sets in Dijkstra's algorithm.

2. Add the starting vertex to the open set, as that is where we want to start exploring.

3. Take the vertex with the smallest `f` from the open set.

4. If the vertex is the ending vertex, we have found the shortest path.

5. For each neighbor of the current vertex, calculate `f`. Remember, `f = g + h`.

   - If the neighbor is in the open set and the new `f` value is lower, update the neighbor's `f` value.
   - If the neighbor is in the closed set and the new `f` value is lower, move the neighbor back to the open set.
   - If the neighbor is in the closed set and the new `f` value is higher, ignore the neighbor.
   - If the neighbor is not in the open set, add it to the open set.

6. Move the current vertex to the closed set.

7. Repeat steps 3-6 until the open set is empty.
