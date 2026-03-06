import * as echarts from 'echarts/core'
import { install as LineChart } from 'echarts/lib/chart/line/install.js'
import { install as BarChart } from 'echarts/lib/chart/bar/install.js'
import { install as ScatterChart } from 'echarts/lib/chart/scatter/install.js'
import { install as HeatmapChart } from 'echarts/lib/chart/heatmap/install.js'
import { install as RadarChart } from 'echarts/lib/chart/radar/install.js'
import { install as BoxplotChart } from 'echarts/lib/chart/boxplot/install.js'
import { install as CustomChart } from 'echarts/lib/chart/custom/install.js'

import { install as GridComponent } from 'echarts/lib/component/grid/install.js'
import { install as TitleComponent } from 'echarts/lib/component/title/install.js'
import { install as TooltipComponent } from 'echarts/lib/component/tooltip/install.js'
import { install as LegendComponent } from 'echarts/lib/component/legend/installLegendPlain.js'
import { install as MarkPointComponent } from 'echarts/lib/component/marker/installMarkPoint.js'
import { install as MarkLineComponent } from 'echarts/lib/component/marker/installMarkLine.js'
import { install as VisualMapComponent } from 'echarts/lib/component/visualMap/installVisualMapContinuous.js'
import { install as GraphicComponent } from 'echarts/lib/component/graphic/install.js'
import { install as RadarComponent } from 'echarts/lib/component/radar/install.js'

import { install as CanvasRenderer } from 'echarts/lib/renderer/installCanvasRenderer.js'

echarts.use([
  TitleComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkPointComponent,
  MarkLineComponent,
  VisualMapComponent,
  GraphicComponent,
  RadarComponent,
  LineChart,
  BarChart,
  ScatterChart,
  HeatmapChart,
  RadarChart,
  BoxplotChart,
  CustomChart,
  CanvasRenderer
])

export { echarts }
