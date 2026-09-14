import { loadReviews } from "./reviews";

try {
  const { published, drafts } = loadReviews();
  console.log(`Reviews valid: ${published.length} ready_for_pr, ${drafts.length} draft${drafts.length === 1 ? "" : "s"} excluded from publication.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
