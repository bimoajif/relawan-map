'use client';

import { Card, Metric, Text, Title, BarList, Flex, Grid } from '@tremor/react';
import TableRelawan from './table';
import Maps from './maps'

export default function PlaygroundPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-8xl">
      <Maps />
    </main>
  );
}
