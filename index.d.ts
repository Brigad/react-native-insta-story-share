declare module "@brigad/react-native-instagram-story-share" {
  type ShareConfigObject = {
    type: "base64" | "file",
    attributionLink: string,
    backgroundAsset: string,
    stickerAsset: string,
    stickerOptions: {
      height: integer,
      width: integer
    }
  }

  const RNStoryShare: {
    isInstagramAvailable(): Promise<boolean>
    shareToInstagram(config: ShareConfigObject): Promise<void>;
  };

  export default RNStoryShare;
}