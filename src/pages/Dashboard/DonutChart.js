import { Grid } from "@mui/material";
import React from "react";
import Chart from 'react-apexcharts';

function DonutChart() {
  return (




    <div>
      <Grid container justifyContent="center">
        <b>Topic</b>
      </Grid>
      <Chart
        type="donut"
        width={500}
        height={185}
        series={[50, 10, 10, 30]}
        options={{
          labels: ['project', 'Tp', 'discuss', 'self lern'],
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: '',
                    formatter: () => '100%'
                  }
                }
              }
            }
          }
        }}


      />

    </div>


  )
};

export default DonutChart;