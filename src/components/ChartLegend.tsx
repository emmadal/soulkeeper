import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {Text} from 'react-native-paper';
import theme from '../themes';

const ChartLegend = ({dataCharts}: any) => {
  const renderLegend = (text, color) => {
    return (
      <View style={styles.renderLegendContainer}>
        <View
          style={[
            styles.renderLegend,
            {backgroundColor: color || theme.colors.text},
          ]}
        />
        <Text style={styles.renderLegendText}>{text || ''}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PieChart
        strokeColor="white"
        strokeWidth={1}
        focusOnPress
        donut
        data={[
          {value: dataCharts?.absents, color: theme.colors.error},
          {value: dataCharts?.present, color: theme.colors.success},
          {value: dataCharts?.total, color: theme.colors.primary},
        ]}
        innerCircleColor="#414141"
        innerCircleBorderWidth={4}
        innerCircleBorderColor={'white'}
        showValuesAsLabels={true}
        showText
        textColor={theme.colors.text}
        textSize={18}
        showTextBackground={true}
      />

      <View style={styles.legend}>
        {renderLegend('Absents', theme.colors.error)}
        {renderLegend('Présents', theme.colors.success)}
        {renderLegend('Total', theme.colors.primary)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#414141',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  textLegend: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  renderLegendContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  renderLegend: {
    height: 18,
    width: 18,
    marginRight: 10,
    borderRadius: 4,
  },
  renderLegendText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ChartLegend;
