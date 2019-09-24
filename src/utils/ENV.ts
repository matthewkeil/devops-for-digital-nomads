const NODE_ENV = process.env.NODE_ENV || "development";

export const ENV = {
    NODE_ENV,
    DEBUG: process.env.DEBUG,
    DEV: NODE_ENV === "development",
    APP_PORT: +(process.env.APP_PORT || 3001),
    DYNAMO_TABLE_NAME: process.env.DYNAMO_TABLE_NAME || "",
    FLOMIO_GPAY_ISSUER_ID: process.env.FLOMIO_GPAY_ISSUER_ID || "",
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN || "",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    REGION: process.env.REGION || "us-east-1",
    DOMAIN_NAME: process.env.DOMAIN_NAME || "idcards2go.com",
    DB_CLUSTER_ADDRESS: process.env.DB_CLUSTER_ADDRESS || "localhost",
    DB_PORT: +(process.env.DB_PORT || 3306),
    DB_USERNAME: process.env.DB_USERNAME || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_NAME: process.env.DB_NAME || "passninja_database",
    PASS_NINJA_DEMO_PASS_TYPE_ID: "pass.com.ndudfield.nfc",
    PUBLIC_PASSES_BUCKET: `demo-passes.idcards2go.com`,
    PASS_NINJA_DEMO_ENCRYPTION_PUBLIC_KEY:
        "MDkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDIgADK5Eqz4qz1/jWpk0EeehgIShMWFzr+iBT28lEaO4ZUBc="
};
