import { extract } from "./extract.js";
import { transform } from "./transform.js";
import { validate } from "./validate.js";
import { write } from "./write.js";

function main(): void {
  console.log("=== AoE2 Tech Tree ETL Pipeline ===\n");

  console.log("[1/4] Extracting...");
  const { gameData, locales } = extract();

  console.log("\n[2/4] Transforming...");
  const transformed = transform(gameData, locales);

  console.log("\n[3/4] Validating...");
  const validated = validate(transformed);

  console.log("\n[4/4] Writing output...");
  write(validated);

  console.log("\nDone.");
}

main();
