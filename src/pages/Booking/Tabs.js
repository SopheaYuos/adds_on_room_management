import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AllBooking from './AllBooking';
import Approved from './Approved';
import Rejected from './Rejected ';
import Pending from './Pending';
import PageHeader from '../../components/PageHeader';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

function TabPanel(props) {
   const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <PageHeader
    title="Booking"
    subTitle="Booking Information"
    icon={<IntegrationInstructionsIcon color="primary" fontSize="large" />}
/>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Pending approval" {...a11yProps(0)} />
          <Tab label="Accepted" {...a11yProps(1)} />
          <Tab label="Rejected" {...a11yProps(1)} />
          <Tab label="All booking" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        
       <Pending></Pending>
      </TabPanel>
    
      <TabPanel value={value} index={1}>
        <Approved></Approved>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Rejected></Rejected>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AllBooking></AllBooking>
      </TabPanel>
    </Box>
    </>
  );
}
