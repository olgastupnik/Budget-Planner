import React, { useContext } from 'react';
import Chart from 'react-apexcharts';

import RootStore from 'store';

interface ICommunalChart {
  months: string[];
  totalAmount: number[];
}

export const CommunalChart = ({ months, totalAmount }: ICommunalChart) => {
  const {
    communalStore: { historyTotal, historyMonths },
  } = useContext(RootStore);

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={{
              chart: {
                id: 'basic-bar',
              },
              colors: ['#a9a9a9'],
              xaxis: {
                categories: historyMonths,
              },
            }}
            series={[
              {
                name: 'series-1',
                data: historyTotal,
              },
            ]}
            type="bar"
            width="500"
          />
        </div>
      </div>
    </div>
  );
};
