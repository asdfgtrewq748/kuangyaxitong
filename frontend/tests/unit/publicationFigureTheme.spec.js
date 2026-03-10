import { mergePublicationChartOption } from '@/utils/publicationFigureTheme'

describe('mergePublicationChartOption', () => {
  it('applies publication defaults without losing series data', () => {
    const option = mergePublicationChartOption({
      xAxis: { type: 'category', data: ['A', 'B'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [1, 2] }]
    })

    expect(option.backgroundColor).toBe('#fffdfa')
    expect(option.series).toHaveLength(1)
    expect(option.series[0].data).toEqual([1, 2])
    expect(option.xAxis.axisLabel.fontFamily).toContain('Source Han Sans SC')
    expect(option.yAxis.splitLine.lineStyle.type).toBe('dashed')
  })

  it('keeps existing labels and merges panel annotations', () => {
    const option = mergePublicationChartOption(
      {
        title: { text: 'Existing title' },
        xAxis: [{ type: 'value' }],
        yAxis: [{ type: 'value' }],
        series: [{ type: 'scatter', data: [[1, 2]] }]
      },
      {
        panelLabel: 'Fig. 2',
        note: '95% CI shown as ribbon.'
      }
    )

    expect(option.title.text).toBe('Existing title')
    expect(Array.isArray(option.graphic)).toBe(true)
    expect(option.graphic.some((item) => String(item?.style?.text || '').includes('Fig. 2'))).toBe(true)
    expect(option.graphic.some((item) => String(item?.style?.text || '').includes('95% CI'))).toBe(true)
  })
})
