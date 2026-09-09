declare module "imagetracerjs" {
  export interface ImageTracerOptions {
    corsenabled?: boolean;
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    rightangleenhance?: boolean;
    colorsampling?: 0 | 1 | 2;
    numberofcolors?: number;
    mincolorratio?: number;
    colorquantcycles?: number;
    layering?: 0 | 1;
    strokewidth?: number;
    linefilter?: boolean;
    scale?: number;
    roundcoords?: number;
    viewbox?: boolean;
    desc?: boolean;
    lcpr?: number;
    qcpr?: number;
    blurradius?: number;
    blurdelta?: number;
    pal?: Array<{ r: number; g: number; b: number; a: number }>;
  }

  export interface TracedData {
    layers: Array<Array<{ type: string; values: number[] }>>;
    palette: Array<{ r: number; g: number; b: number; a: number }>;
    width: number;
    height: number;
  }

  export class ImageTracer {
    versionnumber: string;
    imageToSVG(url: string, callback: (svg: string) => void, options?: ImageTracerOptions | string): void;
    imagedataToSVG(imgdata: ImageData, options?: ImageTracerOptions | string): string;
    imageToTracedata(url: string, callback: (tracedata: TracedData) => void, options?: ImageTracerOptions | string): void;
    imagedataToTracedata(imgdata: ImageData, options?: ImageTracerOptions | string): TracedData;
    getImgdata(canvas: HTMLCanvasElement): ImageData;
    loadImage(url: string, callback: (canvas: HTMLCanvasElement) => void, options?: ImageTracerOptions): void;
    checkoptions(options?: ImageTracerOptions | string): ImageTracerOptions;
  }

  const tracer: ImageTracer;
  export default tracer;
}
