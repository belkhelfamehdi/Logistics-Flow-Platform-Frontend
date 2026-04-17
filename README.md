# Logistics Control Center

Enterprise-oriented frontend for the logistics microservices platform.

## Stack

- React 19 + TypeScript
- Vite 8
- React Router (feature navigation)
- TanStack Query (server-state management)
- Axios (API client)
- React Hook Form + Zod (form validation)
- Recharts (operational charts)

## Backend Integration

This frontend connects to the API Gateway from the backend workspace.

Default base URL:

- `http://localhost:8090`

Configurable through environment variable:

- `VITE_API_BASE_URL`

Copy the example file before running:

```bash
cp .env.example .env
```

## Run

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Enterprise Structure

```text
src/
  app/
    layout/        # Global shell and navigation
    providers/     # App providers (React Query)
    App.tsx
    router.tsx
  entities/        # Domain models (order, inventory, shipment)
  features/        # Business interactions (order creation)
  pages/           # Route-level pages
  shared/
    api/           # HTTP client + API calls
    config/        # Environment configuration
    ui/            # Reusable UI primitives
    utils/         # Formatting and status helpers
  widgets/         # Composite dashboard widgets
```

## Implemented Screens

- Dashboard: cross-service KPIs and event flow visibility
- Orders: order creation and ledger
- Inventory: stock snapshot, restock action, reservation decisions
- Shipments: shipment pipeline and status monitoring

## API Endpoints Used

- `GET /orders`
- `POST /orders`
- `GET /inventory`
- `GET /inventory/reservations`
- `POST /inventory/{sku}/restock?quantity=...`
- `GET /shipments`

## Notes

- All requests are routed through the gateway to keep frontend/backend contracts stable.
- Query invalidation is wired after mutations to keep views consistent.
- The layout and domain split are designed for team scaling and maintainability.
