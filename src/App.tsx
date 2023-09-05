import { useState } from 'react'
import Indonesia from "../src/maps/provinsi/provinces-simplified-topo.json"
import DataProvinsi from "../src/maps/provinsi/Data/ind-data-prov-rev.json"
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Button, Pane, SelectMenu, SideSheet } from 'evergreen-ui'
import { Tooltip as ReactTooltip } from "react-tooltip";
import './App.css'

function App() {

  const [tooltipContent, setTooltipContent] = useState("")
  const [isShown, setIsShown] = useState(false)
  const [selectedProvince, setSelectedProvince] = useState("")

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
                geographies.map((geo) => (
                  <Geography
                    data-tooltip-id="province-tooltip"
                    key={geo.rsmKey}
                    geography={geo}
                    stroke="#000"
                    strokeWidth={1}
                    className="animation duration-100 ease-out"
                    onMouseEnter={() => {
                      setTooltipContent(`${geo.properties.provinsi as string}`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    onClick={() => {
                      setSelectedProvince(`${geo.properties.provinsi as string}`)
                      setIsShown(true)
                    }}
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
              <p>Peta Sebaran Jumlah Relawan pada Provinsi</p>
              <h1 className='heading'>
                {selectedProvince}
              </h1>
              <hr/>
            </Pane>
          </SideSheet>
        </section>
      </main>
    </>
  );
}

export default App
