import { Card, Title, Text, Grid, Flex, BarList } from '@tremor/react';
import { queryBuilder } from '../lib/planetscale';
import Search from './search';
import UsersTable from './table';

export const dynamic = 'force-dynamic';

const website = [
  { name: '/home', value: 1230 },
  { name: '/contact', value: 751 },
  { name: '/gallery', value: 471 },
  { name: '/august-discount-offer', value: 280 },
];

const shop = [
  { name: '/home', value: 453 },
  { name: '/imprint', value: 351 },
  { name: '/shop', value: 271 },
  { name: '/pricing', value: 191 }
];

const app = [
  { name: '/shop', value: 789 },
  { name: '/product-features', value: 676 },
  { name: '/about', value: 564 },
  { name: '/login', value: 234 },
  { name: '/downloads', value: 191 }
];

const data = [
  {
    category: 'Lokasi Jumlah Relawan Terbanyak',
    color: 'blue',
    data: website
  },
  {
    category: 'Lokasi Jumlah Relawan Tersedikit',
    color: 'rose',
    data: shop
  }
];

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  // const search = searchParams.q ?? '';
  // const users = await queryBuilder
  //   .selectFrom('users')
  //   .select(['id', 'name', 'username', 'email'])
  //   .where('name', 'like', `%${search}%`)
  //   .execute();

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {/* <Title>Users</Title>
      <Search />
      <Card className="mt-6">
        <UsersTable />
      </Card> */}
      <Grid numItemsSm={2} numItemsLg={2} className="gap-6">
        {data.map((item) => (
          <Card key={item.category}>
            <Title>{item.category}</Title>
            <Flex
              justifyContent="start"
              alignItems="baseline"
              className="space-x-2"
            >
            </Flex>
            <Flex className="mt-6">
              <Text>Kota/Kabupaten</Text>
              <Text className="text-right">Jumlah Relawan</Text>
            </Flex>
            <BarList
              color={item.category == 'Lokasi Jumlah Relawan Terbanyak' ? 'blue' : 'orange'}
              data={item.data}
              valueFormatter={(number: number) =>
                Intl.NumberFormat('us').format(number).toString()
              }
              className="mt-2"
            />
          </Card>
        ))}
      </Grid>
    </main>
  );
}
