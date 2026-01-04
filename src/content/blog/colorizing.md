---
title: "Colorizing Grayscale Images"
description: "Using VGG19 U-Net architecture to colorize legacy black and white photography."
pubDate: "May 15, 2024"
---

![Colorize Banner](/images/blog/colorization/banner.jpeg)

This is a review of my [computer vision](https://browncsci1430.github.io/) final project, to restore color to legacy black and white photography. We trained a convolutional neural network (CNN) to colorize grayscale images using a VGG19 U-Net architecture with TensorFlow. The project was called RGBIT and was maintained as a 100% free and open-source application and API to restore color to legacy grayscale photography. A live version of the project can be found [here](https://rgbit.johnfarrell.io). Contributors to this project include: Tyler Gurth, John Farrell, Hunter Adrian, and Jania Vandevoorde.

[GitHub Repository](https://johnsfarrell.github.io/rgbit), [Live Demo](https://rgbit.johnfarrell.io), [Research Report](https://rgbit.johnfarrell.io/research/report.pdf)

<hr>

## Summary

We sought to create a model architecture and algorithmic process to take grayscale photos, and color them to a high efficacy. Through proper research, we determined that large **Convolutional Neural Networks** (CNNs) would be the most proficient in this difficult task. Although often used for recognition and classification, a basic understanding of a CNN is that it takes an input and an output, and tries its best to create weights that make that conversion.

We implemented a convolutional neural network (CNN) to colorize grayscale images using a **U-Net architecture with the VGG-19 model**. U-Net is a popular deep learning architecture known for its effectiveness in image segmentation tasks. VGG-19 is a large model with almost 150 million parameters that is pre-trained. It is traditionally used for feature detection and was adapted for colorizing in our project. Our model is trained using the MIT Places365 dataset, which contains 365,000 images of scenes (which we split into 328,500 train and 36,500 test images, a 90/10 split). Moreover, the model makes use of a custom Perceptual Loss function for a higher level chromatic evaluation of the CNN. Our results show that the model produces vibrant and realistically colored images. This project reinforces the potential of deep learning in creative image processing. Below is our VGG-19 U-Net architecture.

![Architecture](/images/blog/colorization/architecture.png)

## Methodology

On the simplest level, the goal of this project and our model is to convert a grayscale image to color. In other words, converting a 2d array of light intensities to a more complex array of color values. A naive approach is to use the RGB colorspace. Our model input is a $1 \times l \times w$ matrix, where $l$ and $w$ are the dimensions of our image. The output is a $3 \times l \times w$ matrix, there each channel is an RGB channel. A better approach is to use the [LAB](https://en.wikipedia.org/wiki/CIELAB_color_space) colorspace. The L channel represents light intensity, the same as our imput. The A and B channels represent the color values. The A channel represents the green-red axis, and the B channel represents the blue-yellow axis. This is a more intuitive way to represent color, as it separates light intensity from color. Not only does this elimate an axis we must predict, but allows us to rescale the AB channels while maintaining the same light intensity. Another common colorspace for colorization is the [LUV](https://en.wikipedia.org/wiki/CIELUV) colorspace.

Because the pre-trained VGG-19 model expects a $3 \times l \times w$ matrix as input, we pass as input a 3 channel image of all L channels. In this case, $l \times w$ is $244 \times 224$. The model then predicts the AB channels, $2 \times 224 \times 224$. We compare the truth and predicted AB channels using our perceptual loss function, defined in detail in the next section. The model can be summarized as a function $f$.

$$
f: \mathbb{R}^{3 \times l \times w} \rightarrow \mathbb{R}^{2 \times l \times w}
$$

$$
loss(\mathbb{R}^{2 \times l \times w}, \mathbb{R}^{2 \times l \times w}) \Rightarrow \mathbb{R}
$$

Using the LAB colorspace allows us to input an image of any size, downscale it to $224 \times 224$, then upscale to original image quality, as we preserve the light intensity channel. This is a more robust approach than using the RGB colorspace. You can see this in live action on our [demo](https://rgbit.johnfarrell.io).

## Loss Function

Defining a loss function was simple enough, in fact, our naive implementations just used MSE (Mean Squared Error) to calculate the differences between predicted and ground truth $ab$ channel pairs. That being said, research guided us to define a more complex perceptual loss function, to consider images that had variations, but on a high level, should produce a similar smoothed color scheme. **The perceptual loss function prioritizes high-level features over pixel-level differences, which is more in line with how humans perceive color.** Our loss function is defined as follows:

We started with the MSE:

$$
\mathrm{MSE((Y*{i}, \hat{Y}*{i})} = \frac{1}{n} \sum*{i=1}^{n}(Y*{i}-\hat{Y}\_{i})^2
$$

We used this MSE as a component for finding what we call a Gaussian Filtered MSE (GD, or Gaussian Distance), (where $f$ is the filter size, and $G$ is the Gaussian filter function, which also takes a filter size.).

$$
\mathrm{GD((Y*{i}, \hat{Y}*{i}, f)} = \sqrt{MSE(G(Y*{i}, f), G(\hat{Y}*{i}, f))}
$$

We used our GMSE function at several filter sizes to define our loss function (where, here $M$ is the MSE function).

$$
L(Y*{i}, \hat{Y}*{i}) = \frac{\sqrt{\mathrm{M(Y*{i}, \hat{Y}*{i})}} + \mathrm{GD(Y*{i}, \hat{Y}*{i}, 3)} + \mathrm{GD(Y*{i}, \hat{Y}*{i}, 5)}}{3}
$$

Our loss function acts as a more complex, perceptual function with higher level smoothing, leading to faster convergences due to its somewhat underfitting nature. Although it is less sensitive to small variability, it resulted in smoother (and, more optimized) outputs.

Here is the code blob for our loss function:

```python
def percept_loss_func(self, truth, predicted):
    truth_blur_3 = blur(truth, (3,3))
    truth_blur_5 = blur(truth, (5,5))

    predicted_blur_3 = blur(predicted, (3,3))
    predicted_blur_5 = blur(predicted, (5,5))

    dist = mse(truth, predicted) ** 0.5
    dist_3 = mse(truth_blur_3, predicted_blur_3) ** 0.5
    dist_5 = mse(truth_blur_5, predicted_blur_5) ** 0.5

    return (dist + dist_3 + dist_5) / 3
```

## Results

Our final model achieved a validation **mean square error ~135**. This is a somewhat arbitrary metric, which compares the true and predicted AB channel difference for each pixel. The model is not meant to perfectly predict original colors, but to create a plausible and natural looking colorization.

The results of perceptual loss showed our model and architecture is viable for creating naturally looking colorful photos, but doesn't correctly account for unique coloring and saturation. To account for unsaturated colorization, we postprocess the images by increasing the contrast by $\times 1.3$. Colors returned are plausible and look natural to the human eye. The model can be used to color any grayscale image, but has best use-cases for naturally existing photos, such as old black and white photography or night vision goggles. Below are some example results from our model test dataset. The first image is the L channel, the second image is the truth coloring, and the third image is the predicted coloring.

|                                                                                                                       |                                                                                                                       |                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ![Places365_val_00015300](https://github.com/johnsfarrell/rgbit/assets/69059806/97252aa3-ff60-4b34-bcfd-8b298859e633) | ![Places365_val_00016263](https://github.com/johnsfarrell/rgbit/assets/69059806/ab2b338f-d3b7-478b-922e-4833d3c724b5) | ![Places365_val_00013593](https://github.com/johnsfarrell/rgbit/assets/69059806/9ecb55b1-04c4-46d2-86d0-eea965663165) |
| ![Places365_val_00017696](https://github.com/johnsfarrell/rgbit/assets/69059806/262ee216-d5d5-4f2a-812f-017f91e31825) | ![Places365_val_00011056](https://github.com/johnsfarrell/rgbit/assets/69059806/8aa37f98-823e-40b7-8dd0-dc665c7f3726) | ![Places365_val_00006786](https://github.com/johnsfarrell/rgbit/assets/69059806/0070ce38-db18-4e48-bb0c-71f742e6fb72) |
| ![Places365_val_00001475](https://github.com/johnsfarrell/rgbit/assets/69059806/6987027c-d9e5-4cc3-8b76-9d5bfba24478) | ![Places365_val_00001356](https://github.com/johnsfarrell/rgbit/assets/69059806/da061c63-a17d-40b3-a605-2e313c7cd390) | ![Places365_val_00033979](https://github.com/johnsfarrell/rgbit/assets/69059806/c0b8436d-9e5f-4fde-9c7c-81acffaa60df) |
| ![Places365_val_00008392](https://github.com/johnsfarrell/rgbit/assets/69059806/22aea350-87c3-4825-a02a-b768b1c94a8a) | ![Places365_val_00007964](https://github.com/johnsfarrell/rgbit/assets/69059806/8b9a6471-f655-4624-b385-b8e8391d841f) | ![Places365_val_00007777](https://github.com/johnsfarrell/rgbit/assets/69059806/07d94c3b-ddc4-4b45-a7e4-517166a90242) |

Results against popular legacy black and white photography. Truth channel is the grayscale image, and the predicted channel is the colorized image.

|                                                   |
| ------------------------------------------------- |
| ![legacy-banner](/images/blog/colorization/legacy.jpeg) |

## Conclusion

We experimented with using perceptual loss and VGG-19 U-Net architecture to predict the colors of grayscale images. The results of perceptual loss showed our model and architecture is viable for creating naturally looking colorful photos, but doesn’t correctly account for unique coloring and saturation. Colors returned are plausible and look natural to the human eye. An improvement would to be to **quantize the colorspace** into bins, and use a **cross-entropy based loss function**, discussed [here](https://arxiv.org/abs/1603.08511). Quantizing the colorspace allows us to weight rare colors heavily, reducing the unsaturated color bias.
