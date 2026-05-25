import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PRACTICE_ACCENT } from '@/constants/tab-colors';
import { letterTight, screenBackground, sfPro, weightSemibold } from '@/constants/typography';
import { usePracticeLog } from '@/contexts/practice-log-context';
import {
  buildYearMonthlyPracticeChart,
  chartMaxForHours,
  formatHoursLabel,
  practicePeriodInsightMessage,
  yTicksForMax,
} from '@/utils/practice-activity';

const ACCENT = PRACTICE_ACCENT;
const CHART_INNER_HEIGHT = 180;
const CHART_BOTTOM_LABEL_SPACE = 28;
const CHART_PLOT_HEIGHT = CHART_INNER_HEIGHT + CHART_BOTTOM_LABEL_SPACE;
const BAR_WIDTH = 36;
const BAR_COLUMN_GAP = 14;
const SIDE_PAD = 16;
const DIM_OPACITY = 0.3;
const INSIGHT_BAR_HEIGHT = 24;

const { width: SCREEN_W } = Dimensions.get('window');
/** Horizontal chart area ≈ screen minus scroll padding and y-axis (matches weekly layout). */
const CHART_H_SCROLL_VIEWPORT_W = SCREEN_W - 40 - 28;

export default function MonthlyPracticeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { entries } = usePracticeLog();
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const chartHScrollRef = useRef<ScrollView>(null);
  const didInitialChartScroll = useRef(false);

  const monthlyChart = useMemo(() => buildYearMonthlyPracticeChart(entries), [entries]);
  const currentMonthIndex = Math.max(0, monthlyChart.length - 1);

  const activeIndex = selectedBarIndex ?? currentMonthIndex;
  const activeMonth = monthlyChart[activeIndex] ?? {
    hours: 0,
    label: '',
    longLabel: '',
    monthIndex: 0,
  };

  const chartMax = useMemo(
    () => chartMaxForHours(monthlyChart.map((m) => m.hours)),
    [monthlyChart],
  );

  const insightSubtitle = useMemo(() => {
    const current = monthlyChart[activeIndex]?.hours ?? 0;
    const prev = activeIndex > 0 ? monthlyChart[activeIndex - 1]!.hours : null;
    return practicePeriodInsightMessage(current, prev, 'month');
  }, [activeIndex, monthlyChart]);

  const insightBars = useMemo(() => {
    const thisMonth = monthlyChart[activeIndex];
    const lastMonth = activeIndex > 0 ? monthlyChart[activeIndex - 1] : null;
    const thisH = thisMonth?.hours ?? 0;
    const lastH = lastMonth?.hours ?? 0;
    const denom = Math.max(thisH, lastH, 1e-6);
    const isCurrentMonth = activeIndex === currentMonthIndex;
    return {
      thisHours: thisH,
      lastHours: lastH,
      thisLabel: isCurrentMonth ? 'This month' : (thisMonth?.label ?? '—'),
      lastLabel: lastMonth ? (isCurrentMonth ? 'Last month' : lastMonth.label) : '—',
      thisWidthPct: (thisH / denom) * 100,
      lastWidthPct: (lastH / denom) * 100,
    };
  }, [activeIndex, monthlyChart, currentMonthIndex]);

  const clearSelection = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBarIndex(null);
  }, []);

  const selectBar = useCallback((i: number) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBarIndex(i);
  }, []);

  const yTicks = useMemo(() => yTicksForMax(chartMax), [chartMax]);

  const barHeights = useMemo(
    () => monthlyChart.map((m) => Math.max(8, (m.hours / chartMax) * CHART_INNER_HEIGHT)),
    [monthlyChart, chartMax],
  );

  const chartPlotInnerWidth =
    SIDE_PAD * 2 +
    monthlyChart.length * BAR_WIDTH +
    Math.max(0, monthlyChart.length - 1) * BAR_COLUMN_GAP;
  const chartScrollWidth = 20 + chartPlotInnerWidth + 20;
  const edgeTapHeight = CHART_PLOT_HEIGHT + 8;

  const scrollChartToCurrentMonth = useCallback(() => {
    if (didInitialChartScroll.current || monthlyChart.length === 0) return;
    const viewportW = CHART_H_SCROLL_VIEWPORT_W;
    if (chartScrollWidth <= viewportW) {
      didInitialChartScroll.current = true;
      return;
    }
    const edge = 20;
    const barCenter =
      edge + SIDE_PAD + currentMonthIndex * (BAR_WIDTH + BAR_COLUMN_GAP) + BAR_WIDTH / 2;
    const maxX = chartScrollWidth - viewportW;
    const x = Math.max(0, Math.min(barCenter - viewportW / 2, maxX));
    chartHScrollRef.current?.scrollTo({ x, animated: false });
    didInitialChartScroll.current = true;
  }, [chartScrollWidth, currentMonthIndex, monthlyChart.length]);

  const periodSubtitle =
    activeIndex === currentMonthIndex ? 'This month' : activeMonth.longLabel;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backGlyph}>‹</Text>
        </Pressable>
        <Text style={styles.screenTitle}>Monthly</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={styles.currentBlock}>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursBig}>{formatHoursLabel(activeMonth.hours)}</Text>
            <Text style={styles.hoursUnit}>Hours</Text>
          </View>
          <Text style={styles.rangeMuted}>{periodSubtitle}</Text>
        </View>

        <View style={styles.chartSection}>
          {monthlyChart.length === 0 ? (
            <Text style={styles.emptyChart}>No practice logged this year yet.</Text>
          ) : (
            <View style={styles.chartRow}>
              <ScrollView
                ref={chartHScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces
                nestedScrollEnabled
                contentContainerStyle={{ minWidth: chartScrollWidth }}
                onContentSizeChange={scrollChartToCurrentMonth}
              >
                <View style={[styles.chartScrollRow, { width: chartScrollWidth }]}>
                  <Pressable
                    style={[styles.edgeTap, { height: edgeTapHeight }]}
                    onPress={clearSelection}
                    accessibilityLabel="Clear bar selection"
                  />
                  <View
                    style={[styles.chartPlot, { width: chartPlotInnerWidth, minHeight: CHART_PLOT_HEIGHT }]}
                  >
                    <View style={[styles.gridOverlay, { height: CHART_INNER_HEIGHT }]} pointerEvents="none">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <View
                          key={i}
                          style={[styles.gridH, { top: (i / 4) * (CHART_INNER_HEIGHT - 1) }]}
                        />
                      ))}
                      {Array.from({ length: monthlyChart.length + 1 }, (_, i) => {
                        const left =
                          i < monthlyChart.length
                            ? SIDE_PAD + i * (BAR_WIDTH + BAR_COLUMN_GAP)
                            : SIDE_PAD +
                              monthlyChart.length * BAR_WIDTH +
                              (monthlyChart.length - 1) * BAR_COLUMN_GAP;
                        return <View key={`v-${i}`} style={[styles.gridV, { left }]} />;
                      })}
                    </View>
                    <View style={[styles.barsRow, { height: CHART_INNER_HEIGHT, paddingHorizontal: SIDE_PAD }]}>
                      {monthlyChart.map((month, i) => {
                        const h = barHeights[i]!;
                        const opacity =
                          selectedBarIndex === null ? 1 : selectedBarIndex === i ? 1 : DIM_OPACITY;
                        return (
                          <View key={month.monthIndex} style={styles.barColumn}>
                            <Pressable
                              style={styles.barTapClear}
                              onPress={clearSelection}
                              accessibilityLabel="Clear selection"
                            />
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`${month.label}, ${formatHoursLabel(month.hours)} hours`}
                              accessibilityState={{ selected: selectedBarIndex === i }}
                              onPress={() => selectBar(i)}
                              style={styles.barPress}
                            >
                              <View style={[styles.barFill, { height: h, opacity }]} />
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                    <View style={[styles.xAxisRow, { paddingHorizontal: SIDE_PAD }]}>
                      {monthlyChart.map((month) => (
                        <View key={month.monthIndex} style={styles.xAxisCell}>
                          <Text style={styles.monthAxisLabel}>{month.label}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <Pressable
                    style={[styles.edgeTap, { height: edgeTapHeight }]}
                    onPress={clearSelection}
                    accessibilityLabel="Clear bar selection"
                  />
                </View>
              </ScrollView>

              <View style={styles.yAxis}>
                {yTicks.map((t) => (
                  <Text key={t} style={styles.yTick}>
                    {formatHoursLabel(t)}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.highlightCard}>
          <Text style={styles.highlightTitle}>Monthly Insight</Text>
          <Text style={styles.highlightBody}>{insightSubtitle}</Text>

          <View style={styles.highlightRows}>
            <View style={styles.hlRow}>
              <Text style={styles.hlHours}>{formatHoursLabel(insightBars.thisHours)} h</Text>
              <View style={[styles.hlTrack, styles.hlTrackThisPeriod]}>
                <View
                  style={[styles.hlFillThisPeriod, { width: `${insightBars.thisWidthPct}%` }]}
                >
                  <Text style={styles.hlBarLabelOnAccent} numberOfLines={1}>
                    {insightBars.thisLabel}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.hlRow}>
              <Text style={styles.hlHours}>{formatHoursLabel(insightBars.lastHours)} h</Text>
              <View style={[styles.hlTrack, styles.hlTrackThisPeriod]}>
                <View
                  style={[styles.hlFillLastPeriod, { width: `${insightBars.lastWidthPct}%` }]}
                >
                  <Text style={styles.hlBarLabelOnMuted} numberOfLines={1}>
                    {insightBars.lastLabel}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: screenBackground,
  },
  scroll: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8e8ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    fontFamily: sfPro,
    fontSize: 28,
    color: '#333',
    fontWeight: weightSemibold,
    marginTop: -2,
    includeFontPadding: false,
  },
  topBarSpacer: {
    width: 44,
  },
  screenTitle: {
    fontFamily: sfPro,
    fontSize: 18,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  currentBlock: {
    marginTop: 12,
    marginBottom: 28,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  hoursBig: {
    fontFamily: sfPro,
    fontSize: 44,
    fontWeight: weightSemibold,
    color: '#000',
    letterSpacing: letterTight,
  },
  hoursUnit: {
    fontFamily: sfPro,
    fontSize: 18,
    fontWeight: weightSemibold,
    color: '#000',
    letterSpacing: letterTight,
  },
  rangeMuted: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#000',
    letterSpacing: letterTight,
    marginTop: 3,
  },
  chartSection: {
    marginBottom: 28,
  },
  emptyChart: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#b7b7b7',
    letterSpacing: letterTight,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  chartScrollRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  edgeTap: {
    width: 20,
    alignSelf: 'flex-end',
  },
  chartPlot: {
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderStyle: 'dotted',
    opacity: 0.85,
  },
  gridV: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: CHART_INNER_HEIGHT,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    borderStyle: 'dotted',
    opacity: 0.85,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: BAR_COLUMN_GAP,
  },
  xAxisRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: BAR_COLUMN_GAP,
    marginTop: 8,
  },
  xAxisCell: {
    width: BAR_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 20,
  },
  monthAxisLabel: {
    fontFamily: sfPro,
    fontSize: 12,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    textAlign: 'center',
    width: '100%',
  },
  barColumn: {
    width: BAR_WIDTH,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    height: CHART_INNER_HEIGHT,
  },
  barTapClear: {
    flex: 1,
    minHeight: 24,
  },
  barPress: {
    justifyContent: 'flex-end',
    height: CHART_INNER_HEIGHT * 0.72,
  },
  barFill: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: ACCENT,
  },
  yAxis: {
    width: 28,
    justifyContent: 'space-between',
    paddingVertical: 0,
    paddingLeft: 4,
    height: CHART_INNER_HEIGHT,
    alignSelf: 'flex-end',
  },
  yTick: {
    fontFamily: sfPro,
    fontSize: 11,
    fontWeight: weightSemibold,
    color: '#000',
    textAlign: 'right',
    letterSpacing: letterTight,
  },
  highlightCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  highlightTitle: {
    fontFamily: sfPro,
    fontSize: 17,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    marginBottom: 10,
  },
  highlightBody: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#b7b7b7',
    letterSpacing: letterTight,
    lineHeight: 20,
    marginBottom: 22,
  },
  highlightRows: {
    gap: 18,
  },
  hlRow: {
    gap: 8,
  },
  hlHours: {
    fontFamily: sfPro,
    fontSize: 22,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  hlTrack: {
    width: '100%',
    height: INSIGHT_BAR_HEIGHT,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  hlTrackThisPeriod: {
    backgroundColor: 'transparent',
  },
  hlFillThisPeriod: {
    height: '100%',
    borderRadius: 12,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 8,
    minWidth: 0,
  },
  hlFillLastPeriod: {
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 8,
    minWidth: 0,
  },
  hlBarLabelOnAccent: {
    fontFamily: sfPro,
    fontSize: 12,
    fontWeight: weightSemibold,
    color: '#fff',
    letterSpacing: letterTight,
  },
  hlBarLabelOnMuted: {
    fontFamily: sfPro,
    fontSize: 12,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
  },
  pressed: {
    opacity: 0.88,
  },
});
