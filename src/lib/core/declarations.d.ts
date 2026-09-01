declare module "libheif-js/wasm-bundle" {
  const content: any;
  export default content;
}

declare module "heic2any" {
  const heic2any: (options: {
    blob: Blob;
    toType?: string;
    quality?: number;
    multiple?: boolean;
  }) => Promise<Blob | Blob[]>;
  export default heic2any;
}

declare module "cryptpdf" {
  export function encryptPDF(data: Uint8Array | ArrayBuffer, password: string): Promise<Uint8Array>;
  export function decryptPDF(data: Uint8Array | ArrayBuffer, password: string): Promise<Uint8Array>;
}
