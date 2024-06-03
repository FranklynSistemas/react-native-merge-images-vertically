import * as React from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';
import { mergeImages } from 'react-native-merge-images-vertically';

const image1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACzSURBVDjLhVIxEsAgCONZLi6Oujn6/3/Yw7t4gUI75OwJCTFUaq1b0Vo76L0frLUM5pwHWtM+8ARkLaApIjJYRKCEySzEgCDqehoH3sWXGzhQCE/nDCIXIOP7OCilbM4BQmMMQ+Ianq1cici8GU8GlGwEsma+8wFegUiEp0WZ3C1EGfjn6Jn+SBBgF385oPZy4IlZuGYLSJOdZKJcv1vwzSB40eyJwo1RgyeHDvy0TIh7gQcKP8ylbMeQ9QAAAABJRU5ErkJggg==';
const image2 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAC6SURBVDjLpVOrDsMwDMznDA8UDewHhgYjFXZgaDSovF+wr011kS5yLkkbbcCV7Z4vfrp1nuL2usXv555l1Easg7I8LvH9vGaBjZ89H3QIYhOBBQLErKzQb7HwO3xsMMEtAqZNfJEBARqodZOsIlCANk99RQ9gHIFbk2CZrlfzGUGzhBBC9N7nDPTFIQLIGQGwVQ8I0s3sTaTqgQ08IuiO0e6Cpju0SL+sciJgQ+zR6OFAp9/iUg/+PecdxlckrJoZmykAAAAASUVORK5CYII=';

export default function App() {
  const [result, setResult] = React.useState<string | undefined>();
  const [result2, setResult2] = React.useState<string | undefined>();

  const getMergedImage = async () => {
    const newImage = await mergeImages([
      {
        uri: image1,
      },
      {
        uri: image2,
      },
    ]);

    setResult(newImage);

    const newImage2 = await mergeImages([
      {
        uri: image2,
      },
      {
        uri: `data:image/png;base64,${newImage}`,
      },
    ]);
    setResult2(newImage2);
  };

  React.useEffect(() => {
    getMergedImage();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Image 1: </Text>
      <Image source={{ uri: image1 }} style={styles.exampleImages} />
      <Text>Image 2: </Text>
      <Image source={{ uri: image2 }} style={styles.exampleImages} />
      <Text>Image 1 + Image 2: </Text>
      <Image
        source={{ uri: `data:image/png;base64,${result}` }}
        style={styles.resultImage}
      />
      <Text>Previous result + image 2: </Text>
      <Image
        source={{ uri: `data:image/png;base64,${result2}` }}
        style={styles.resultImage2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleImages: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  resultImage: {
    width: 50,
    height: 100,
  },
  resultImage2: {
    width: 50,
    height: 150,
  },
});
