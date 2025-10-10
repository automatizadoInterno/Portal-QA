import { executarQueries } from "./lib/azureQuery.js";
import config from "./src/config.js";

async function teste() {
  const pat = process.env.AZURE_PAT;
  if (!pat) {
    console.log("AZURE_PAT ausente");
    return;
  }

  try {
    const items = await executarQueries(
      config.organization,
      config.queriesChamados,
      pat
    );
    console.log("Itens:", items);
  } catch (err) {
    console.error(err);
  }
}

teste();
