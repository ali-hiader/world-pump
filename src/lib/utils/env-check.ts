// Environment variable checker for debugging
export function checkEnvironmentVariables() {
  const requiredEnvVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  };

  const missing = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing.join(", "));
    return false;
  }

  console.log("✅ All required environment variables are set");
  return true;
}

export function logEnvironmentStatus() {
  console.log("Environment Status:");
  console.log("NODE_ENV:", process.env.NODE_ENV || "development");
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "✅ Set" : "❌ Missing"
  );
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing");
  console.log(
    "BETTER_AUTH_SECRET:",
    process.env.BETTER_AUTH_SECRET ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "CLOUDINARY_CLOUD_NAME:",
    process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing"
  );
}
