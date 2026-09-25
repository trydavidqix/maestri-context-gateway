# Control Plane — current code

Canonical owner: `packages/control-plane`.

Existing modules include task/job helpers, claim and receipt stores, session state, event-log adapters, DAG scheduling, and workforce scheduling. These remain local library capabilities; this migration does not claim a deployed service, durable cloud store, or one unified production task authority.

`packages/compat` re-exports selected legacy Maestri interfaces. New code should import `@nexus-brain/control-plane` subpaths. The compatibility facade is optional and does not start Maestri or Wire.

Future API, database, scheduler, approvals, budgets, and workforce features remain in the Master Blueprint and are not implemented by this migration.
