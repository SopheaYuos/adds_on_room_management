import { Autocomplete, Grid, TextField } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";
    
    class ColumnChart extends React.Component {
       
        constructor(props) {
          
          super(props);

          this.state = {
            

            series: [{
            
              name: 'Net Profit',
              data: [44, 55, 57,45,34,34,67,89,6,6,77,78]
             
            }],
           
            options: {
              chart: {
                type: 'bar',
                height: 30,
                
              },
              
              legend:{
                show:false
              },
              
              plotOptions: {
                bar: {
                  
                  distributed:true,
                  horizontal: false,
                  columnWidth: '60%',
                  endingShape: 'rounded',
                  
                },
              },
              dataLabels: {
                enabled: false,
                
              },
              stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
              },
              xaxis: {
                
                categories: ['GIC','GIC', 'GCA', 'GGG', 'GEE', 'GTR', 'DTC', 'AMS', 'GAR','GIM','GTI','GRU'],
              },
              yaxis: {
                title: {
                  text: ' Attendance'
                }
              },
              fill: {
                opacity: 1,
                
                
                
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return "$ " + val + " thousands"
                  }
                }
              
              },
              colors:["#81d4fa",
              "#1565c0",
              "#ec407a",
              "#03a9f4",
              "#039be5",
              "#f44336",
              "#ff5252",
              "#01579b",
              "#7c4dff",
              "#651fff",
              "#6200ea",
            "#7e57c2"]
            },
            
          
          
          };
        }
  
      

        render() {
          return (

              <div>
                   <Grid container justifyContent="center">
                          <b>Departments</b>
                      </Grid>
            <Autocomplete  
               options={timeSlots}

              sx={{marginTop: '-23px', width: 110, position: "relative", left: '85%' }}
              renderInput={(params) => <TextField {...params} label="Weekly" />}
               />
              <ReactApexChart  options={this.state.options} series={this.state.series} type="bar" height={252} />
              </div>
    

          );
        }
      }
      const timeSlots = Array.from(new Array(24 * 2)).map(
        (_, index) =>
          `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${
            index % 2 === 0 ? '00' : '30'
          }`,
      );
export default ColumnChart;
    


