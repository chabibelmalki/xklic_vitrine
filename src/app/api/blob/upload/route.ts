import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Délivre des tokens d'upload côté client pour Vercel Blob.
// Le navigateur appelle cette route via upload() (@vercel/blob/client), qui
// négocie ici un token signé puis téléverse le fichier directement vers Blob
// — on évite ainsi les limites de body des fonctions serverless.
//
// Le token de lecture/écriture vient de la variable d'environnement
// BLOB_READ_WRITE_TOKEN (lue automatiquement par handleUpload).
export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async () => ({
        // Uniquement des images : les sites les afficheront publiquement.
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "image/avif",
          "image/svg+xml",
        ],
        // Évite les collisions de noms entre clients/soumissions.
        addRandomSuffix: true,
        maximumSizeInBytes: 15 * 1024 * 1024, // 15 Mo / image
      }),
      // Pas de callback onUploadCompleted : le client récupère l'URL
      // directement via la valeur de retour de upload(), et ce callback
      // n'est de toute façon pas joignable en développement local.
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 },
    );
  }
}
