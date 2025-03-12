/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  env: {
    MAX_INCIDENTS: process.env.MAX_INCIDENTS,
    CURRENT_YEAR: process.env.CURRENT_YEAR,
    INCIDENT_DAMAGE: process.env.INCIDENT_DAMAGE,
  },
};

export default config;
