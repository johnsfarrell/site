---
title: "Implementing a Neural Network"
description: "Implementing a neural network from scratch with sigmoid and softmax activations using Python."
pubDate: "April 6, 2024"
---

This is a guide to implementing a neural network and training with gradient descent.

<hr>

## Background

We will start with an example identifying handwritten digits using the [MNIST dataset](https://en.wikipedia.org/wiki/MNIST_database). This problem has 10 classes (digits $0-9$). Each image in the database is $28 \times 28$ pixels, meaning each input is a linearlized $1 \times 784$ vector. The output of the CNN will be a $1 \times 10$ vector, where each feature represents the probability of the input being a digit $0-9$.

For now, let's suppose our network has one fully-connected layer with 10 neurons, one neuron per class or digit. Each neuron has a weight for each input and a bias term.

> A **neuron** is a single node within a neural network layer. Neurons, also known as perceptrons, take in and process a set of data and output a set of data. More information on the neuron (perceptron) can be found [here](/writing/neural-networks#perceptrons).

> Because our first layer is a **fully-connected layer**, each neuron in this layer takes in all the input data, making 784 connections and weights. More on different neural network layers [here](/writing/nn-layers).

### Definitions

Let's define variables for our network:

- $x$ is the input data, a $1 \times 784$ vector.

$$
x = \begin{bmatrix} x_1 & x_2 & \cdots & x_{784} \end{bmatrix}
$$

- $y$ are the input data labels, a $1 \times 10$ vector.

$$
y = \begin{bmatrix} y_1 & y_2 & \cdots & y_{10} \end{bmatrix}
$$

- $p$ is the probability output of the network, a $1 \times 10$ vector. Each value in $p$ corresponds to a value in $y$.

$$
p = \begin{bmatrix} p_1 & p_2 & \cdots & p_{10} \end{bmatrix}
$$

- $w$ are the weights per neuron, a $784 \times 1$ matrix per neuron. For all 10 neurons, $w$ is a $784 \times 10$ matrix.

$$
w = \begin{bmatrix}
w_{1,1} & w_{1,2} & \cdots & w_{1,10} \\
w_{2,1} & w_{2,2} & \cdots & w_{2,10} \\
\vdots & \vdots & \ddots & \vdots \\
w_{784,1} & w_{784,2} & \cdots & w_{784,10}
\end{bmatrix}
$$

- $b$ are the bias of a neuron. For all 10 neurons, $b$ is a $1 \times 10$ vector.

$$
b = \begin{bmatrix} b_1 & b_2 & \cdots & b_{10} \end{bmatrix}
$$

- $l$ is the output of the fully-connected layer, a $1 \times 10$ vector. $l$ stands for logits.

$$
l = \begin{bmatrix} l_1 & l_2 & \cdots & l_{10} \end{bmatrix}
$$

Now we can define an output per neuron in the fully connected layer:

$$
l_j = w_j \cdot x + b_j = \sum_{i=1}^{784} w_{i,j} \cdot x_i + b_j
$$

where $j$ is the index of the current neuron.

We can turn our logits into probabilities for each class:

$$
p_j = \frac{e^{l_j}}{\sum_j e^{l_j}}
$$

This is simply the exponential of the current logit divided by the sum of all logit exponentials. This is known as the softmax function.

> The **softmax function** is guarenteed to output a probability distribution ($\sum_j p_j = 1$), and is popular for determining the best class in a classification problem for convolutional neural networks.

To train our model, we want to define a loss function for the difference between $p$ and $y$, our predicted and actual values:

$$
L(w,b,x) = -\sum_j^{10} y_j \log(p_j)
$$

where $y_j = 1$ if the input is class $j$, and $0$ otherwise.

This is known as the cross-entropy loss function. We can use this loss function to compute error, which is defined as $1 - \text{accuracy}$.

> **Cross-entropy loss** measures how well the predicted probability distribution matches the actual distribution. This loss function minimizes the amounts of information needed to represent the truth distribution versus our predicted distribution. When the amount of information needed is similar, the loss is low and both distributions are similar. There are other loss functions available, but cross-entropy most is popular for classification problems.

## Training

To train our model, we calculate the loss function $L$ for every different training example, also known as an epoch. We repeat this for many epochs until hte loss over all training examples is minimized.

> A **training example** is a single input and output pair. This is used to update the weights and biases of the network.
> An **epoch** is a single pass through the entire dataset. This is used to update the weights and biases of the network.

The most common strategy for minimizing the loss function is gradient descent. For each training example, we will use backpropagation to update weights and biases via a learning rate.

> **Gradient descent** is an optimization algorithm to minimize a function by iteratively moving in the direction of steepest descent. Steepest descents are calculated by the gradient of the function at the current point.

> The **learning rate** is one of the neural network's hyperparameters. It determines how far each step of gradient descent should go.

> **Backpropagation** is a method to calculate the gradient of the loss function with respect to the weights and biases of the network. Backpropagation is used with gradient descent to update the weights and biases.

The weights and biases are updated as follows:

$$
w_{i,j} = w_{i,j} - \lambda \frac{\partial L}{\partial w_{i,j}}
$$

$$
b_j = b_j - \lambda \frac{\partial L}{\partial b_j}
$$

where $\lambda$ is the scalar learning rate.

In order to calculate the partial derivatives, we need to deduce $\frac{\partial L}{\partial w_{i,j}}$ and $\frac{\partial L}{\partial b_j}$ in terms of $x_i$ and $p_j$.

The derivatives are as follows:

$$
\begin{equation}
\frac{\delta L}{\delta w_{ij}} = \frac{\delta L}{\delta p_a} \frac{\delta p_a}{\delta l_j} \frac{\delta l_j}{\delta w_{ij}} =\begin{cases}
x_i(p_j-1), a = j\\
x_ip_j,  a\neq j
\end{cases}
\end{equation}
$$

$$
\begin{equation}
\frac{\delta L}{\delta b_j} = \frac{\delta L}{\delta p_a} \frac{\delta p_a}{\delta l_j} \frac{\delta l_j}{\delta b_j} =\begin{cases}
(p_j-1), a = j\\
p_j,  a\neq j
\end{cases}
\end{equation}
$$

We skip much of the calculation here, but the derivatives are derived from the chain rule, using backpropagation. More extensive derivation walkthroughs can be found [here](https://en.wikipedia.org/wiki/Backpropagation).

# Learn More

- [CNNs CSCI1430](https://browncsci1430.github.io/hw5_cnns/)
