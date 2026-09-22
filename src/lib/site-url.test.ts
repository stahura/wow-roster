import assert from "node:assert/strict";
import test from "node:test";
import { metadataBaseFromOrigin, siteOriginFromEnv } from "./site-url";

test("Railway public domain becomes an https origin", () => {
  assert.equal(
    siteOriginFromEnv({ RAILWAY_PUBLIC_DOMAIN: "wow-roster.up.railway.app" }),
    "https://wow-roster.up.railway.app",
  );
  assert.equal(
    siteOriginFromEnv({ RAILWAY_PUBLIC_DOMAIN: "https://wow-roster.up.railway.app/" }),
    "https://wow-roster.up.railway.app",
  );
  assert.equal(
    siteOriginFromEnv({
      RAILWAY_PUBLIC_DOMAIN: "roster.example.com",
      RAILWAY_STATIC_URL: "https://wow-roster.up.railway.app",
    }),
    "https://roster.example.com",
  );
});

test("Railway static URL is used when public domain is missing", () => {
  assert.equal(
    siteOriginFromEnv({ RAILWAY_STATIC_URL: "https://wow-roster.up.railway.app" }),
    "https://wow-roster.up.railway.app",
  );
  assert.equal(
    siteOriginFromEnv({ RAILWAY_STATIC_URL: "http://wow-roster.up.railway.app" }),
    "https://wow-roster.up.railway.app",
  );
  assert.equal(siteOriginFromEnv({}), "http://localhost:3000");
});

test("request origin overrides metadataBase when present", () => {
  assert.equal(
    metadataBaseFromOrigin("https://wow-roster.up.railway.app")?.href,
    "https://wow-roster.up.railway.app/",
  );
  assert.equal(metadataBaseFromOrigin(""), undefined);
  assert.equal(metadataBaseFromOrigin("not a url"), undefined);
});
