---
title: "Flutter and Dart"
description: "My notes on Flutter and Dart, from a React and JavaScript background."
pubDate: "June 2, 2024"
---

These are my notes on Flutter (and subsequently Dart) from my 2024 summer internship at [BillMax](https://billmax.com). I continually update this page from June to August 2024 with notes, documentation, and other cool things I learn during this mobile development. I have never touched mobile application development before this summer, rather having a strong background in web development (React and Vanilla HTML, CSS, JavaScript). It is interesting to make note of the similarities and differences between the web and mobile development.

<hr>

## My Thoughts and Impressions

At first glance, I wasn't a fan of Flutter. There seems to be a lot of boilerplate code and inline styling (even with a UI library, in this case Material UI), making it difficult to debug. Working off an existing application, it was not easy to understand existing implementation due to the cluttered styling and long lined files. Something I would love to look into is a style sheets for mobile development, which _likely do_ exist but I just haven't had the time research, nor is refactoring the priority of this internship, as we're developing an MVP.

Similar to standard web development, Flutter applications has a foundational hierarchical structure. But unlike HTML, elements aren't divided by `<>` tags and instead have children and parent variables. For example, look at the React segment below:

```javascript
const MyComponent = () => {
  return <div>Hello world!</div>;
};
```

The same could be written in Flutter as:

```dart
class MyComponent {
    @override
    Widget build(BuildContext context) {
        return Container(
            child: Text("Hello World!")
        )
    }
}
```

As you can see, Flutter has more boilerplate. Dart is class based unlike JavaScript. In this regard, I like Flutter, as it reminds of other reliable and languages like Java.

## States and Asyncs

All modern frontend frameworks have state and async management systems. A promise in React corresponds to future in Flutter:

```dart
Future<num> fetchFunc(String x) async {
    print(x);
    return await http.get(url);
}
```

In addition, we can make note of the Dart function syntax. The return type comes before the function. Types are always labeled (`dynamic` corresponds to `any` in React). And when the function is asyncronous, `async` is included after the function definition header. Console prints like Python `print`. `await` similar to React.
