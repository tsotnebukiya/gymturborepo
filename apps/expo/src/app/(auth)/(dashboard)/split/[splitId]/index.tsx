import { keepPreviousData } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import SplitIndividual from '~/components/splits/SplitIndividual';
import SplitIndividualSkeleton from '~/components/splits/SplitIndividualSkeleton';
import { useCurrentLanguageEnum } from '~/i18n';
import { api } from '~/utils/api';

export default function SplitScreen() {
  const language = useCurrentLanguageEnum();
  const { splitId } = useLocalSearchParams();
  const { data: split, isLoading } = api.split.getOne.useQuery(
    {
      id: Number(splitId),
      language,
    },
    {
      placeholderData: keepPreviousData,
    }
  );
  if (isLoading) return <SplitIndividualSkeleton />;
  if (!split) return null;
  return <SplitIndividual split={split} />;
}
