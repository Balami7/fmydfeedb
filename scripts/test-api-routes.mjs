/* eslint-disable no-console */

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

async function req(path, init) {
  const res = await fetch(`${baseUrl}${path}`, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // ignore
  }
  return { res, text, json };
}

async function assertOk(name, result) {
  if (!result.res.ok) {
    throw new Error(
      `${name} failed: ${result.res.status} ${result.res.statusText}\n${result.text}`
    );
  }
}

async function main() {
  console.log(`BASE_URL=${baseUrl}`);

  await assertOk("GET /api/products", await req("/api/products"));
  await assertOk("GET /api/services", await req("/api/services"));
  await assertOk("GET /api/gallery", await req("/api/gallery"));
  await assertOk("GET /api/orders", await req("/api/orders"));
  await assertOk("GET /api/registration", await req("/api/registration"));
  await assertOk("GET /api/survey", await req("/api/survey"));

  const dashboardNoAuth = await req("/api/admin/dashboard");
  if (dashboardNoAuth.res.status !== 401) {
    throw new Error(
      `Expected 401 from GET /api/admin/dashboard without token, got ${dashboardNoAuth.res.status}\n${dashboardNoAuth.text}`
    );
  }
  console.log("GET /api/admin/dashboard (no token) => 401 OK");

  if (!adminEmail || !adminPassword) {
    console.log("Skipping admin login: set ADMIN_EMAIL and ADMIN_PASSWORD to test admin routes.");
    return;
  }

  const login = await req("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  await assertOk("POST /api/admin/login", login);

  const token = login.json?.token;
  if (!token) {
    throw new Error("POST /api/admin/login did not return { token }");
  }

  await assertOk(
    "GET /api/admin/dashboard (token)",
    await req("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  console.log("All API smoke tests passed.");
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exitCode = 1;
});

