import { useState } from 'react'
import Indonesia from "../src/maps/provinsi/provinces-simplified-topo.json"
import WorldMap from "../src/maps/world-countries.json"
import Jawa from "../src/maps/provinsi/Data/data_jawa.json"
// import Indonesia2 from "../src/maps/provinsi/Data/indonesia-topojson-city-regency.json"
import Anies from "./assets/anies.png"
import DataProvinsi from "../src/maps/provinsi/Data/ind-data-prov-rev.json"
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { IconButton, Pane, Text, SideSheet, PlusIcon, MinusIcon, ResetIcon, Card, Heading, Dialog } from 'evergreen-ui'
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


  return (
    <>
      <main>
        {/* <TipsDialog /> */}
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
              <Text className='font-extrabold col-span-2 text-[#0F1436] text-4xl'>
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
              // center: [104, -11.3],
              // scale: 9000
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
                      stroke='rgba(0, 27, 85, 0.05'
                      strokeWidth={0.3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill='#ffffff'
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
                      (s) => s.provinsi === geo.properties.NAME_1
                    );
                    const transparency = (geo.properties.JML_RELAWAN)/10000
                    return (
                      <Geography
                        data-tooltip-id="province-tooltip"
                        key={geo.rsmKey}
                        geography={geo}
                        stroke={`rgba(0, 27, 85, ${0.02}`}
                        fill={`rgba(0, 27, 85, ${transparency}`}
                        strokeWidth={0.3}
                        className="animation duration-100 ease-out"
                        onMouseEnter={() => {
                          setTooltipContent(`${geo.properties.NAME_2 as string}: ${geo.properties.JML_RELAWAN} Relawan`);
                        }}
                        onMouseLeave={() => {
                          setTooltipContent("");
                        }}
                        onClick={() => {
                          setSelectedProvince({
                            id: geo.properties.ID_0,
                            provinsi: geo.properties.NAME_2,
                            total_relawan: geo.properties.JML_RELAWAN,
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
              <Marker coordinates={[100.8, -0.74]}>
                <text fontSize={1} textAnchor="middle" fill="#000" fontWeight="bold">
                  Pemalang
                </text>
                <text fontSize={1} y={1} textAnchor="middle" fill="#000">
                  61 relawan
                </text>
              </Marker>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TipsDialog() {

  const [dialogShown, setDialogShown] = useState(true)
  return (
    <Dialog
      isShown={dialogShown}
      title="Perhatian!"
      onCloseComplete={() => setDialogShown(false)}
      hasFooter={false}
    >
      <Card
        alignSelf="center"
        border="default"
        background="#F8FAF8"
        padding={10}
        borderRadius={20}
      >
        <Pane>
          <IconButton size='large' margin={4} marginRight={8} icon={PlusIcon}></IconButton>
          <Text>Zoom In</Text>
        </Pane>
        <Pane>
          <IconButton size='large' margin={4} marginRight={8} icon={MinusIcon}></IconButton>
          <Text>Zoom Out</Text>
        </Pane>
        <Pane>
          <IconButton size='large' margin={4} marginRight={8} icon={ResetIcon}></IconButton>
          <Text>Reset</Text>
        </Pane>
      </Card>
    </Dialog>
  );
}