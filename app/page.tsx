"use client"

import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";

import dynamic from "next/dynamic";
import Head from "next/head"

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PlaceIcon from "@mui/icons-material/Place";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { v4 as uuidv4 } from "uuid";

const DynamicMapComponent = dynamic(
  () => import("../components/MapComponent"),
  {
    loading: () => <p>Loading the map</p>,
    ssr: false,
  }
);

export type Location = {
  latitude: number;
  longitude: number;
};

export type Area = {
  locations: { [key: string]: Location };
};

function DropDown(props: { areas: { [key: string]: Area }, selectedArea: string, onChange: Function }) {
  const handleChange = (event: SelectChangeEvent) => {
    props.onChange(event.target.value as string);
  };
  return (
    <FormControl fullWidth sx={{ p: 1 }} >
      <Select
        id="demo-simple-select"
        value={props.selectedArea}
        onChange={handleChange}
      >
        {Object.keys(props.areas).map(key => (
          <MenuItem key={key} value={key}>
            {key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function LocationListItem(key: string, location: Location, onLocationClick: Function, selected: boolean) {
  const decimals: number = 7;
  return (
    <ListItem
      disablePadding
      key={key}
      onClick={() => onLocationClick(key, location)}
    >
      <ListItemButton sx={{
        bgcolor: selected ? "primary.main" : "transparent",
        color: selected ? "primary.contrastText" : "inherit",
        "&:hover": { bgcolor: selected ? "primary.dark" : "action.hover" }
      }}>
        <ListItemIcon>
          <PlaceIcon />
        </ListItemIcon>
        <ListItemText
          primary={location.latitude.toFixed(decimals) + ", " + location.longitude.toFixed(decimals)}
        />
      </ListItemButton>
    </ListItem>
  );
}

function LocationList(props: { locations: { [key: string]: Location }, onLocationClick: Function, selectedLocation: string }) {
  return (
    <Box sx={{ width: "100%", maxHeight: 400, overflowY: "auto" }}>
      <List>
        {Object.keys(props.locations).map((key => LocationListItem(
          key, props.locations[key], props.onLocationClick, key === props.selectedLocation
        )))}
      </List>
    </Box>
  );
}

function getLocationKey(): string {
  return uuidv4();
}

function calculateNewLocation(area: Area): Location {
  const keys: Array<string> = Object.keys(area.locations);
  if (keys.length > 0) {
    const first: string = keys[0];
    const last: string = keys[keys.length - 1];
    const latitude: number = (area.locations[first].latitude + area.locations[last].latitude) / 2;
    const longitude: number = (area.locations[first].longitude + area.locations[last].longitude) / 2;
    return { latitude: latitude, longitude: longitude };
  } else {
    return { latitude: 0, longitude: 0 };
  }
}

export default function Page() {
  const initialAreas: { [key: string]: Area } =
    {"Kamppi":{"locations":{
      "4986070d-c9da-4178-ad88-42192bf01a4d":{"latitude":60.17236385439803,"longitude":24.934887886047367},
      "bf2af528-5410-42fe-a1ac-bfb704bab690":{"latitude":60.167795542273105,"longitude":24.92098331451416},
      "168ba56d-be0f-40e2-9460-52652c8cad5a":{"latitude":60.16350416589006,"longitude":24.92136955261231},
      "8405b3af-387f-43eb-a464-3f1abf1a4bd3":{"latitude":60.160600230133824,"longitude":24.925746917724613},
      "21a867dc-12f6-4d91-808e-0d0cdcc29207":{"latitude":60.16282090997341,"longitude":24.932956695556644},
      "1fab29ed-c3e3-4008-abc2-cccdd826b06c":{"latitude":60.162073582548565,"longitude":24.934201240539554},
      "726663c8-9993-4b38-b75f-a5e89da9c792":{"latitude":60.165489797763136,"longitude":24.94381427764893},
      "b52c2177-7887-48b9-b307-ee7e29100742":{"latitude":60.166407845055865,"longitude":24.94377136230469}}},
    "Punavuori":{"locations":{
      "b90aa425-3871-442a-9ecc-e286aa48966e":{"latitude":60.162073582548565,"longitude":24.934179782867435},
      "eb49df14-d1d9-43fb-849b-85675eb3f3a0":{"latitude":60.16293834559509,"longitude":24.933128356933597},
      "29442362-7af8-4b79-8bf0-2694585f9fa4":{"latitude":60.161806675778244,"longitude":24.929738044738773},
      "113da39e-1127-469f-946c-2f241c60a5e6":{"latitude":60.161070001844394,"longitude":24.929544925689697},
      "1a351ff4-edb4-41e7-9e59-5e10ea600bf0":{"latitude":60.159735405562365,"longitude":24.932012557983402},
      "015b2acf-e900-4eba-be8c-9a8ed13ce0e6":{"latitude":60.15774942597614,"longitude":24.9334716796875},
      "a248fb3e-cc85-495f-a855-3a9f8b8973ee":{"latitude":60.15802704324041,"longitude":24.940788745880127},
      "4f22baa6-c1d7-47e3-8f60-2da8a7eef19b":{"latitude":60.15916952037816,"longitude":24.94229078292847},
      "bb631d29-52f9-4423-8ada-7c1156b1681b":{"latitude":60.16078173363616,"longitude":24.94207620620728},
      "0096f059-5ff0-4f37-93a1-1d851e9e3c05":{"latitude":60.16208425877427,"longitude":24.942719936370853},
      "a2726d0a-534e-4562-9082-deaf4b2991dc":{"latitude":60.163023753056336,"longitude":24.945616722106937},
      "97d8cd9a-6151-4314-a58b-5ea2cd901812":{"latitude":60.16512684175867,"longitude":24.942741394042972}}},
    "Kaivopuisto":{"locations":{
      "c991870b-2cd9-4a69-bcfe-0095335ed5f6":{"latitude":60.157429095449935,"longitude":24.96273994445801},
      "6debe1b6-1758-4561-84ad-69f99c7da304":{"latitude":60.15573129154271,"longitude":24.96273994445801},
      "0b966ade-0204-4094-b62a-555355d52ee2":{"latitude":60.153488774626965,"longitude":24.956688880920414},
      "df8fe299-4102-427c-9242-30c1135abc51":{"latitude":60.155656543443435,"longitude":24.950444698333744},
      "a23eb359-c45a-40ac-8b31-67636a5b5867":{"latitude":60.15894529902527,"longitude":24.95492935180664},
      "d53c533b-ec70-43f5-9f25-aeb22df94eb4":{"latitude":60.16116609068525,"longitude":24.956474304199222},
      "e787b869-af73-459b-b14f-81d2dc4c49cb":{"latitude":60.16024789694429,"longitude":24.958448410034183},
      "039e0c6b-84fa-404d-89b3-f379669e01af":{"latitude":60.15994894460934,"longitude":24.960508346557617}}},
    "Katajanokka":{"locations":{
      "497a66bf-d20b-4d6a-bc7b-7cf90ed905ec":{"latitude":60.163077132606894,"longitude":24.969606399536136},
      "c47fa7b2-d908-49fb-94d5-fbeafedaeab9":{"latitude":60.16664269024329,"longitude":24.957933425903324},
      "4cb11fd4-a969-45bc-96b0-aae2dc68ef94":{"latitude":60.1678168910033,"longitude":24.95776176452637},
      "6ca9c199-5690-402c-9994-82ff6ffc4721":{"latitude":60.16910846337395,"longitude":24.959135055541996},
      "3cd10e1b-23c5-40f2-814b-4b72b745ba4c":{"latitude":60.16963148236986,"longitude":24.965701103210453},
      "627e2b44-4c10-418e-bfc0-5b586c4529ef":{"latitude":60.16850004304534,"longitude":24.96999263763428},
      "cd281148-3728-4abb-a75f-aaabb674a62b":{"latitude":60.16990899927236,"longitude":24.975357055664066},
      "0ac19d1b-18f1-4b0b-8426-13fa636dd8b8":{"latitude":60.168756221399065,"longitude":24.978747367858887},
      "459460e4-3c18-4209-b617-7155979084c3":{"latitude":60.167197772195834,"longitude":24.980850219726566}}},
    "Jätkäsaari":{"locations":{
      "d1bf58a6-c6b1-42d2-b391-0de21b0221b5":{"latitude":60.15645740709047,"longitude":24.904589653015137},
      "a27c9fd1-4f67-4ebf-938c-6b50336212e7":{"latitude":60.15831533560997,"longitude":24.903259277343754},
      "10a18518-addc-4df0-849e-a9d6a93f8f3b":{"latitude":60.16171058881025,"longitude":24.914245605468754},
      "17e57d84-a567-436c-804a-469b6dab244c":{"latitude":60.161817352090665,"longitude":24.921884536743168},
      "cbe7eb70-4df5-4064-a17b-1f293fbcdb91":{"latitude":60.15570993496026,"longitude":24.923086166381836},
      "c83ba6b6-08a2-4290-8113-94009a7fd1d9":{"latitude":60.14774296186144,"longitude":24.914245605468754},
      "5a65bf05-81be-41ca-ac73-21aa3eefe219":{"latitude":60.14817019438939,"longitude":24.91162776947022},
      "4b6c85eb-6763-4036-ba5c-e1f0141d0680":{"latitude":60.152549007768975,"longitude":24.915018081665043},
      "c6710da1-1151-43b7-a462-230eba2ddd0a":{"latitude":60.15295481948042,"longitude":24.914159774780277},
      "91c975b8-39a1-459f-92c3-aa93003d5916":{"latitude":60.149515940571,"longitude":24.90733623504639},
      "6b5c4f95-298a-4505-b272-5cf389ae07d9":{"latitude":60.151630573293865,"longitude":24.903774261474613},
      "af83c786-5806-4b5b-91cc-6a4b76a7503d":{"latitude":60.15530415725744,"longitude":24.90248680114746},
      "fb04a437-275c-4a43-b865-394487db5249":{"latitude":60.15724757343269,"longitude":24.909009933471683},
      "bfca6c9d-c5bd-4a24-bd66-4554930bca59":{"latitude":60.15763197181232,"longitude":24.908494949340824}}}
    };

  const [areas, setAreas] = useState(initialAreas);
  const [selectedArea, setSelectedArea] = useState(Object.keys(areas)[0]);
  const [selectedLocation, setSelectedLocation] = useState("0");
  const [focusRequest, setFocusRequest] = useState(false);
  const [focusLocation, setFocusLocation] = useState({ latitude: 0, longitude: 0 });

  const handleLocationChange = (areaId: string, locationId: string, location: Location) => {
    setAreas({
      ...areas,
      [areaId]: {
        ...areas[areaId],
        locations: {
          ...areas[areaId].locations,
          [locationId]: location
        }
      }
    });
  };
  const handleSelectedAreaChange = (areaId: string) => {
    setSelectedArea(areaId);
  };
  const handleLocationClick = (locationId: string, location: Location) => {
    setSelectedLocation(locationId);
    setFocusRequest(true);
    setFocusLocation(location);
  };
  const handleInsertLocationClick = () => {
    const newLocation: Location = calculateNewLocation(areas[selectedArea]);
    handleLocationChange(selectedArea, getLocationKey(), newLocation);
  }
  const handleRemoveLocationClick = () => {
    const { [selectedLocation]: _, ...updatedLocations } = areas[selectedArea].locations;
    setAreas({
      ...areas,
      [selectedArea]: {
        ...areas[selectedArea],
        locations: updatedLocations
      }
    });
  }

  return (
    <>
    <div className="map">
      <Head>
        <title>react map demo</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <div className="sidebar">
        <DropDown
          areas={areas}
          selectedArea={selectedArea}
          onChange={handleSelectedAreaChange}
        />
        <Divider />
        <LocationList
          locations={areas[selectedArea].locations}
          onLocationClick={handleLocationClick}
          selectedLocation={selectedLocation}
        />
        <Divider />
        <IconButton onClick={handleRemoveLocationClick}>
          <RemoveIcon />
        </IconButton>
        <IconButton onClick={handleInsertLocationClick}>
          <AddIcon />
        </IconButton>
      </div>
      <div id="map">
        <DynamicMapComponent
          areas={areas}
          selectedArea={selectedArea}
          handleLocationChange={handleLocationChange}
          focusRequest={focusRequest}
          setFocusRequest={setFocusRequest}
          focusLocation={focusLocation}
        />
      </div>
    </div>
    </>
  );
}
