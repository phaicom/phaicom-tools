import AdmZip from "adm-zip";

export type ZipInputFile = {
  data: Uint8Array;
  fileName: string;
};

export function createZipArchive(files: ZipInputFile[]) {
  const zip = new AdmZip();

  for (const file of files) {
    zip.addFile(file.fileName, Buffer.from(file.data));
  }

  return Uint8Array.from(zip.toBuffer());
}
