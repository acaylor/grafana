# Grafana Stack for testing

This is a docker compose stack to experiment with Grafana and data sources.

- `app` is a nodejs server that counts the number of requests received and exposes prometheus metrics.
- `fluentd` is a server that can collect logs. Docker includes a logging driver to use this protocol.
- `grafana/provisioning` prepares the grafana container config to use the influxdb and prometheus containers as a data source. It also loads example dashboards.
- `otel` is for configuring opentelemetry collector. This is mostly what I experiment with right now, it can collect logs and metrics from other systems, transform the output and export it somewhere else.
- `prometheus` is a time series database configured with a .yml file. It can also scrape metrics from other servers and write metrics to other servers.
- `telegraf` collect metrics from the host system. I configured it to output metrics to influxdb and expose the prometheus `/metrics` endpoint.
- `influxdb` is a time series database.
- `loki` is a Grafana project to collect logs. It can receive logs in the open telemetry format.

Say my application is the `app` nodejs application. The application has a server that returns a simple counter for the number of times it has received a request. The application uses the prometheus client library to expose some metrics on the endpoint `/metrics`. The app runs as a docker container.

The docker daemon can send logs from each container to a fluentd server using a logging driver. In this stack each container except for fluentd is configured to use the fluentd logging driver. This can actually be pointed to either the fluentd container OR the opentelemetry collector.

To experiment with various metrics systems, this stack includes prometheus and telegraf. Both of these can optionally read and write from each other. The opentelemetry collector can also sit in between here to read and write metrics.

Finally Grafana is the intended front-end here to be accessed via browser most likely.

## Running the stack

Run the stack with `docker compose`.

```bash
docker compose up -d
```

Look at the container logs live:

```bash
docker compose logs -f
```

### Accessing the stack

Each container should expose the ports to the localhost interface so you can test any of the applications easily. Here are some of the ports and api routes of note:

#### app

- `app` is a nodejs app that runs on port `3001`.
  - There is an api at `/` and a prometheus metrics endpoint at `/metrics`.

#### fluentd

- `fluentd` has a server on port `24224`
  - this can be used as an endpoint for sending logs.

#### grafana

- `grafana` has a UI and API at port `3000`.
  - a prometheus metrics endpoint at `/metrics`.
  - The credentials are set to `admin/admin` by default, this can be adjusted or omitted in the docker-compose.yml.

#### otel

##### ports

- `1888`: pprof extension
- `8006`: fluentd port listener I configured
- `8888`: Prometheus metrics exposed by the Collector
- `8889`: Prometheus exporter metrics
- `1313`: health_check extension
- `4317`: OTLP gRPC receiver
- `4318`: OTLP http receiver
- `55679`: zpages extension

#### prometheus

- `prometheus` has a UI and API on port `9090`.

#### loki

- `loki` has an API on port `3100`
  - Write logs to `/loki/api/v1/push`
  - Write OTLP logs to `/otlp`

#### influxdb

- `influxdb` has an API on port `8086`

#### telegraf

- `telegraf` has a `/metrics` endpoint if configured on port `9273`

## Dashboards

For Grafana dashboards, see the `grafana/provisioning/dashboards` directory.
