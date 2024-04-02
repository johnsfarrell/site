---
title: "A*"
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
