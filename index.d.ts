declare module "@brigad/react-native-instagram-story-share" {
  type ShareConfigObject = {
    type: "base64" | "file",
    media: 'photo' | 'video',
    attributionLink?: string,
    backgroundBottomColor?: string,
    backgroundTopColor?: string,
  } & ({
    stickerAsset: string,
    backgroundAsset?: string,
  } | {
    stickerAsset?: string,
    backgroundAsset: string,
  });

  const RNStoryShare: {
    isInstagramAvailable(): Promise<boolean>
    shareToInstagram(config: ShareConfigObject): Promise<void>;
  };

  export default RNStoryShare;
}