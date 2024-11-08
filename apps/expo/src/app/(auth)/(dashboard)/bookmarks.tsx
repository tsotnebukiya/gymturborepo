import GradientLayout from '~/components/common/GradientLayout';
import { Text } from 'react-native-paper';
import SavedLayout from '~/components/saved/SavedLayout';

export default function BookmarksScreen() {
  return (
    <GradientLayout>
      <SavedLayout />
    </GradientLayout>
  );
}
