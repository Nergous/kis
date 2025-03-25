import React from "react";
import { Image, Skeleton } from "antd";

const CachedImage = React.memo(({ src, alt, width, height, style, preview }) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    style={style}
    preview={preview}
    loading="lazy" // Включение native lazy loading
    placeholder={
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Skeleton.Image active />
      </div>
    }
  />
));

export default CachedImage;