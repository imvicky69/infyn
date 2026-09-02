import { GlobalLoader } from "@/components/global-loader";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center w-full px-4">
      <GlobalLoader text="Loading Infyn..." size="lg" />
    </div>
  );
}
