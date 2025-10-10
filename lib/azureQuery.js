async function executarQueryAzure(organization, project, queryIdGuid, pat) {
  const authString = `:${pat}`;
  const encodedAuth = Buffer.from(authString).toString("base64");

  const headers = {
    Authorization: `Basic ${encodedAuth}`,
  };

  try {
    const url = `https://dev.azure.com/${organization}/${project}/_apis/wit/wiql/${queryIdGuid}?api-version=7.1-preview.2`;
    const resp = await fetch(url, { headers });

    if (!resp.ok) {
      console.error(`Erro na primeira chamada: ${resp.status} ${resp.statusText}`);
      return [];
    }

    const data = await resp.json();
    const workItems = data.workItems || [];
    if (!workItems.length) return [];

    const ids = workItems.map((w) => String(w.id)).join(",");

    const fieldsUrl = `https://dev.azure.com/${organization}/_apis/wit/workitems?ids=${ids}&$expand=Fields&api-version=7.1-preview.2`;
    const fieldsResp = await fetch(fieldsUrl, { headers });

    if (!fieldsResp.ok) {
      console.error(`Erro na segunda chamada: ${fieldsResp.status} ${fieldsResp.statusText}`);
      return [];
    }

    const fieldsData = await fieldsResp.json();

    const items = (fieldsData.value || []).map((item) => {
      const f = item.fields || {};

      // Extrai o nome do dev sem o e-mail, ex:
      // "Leonardo Gil Carlana <leonardo.gil@buonny.com.br>" → "Leonardo Gil Carlana"
      let assignedTo = f["System.AssignedTo"] || "";
      if (assignedTo.includes("<")) {
        assignedTo = assignedTo.split("<")[0].trim();
      }
      if (!assignedTo) {
        assignedTo = "Não atribuído";
      }

      return {
        ID: f["System.Id"] || item.id || "",
        Title: f["System.Title"] || "",
        Resumo:
          f["Custom.Resumo"] ||
          f["Custom.Síntese"] ||
          f["Custom.Sintese"] ||
          "",
        Produto: f["Custom.Produto"] || "",
        Cliente: f["Custom.Cliente"] || "",
        "Data deploy": f["Custom.Datadeploy"] || f["Custom.DataDeploy"] || "",
        "Iteration Path": f["System.IterationPath"] || "",
        "Referencia no Ajuda": f["Custom.ReferencianoAjuda"] || "",
        "Assigned To": assignedTo, // novo campo tratado
        State: f["System.State"] || "",
      };
    });

    return items;
  } catch (err) {
    console.error("Erro executarQueryAzure com fetch:", err);
    return [];
  }
}

export async function executarQueries(organization, queries, pat) {
  const all = [];
  for (const q of queries) {
    const items = await executarQueryAzure(
      organization,
      q.project,
      q.queryIdGuid,
      pat
    );
    if (items && items.length) all.push(...items);
  }
  return all;
}
