---
title: "Decorators"
description: "What is a decorator in Python?"
pubDate: "July 25, 2024"
---

Decorators are an important concept to understand, especially when working with libraries and packages in Python. Below discusses what a decorator is, and the most recent use case I found for them, **Prefect Flows**.

<hr>

**_Use Case:_** A **flow** in [Prefect](https://www.prefect.io/) is like a function. It may take inputs and may return an output. Flows may consist of subflows, as well as tasks. Flows can be deployed through the [Prefect API](https://docs.prefect.io/latest/api-ref/) for monitoring and scheduling. Something so great about Prefect is that you can _easily_ make a flow by adding `@flow` above any function. `@flow` is the decorator.

```python
from prefect import flow

@flow
def hello_world():
    print("Hello, world!")
```

To understand a decorator, we must understand that a function in python is a **first class object**. A first class object in Python can be used and passed as arguments. Furthermore, one can store first class functions in data stuctures and return them from another function. More on [first class functions in Python](https://www.geeksforgeeks.org/first-class-functions-python/). Below is an example of using a function as a variable in Python.

```python
def add(a,b):
    return a + b
def subtract(a,b):
    return a - b
# computer is either of the functions above
def compute(a,b,computer):
    return computer(a,b)
```

A **decorator** is a higher-order function. A **higher-order function** takes other functions as their input and returns another function. A decorator simply adds extra functionality to an existing function, it _decorates_ it. For Prefect, the `@flow` decorator adds functionality we will learn more about, but it includes many of the capabilities such as scheduling, logging, and monitoring. Below is an example of a decorator.

```python
def my_decorator(func):
    def wrapper():
        print("scheduling this...")
        func()
        print("logging that...")
    return wrapper

@my_decorator
def my_flow():
    print("executing stuff")
```

Decorators are used in many popular libraries, include Prefect above. They are a powerful tool to add functionality to existing code. It is both helpful and rewarding to explore these features and nuances in Python!

Helpful resources:

- [Python Decorators](https://realpython.com/primer-on-python-decorators/)
- [First Class Functions in Python](https://www.geeksforgeeks.org/first-class-functions-python/)
- [Prefect](https://prefect.io/)
