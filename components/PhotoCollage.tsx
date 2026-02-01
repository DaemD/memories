'use client';

import { cn } from "@/lib/utils";

interface CollageProps {
    photos: { id: string; url: string }[];
}

export function PhotoCollage({ photos }: CollageProps) {
    const count = photos.length;

    if (count === 0) return <div className="bg-zinc-100 aspect-video rounded-3xl" />;

    // Single Photo
    if (count === 1) {
        return (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sm group-hover:shadow-md transition-shadow">
                <img
                    src={photos[0].url}
                    alt="Memory"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
            </div>
        );
    }

    // Two Photos (Grid)
    if (count === 2) {
        return (
            <div className="grid grid-cols-2 gap-2 aspect-[4/3] rounded-3xl overflow-hidden">
                {photos.map(p => (
                    <div key={p.id} className="relative w-full h-full overflow-hidden">
                        <img
                            src={p.url}
                            alt="Memory"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                ))}
            </div>
        );
    }

    // 3+ Photos (Magazine Style: 1 Big, 2 Small)
    return (
        <div className="grid grid-rows-2 grid-cols-2 gap-2 aspect-[4/3] rounded-3xl overflow-hidden">
            <div className="row-span-2 col-span-1 relative overflow-hidden">
                <img
                    src={photos[0].url}
                    alt="Memory"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
            </div>
            <div className="col-span-1 relative overflow-hidden">
                <img
                    src={photos[1].url}
                    alt="Memory"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
            </div>
            <div className="col-span-1 relative overflow-hidden">
                {count > 3 && (
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                        <span className="text-white font-lora text-lg font-medium">+{count - 3} more</span>
                    </div>
                )}
                <img
                    src={photos[2].url}
                    alt="Memory"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
            </div>
        </div>
    );
}
