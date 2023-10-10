import {
  Card,
  Metric,
  Text,
  Table,
  TableHead, 
  TableHeaderCell, 
  TableBody, 
  TableRow, 
  TableCell, 
  TableFoot, 
  TableFooterCell
} from "@tremor/react";

import DataTabel from '../../assets/maps/data_nominal_jawa.json'

export default function TableRelawan() {
  return (
    <Card className="mt-8">
      <Metric
        className='text-center'
      >
        Tabel Sebaran Relawan di Jawa Tengah, Jawa Timur, dan DIY
      </Metric>
      <Table className="mt-8">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Nama</TableHeaderCell>
            <TableHeaderCell>Provinsi</TableHeaderCell>
            <TableHeaderCell>Kabupaten</TableHeaderCell>
            <TableHeaderCell>Kecamatan</TableHeaderCell>
            <TableHeaderCell>Desa/Keluarahan</TableHeaderCell>
            <TableHeaderCell>Alamat</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(DataTabel).map((relawan) => (
          <TableRow key={relawan.Provinsi}>
            <TableCell>{relawan.Provinsi}</TableCell>
            <TableCell>
              <Text>{relawan.Kabupaten}</Text>
            </TableCell>
            <TableCell>
              <Text>{relawan.Jumlah_Relawan}</Text>
            </TableCell>
          </TableRow>
        ))}
        </TableBody>
      </Table>
    </Card>
  );
}