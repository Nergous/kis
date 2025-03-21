import React from "react";
import { Image } from "antd";

const CachedImage = React.memo(({ src, alt, width, height, style, preview }) => (
    <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        preview={preview}
        placeholder={
            <div
                style={{
                    width: width,
                    height: height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                }}
            >
                Загрузка...
            </div>
        }
    />
));

export default CachedImage;