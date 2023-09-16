/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import Indonesia from "../src/maps/provinsi/provinces-simplified-topo.json"
import WorldMap from "../src/maps/world-countries.json"
import Indonesia2 from "../src/maps/provinsi/Data/indonesia-topojson-city-regency.json"
import Anies from "./assets/anies.png"
import DataProvinsi from "../src/maps/provinsi/Data/ind-data-prov-rev.json"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { IconButton, Pane, Text, SideSheet, Tooltip, PlusIcon, MinusIcon, ResetIcon, Card, Heading } from 'evergreen-ui'
import { scaleQuantile } from "d3-scale";
import { COLOR_RANGE, DEFAULT_COLOR } from './assets/color';
import { ILocation } from './assets/interface';
import './App.css'

function App() {

  const [tooltipContent, setTooltipContent] = useState("")
  const [isShown, setIsShown] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState<ILocation | undefined>(undefined);

  const [zoom, setZoom] = useState(1);

  function handleZoom(isZoom: boolean) {
    if (isZoom == true) {
      setZoom(zoom + 1)
    } else {
      zoom == 1 ? setZoom(1) : setZoom(zoom - 1)
    }
  }

  const colorScale = scaleQuantile<string>()
    .domain(DataProvinsi.map((d) => d.total_relawan))
    .range(COLOR_RANGE);

  return (
    <>
      <main>
        <Pane
          display="grid"
          position="relative"
          justifyContent="center"
          alignItems="stretch"
        >
          <Pane
            display="flex"
            justifySelf="center"
            position="fixed"
            flexDirection="row"
          >
            <Card
              height={100}
              width={100}
              margin={8}
              marginRight={5}
              background='#F8FAF8'
              display="flex"
              border="default"
              borderRadius={20}
              justifyContent="center"
            >
              <img src={Anies} className='object-fit scale-95' />
            </Card>

            <Card
              display="flex"
              flexDirection="column"
              background='#F8FAF8'
              height={100}
              margin={8}
              padding={10}
              paddingLeft={30}
              paddingRight={30}
              border="default"
              justifyContent="center"
              alignItems="start"
              borderRadius={20}
            >
              <Text className='font-extrabold col-span-2 text-[#223140] text-4xl'>
                Peta Persebaran Relawan Anies
              </Text>
              <Text className='font-light col-span-2 text-[#616E6E] text-2xl'>
                {tooltipContent == "" ? "Pilih lokasi..." : tooltipContent}
              </Text>
            </Card>
          </Pane>

        </Pane>
        <Pane
          display="grid"
          position="fixed"
          height="100vh"
          justifyContent="center"
        >
          <Card
            alignSelf="center"
            border="default"
            background="#F8FAF8"
            padding={10}
            marginLeft={8}
            borderRadius={20}
          >
            <Pane>
              <IconButton size='large' margin={4} marginRight={8} icon={PlusIcon} onClick={() => handleZoom(true)}></IconButton>
              <Text>Zoom In</Text>
            </Pane>
            <Pane>
              <IconButton size='large' margin={4} marginRight={8} icon={MinusIcon} onClick={() => handleZoom(false)}></IconButton>
              <Text>Zoom Out</Text>
            </Pane>
            <Pane>
              <IconButton size='large' margin={4} marginRight={8} icon={ResetIcon} onClick={() => window.location.reload()}></IconButton>
              <Text>Reset</Text>
            </Pane>
          </Card>
        </Pane>
        <section className="flex">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              rotate: [0, 0, 0],
              center: [118, -1.6],
              scale: 1250,
            }}
            className="w-screen h-screen"
          >
            <ZoomableGroup
              zoom={zoom}
              center={[118, -3]}
              maxZoom={30}
            >
              <Geographies geography={WorldMap}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      fill='#F8FAF8'
                      stroke='#d4d4d8'
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
                      stroke='#E7ECE8'
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
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

              <Geographies geography={Indonesia2}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const current = DataProvinsi.find(
                      (s) => s.provinsi === geo.properties.NAME_1
                    );
                    return (
                      <Geography
                        data-tooltip-id="province-tooltip"
                        key={geo.rsmKey}
                        geography={geo}
                        stroke="#081829"
                        fill={current ? colorScale(current.total_relawan) : DEFAULT_COLOR}
                        strokeWidth={0.2}
                        className="animation duration-100 ease-out"
                        onMouseEnter={() => {
                          setTooltipContent(`${geo.properties.NAME_2 as string}: ${current?.total_relawan} Relawan`);
                        }}
                        onMouseLeave={() => {
                          setTooltipContent("");
                        }}
                        onClick={() => {
                          setSelectedProvince({
                            id: current?.id,
                            provinsi: current?.provinsi,
                            total_relawan: current?.total_relawan,
                            projection_config: current?.projection_config
                          })
                          setIsShown(true)
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
            </ZoomableGroup>
          </ComposableMap>
          <div className='absolute flex justify-center top-0 m-10 items-center gap-1'>
            {/* <SelectMenu
              title="Pilih Provinsi"
              hasFilter={false}
              options={DataProvinsi.map((item) => item.provinsi).map((label) => ({ label, value: label }))}
              width={280}
              height={200}
              // selected={DataProvinsi?.provinsi}
              onSelect={(item) => {
                const current = DataProvinsi.find(
                  (s) => s.provinsi === item.value
                );
                setSelectedProvince({
                  id: current?.id,
                  provinsi: current?.provinsi,
                  total_relawan: current?.total_relawan,
                  projection_config: current?.projection_config
                })
              }}
            >
              <Button width={280}>{selectedProvince?.provinsi || 'Pilih Provinsi...'}</Button>
            </SelectMenu>
            <Button appearance="primary" onClick={() => { setIsShown(true) }}>Cari</Button> */}
          </div>
          <SideSheet
            isShown={isShown}
            preventBodyScrolling
            onCloseComplete={() => {
              setIsShown(false)
              setSelectedProvince(undefined)
            }}
          >
            <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
              <Pane
                display="flex"
                flexDirection="column"
                padding={16}
                borderBottom="default"
              >
                <Heading size={100} color="#696f8c">
                  Peta Sebaran Jumlah Relawan Anies pada Kota
                </Heading>
                <Heading size={900} className='font-extrabold'>
                  {selectedProvince?.provinsi}
                </Heading>
              </Pane>
            </Pane>
            <Pane flex="1" background="tint2" padding={16}>
              <Card
                backgroundColor="white"
                elevation={0}
                height={240}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Heading>GRAFIK-GRAFIK</Heading>
              </Card>
            </Pane>
          </SideSheet>
          <div className='fixed flex-row items-center justify-center p-3'>
          </div>
        </section>
      </main >
    </>
  );
}

export default App
