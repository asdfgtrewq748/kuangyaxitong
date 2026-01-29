# Mining Pressure System Backend

## Run

1) Install dependencies

2) Start server

The API exposes:
- GET /health
- GET /boreholes/scan
- GET /boreholes/preview?file=<csv>&limit=20

`DATA_DIR` env can override data folder. Default is ../data relative to backend.
