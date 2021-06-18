# street-fighter

---

Playing Street Fighter using Tensorflow.js

- Inspired by [this project](https://github.com/charliegerard/gestures-ml-js) by the baddest js tinkerer [Dev Charlie](https://github.com/charliegerard/gestures-ml-js)

# How It Works

---

The phone has inbuilt sensors gyroscope and accelerometer. The gyroscope uses earth's gravity to help determine orientation. From the Gyroscope interface of the Web Sensors APIs we get the angular velocity of the phone along three axes(x, y, z). The accelerometer is used to measure non-gravitational acceleration. The Accelerometer interface of the Sensors APIs provides on each reading the acceleration applied to the device along all three axes. Using websockets(socket.io) we stream the readings from the two sensors when an action is performed from the phone and save the data for training the neural net. Using @tensorflow/tfjs-node (TensorFlow backend for TensorFlow.js via Node.js) we define a sequential model with two dense layers and train it using the data recorded. Once the model is ready we can feed the live data from the sensors and get the prediction of the type of action which is used as the input to the GUI to show the results of the action.
