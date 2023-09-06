/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import Indonesia from "../src/maps/provinsi/provinces-simplified-topo.json"
import DataProvinsi from "../src/maps/provinsi/Data/ind-data-prov-rev.json"
import Aceh from "../src/maps/kabupaten-kota/Jawa Barat/jawa-barat-simplified-topo.json"
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Button, Pane, SelectMenu, SideSheet } from 'evergreen-ui'
import { Tooltip as ReactTooltip } from "react-tooltip";
import { scaleQuantile } from "d3-scale";
import './App.css'

const COLOR_RANGE = [
  "#eff6ff",
  "#e2efff",
  "#d5e7fe",
  "#c8e0fe",
  "#bbd9fd",
  "#aed1fd",
  "#a1cafc",
  "#94c2fc",
  "#87bbfb",
  "#7ab4fb",
  "#6dacfa",

  "#60a5fa",
  "#599cf7",
  "#5394f3",
  "#4c8bf0",
  "#4582ec",
  "#3f79e9",
  "#3871e6",
  "#3168e2",
  "#2a5fdf",
  "#2457db",
  "#1d4ed8",

  "#1c4acc",
  "#1944be",
  "#163eb1",
  "#1438a3",
  "#113295",
  "#0e2c88",
  "#0b267a",
  "#08206c",
  "#061a5e",
  "#031451",
  "#000e43",
];

const DEFAULT_COLOR = "#eff6ff";

function App() {

  const [tooltipContent, setTooltipContent] = useState("")
  const [isShown, setIsShown] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState("")
  const [data, setData] = useState(DataProvinsi)

  const colorScale = scaleQuantile<string>()
    .domain(data.map((d) => d.total_relawan))
    .range(COLOR_RANGE);

  return (
    <>
      <main>
        <section className="flex justify-center">
          <ReactTooltip
            id="province-tooltip"
            place="bottom"
            content={tooltipContent}
          />
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              rotate: [0, 0, 0],
              center: [118, -3],
              scale: 1250,
            }}
            className="w-screen h-screen"
          >
            <Geographies geography={Indonesia}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const current = data.find(
                    (s) => s.provinsi === geo.properties.provinsi
                  );
                  return (
                    <Geography
                      data-tooltip-id="province-tooltip"
                      key={geo.rsmKey}
                      geography={geo}
                      stroke="#000"
                      fill={current ? colorScale(current.total_relawan) : DEFAULT_COLOR}
                      strokeWidth={1}
                      className="animation duration-100 ease-out"
                      onMouseEnter={() => {
                        setTooltipContent(`${geo.properties.provinsi as string}: ${current?.total_relawan} Relawan`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      onClick={() => {
                        setSelectedProvince(`${geo.properties.provinsi as string}`)
                        setIsShown(true)
                      }}
                      style={{
                        hover: { fill: "#f59e0b" },
                        pressed: { fill: "#d97706" }
                      }}
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
          <div className='absolute flex justify-center top-0 m-10 items-center gap-1'>

            <SelectMenu
              title="Pilih Provinsi"
              hasFilter={false}
              options={DataProvinsi.map((province) => province.provinsi).map((label) => ({ label, value: label }))}
              width={280}
              height={200}
              selected={selectedProvince}
              onSelect={(item) => setSelectedProvince(item.value as string)}
            >
              <Button width={280}>{selectedProvince || 'Pilih Provinsi...'}</Button>
            </SelectMenu>
            <Button appearance="primary" onClick={() => { setIsShown(true) }}>Cari</Button>
          </div>
          <SideSheet
            isShown={isShown}
            preventBodyScrolling
            onCloseComplete={() => {
              setIsShown(false)
              setSelectedProvince('')
            }}
          >
            <Pane className='m-5'>
              <p className='text-slate-500'>Peta Sebaran Jumlah Relawan pada Provinsi</p>
              <h1 className='heading'>
                {selectedProvince}
              </h1>
              <hr />
              <Pane className='h-[50vh] bg-red-600'>
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    rotate: [0, 0, 0],
                    center: [109.7, -8.55],
                    scale: 6300,
                  }}
                  className="w-screen h-auto"
                >
                  <Geographies geography={Aceh}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          data-tooltip-id="province-tooltip"
                          key={geo.rsmKey}
                          geography={geo}
                          stroke="#000"
                          strokeWidth={1}
                          className="animation duration-100 ease-out"
                          style={{
                            default: { fill: "#fff" },
                            hover: { fill: "#4065F6" },
                            pressed: { fill: "#4065F6" }
                          }}
                        />
                      ))
                    }
                  </Geographies>
                </ComposableMap>
              </Pane>
              adjlsadjls
            </Pane>
          </SideSheet>
        </section>
      </main>
    </>
  );
}

export default App
