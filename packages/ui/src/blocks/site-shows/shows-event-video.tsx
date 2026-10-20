import { Badge } from "@grade10/design-system/components/display/badge";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { Play } from "@phosphor-icons/react";
import { useState } from "react";
import type { ShowChapter, ShowsPageBodyCopy } from "./types";

type ShowsEventVideoProps = {
  video: NonNullable<ShowChapter["video"]>;
  copy: ShowsPageBodyCopy;
};

/** Poster-first YouTube presentation; clicking the play affordance swaps the
 * poster for the embed inside the same rounded container. */
function ShowsEventVideo({ video, copy }: ShowsEventVideoProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border sm:aspect-[1232/512] sm:rounded-3xl">
      {playing ? (
        <iframe
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
          className="size-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0`}
          title={copy.videoTitle(video.badge)}
        />
      ) : (
        <>
          <img
            alt={video.posterAlt}
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
            src={video.poster}
          />
          <Badge className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
            {video.badge}
          </Badge>
          <div className="absolute inset-0 grid place-items-center">
            <IconButton
              aria-label={copy.playVideo(video.badge)}
              onClick={() => setPlaying(true)}
              size="lg"
              variant="secondary"
            >
              <Play weight="fill" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}

export { ShowsEventVideo, type ShowsEventVideoProps };
