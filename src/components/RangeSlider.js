import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
function valuetext(value) {
  return `${value}`;
}

function RangeSlider({ title, value, onChange, ...props }) {
  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item>
        <label htmlFor="type">{title}</label>
      </Grid>
      <Grid item>
        <Box
          sx={{
            width: 400,
            bgcolor: "#f1f3f3",
            borderColor: "blue",
            borderRadius: 2,
            border: 2,
            px: 1,
            marginBottom : 1
          }}
        >
          <Grid container spacing={2} alignItems="center" className="p-0">
            <Grid item>0</Grid>
            <Grid item xs>
              <Slider
                size="small"
                getAriaLabel={() => "Stats range"}
                value={value}
                onChange={onChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={0}
                max={210}
                {...props}
              />
            </Grid>
            <Grid item>210</Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default RangeSlider;
