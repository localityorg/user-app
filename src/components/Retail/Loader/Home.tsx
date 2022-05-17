import {StyleSheet} from 'react-native';
import SkeletonContent from 'react-native-skeleton-content';
import {Text} from '../../Common/Themed';

interface ProductItemsProps {
  loading?: boolean;
}

export default function ProductItems(props: ProductItemsProps) {
  return (
    <SkeletonContent
      containerStyle={ProductItemStyle.container}
      isLoading={true}
      layout={[
        {key: 'someId', width: 220, height: 20, marginBottom: 6},
        {key: 'someOtherId', width: 180, height: 20, marginBottom: 6},
      ]}
    >
      <Text>Your content</Text>
      <Text>Other content</Text>
    </SkeletonContent>
  );
}

const ProductItemStyle = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    borderRadius: 5,
    paddingTop: 0,
    padding: 5,
    marginBottom: 10,
  },
});
