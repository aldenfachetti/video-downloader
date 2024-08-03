// Importando os módulos necessários
import express, { Request, Response } from "express";
import { exec } from "child_process";
import { DownloadRequest } from "./types";
import path from "path";
import fs from "fs";

// Configuração básica do servidor
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Endpoint para processar o download
app.post("/download", async (req: Request, res: Response) => {
  const { url, format }: { url: string; format: string } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    // Defina o nome base do arquivo com a extensão selecionada
    let outputBase = "video";
    let fileExtension = `.${format}`;

    // Verifique se o arquivo já existe e ajuste o nome do arquivo
    let output = `${outputBase}${fileExtension}`;
    let counter = 1;
    while (fs.existsSync(output)) {
      output = `${outputBase}_${counter}${fileExtension}`;
      counter++;
    }

    const command = `yt-dlp -f ${format} -o ${output} ${url}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Download Error: ${stderr}`);
        return res.status(500).json({ error: "Failed to download video" });
      }

      console.log(`Download Success: ${stdout}`);
      return res
        .status(200)
        .json({ message: "Video downloaded successfully", output });
    });
  } catch (error) {
    console.error("Download Error:", error);
    return res.status(500).json({ error: "Failed to download video" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app; // ou 'export const app = ...' se preferir exportação nomeada
