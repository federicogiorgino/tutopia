// Re-export everything so both your db client (`schema: "./schemas/schema"`-style
// imports) and drizzle-kit can see every table/relation from one place.

export * from "./schemas/auth"; // your existing better-auth tables/relations
export * from "./schemas/snippets";
