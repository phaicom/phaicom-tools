import { PageIntro } from "@/shared/components/content/PageIntro";

import { useImageToWebp } from "../hooks/useImageToWebp";
import { ImageDropZone } from "./ImageDropZone";
import { ImageToWebpBatchSection } from "./ImageToWebpBatchSection";
import { ImageToWebpSidebar } from "./ImageToWebpSidebar";

export function ImageToWebpPage() {
  const {
    addFiles,
    convertedFiles,
    downloadUrl,
    failedFiles,
    files,
    handleConvert,
    handleDownload,
    invalidateCompletedResults,
    isConverting,
    isPackagingZip,
    notice,
    quality,
    setQuality,
    supportedFiles,
    totalCount,
    completedCount,
  } = useImageToWebp();

  const progressValue = totalCount > 0 ? completedCount : 0;
  const hasFiles = files.length > 0;
  const unsupportedCount = files.length - supportedFiles.length;

  return (
    <div className="space-y-8">
      <PageIntro
        category="Images"
        title="Image to WebP"
        description="Upload a batch of images, convert supported files to WebP, and download the results as a ZIP without leaving the page."
      />

      <section className="grid gap-10 xl:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)]">
        <div className="space-y-8">
          <ImageDropZone
            disabled={isConverting || isPackagingZip}
            onAddFiles={({ files: nextFiles, messages }) => addFiles(nextFiles, messages)}
          />

          <ImageToWebpBatchSection
            files={files}
            hasFiles={hasFiles}
            isConverting={isConverting}
            isPackagingZip={isPackagingZip}
            onResetStatuses={invalidateCompletedResults}
            resettableResultsCount={convertedFiles.length + failedFiles.length}
            supportedFilesCount={supportedFiles.length}
            unsupportedCount={unsupportedCount}
          />
        </div>

        <ImageToWebpSidebar
          convertedFilesCount={convertedFiles.length}
          downloadUrl={downloadUrl}
          failedFilesCount={failedFiles.length}
          filesCount={files.length}
          isConverting={isConverting}
          isPackagingZip={isPackagingZip}
          notice={notice}
          onConvert={() => void handleConvert()}
          onDownload={handleDownload}
          onQualityChange={(value) => {
            setQuality(value);
            invalidateCompletedResults();
          }}
          progressValue={progressValue}
          quality={quality}
          supportedFilesCount={supportedFiles.length}
          totalCount={totalCount}
        />
      </section>
    </div>
  );
}
