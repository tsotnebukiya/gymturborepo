import React, { useEffect } from 'react';
import { View } from 'react-native';
import Homepage from '~/components/Homepage/Homepage';
import { api } from '~/utils/api';

export default function HomeScreen() {
  const { data, isLoading, isFetching } = api.generation.getAll.useQuery();

  useEffect(() => {
    const startTime = performance.now();

    if (!isLoading && data) {
      const endTime = performance.now();
      console.log(`Data fetch took ${endTime - startTime}ms`);
    }
  }, [isLoading, data]);

  if (isLoading || !data) return <View />;

  return <Homepage data={data} />;
}
