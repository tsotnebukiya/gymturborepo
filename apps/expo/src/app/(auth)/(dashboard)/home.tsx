import { Link } from 'expo-router';
import React from 'react';
import GradientLayout from '~/components/GradientLayout';
import { api } from '~/utils/api';

export default function HomeScreen() {
  // const { data } = api.post.all.useQuery();
  return (
    <GradientLayout>
      <Link href={{ pathname: '/generated/[id]', params: { id: '1' } }}>
        First One
      </Link>
      <Link href={{ pathname: '/generated/[id]', params: { id: '2' } }}>
        Second One
      </Link>
    </GradientLayout>
  );
}
