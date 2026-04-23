import { Image, Video } from "@imagekit/next";
import type { Transformation } from "@imagekit/next";
import type { MediaAsset } from "@/lib/types";

type MediaImageProps = {
  asset: MediaAsset;
  className?: string;
  priority?: boolean;
  sizes: string;
  transformation?: Transformation[];
};

type MediaVideoProps = {
  src: string;
  className?: string;
};

const imageKitUrlEndpoint =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, "") ||
  "https://ik.imagekit.io/maxhoang";

function isAbsoluteUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function getImageKitSrc(value: string) {
  if (isAbsoluteUrl(value)) {
    return value;
  }

  return value.startsWith("/") ? value : `/${value}`;
}

function canRenderMedia(value: string) {
  return isAbsoluteUrl(value) || Boolean(imageKitUrlEndpoint);
}

export function MediaImage({
  asset,
  className,
  priority = false,
  sizes,
  transformation = [
    {
      quality: 82
    }
  ]
}: MediaImageProps) {
  if (!canRenderMedia(asset.url)) {
    return null;
  }

  return (
    <Image
      urlEndpoint={imageKitUrlEndpoint || undefined}
      src={getImageKitSrc(asset.url)}
      alt={asset.alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      transformation={transformation}
    />
  );
}

export function MediaVideo({ src, className }: MediaVideoProps) {
  if (!canRenderMedia(src)) {
    return null;
  }

  return (
    <Video
      urlEndpoint={imageKitUrlEndpoint || undefined}
      src={getImageKitSrc(src)}
      className={className}
      controls
      playsInline
      preload="metadata"
      transformation={[
        {
          quality: 80
        }
      ]}
    />
  );
}

export function MediaGallery({
  items,
  title
}: {
  items: MediaAsset[];
  title: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="media-section" aria-label={`${title} media gallery`}>
      <div className="media-gallery">
        {items.map((item, index) => (
          <figure className="media-gallery__item" key={`${item.url}-${index}`}>
            <MediaImage
              asset={item}
              sizes="(max-width: 900px) 100vw, 50vw"
              transformation={[
                {
                  width: 900,
                  quality: 82
                }
              ]}
            />
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
