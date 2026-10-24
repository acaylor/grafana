# Grafana Dashboards

Dashboards in grafana can be shared and exported in JSON format.

Files in this directory can be imported to grafana.

## Home dashboard

`home/home-dashboard.json` is the portable Grafana v2 export of the **Home**
dashboard, refreshed on 2026-10-24 from saved generation 6 (65 panels).

To refresh it, open Home in Grafana, choose **Export → Export as code**, enable
**Share dashboard with another instance**, and download the JSON file. Review
the export for credentials, private URLs, and sensitive query values before
replacing the file here. Keep login sessions and raw instance exports outside
this repository.

The portable export uses data source labels (`prometheus-1` and `grafana-1`)
instead of local data source IDs and omits instance and user metadata. Import it
through the Grafana UI on an instance that supports the v2 dashboard format.
Panel queries and dashboard links are retained.

## Provisioning

The file `default.yaml` helps provision Grafana with these dashboards. See the top level docker stack for an example of how dashboards are provisioned into a container.

## Public Dashboards

Dashboards that are published for the grafana community can be imported with an ID string:

|ID |Description |
|---|---|
|1860|Node exporter full|
|10347|Proxmox|
|14510|Windows exporter|
|15757|Kubernetes Global View|

### Prometheus exporter open-source projects

- [AdGuard Home Exporter](https://github.com/henrywhitaker3/adguard-exporter)
- [NUT Exporter](https://github.com/HON95/prometheus-nut-exporter)
- [unpoller](https://github.com/unpoller/unpoller)
