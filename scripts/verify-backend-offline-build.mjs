import { spawn } from "node:child_process";
import { once } from "node:events";
import { rm } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const backendRequests = [];
const backend = createServer((request, response) => {
  backendRequests.push(`${request.method} ${new URL(request.url ?? "/", "http://localhost").pathname}`);
  response.writeHead(503, { "Content-Type": "application/json", Connection: "close" });
  response.end(JSON.stringify({ code: 503, message: "Backend unavailable (CI fixture)", data: null }));
});

try {
  backend.listen(0, "127.0.0.1");
  await once(backend, "listening");
  const address = backend.address();
  if (!address || typeof address === "string") throw new Error("Could not allocate mock backend port");

  // A warm Next data cache must not hide a build-time dependency.
  await rm(".next", { recursive: true, force: true });
  const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
    env: { ...process.env, BACKEND_BASE_URL: `http://127.0.0.1:${address.port}`, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: "inherit",
  });
  const [code, signal] = await once(child, "exit");
  if (code !== 0) throw new Error(`Offline backend build failed (exit=${code}, signal=${signal})`);
  if (backendRequests.length) {
    throw new Error(`Build unexpectedly contacted the backend ${backendRequests.length} time(s):\n${backendRequests.join("\n")}`);
  }
  console.log("Offline backend build passed: zero backend requests during next build.");
} finally {
  if (backend.listening) await new Promise((resolve, reject) => backend.close(error => error ? reject(error) : resolve()));
}
