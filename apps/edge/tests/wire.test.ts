import { describe, expect, it } from "vitest";
import { acceptWireMutation, buildWireUrl, openWireFeed } from "../src/bridge/wire.mjs";

describe("Maestri Wire bridge", () => {
  it("accepts monotonic events and requests resync on epoch changes", () => {
    const first = acceptWireMutation({ epoch: "e1", sequence: 1 }, null, { snapshot: true });
    expect(first).toMatchObject({ accepted: true, state: { epoch: "e1", sequence: 1 } });

    const next = acceptWireMutation({ epoch: "e1", sequence: 2 }, first.state);
    expect(next).toMatchObject({ accepted: true, state: { sequence: 2 } });

    const changed = acceptWireMutation({ epoch: "e2", sequence: 1 }, next.state);
    expect(changed).toMatchObject({ accepted: false, resync_required: true });
  });

  it("builds an authenticated Wire endpoint URL without changing the host", () => {
    const url = buildWireUrl({ host: "127.0.0.1", port: 7434 }, "/api/feed", { workspace: "main" });
    expect(url.href).toBe("https://127.0.0.1:7434/api/feed?workspace=main");
  });

  it("rejects remote feeds without a certificate pin before connecting", async () => {
    await expect(openWireFeed({ host: "198.51.100.10", port: 0 }, "workspace-test", () => {}))
      .rejects.toThrow("Wire certificate pin required");
  });
});
