# webtask-queue
Use webtask to send simple temporary messages between API's and local/remote servers

For example, suppose you need to send a simple message between IFFT or Maker to your own Desktop computer, you can then use http://webtask.io to populate a queue using this library to communicate

# Setup
1. Configure your webtask.io accout following steps 1 and 2 located ![here](https://webtask.io/cli)
  1. Be sure to follow the steps to verify your e-mail in the previous step
1. Clone this repository running the following command
`git clone` ![this repository](https://github.com/rguerra712/webtask-queue.git)
1. Run the command `./deploy --secret SOMESECRET --queue SOMEQUEUENAME` replacing the command line arguments as desired
1. Copy and paste the output URL for your queue, and use it for any purposes you deem fit for basic QUEUE communication
