# street-fighter

Playing Street Fighter using Tensorflow.js

Inspired by [this project](https://github.com/charliegerard/gestures-ml-js) by the baddest js tinkerer [Dev Charlie](https://github.com/charliegerard/gestures-ml-js)

# Demo

[demo](./public/demo.gif)

# How It Works

The phone has inbuilt sensors gyroscope and accelerometer. The gyroscope uses earth's gravity to help determine orientation. From the Gyroscope interface of the Web Sensors APIs we get the angular velocity of the phone along three axes(x, y, z). The accelerometer is used to measure non-gravitational acceleration. The Accelerometer interface of the Sensors APIs provides on each reading the acceleration applied to the device along all three axes. Using websockets(socket.io) we stream the readings from the two sensors when an action is performed from the phone and save the data for training the neural net. Using @tensorflow/tfjs-node (TensorFlow backend for TensorFlow.js via Node.js) we define a sequential model with two dense layers and train it using the data recorded. Once the model is ready we can feed the live data from the sensors and get the prediction of the type of action which is used as the input to the GUI to show the results of the action.

## 1. Recording Data

Start the recording server
`node record.js`
Open the /record url of the server on your phone (use https had trouble with sensor reading on http)
When you hold down any finger on the screen, it will send data to the Node.js server via web sockets. When you release, all this data is saved in a .txt file in the data folder.

## 2. Train the Algorithm

Run the training command
`node train.js`
This command will read the data in all the files, do some data processing, split between test and training set, create and save the model that should be available in the model folder.

A mismatch of the number of samples per gesture affects the size of the input vector, currently working to improve it, incase you encounter a problem, the number of hadokens, uppercuts, and punches is logged to help you determine where you need to increment or decrement. The number of valid samples per gesture should be 21.

## 3. Predict

`node predict.js`
Using Chrome on your phone, visit the url indicated by ngrok followed by /predict.

When this command is run, you can execute one of the gestures you trained by holding down any finger on the screen, executing the gesture you want to predict, and release the screen to let the model classify the new samples.
