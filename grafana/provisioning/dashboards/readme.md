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

## Grafana Alloy host dashboards

Three dashboards for metrics that Grafana Alloy collects with
`prometheus.exporter.unix` and the node_exporter textfile collector. They are
described in
[Monitoring Proxmox hosts with Grafana Alloy](https://blog.ayjc.net/posts/grafana-alloy-proxmox-monitoring/).

| File | Dashboard | Metrics |
|---|---|---|
| `proxmox-host-health.json` | Proxmox host health | Failed systemd units, pending apt upgrades, reboot required, last ZFS scrub, and a SMART table and temperature graph for SATA and NVMe disks |
| `zfs-pool.json` | ZFS pool | Pool health, capacity, scrub results, per-vdev state and errors, and SMART temperature for the pool's disks |
| `wireguard-peers.json` | WireGuard peers | Interface uptime, connected peers, and per-peer handshake age and traffic |

### Requirements

- Every series has a `host` label. Alloy sets it with `external_labels = { host = constants.hostname }` on `prometheus.remote_write`.
- The systemd collector is enabled in `prometheus.exporter.unix`, and the textfile collector reads `/var/lib/prometheus/node-exporter`.
- Debian's `prometheus-node-exporter-collectors` package writes the `smartmon_*`, `nvme_*`, `apt_*`, `node_reboot_required`, and `zfs_zpool*` capacity metrics through its systemd timers.
- `zfs_zpool_scrub_*`, `zfs_zpool_data_errors`, `zfs_vdev_state`, and `zfs_vdev_errors` come from a custom script that parses `zpool status -p`. Panels that use them show "No data" without it.
- The `wireguard_*` metrics come from a custom script that parses `wg show <interface> dump`.

The blog post has both scripts.

### Import

The dashboards use a `datasource` template variable instead of `__inputs`, so
the same file works in the UI, through the API, and with file provisioning.
Pick the Prometheus data source and hosts from the variables at the top of
each dashboard.

- **UI:** **Dashboards → New → Import**, upload the file, and choose a folder.
- **API:** wrap the file in a `dashboard` object and post it.

  ```bash
  jq '{dashboard: ., overwrite: true}' proxmox-host-health.json |
    curl -X POST -H "Authorization: Bearer $GRAFANA_TOKEN" \
      -H 'Content-Type: application/json' --data @- \
      https://grafana.example.com/api/dashboards/db
  ```

- **Provisioning:** the files load with the provider in `default.yaml` like the other dashboards here.

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
