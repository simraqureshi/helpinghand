import { useState } from "react";

//multi-dropdown
import Select from "react-select";

//calender
import DatePicker from "react-multi-date-picker";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";

import bgImage from "assets/images/hh-bg.jpg";

import axios from "axios";

function ProfileEdit() {
  const [dropdown, setDropdown] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState("");

  const [inputs, setInputs] = useState({
    fullName: { value: "", isSuccess: false, isFail: false },
    address: { value: "", isSuccess: false, isFail: false },
    addressTwo: { value: "", isSuccess: false, isFail: false },
    city: { value: "", isSuccess: false, isFail: false },
    zipCode: { value: "", isSuccess: false, isFail: false },
  });

  //cal
  const [values, setValues] = useState([]);
  const openDropdown = ({ currentTarget }) => setDropdown(currentTarget);
  const closeDropdown = () => setDropdown(null);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    closeDropdown();
  };

  //multi-dropdown
  const options = [
    { value: "cooking", label: "Cooking" },
    { value: "gardening", label: "Gardening" },
    { value: "Building", label: "building" },
  ];

  // Styles
  const iconStyles = {
    ml: 1,
    fontWeight: "bold",
    transition: "transform 200ms ease-in-out",
  };

  const dropdownIconStyles = {
    transform: dropdown ? "rotate(180deg)" : "rotate(0)",
    ...iconStyles,
  };

  //const [fullName, setFullName] = useState('');

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    const isSuccess = value.length > 0;
    const fail = false;

    setInputs((prev) => ({
      ...prev,
      [field]: { value, isSuccess, fail },
    }));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const formatDates = (dates) => {
    if (!Array.isArray(dates) || dates.length === 0) {
      return "";
    }
    const formattedDates = [];
    for (const date of dates) {
      let forDate = "";
      if (date.length == 1) {
        forDate += formatDate(new Date(date[0]));
        formattedDates.push(forDate);
        break;
      }
      for (let i = 0; i < date.length; i++) {
        forDate += formatDate(new Date(date[i]));
        if (i != date.length - 1) {
          forDate += " - ";
        }
      }
      formattedDates.push(forDate);
    }

    return formattedDates;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //console.log("test:", values);
    const formattedAvailability = formatDates(values);

    const dataToSend = {
      fullName: inputs.fullName.value,
      address: inputs.address.value,
      addressTwo: inputs.addressTwo.value,
      city: inputs.city.value,
      state: selectedState,
      zipCode: inputs.zipCode.value,
      skills: skills.map((skill) => skill.value),
      preferences: preferences,
      availability: formattedAvailability,
    };
    console.log("Data:", dataToSend);
    try {
      const response = await axios.post("http://localhost:5000/api/profile", dataToSend);
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message);

      if (error.response?.data?.message == "Invalid zip code format") {
        setInputs((prev) => ({
          ...prev,
          zipCode: { ...prev.zipCode, isSuccess: false, isFail: true },
        }));
      }
      if (error.response?.data?.message == "All fields are required") {
        for (const key in inputs) {
          if (!inputs[key].value) {
            setInputs((prev) => ({
              ...prev,
              [key]: {
                ...prev[key],
                isSuccess: false,
                isFail: true,
              },
            }));
          }
        }
      }
    }
  };

  return (
    <MKBox
      bgColor="white"
      borderRadius="xl"
      shadow="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      mt={{ xs: 20, sm: 18, md: 20 }}
      mb={{ xs: 20, sm: 18, md: 20 }}
      mx={70}
    >
      <MKBox component="section" py={5}>
        <Container>
          <Grid container item xs={12} lg={8} py={1} mx="auto" style={{ marginTop: "10px" }}>
            <MKInput
              variant="standard"
              label="Full Name*"
              placeholder="eg. Raj Singh"
              InputLabelProps={{ shrink: true }}
              fullWidth
              inputProps={{ maxLength: 50 }}
              onChange={handleChange("fullName")}
              error={inputs.fullName.isFail}
              success={inputs.fullName.isSuccess}
            />
          </Grid>
        </Container>
        <MKBox component="section" py={5}>
          <Container>
            <Grid container item xs={12} lg={8} py={1} mx="auto">
              <MKInput
                maxLength={2}
                variant="standard"
                label="Address 1*"
                inputProps={{ maxLength: 100 }}
                placeholder="eg. 4302 University Dr, Houston, TX 77004"
                InputLabelProps={{ shrink: true }}
                fullWidth
                onChange={handleChange("address")}
                error={inputs.address.isFail}
                success={inputs.address.isSuccess}
              />
            </Grid>
          </Container>
          <MKBox component="section" py={5}>
            <Container>
              <Grid container item xs={12} lg={8} py={1} mx="auto">
                <MKInput
                  variant="standard"
                  label="Address 2"
                  inputProps={{ maxLength: 100 }}
                  onChange={handleChange("addressTwo")}
                  placeholder="eg. 4302 University Dr, Houston, TX 77004"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            </Container>
            <MKBox component="section" py={5}>
              <Container>
                <Grid container item xs={12} lg={8} py={1} mx="auto">
                  <MKInput
                    variant="standard"
                    label="City*"
                    inputProps={{ maxLength: 100 }}
                    onChange={handleChange("city")}
                    success={inputs.city.isSuccess}
                    error={inputs.city.isFail}
                    placeholder="eg. Houston"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                </Grid>
              </Container>
              <MKBox component="section" py={5}>
                <Container>
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={12} textAlign="center">
                      <MKButton variant="gradient" color="info" onClick={openDropdown}>
                        {selectedState ? selectedState : "State*"}
                        <Icon sx={dropdownIconStyles}>expand_more</Icon>
                      </MKButton>
                      <Menu anchorEl={dropdown} open={Boolean(dropdown)} onClose={closeDropdown}>
                        <MenuItem onClick={() => handleStateSelect("AL")}>AL</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("AK")}>AK</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("AZ")}>AZ</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("AR")}>AR</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("CA")}>CA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("CO")}>CO</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("CT")}>CT</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("DE")}>DE</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("FL")}>FL</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("GA")}>GA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("HI")}>HI</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("ID")}>ID</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("IL")}>IL</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("IN")}>IN</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("IA")}>IA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("KS")}>KS</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("KY")}>KY</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("LA")}>LA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("ME")}>ME</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MD")}>MD</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MA")}>MA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MI")}>MI</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MN")}>MN</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MS")}>MS</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MO")}>MO</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("MT")}>MT</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NE")}>NE</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NV")}>NV</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NH")}>NH</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NJ")}>NJ</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NM")}>NM</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NY")}>NY</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("NC")}>NC</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("ND")}>ND</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("OH")}>OH</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("OK")}>OK</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("OR")}>OR</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("PA")}>PA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("RI")}>RI</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("SC")}>SC</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("SD")}>SD</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("TN")}>TN</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("TX")}>TX</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("UT")}>UT</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("VT")}>VT</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("VA")}>VA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("WA")}>WA</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("WV")}>WV</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("WI")}>WI</MenuItem>
                        <MenuItem onClick={() => handleStateSelect("WY")}>WY</MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                </Container>
                <MKBox component="section" py={3}>
                  <Container>
                    <Grid container item xs={12} lg={8} py={1} mx="auto">
                      <MKInput
                        type="number"
                        variant="standard"
                        label="Zip code*"
                        placeholder="eg. 77004"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        onChange={handleChange("zipCode")}
                        onInput={(e) => {
                          if (e.target.value.length > 9) {
                            e.target.value = e.target.value.slice(0, 9);
                          }
                        }}
                        error={inputs.zipCode.isFail}
                        success={inputs.zipCode.isSuccess}
                      />
                    </Grid>
                  </Container>
                  <MKBox component="section" py={3}>
                    <Container>
                      <Grid container item xs={12} lg={8} py={1} mx="auto">
                        <Grid item xs={12} sm={10}>
                          <MKTypography variant="h6" color="gray" fontsize="5">
                            Skills*
                          </MKTypography>
                        </Grid>
                        <Select
                          //defaultValue={[colourOptions[2], colourOptions[3]]}
                          isMulti
                          name="colors"
                          options={options}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={setSkills}
                        />
                      </Grid>
                    </Container>
                    <MKBox component="section" py={3}>
                      <Container>
                        <Grid container item xs={12} lg={8} py={1} mx="auto">
                          <MKInput
                            variant="standard"
                            label="Preferences"
                            placeholder="Message"
                            multiline
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            onChange={(event) => setPreferences(event.target.value)}
                            rows={6}
                          />
                        </Grid>
                      </Container>
                      <MKBox component="section" py={3}>
                        <Container>
                          <Grid container item xs={12} lg={4} py={1} mx="auto">
                            <Grid item xs={12} sm={10}>
                              <MKTypography variant="h6" color="gray" fontsize="5">
                                Availability*
                              </MKTypography>
                            </Grid>
                            <DatePicker onChange={setValues} multiple range format="MM/DD/YYYY" />
                          </Grid>
                        </Container>
                        <MKBox
                          position="absolute"
                          top={0}
                          left={0}
                          zIndex={-1}
                          width="100%"
                          minHeight="200vh"
                          sx={{
                            backgroundImage: `url(${bgImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "repeat",
                          }}
                        />
                        <MKBox component="section" py={3}>
                          <Container>
                            <Grid container item xs={12} lg={2.7} py={1} mx="auto">
                              <MKButton variant="gradient" color="success" onClick={handleSubmit}>
                                Save Changes
                              </MKButton>
                            </Grid>
                          </Container>
                        </MKBox>
                      </MKBox>
                    </MKBox>
                  </MKBox>
                </MKBox>
              </MKBox>
            </MKBox>
          </MKBox>
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

export default ProfileEdit;
