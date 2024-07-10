import fs from "fs/promises";
import Image from "next/image";
import { DownloadButton } from "./_components/downloadButton";

export default async function PhotosPage() {
  const svgs = await fs.readdir("public/icons");
  return (
    <main className="grid gap-5 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {svgs.map((svgpath) => (
        <div
          key={svgpath}
          className="flex h-fit w-56 flex-col items-center gap-3 p-2"
        >
          <div className="h-fit w-fit">
            <Image
              width={500}
              height={300}
              src={`/icons/${svgpath}`}
              alt={svgpath}
            />
          </div>
          <DownloadButton />
        </div>
      ))}
    </main>
  );
}
