'use client';

import { Card, Flex, Metric, Button, SearchSelect, SearchSelectItem, Text, Title, Table, TableHead, TableHeaderCell, TableRow, TableCell, TableBody } from '@tremor/react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import WorldMap from '../../assets/maps/world-countries.json'
import Indonesia from '../../assets/maps/provinces-simplified-topo.json'
import Jawa from '../../assets/maps/data_jawa.json'
import DataProvinsi from '../../assets/maps/data_nominal_jawa.json'
import { SetStateAction, useState } from 'react';
import { IRelawan } from '../../assets/interfaces'
import DataTabel from '../../assets/data/dataframe_jawa.json'

export default function Maps() {

  const defaultCoordinate = [111.5, -7.6] as [number, number]
  const [coord, setCoord] = useState(defaultCoordinate)
  const [tableData, setTableData] = useState([])
  const [kabupaten, setKabupaten] = useState('')
  const [zoom, setZoom] = useState(1)

  let rowNumber = 0

  function handleTableData(kabupaten: string) {
    const datatable = kabupaten == "" ? [] : Object.values(DataTabel).filter((item) => {
      return item.Kabupaten === kabupaten.toUpperCase()
    })
    setTableData(datatable as SetStateAction<never[]>)
  }

  function handleZoom(longitude: number, latitude: number) {
    setCoord([longitude, latitude])
    setZoom(6)
  }

  function resetZoom() {
    setKabupaten('')
    setCoord(defaultCoordinate)
    setTableData([])
    setZoom(1)
  }

  const max = 5000;

  const searchSelectItems = DataProvinsi.map(item => (
    <SearchSelectItem key={item.Kabupaten} value={item.Kabupaten}>
      {item.Kabupaten} - {item.Provinsi}
    </SearchSelectItem>
  ));

  const markerCoordinate = DataProvinsi.map(item => (
    <Marker key={item.Kabupaten} coordinates={[item.longitude, item.latitude]}>
      <text fontSize={7} textAnchor="middle" fill="#000" fontWeight="bold">
        {item.Kabupaten}
      </text>
      <text fontSize={7} y={7} textAnchor="middle" fill="#000">
        {item.Jumlah_Relawan} Relawan
      </text>
    </Marker>
  ));

  return (
    <>
      <Card>
        <Metric
          className='text-center'
        >
          Peta Sebaran Relawan di Jawa Tengah, Jawa Timur, dan DIY
        </Metric>

        <Flex justifyContent='center' className='mt-3 gap-3'>
          <SearchSelect className='w-80' placeholder='Pilih Kota/Kabupaten' onValueChange={setKabupaten}>
            {searchSelectItems}
          </SearchSelect>

          <Button
            size="sm"
            className='bg-[#061A52] border-[#061A52] hover:bg-[#f59e0b] hover:border-[#f59e0b]'
            onClick={() => {
              const data = DataProvinsi.find((item) => {
                return item.Kabupaten === kabupaten
              })
              handleTableData(data?.Kabupaten as string)
              handleZoom(data?.longitude as number, data?.latitude as number)
            }}
          >
            Cari
          </Button>
          <Button
            variant='secondary'
            size="sm"
            // className='bg-[#061A52] border-[#061A52] hover:bg-[#f59e0b] hover:border-[#f59e0b]'
            onClick={() => {
              resetZoom()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>

          </Button>
        </Flex>

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            rotate: [0, 0, 0],
            center: [118, -1.6],
            scale: 13000
            // center: [118, -1.6],
            // scale: 1900,
          }}
          className="w-full h-[60vh] mt-8 border-2 border-[#E5E7EB] rounded-xl bg-blue-200"
        >
          {/* <ZoomableGroup center={[118, -3]} maxZoom={30}> */}
          <ZoomableGroup center={coord} zoom={zoom} maxZoom={30}>
            <Geographies geography={WorldMap}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    fill='#F9FAFB'
                    stroke='#E5E7EB'
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            <Geographies geography={Indonesia}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    stroke='rgba(0, 27, 85, 0.8)'
                    strokeWidth={0.3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill='#f8fafc'
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            <Geographies geography={Jawa}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const current = DataProvinsi.find(
                    (s) => s.Kabupaten === geo.properties.NAME_2
                  );
                  // const transparency = (current?.total_relawan as number) / 10000
                  const transparency = (current?.Jumlah_Relawan as number) / max
                  return (
                    <Geography
                      data-tooltip-id="province-tooltip"
                      key={geo.rsmKey}
                      geography={geo}
                      stroke={`rgba(0, 27, 85, 0.03`}
                      fill={`rgba(0, 27, 85, ${transparency}`}
                      strokeWidth={2}
                      className="animation duration-100 ease-out"
                      onClick={() => {
                        setKabupaten('')
                        setTableData([])
                        handleZoom(current?.longitude as number, current?.latitude as number)
                        setKabupaten(geo.properties.NAME_2)
                        handleTableData(geo.properties.NAME_2)
                      }}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: "#f59e0b", outline: 'none' },
                        pressed: { fill: "#d97706", outline: 'none' }
                      }}
                    />
                  )
                })
              }
            </Geographies>
            {markerCoordinate}
          </ZoomableGroup>
        </ComposableMap>
        <Card className="max-w-sm mx-auto mt-5">
          {/* <Title className='mb-3 text-extrabold'>Legenda</Title> */}
          <Flex>
            <Text>0</Text>
            <Text>{max / 4}</Text>
            <Text>{2 * max / 4}</Text>
            <Text>&gt; {max}</Text>
          </Flex>
          <div className='w-full h-3 bg-gradient-to-r from-transparent to-[#061A52] rounded-full'>
          </div>
          <Text className='text-center'>&#40;relawan&#41;</Text>
        </Card>
      </Card>

      <Card className="mt-8">
        <Metric
          className='text-center'
        >
          Tabel Sebaran Relawan di {kabupaten}
        </Metric>
        <Table className="mt-8">
          <TableHead>
            <TableRow>
              <TableHeaderCell>No</TableHeaderCell>
              <TableHeaderCell>Provinsi</TableHeaderCell>
              <TableHeaderCell>Kabupaten</TableHeaderCell>
              <TableHeaderCell>Kecamatan</TableHeaderCell>
              <TableHeaderCell>Alamat</TableHeaderCell>
              <TableHeaderCell>Umur</TableHeaderCell>
              <TableHeaderCell>Pekerjaan</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(tableData).map((relawan: IRelawan) => (
              <TableRow key={relawan.Nama}>
                <TableCell>{++rowNumber}</TableCell>
                <TableCell>
                  <Text>{relawan.Provinsi}</Text>
                </TableCell>
                <TableCell>
                  <Text>{relawan.Kabupaten}</Text>
                </TableCell>
                <TableCell>
                  <Text>{relawan.Kecamatan}</Text>
                </TableCell>
                <TableCell>
                  <Text className='w-96 break-words overflow-auto'>{relawan.Alamat}</Text>
                </TableCell>
                <TableCell>
                  <Text>{relawan.Umur}</Text>
                </TableCell>
                <TableCell>
                  <Text>{relawan.Pekerjaan}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}