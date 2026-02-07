import * as echarts from 'echarts/core'
import { install as LineChart } from 'echarts/lib/chart/line/install.js'
import { install as BarChart } from 'echarts/lib/chart/bar/install.js'
import { install as ScatterChart } from 'echarts/lib/chart/scatter/install.js'
import { install as HeatmapChart } from 'echarts/lib/chart/heatmap/install.js'

import { install as GridComponent } from 'echarts/lib/component/grid/install.js'
import { install as TooltipComponent } from 'echarts/lib/component/tooltip/install.js'
import { install as LegendComponent } from 'echarts/lib/component/legend/installLegendPlain.js'
import { install as ToolboxComponent } from 'echarts/lib/component/toolbox/install.js'
import { install as DataZoomComponent } from 'echarts/lib/component/dataZoom/installDataZoomInside.js'
import { install as MarkPointComponent } from 'echarts/lib/component/marker/installMarkPoint.js'
import { install as MarkLineComponent } from 'echarts/lib/component/marker/installMarkLine.js'
import { install as VisualMapComponent } from 'echarts/lib/component/visualMap/installVisualMapContinuous.js'
import { install as GraphicComponent } from 'echarts/lib/component/graphic/install.js'

import { install as CanvasRenderer } from 'echarts/lib/renderer/installCanvasRenderer.js'

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  MarkPointComponent,
  MarkLineComponent,
  VisualMapComponent,
  GraphicComponent,
  LineChart,
  BarChart,
  ScatterChart,
  HeatmapChart,
  CanvasRenderer
])

export { echarts }
