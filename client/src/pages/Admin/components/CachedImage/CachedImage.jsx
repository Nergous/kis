import React from "react";
import { Image } from "antd";

const CachedImage = React.memo(({ src, alt, width, height }) => (
    <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
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