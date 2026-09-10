type BrowserZipFile = {
  blob: Blob;
  name: string;
};

const encoder = new TextEncoder();

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function write16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value, true);
}

function write32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value, true);
}

export async function createBrowserZip(files: BrowserZipFile[]) {
  const parts: BlobPart[] = [];
  const centralParts: BlobPart[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = new Uint8Array(await file.blob.arrayBuffer());
    const checksum = crc32(data);
    const local = new ArrayBuffer(30 + name.length);
    const localView = new DataView(local);
    write32(localView, 0, 0x04034b50);
    write16(localView, 4, 20);
    write16(localView, 6, 0x0800);
    write16(localView, 8, 0);
    write32(localView, 14, checksum);
    write32(localView, 18, data.length);
    write32(localView, 22, data.length);
    write16(localView, 26, name.length);
    new Uint8Array(local, 30).set(name);
    parts.push(local, data);

    const central = new ArrayBuffer(46 + name.length);
    const centralView = new DataView(central);
    write32(centralView, 0, 0x02014b50);
    write16(centralView, 4, 20);
    write16(centralView, 6, 20);
    write16(centralView, 8, 0x0800);
    write16(centralView, 10, 0);
    write32(centralView, 16, checksum);
    write32(centralView, 20, data.length);
    write32(centralView, 24, data.length);
    write16(centralView, 28, name.length);
    write32(centralView, 42, offset);
    new Uint8Array(central, 46).set(name);
    centralParts.push(central);
    offset += local.byteLength + data.length;
  }

  const centralSize = centralParts.reduce(
    (total, part) => total + (part instanceof ArrayBuffer ? part.byteLength : 0),
    0,
  );
  const end = new ArrayBuffer(22);
  const endView = new DataView(end);
  write32(endView, 0, 0x06054b50);
  write16(endView, 8, files.length);
  write16(endView, 10, files.length);
  write32(endView, 12, centralSize);
  write32(endView, 16, offset);

  return new Blob([...parts, ...centralParts, end], { type: "application/zip" });
}
