/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import Indonesia from "../src/maps/provinsi/provinces-simplified-topo.json"
import DataProvinsi from "../src/maps/provinsi/Data/ind-data-prov-rev.json"
import Aceh from "../src/maps/kabupaten-kota/All/yogyakarta-simplified-topo.json"
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Button, Pane, SelectMenu, SideSheet } from 'evergreen-ui'
import { Tooltip as ReactTooltip } from "react-tooltip";
import { scaleQuantile } from "d3-scale";
import { COLOR_RANGE, DEFAULT_COLOR } from './assets/color';
import './App.css'

interface Location {
  id: string | undefined,
  provinsi: string | undefined,
  total_relawan: number | undefined,
  projection_config: {
    rotate: number[],
    center: number[],
    scale: number
  } | undefined
}

function App() {

  const [tooltipContent, setTooltipContent] = useState("")
  const [isShown, setIsShown] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState<Location | undefined>(undefined);
  const [provinceId, setProvinceId] = useState("")

  const colorScale = scaleQuantile<string>()
    .domain(DataProvinsi.map((d) => d.total_relawan))
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
                  const current = DataProvinsi.find(
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
                        setTooltipContent(`${current?.provinsi as string}: ${current?.total_relawan} Relawan`);
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
                        setProvinceId(`${current?.id as string}`)
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
              selected={selectedProvince?.provinsi}
              // onSelect={(item) => setSelectedProvince(item.value as string)}
            >
              <Button width={280}>{selectedProvince?.provinsi || 'Pilih Provinsi...'}</Button>
            </SelectMenu>
            <Button appearance="primary" onClick={() => { setIsShown(true) }}>Cari</Button>
          </div>
          <SideSheet
            isShown={isShown}
            preventBodyScrolling
            onCloseComplete={() => {
              setIsShown(false)
              setSelectedProvince(undefined)
            }}
          >
            <Pane className='m-5'>
              <p className='text-slate-500'>Peta Sebaran Jumlah Relawan pada Provinsi</p>
              <h1 className='heading'>
                {selectedProvince?.provinsi}
              </h1>
              <hr />
              <Pane className='h-[50vh]'>
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    rotate: selectedProvince?.projection_config?.rotate as [number, number, number],
                    center: selectedProvince?.projection_config?.center as [number, number],
                    scale: selectedProvince?.projection_config?.scale,
                  }}
                  className="w-screen h-auto"
                >
                  <Geographies geography={`../src/maps/kabupaten-kota/All/${selectedProvince?.id}-simplified-topo.json`}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        console.log(provinceId)
                        return (
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
                        )
                      })
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
