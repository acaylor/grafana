const express = require("express");
const client = require("prom-client");
const app = express();
let counter = 0;

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default metrics collection
client.collectDefaultMetrics({ register });

// Create a custom counter metric
const requestCounter = new client.Counter({
  name: "node_request_counter",
  help: "The total number of processed requests",
});

// Register the custom counter
register.registerMetric(requestCounter);

app.get("/", (req, res) => {
  counter++;
  requestCounter.inc(); // Increment the custom counter
  res.send(`Request counter: ${counter}`);
});

// Add a /metrics endpoint to expose the metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const port = 3001;
app.listen(port, () => {
  console.log(`Node.js server running on port ${port}`);
});
