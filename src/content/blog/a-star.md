---
title: "A* Search Algorithm"
description: "Introduction to the A* search algorithm."
pubDate: "April 2, 2024"
---

This will be a short introduction to the A* search algorithm. I'll start by introducing breadth first search and dijkstra's algorithm. Having these two algorithms mastered will make A*'s implementation far more intuitive.

<hr>

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
