/// <reference lib="webworker" />
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Web Worker: runs RMBG-1.4 inference off the main thread.
 * Model is cached in-memory between calls (no re-download after first load).
 */

type OutMsg =
  | { type: "progress"; text: string; value: number }
  | { type: "done"; mask: ArrayBuffer; width: number; height: number }
  | { type: "error"; message: string };

const post = (msg: OutMsg) => (self as unknown as Worker).postMessage(msg);

let cachedModel: any = null;
let cachedProcessor: any = null;

(self as unknown as Worker).addEventListener(
  "message",
  async (e: MessageEvent<{ imageBuffer: ArrayBuffer }>) => {
    const { imageBuffer } = e.data;

    try {
      const { AutoModel, AutoProcessor, RawImage, env } =
        await import("@huggingface/transformers");

      // We're already in a worker — disable wasm proxy
      if (env.backends?.onnx?.wasm) {
        env.backends.onnx.wasm.proxy = false;
      }

      // ── Load model (once; stays cached in worker memory) ───────────────
      if (!cachedModel || !cachedProcessor) {
        const fileProgress: Record<string, { loaded: number; total: number }> = {};

        const onProgress = (p: any) => {
          if (p.status === "progress" && p.file != null && p.loaded != null && p.total != null) {
            fileProgress[p.file] = { loaded: p.loaded, total: p.total };
            const loaded = Object.values(fileProgress).reduce((s, f) => s + f.loaded, 0);
            const total = Object.values(fileProgress).reduce((s, f) => s + f.total, 0);
            const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;
            post({
              type: "progress",
              text: `Downloading model… ${pct}%`,
              // Scale download phase to 0→65 of the overall bar
              value: Math.round(pct * 0.65),
            });
          }
        };

        post({ type: "progress", text: "Preparing AI model…", value: 0 });

        [cachedModel, cachedProcessor] = await Promise.all([
          AutoModel.from_pretrained("briaai/RMBG-1.4", {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: { model_type: "custom" } as any,
            progress_callback: onProgress,
          }),
          AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
            config: {
              do_normalize: true,
              do_pad: false,
              do_rescale: true,
              do_resize: true,
              image_mean: [0.5, 0.5, 0.5],
              image_std: [1.0, 1.0, 1.0],
              feature_extractor_type: "ImageFeatureExtractor",
              resample: 2,
              rescale_factor: 0.00392156862745098,
              size: { width: 1024, height: 1024 },
            },
          }),
        ]);
      }

      // ── Inference ────────────────────────────────────────────────────────
      post({ type: "progress", text: "Reading image…", value: 68 });

      const blob = new Blob([imageBuffer]);
      const url = URL.createObjectURL(blob);
      const image = await (RawImage as any).fromURL(url);
      URL.revokeObjectURL(url);

      post({ type: "progress", text: "Preprocessing…", value: 74 });
      const { pixel_values } = await cachedProcessor(image);

      post({ type: "progress", text: "Running AI inference…", value: 82 });
      const { output } = await cachedModel({ input: pixel_values });

      post({ type: "progress", text: "Generating alpha mask…", value: 92 });
      const mask: any = await (RawImage as any)
        .fromTensor(output[0].mul(255).to("uint8"))
        .resize(image.width, image.height);

      post({ type: "progress", text: "Finalising…", value: 98 });

      // Transfer mask as ArrayBuffer (zero-copy)
      const maskBuffer = mask.data instanceof Uint8Array
        ? mask.data
        : new Uint8Array(mask.data as ArrayLike<number>);
      const transferable = maskBuffer.buffer.slice(0) as ArrayBuffer;

      post({
        type: "done",
        mask: transferable,
        width: image.width,
        height: image.height,
      });
    } catch (err: any) {
      post({ type: "error", message: err?.message ?? "Unknown inference error." });
    }
  }
);
