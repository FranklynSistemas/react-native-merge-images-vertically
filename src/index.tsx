import { NativeModules, Platform } from 'react-native';

export type Image = {
  uri: string;
};

const LINKING_ERROR =
  `The package 'react-native-merge-images-vertically' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ImagesMerge = NativeModules.ImagesMerge
  ? NativeModules.ImagesMerge
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const mergeImages = (images: Image[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    ImagesMerge.mergeImages(images, (result: string, error: Error) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export { mergeImages };
